from flask import Flask, session, request, jsonify,Blueprint
from flask_cors import CORS
import sqlite3
import razorpay
import hmac
import hashlib
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json

payments = Blueprint('payments', __name__)
client = razorpay.Client(auth=("rzp_test_0fJFxZHQ0pt557", "EciUxT9hH3EcW2vAIv7s1qkw"))

def get_db_connection():
    conn = sqlite3.connect('./userData.db')
    conn.row_factory = sqlite3.Row
    return conn

@payments.route('/api/createRazororder', methods=['POST'])
def create_order():
    data = request.get_json()
    id = data['id']
    totalPrice = data['totalPrice']
    

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM plans WHERE id = ?', (id,))
    plan = cursor.fetchone()
    conn.close()
    if not plan:
        return jsonify({'error': 'Plan not found'}), 404
    plan=dict(plan)
    now = datetime.now()
    timestamp_str = now.strftime("%d-%m-%Y-%H-%M-%S")
    desc=json.loads(plan['description'])
    # print(timestamp_str)
    DATA = {
    "amount": int(totalPrice*100),
    "currency": "INR",
    "receipt": "receipt#"+str(timestamp_str),
    "notes": {
        "key1": str(desc[0]),
        "key2": str(desc[1]),
    }
    
}
    result=client.order.create(data=DATA)
    user_details={
        "name": session['name'],
        "email": session['email'],
        "contact": session['contact'],
        "address": session['address']
    }
    # print(result)
    return jsonify({"razor_obj":result,"plan":plan,"user_details":user_details,"status": "success", "message": "Order created"}), 200



@payments.route("/api/verify_and_store_payment", methods=["POST"])
def verify_payment():
    data = request.get_json()

    # Extract values from frontend
    plan= data.get("plan")
    coupon= data.get("coupon")
    totalPrice= data.get("totalPrice")
    discount= data.get("discount")
    print("plan:::::::::::::: ",plan)
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    try:
        # Razorpay verification utility
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        # This will raise an error if signature doesn't match
        client.utility.verify_payment_signature(params_dict)

        # If the signature is verified, you can proceed to store the payment details in your database
        print("session id:: ",session['user_id']) 
        conn=get_db_connection()
        cursor = conn.cursor()
        # cursor.execute('SELECT * FROM plans WHERE id = ?', (plan,))
        # plan = dict(cursor.fetchone())
        # start,end=get_current_and_expiry(months=int(plan['months']))
        cursor.execute("INSERT INTO plan_payments (userid,start,end,order_id, payment_id, signature,planid,coupon,total_value) VALUES (?, ?, ?,?,?,?,?,?,?)",(session['user_id'],plan["start_date"],plan["end_date"],razorpay_order_id,razorpay_payment_id,razorpay_signature,plan['id'],coupon,totalPrice))
        conn.commit()
        user_details={
        "name": session['name'],
        "email": session['email'],
        "contact": session['contact'],
        "address": session['address']
    }
        data={"user_details":user_details,"plan":plan,coupon:coupon,"order_id":razorpay_order_id,"totalprice":totalPrice,"coupondiscount":discount,"payment_id":razorpay_payment_id,"date":plan["start_date"],"expiry":plan["end_date"],"amount":totalPrice}

        generate_receipt_pdf(data, f"./receipts/receipt_{razorpay_order_id}.pdf")

        conn.close()

        # link="https://known-smooth-cobra.ngrok-free.app/download/receipt_"+str(razorpay_order_id)+".pdf"
        link="http://localhost:5000/download/receipt_"+str(razorpay_order_id)+".pdf"

        return jsonify({"status": "success", "message": "Payment verified ✅","link":link}), 200

    except razorpay.errors.SignatureVerificationError:
        return jsonify({"status": "failure", "message": "Signature mismatch ❌"}), 400


@payments.route('/api/webhook_payment', methods=['POST','GET'])
def webhook_payment():
    data = request.get_json()
    # print("webshhodata:::::::: ",data)

    return jsonify({"status": "success", "message": "Payment verified ✅"}), 200




def get_current_and_expiry(months: int):
    """
    Returns the current date and expiry date after N months.

    Args:
        months (int): Number of months to add.

    Returns:
        tuple: (current_date_str, expiry_date_str) in 'dd-mm-yyyy' format.
    """
    now = datetime.now()
    expiry = now + relativedelta(months=months)

    current_str = now.strftime("%d-%m-%Y")
    expiry_str = expiry.strftime("%d-%m-%Y")

    return current_str, expiry_str


@payments.route('/api/get_coupon', methods=['POST'])
def get_coupon():
    coupon=request.json.get('coupon')
    planid=request.json.get('planid')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM coupons WHERE coupon = ?', (coupon,))
    coupondata = cursor.fetchone()
    conn.close()
    if not coupondata:
        return jsonify({'error': 'Coupon not found',"FLAG": "NO_COUPON"}), 404
    else:
        onplans_list = list(map(int,((coupondata)["onplans"]).split(",")))
        if int(planid) not in onplans_list:
            return jsonify({'error': 'Coupon not applicable for this plan',"FLAG":"NON_APPLICABLE"}), 404
        else:
            couponvalue=dict(coupondata)["value"]
        return jsonify({'status': 'success', 'message': 'Coupon found', 'coupon': couponvalue,"FLAG":"APPLICABLE"}), 200


from weasyprint import HTML

def generate_receipt_pdf(data, output_path):
    html_content = generate_receipt_html(data)
    HTML(string=html_content).write_pdf(output_path)


import requests


def send_whatsapp(phone_number, message,link=None ,file_name=None):
    url = "https://api.ultramsg.com/instance115886/messages/document"

    payload =  "token=1p6yg32e2lx32ocv&to="+str(phone_number)+"&body="+message+"&filename="+file_name+"&document="+link+"&caption=document caption"
    payload = payload.encode('utf8').decode('iso-8859-1')
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    print(response.text)


def generate_receipt_html(data):
    return f'''<!-- receipt_template.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gym Receipt</title>
  <style>
    body {{
  font-family: Arial, sans-serif;
  background: #f3f4f6;
  margin: 0;
  padding: 20px;
}}
.receipt-container {{
  max-width: 500px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid #eee;
}}
.header {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}}
.logo-title {{
  display: flex;
  align-items: center;
  gap: 10px;
}}
.logo-title img {{
  height: 40px;
}}
.title {{
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}}
.checkmark {{
  font-size: 24px;
  color: #10b981;
}}
.details {{
  font-size: 14px;
  color: #374151;
}}
.details-row {{
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}}
.details-row span:last-child {{
  font-weight: 500;
  text-align: right;
}}
    .separator {{
      border-top: 1px solid #e5e7eb;
      margin-top: 15px;
      padding-top: 10px;
      font-weight: 600;
      color: #111827;
    }}
    .footer {{
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #9ca3af;
    }}
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="logo-title">
<svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="100px"
            height="100px"
            viewBox="0 0 300.000000 300.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M1433 2446 c-59 -28 -77 -54 -88 -126 -11 -81 -9 -98 16 -147 l23
          -45 -29 -24 c-26 -21 -75 -30 -75 -13 0 9 -73 29 -107 29 -17 0 -36 7 -43 15
          -7 8 -20 15 -30 15 -32 0 -42 24 -30 69 6 23 12 41 13 41 2 0 20 -9 42 -20 56
          -29 88 -26 119 11 54 63 17 150 -78 187 -70 27 -109 21 -156 -23 -19 -18 -56
          -46 -82 -64 -26 -17 -63 -46 -82 -64 -39 -36 -116 -166 -116 -195 0 -10 13
          -32 30 -48 39 -38 38 -52 -7 -70 -103 -41 -119 -53 -124 -89 -4 -29 11 -137
          32 -239 10 -49 19 -91 19 -93 0 -2 -11 -3 -25 -3 -39 0 -29 -15 18 -27 26 -7
          46 -8 51 -2 6 6 6 9 -1 9 -17 0 -72 274 -73 360 0 10 30 27 83 48 45 17 87 32
          93 32 5 0 27 -17 47 -38 l37 -38 -78 -24 c-42 -14 -80 -24 -84 -22 -5 1 -8 -5
          -8 -14 0 -8 5 -12 10 -9 6 3 10 -3 10 -15 0 -19 38 -215 55 -283 6 -23 39 -46
          50 -35 2 2 -4 32 -15 65 -17 55 -50 219 -50 250 0 17 141 62 165 52 51 -19 61
          -22 69 -20 29 7 55 -11 61 -41 10 -44 28 -77 64 -115 16 -18 27 -33 25 -33 -3
          0 6 -14 20 -30 23 -28 46 -86 46 -117 0 -10 -29 -13 -112 -13 -122 0 -194 16
          -210 44 -6 10 -21 61 -34 113 -27 109 -23 129 31 139 19 3 32 10 29 15 -3 5 7
          9 22 9 19 0 25 3 18 10 -7 7 -32 4 -78 -10 l-68 -21 7 -47 c11 -72 53 -233 65
          -247 10 -11 120 -22 300 -29 28 -2 35 -6 35 -21 0 -18 -6 -20 -60 -17 -160 7
          -501 48 -570 68 -18 5 -18 4 -5 -8 15 -14 169 -48 220 -48 14 0 35 -3 47 -6
          21 -6 20 -8 -18 -36 -39 -28 -69 -78 -69 -115 0 -10 7 -31 15 -46 13 -25 12
          -31 -6 -67 -26 -50 -18 -97 25 -139 49 -47 152 -59 199 -23 7 5 20 12 29 15
          15 5 16 2 8 -19 -6 -14 -10 -61 -10 -104 0 -43 -3 -81 -7 -83 -5 -3 -46 -8
          -93 -11 -91 -7 -282 -33 -315 -43 -37 -10 -73 -53 -45 -53 6 0 9 5 8 11 -4 16
          31 24 200 48 221 31 378 41 666 41 285 0 519 -12 683 -35 190 -27 233 -36 233
          -51 0 -8 5 -14 10 -14 15 0 12 15 -7 33 -25 22 -77 32 -248 52 -82 9 -168 18
          -190 21 l-40 4 3 44 c2 24 0 52 -6 62 -5 11 -6 30 -3 43 6 23 8 24 115 22 100
          -2 110 0 132 20 13 12 24 33 24 45 0 32 -58 97 -82 91 -11 -3 -18 0 -18 10 0
          8 4 12 9 9 13 -9 53 78 45 98 -4 11 2 26 16 41 31 33 29 72 -5 99 l-28 22 54
          12 c30 6 77 14 104 17 112 15 157 39 135 75 -6 10 -9 7 -12 -11 -3 -22 -11
          -25 -103 -41 -115 -19 -358 -46 -460 -50 -63 -3 -70 -1 -70 16 0 17 8 20 55
          22 30 2 102 6 160 10 58 4 108 7 112 6 10 -2 53 154 72 269 l6 36 -68 22 c-77
          24 -82 25 -82 11 0 -5 19 -15 43 -21 65 -19 79 -35 71 -84 -23 -141 -41 -191
          -73 -205 -30 -12 -246 -30 -274 -22 -17 4 -18 11 -13 49 4 33 19 61 61 113 55
          69 79 112 90 163 6 30 30 36 67 16 15 -8 19 -8 14 0 -4 6 1 14 11 17 10 3 26
          10 35 14 12 7 40 1 91 -17 l75 -27 -5 -36 c-11 -83 -36 -198 -53 -242 -14 -38
          -15 -48 -5 -48 26 0 43 30 63 117 26 109 44 221 38 232 -3 4 -33 16 -68 26
          -35 10 -67 22 -72 26 -12 10 57 79 79 79 13 0 161 -56 174 -66 10 -9 -37 -282
          -65 -373 -6 -21 -5 -23 17 -16 13 4 35 12 49 18 l25 10 -25 6 c-28 8 -29 22
          -10 126 6 33 13 83 16 110 2 28 7 61 9 75 3 14 2 33 -1 43 -6 18 -88 65 -124
          70 -40 6 -43 23 -11 59 45 52 45 73 -4 158 -40 71 -70 100 -180 178 -6 4 -33
          26 -61 48 -43 36 -56 41 -91 39 -128 -10 -206 -127 -134 -204 33 -35 53 -38
          111 -15 23 9 43 14 46 11 3 -3 9 -21 14 -41 8 -34 7 -36 -41 -61 -27 -14 -59
          -25 -72 -25 -30 0 -90 -20 -98 -33 -9 -13 -51 -2 -80 22 l-23 19 23 50 c20 42
          22 59 17 113 -10 91 -22 116 -73 146 -59 34 -109 37 -170 9z m118 -28 c59 -17
          79 -41 79 -93 0 -24 5 -47 10 -50 13 -8 2 -57 -16 -71 -8 -6 -14 -21 -14 -32
          0 -30 -81 -76 -117 -68 -33 9 -93 54 -93 71 0 8 -8 27 -17 44 -15 25 -16 34
          -5 51 6 11 12 39 12 64 0 48 9 59 66 80 49 18 49 18 95 4z m-392 -17 c65 -26
          92 -92 54 -133 -17 -19 -43 -24 -43 -9 0 5 -11 12 -24 15 -13 3 -38 22 -55 41
          l-31 35 -35 -37 c-44 -48 -46 -67 -2 -25 18 18 36 30 39 27 3 -3 -6 -26 -18
          -52 -13 -25 -24 -55 -24 -65 0 -30 -45 -68 -80 -68 -16 0 -30 -4 -30 -10 0
          -12 36 -12 102 -1 59 10 94 -4 132 -53 29 -39 46 -43 26 -7 -9 18 -8 21 12 21
          32 -1 99 -33 122 -59 15 -16 31 -21 70 -21 29 0 70 -9 94 -20 43 -19 43 -19
          80 0 24 13 56 20 93 20 47 0 59 4 80 26 28 30 80 54 116 54 21 0 23 -2 13 -15
          -6 -8 -10 -20 -8 -26 2 -6 16 5 31 25 40 52 72 66 127 56 61 -12 100 -12 100
          0 0 6 -13 10 -30 10 -37 0 -68 32 -76 79 -3 20 -15 48 -25 64 -31 43 -12 53
          29 15 38 -36 33 -19 -11 32 l-28 33 -27 -31 c-15 -17 -44 -40 -66 -52 -36 -20
          -39 -20 -57 -4 -40 36 -17 113 39 133 78 27 99 26 129 -9 16 -18 57 -51 93
          -75 36 -23 75 -52 87 -64 27 -25 55 -76 47 -84 -3 -3 9 -19 27 -35 l34 -30
          -104 -99 c-111 -106 -134 -122 -168 -123 -26 0 -27 3 -11 33 7 14 -6 7 -35
          -20 -46 -42 -77 -53 -146 -50 -34 2 -52 -14 -90 -81 -11 -19 -120 -34 -158
          -21 -32 10 -33 12 -33 66 0 38 -4 53 -12 51 -8 -3 -11 -22 -9 -56 l2 -51 -39
          -10 c-27 -8 -56 -8 -92 -1 -29 5 -54 10 -55 10 -1 0 -16 23 -34 51 -30 49 -33
          51 -66 45 -52 -10 -110 10 -150 51 -19 20 -35 32 -35 27 0 -6 5 -15 11 -21 22
          -22 5 -32 -33 -19 -32 12 -248 199 -248 216 0 4 11 17 25 30 14 13 25 31 25
          39 0 34 53 91 128 140 43 28 88 65 101 81 25 35 54 38 120 11z m352 -331 c21
          0 47 8 62 20 31 25 33 25 40 1 3 -12 17 -21 41 -25 49 -9 45 -26 -6 -26 -24
          -1 -66 -9 -95 -19 -45 -15 -55 -16 -79 -3 -15 8 -53 17 -85 19 -67 6 -76 19
          -23 29 23 4 38 13 41 25 5 17 6 17 36 -2 18 -10 48 -19 68 -19z m-249 -305
          c32 -53 80 -70 173 -61 67 7 66 7 155 0 91 -7 138 11 168 64 23 41 24 42 78
          42 30 0 54 -4 54 -9 0 -5 -16 -31 -35 -57 -20 -27 -49 -69 -65 -93 l-30 -45 0
          30 c0 17 -7 39 -15 50 -15 18 -15 16 -10 -24 4 -23 4 -80 0 -125 l-7 -84 -77
          -19 c-96 -24 -185 -24 -282 0 l-77 19 -7 61 c-11 82 -11 115 -1 156 8 31 7 33
          -8 21 -9 -7 -16 -26 -16 -42 0 -16 -4 -29 -10 -29 -5 0 -10 5 -10 10 0 6 -22
          40 -50 76 -81 106 -81 104 -13 104 58 -1 58 -1 85 -45z m-152 -355 c0 -3 -7
          -15 -14 -26 -15 -19 -15 -18 -41 6 l-25 26 40 0 c22 0 40 -3 40 -6z m-90 -43
          c30 -15 37 -48 15 -67 -13 -11 -19 -10 -35 5 -22 20 -75 24 -92 7 -20 -20 1
          -42 66 -71 72 -33 96 -60 96 -109 0 -100 -137 -145 -216 -71 -24 22 -32 68
          -18 103 8 20 24 21 24 2 0 -8 10 -27 23 -41 17 -20 32 -27 59 -27 46 0 58 7
          58 36 0 23 -12 32 -81 59 -82 33 -104 103 -50 158 25 24 38 29 78 29 26 0 59
          -6 73 -13z m168 -43 c-23 -67 -18 -89 14 -78 13 5 37 9 53 10 43 2 43 28 -3
          117 -2 4 14 7 37 7 38 0 41 -2 51 -37 14 -47 25 -251 16 -287 -6 -23 -11 -26
          -47 -26 -38 0 -41 2 -34 23 18 57 28 116 21 132 -5 14 -14 17 -49 12 -72 -10
          -88 -47 -61 -144 6 -21 3 -23 -36 -23 l-42 0 4 163 c2 89 7 168 11 175 5 6 25
          12 46 12 l38 0 -19 -56z m428 23 c34 -40 31 -72 -11 -114 l-36 -36 25 -26 c28
          -29 56 -90 56 -121 0 -17 -6 -20 -40 -20 -35 0 -40 3 -40 23 0 27 -33 102 -50
          112 -6 4 -20 -1 -32 -11 -16 -15 -19 -26 -14 -55 3 -21 9 -44 12 -53 5 -13 -1
          -16 -34 -16 l-41 0 -7 47 c-8 53 1 276 11 293 5 8 35 11 92 8 78 -3 87 -5 109
          -31z m284 28 c0 -9 -30 -65 -35 -65 -2 0 -16 5 -31 10 -37 14 -82 -4 -90 -37
          -9 -34 -2 -37 55 -22 28 7 53 10 56 7 3 -3 -2 -21 -10 -42 -13 -32 -19 -35
          -41 -30 -56 14 -89 -69 -40 -101 22 -15 28 -15 61 -1 21 9 40 16 44 16 7 0 31
          -58 31 -73 0 -4 -49 -7 -110 -7 l-110 0 0 84 c0 77 14 222 25 254 3 8 32 12
          100 12 52 0 95 -2 95 -5z m250 0 c0 -4 -7 -19 -16 -36 -12 -25 -19 -29 -37
          -22 -57 20 -107 -3 -107 -50 0 -20 -4 -20 88 0 25 6 29 -11 10 -52 -9 -21 -16
          -25 -39 -20 -33 7 -59 -16 -59 -53 0 -52 33 -69 87 -47 19 8 37 15 39 15 6 0
          34 -58 34 -70 0 -6 -40 -10 -109 -10 l-109 0 -6 43 c-5 38 0 104 20 255 l7 52
          98 0 c55 0 99 -2 99 -5z m-266 -201 c-5 -19 -74 -50 -74 -33 0 5 5 9 11 9 7 0
          23 12 36 26 27 29 35 28 27 -2z m-635 -66 c-5 -18 -9 -34 -9 -36 0 -2 -4 0
          -10 3 -5 3 -10 19 -10 36 0 22 5 29 19 29 17 0 19 -4 10 -32z m261 -194 c0
          -75 -2 -84 -18 -84 -13 0 -23 15 -36 55 -23 73 -41 73 -32 -1 6 -50 4 -55 -11
          -52 -32 6 -30 168 3 168 12 0 46 -44 58 -75 9 -25 15 5 6 35 -11 38 -6 52 15
          43 12 -4 15 -25 15 -89z m-312 74 c-3 -7 -17 -15 -33 -18 -16 -3 -30 -11 -33
          -19 -3 -10 2 -12 22 -7 21 5 26 3 26 -13 0 -13 -8 -21 -22 -23 -20 -3 -23 -8
          -20 -40 2 -33 0 -38 -18 -38 -19 0 -20 6 -20 85 l0 85 51 0 c36 0 49 -4 47
          -12z m48 -73 c0 -76 -2 -85 -18 -85 -16 0 -18 10 -18 85 0 74 2 85 18 85 15 0
          17 -11 18 -85z m134 64 c0 -15 -5 -19 -19 -14 -26 8 -33 -17 -25 -82 6 -50 5
          -53 -16 -53 -21 0 -22 3 -18 70 3 65 -2 84 -17 60 -10 -16 -25 -11 -25 8 0 28
          9 32 67 32 47 0 53 -2 53 -21z m254 7 c-3 -8 -20 -16 -37 -18 -17 -2 -32 -9
          -35 -17 -3 -10 3 -11 27 -6 17 4 31 3 31 -2 0 -16 -15 -31 -35 -34 -12 -3 -20
          -12 -20 -24 0 -16 6 -20 30 -18 26 2 44 -10 45 -29 0 -12 -98 -9 -106 3 -3 6
          -3 44 1 85 l7 74 49 0 c38 0 47 -3 43 -14z m114 -9 c3 -16 -1 -17 -32 -11 -47
          8 -48 -11 -2 -30 42 -17 54 -48 32 -81 -22 -34 -70 -34 -92 0 -10 15 -13 32
          -9 42 6 16 8 16 18 -4 6 -14 19 -23 33 -23 39 0 36 18 -6 40 -42 21 -53 53
          -28 78 19 19 82 11 86 -11z m130 0 c3 -16 -1 -17 -32 -11 -47 8 -48 -11 -1
          -33 43 -21 55 -55 30 -83 -34 -38 -105 -17 -105 31 0 23 15 25 24 4 7 -20 56
          -20 56 0 0 8 -11 17 -24 21 -14 3 -32 14 -42 25 -14 16 -15 23 -6 45 11 22 17
          25 54 22 32 -2 44 -8 46 -21z"
              />
              <path
                d="M1398 1651 c-27 -9 -48 -19 -48 -23 0 -13 54 -8 80 7 14 8 35 14 48
          15 19 0 22 -5 22 -35 0 -29 -4 -35 -22 -35 -34 0 -88 -23 -88 -37 0 -16 0 -16
          45 3 47 19 65 13 65 -26 0 -26 -4 -30 -26 -30 -31 0 -67 -18 -59 -30 3 -5 17
          -5 33 1 29 10 106 7 135 -6 12 -5 17 -3 17 8 0 17 -21 27 -56 27 -21 0 -24 5
          -24 35 0 39 16 45 60 20 31 -18 50 -19 50 -2 0 14 -54 37 -88 37 -18 0 -22 6
          -22 35 0 30 3 35 23 35 12 -1 33 -7 47 -15 29 -17 80 -20 80 -5 0 6 -10 10
          -22 10 -13 1 -34 7 -48 15 -33 19 -141 17 -202 -4z"
              />
              <path
                d="M1486 1314 c-22 -22 -22 -94 1 -94 25 0 83 49 83 70 0 36 -57 52 -84
          24z"
              />
              <path
                d="M1110 765 c-169 -12 -273 -25 -390 -46 -91 -16 -101 -19 -96 -28 3
          -5 25 -4 48 1 135 28 365 47 338 28 -11 -8 29 -9 147 -4 111 4 165 3 175 -4 7
          -6 29 -24 48 -40 19 -16 52 -39 73 -51 20 -12 35 -27 31 -32 -17 -28 94 40
          183 111 l31 25 156 -9 c151 -9 187 -5 156 15 -15 9 87 3 120 -7 8 -3 42 -8 75
          -11 33 -3 64 -9 70 -14 10 -10 112 -13 102 -3 -3 4 -28 10 -54 15 -327 62
          -807 83 -1213 54z m443 -15 c20 -1 20 -2 -5 -15 -21 -12 -33 -13 -55 -4 -26
          10 -27 12 -8 19 11 5 26 7 33 4 8 -2 23 -4 35 -4z m142 -13 c-8 -4 -20 -5 -25
          -2 -6 3 -10 1 -10 -6 0 -7 -3 -10 -6 -6 -3 3 -11 1 -18 -4 -6 -6 -37 -27 -70
          -49 l-58 -38 -70 47 -71 46 43 3 c34 3 48 -2 69 -21 l26 -25 35 24 c19 13 47
          24 62 24 15 0 29 4 32 9 3 5 22 9 41 8 25 -1 31 -3 20 -10z"
              />
              <path
                d="M1090 681 l-95 -6 103 -6 c87 -5 107 -9 125 -27 43 -42 161 -132 173
          -132 4 0 22 -11 40 -25 47 -36 85 -32 168 17 66 39 137 90 169 122 33 34 77
          46 157 45 45 -1 84 2 87 5 4 3 -32 6 -80 6 -47 0 -92 2 -100 5 -8 4 -51 -24
          -103 -65 -49 -39 -119 -88 -156 -110 l-66 -40 -69 42 c-37 22 -94 62 -127 87
          -82 65 -120 91 -126 89 -3 -1 -48 -4 -100 -7z"
              />
            </g>
          </svg>        <div class="title">Gym Membership</div>
      </div>
      <div class="checkmark">✅</div>
    </div>

    <div class="details">
      <div class="details-row">
        <span>Name:</span>
        <span>{data["user_details"]["name"]}</span>
      </div>
      <div class="details-row">
        <span>Phone:</span>
        <span>{data["user_details"]["contact"]}</span>
      </div>
      <div class="details-row">
        <span>Address:</span>
        <span>{data["user_details"]["address"]}</span>
      </div>
      <div class="details-row">
        <span>Plan:</span>
        <span>{data["plan"]["planName"]}</span>
      </div>
      <div class="details-row">
        <span>Order ID:</span>
        <span>{data["order_id"]}</span>
      </div>
      <div class="details-row">
        <span>Payment ID:</span>
        <span>{data["payment_id"]}</span>
      </div>
      <div class="details-row">
        <span>Date:</span>
        <span>{data["date"]}</span>
      </div>
      <div class="details-row">
        <span>Expiry:</span>
        <span>{data["expiry"]}</span>
      </div>

      <div class="details-row separator">
        <span>Subscription price:</span>
        <span>₹{data["plan"]["price"]}</span>
      </div>
      <div class="details-row separator">
        <span>Coupon discount:</span>
        <span>-₹{data["coupondiscount"]}</span>
      </div>
      <div class="details-row separator">
        <span>Total Paid:</span>
        <span>₹{data["amount"]}</span>
      </div>
    </div>

    <div class="footer">
      Thank you for your purchase! 🏋️‍♀️
    </div>
  </div>
</body>
</html>

'''

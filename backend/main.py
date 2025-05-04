
from flask_cors import CORS
import json
from flask import Flask,session,request, jsonify
from clerkWebhook import clerkdata
from payments import payments
from subscriptions import subscriptions
from admin import admin
app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")
app.register_blueprint(clerkdata)
app.register_blueprint(payments)
app.register_blueprint(subscriptions)
app.register_blueprint(admin)
app.secret_key = "your_secret_key"  # Needed for session support

import sqlite3


from datetime import datetime
from dateutil.relativedelta import relativedelta

@app.route('/setsession',methods=["POST", "GET"])
def getsession():
    clerk_id = request.args.get("user_id")
    email = request.args.get("email")
    print("Data received:", clerk_id)
    session['clerk_id'] = clerk_id
    session['email'] = email

    conn=get_db_connection()
    cursor = conn.execute('SELECT * FROM clerk WHERE clerkID = ?', (clerk_id, ))
    existing_user = dict(cursor.fetchone())
    print("local id",existing_user['id'])
    session['user_id'] = existing_user['id']
    session['contact'] = existing_user['phone']
    session['address'] = existing_user['address']
    session['name'] = existing_user['name']


   


    return jsonify(user_id=session.get('user_id'),email=session.get('email'))



def get_db_connection():
    conn = sqlite3.connect('./userData.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/plans', methods=['GET'])
def get_plans():
    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM plans')
    plans = cursor.fetchall()
    conn.close()

    # Convert the result to a list of dictionaries
    plans_list = [dict(plan) for plan in plans]

    return jsonify(plans_list)

from datetime import datetime










@app.route('/api/is_active_plan', methods=['POST'])
def get_user_plan():
    user_id=session['user_id']
    # user_id=1
    planid=request.json.get('planid')
    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM plan_payments WHERE userid = ? AND planid=? AND status = "ACTIVE" ', (user_id,planid))
    plans = cursor.fetchone()
    conn.close()
    if not plans:
        return jsonify({'FLAG': 'NO_PLAN'})
    else:
        return jsonify({'FLAG': 'YES_PLAN',"plan":dict(plans)})
    
@app.route('/api/get_user_details', methods=['POST'])
def get_user_details():
    user_id=session['user_id']
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # ✅ JOIN plan_payments with plans
    cursor.execute('''
        SELECT 
            pp.*, 
            p.planName, 
            p.price, 
            p.duration, 
            p.description, 
            p.months
        FROM plan_payments pp
        JOIN plans p ON pp.planid = p.id
        WHERE pp.userid = ?
    ''', (user_id,)) 
    
    history = [dict(row) for row in cursor.fetchall()]
    conn.close()

    if not history:
        return jsonify({'FLAG': 'EMPTY'})

    # ✅ Filter out active plans
    active_plan = [entry for entry in history if entry['status'] == 'ACTIVE']

    return jsonify({
        "history": history,
        "active_plan": active_plan
    })



@app.route('/api/update_plan_status', methods=['POST'])
def update_plan_status():
    conn = get_db_connection()
    cursor = conn.cursor()

    today = datetime.today().date()

    # Convert string dates and update expired plans
    cursor.execute('SELECT id, end FROM plan_payments WHERE status = "ACTIVE"')
    plans = cursor.fetchall()

    for plan in plans:
        end_date = datetime.strptime(plan['end'], '%d-%m-%Y').date()
        if end_date < today:
            cursor.execute('UPDATE plan_payments SET status = "DEACTIVATED" WHERE id = ?', (plan['id'],))

    
            conn.commit()
    conn.close()

    return jsonify({'message': 'Expired plans deactivated successfully.'})


@app.route("/api/getcontact",methods=['POST','GET'])
def getContact():
    phone=session['contact']
    if phone == "None":
        return jsonify({"FLAG":"NO"})
    else:
        return jsonify({"FLAG":"YES"})
    
@app.route("/api/savecontact",methods=['POST','GET'])
def saveconta():
    phone=request.json.get('phone')
    address=request.json.get('address')

    conn=get_db_connection()
    conn.execute('UPDATE clerk SET phone = ?,address=?  WHERE id = ?', (phone,address,session['user_id']))
    conn.commit()
    conn.close()
    print(phone,address)
    return jsonify({"FLAG":"YES"})


if __name__ == '__main__':
    app.run(debug=True, port=5000 ,host='0.0.0.0')

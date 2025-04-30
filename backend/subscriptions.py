from flask import Flask, session, request, jsonify, Blueprint,send_from_directory,  abort
from flask_cors import CORS
import sqlite3,os
import razorpay 
import hmac
import hashlib
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json

subscriptions = Blueprint('subscriptions', __name__)
def get_db_connection():
    conn = sqlite3.connect('./userData.db')
    conn.row_factory = sqlite3.Row
    return conn

@subscriptions.route('/api/get_subscription', methods=['POST'])
def get_subscription():
    data = request.get_json()
    plan_id = data['planid']
    print("Plan ID:", plan_id)

    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM plans WHERE id = ?', (plan_id))
    subscription = cursor.fetchone()
    conn.close()
    start,end=get_current_and_expiry(months=int(dict(subscription)['months']))

    if not subscription:
        return jsonify({'error': 'Subscription not found'}), 404
    user_details={
        "name": session['name'],
        "email": session['email'],
        "contact": session['contact'],
        "address": session['address']
    }
    subscription = dict(subscription)
    subscription['start_date'] = start
    subscription['end_date'] = end
    return jsonify({"subscription":subscription,"user_details":user_details}), 200




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

@subscriptions.route("/download/<filename>",methods=["GET"])
def download_file(filename):
    # Define the directory where your files are stored
    directory = "./receipts/"  # Replace with the actual directory path

    # Check if the file exists in the specified directory
    file_path = os.path.join(directory, filename)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(directory, filename, as_attachment=True)
    else:
        abort(404, description="File not found")



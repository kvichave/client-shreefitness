from flask import Flask, session, request, jsonify, Blueprint,send_from_directory,  abort
from flask_cors import CORS
import sqlite3,os
import razorpay 
import hmac
import hashlib
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json
admin = Blueprint('admin', __name__)


def get_db_connection():
    conn = sqlite3.connect('./userData.db')
    conn.row_factory = sqlite3.Row
    return conn

# Clerk APIs
@admin.route('/admin/clerk', methods=['GET'])
def get_clerks():
    conn = get_db_connection()
    clerks = conn.execute('SELECT * FROM clerk').fetchall()
    conn.close()
    return jsonify([dict(clerk) for clerk in clerks])

@admin.route('/admin/clerk/<int:id>', methods=['DELETE'])
def delete_clerk(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM clerk WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'message': 'Clerk not found'}), 404
    return jsonify({'message': 'Clerk deleted successfully'})

# Coupon APIs
@admin.route('/admin/coupons', methods=['GET'])
def get_coupons():
    conn = get_db_connection()
    coupons = conn.execute('SELECT * FROM coupons').fetchall()
    conn.close()
    return jsonify([dict(coupon) for coupon in coupons])

@admin.route('/admin/coupons', methods=['POST'])
def add_coupon():
    data = request.get_json()
    coupon = data['coupon']
    onplans = ','.join(map(str, data['onplans']))
    value = data['value']
    conn = get_db_connection()
    conn.execute('INSERT INTO coupons (coupon, onplans, value) VALUES (?, ?, ?)',
                 (coupon, onplans, value))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Coupon added successfully'})

@admin.route('/admin/coupons/<int:id>', methods=['DELETE'])
def delete_coupon(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM coupons WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'message': 'Coupon not found'}), 404
    return jsonify({'message': 'Coupon deleted successfully'})

# Plan APIs
@admin.route('/admin/plans', methods=['GET'])
def get_plans():
    conn = get_db_connection()
    plans = conn.execute('SELECT * FROM plans').fetchall()
    conn.close()
    return jsonify([dict(plan) for plan in plans])

@admin.route('/admin/plans', methods=['POST'])
def add_plan():
    data = request.get_json()
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO plans (planName, price, duration, description, months)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['planName'], data['price'], data['duration'], str(data['description']), data['months']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Plan added successfully'})

@admin.route('/admin/plans', methods=['PUT'])
def update_plan():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.execute('''
        UPDATE plans
        SET planName = ?, price = ?, duration = ?, description = ?, months = ?
        WHERE id = ?
    ''', (data['planName'], data['price'], data['duration'], str(data['description']), data['months'], data['id']))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'message': 'Plan not found'}), 404
    return jsonify({'message': 'Plan updated successfully'})

@admin.route('/admin/plans/<int:id>', methods=['DELETE'])
def delete_plan(id):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM plans WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'message': 'Plan not found'}), 404
    return jsonify({'message': 'Plan deleted successfully'})

# Transactions
@admin.route('/admin/transactions', methods=['GET'])
def get_transactions():
    conn = get_db_connection()
    transactions = conn.execute("""
        SELECT 
            plan_payments.id,
            clerk.name AS user_name,
            plans.planName AS plan_name,
            coupons.value AS discount_value,
            plan_payments.order_id,
            plan_payments.status,
            plan_payments.total_value
        FROM plan_payments
        LEFT JOIN clerk ON plan_payments.userid = clerk.id
        LEFT JOIN plans ON plan_payments.planid = plans.id
        LEFT JOIN coupons ON plan_payments.coupon = coupons.coupon
    """).fetchall()
    conn.close()
    return jsonify([dict(txn) for txn in transactions])




@admin.route('/api/admin/verify', methods=['POST'])
def verify_access():
    from admincred import admins

    email=session['email'] 
    contact=str(session['contact']) 
    username=session['name']
    print(email, contact, username)
    for admin in admins:
        print(admin["phone"][len(admin['phone'])-10:])
        print(admin['email'])
        print(contact)
        if admin['email'] == email and str(admin["phone"][len(admin['phone'])-10:]) == contact[len( contact )-10:]:
            return jsonify({'FLAG': 'YES', 'name': username})
        else:
            return jsonify({'FLAG': 'NO'})
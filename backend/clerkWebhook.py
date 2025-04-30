import sqlite3
from flask import Flask,request,session,Blueprint
import json
    # @app.route("/api/webhooks",methods=["POST","GET"])
    # def getData():
    #     data=request.get_json()
    #     print("this is webhook",type(data))
    #     return "success"
# app= Flask(__name__)
clerkdata=Blueprint("clerkdata",__name__)

@clerkdata.route("/api/webhooks", methods=["POST", "GET"])
def clerk():
    data=request.get_json()
    # print("data",data)
    clerkId,clerkName,clerkEmail,clerkNumber,requestType=extractClerk(data)
    conn = get_db_connection()
    
    if requestType == "user.created":
        cursor = conn.execute('SELECT * FROM clerk WHERE clerkID = ? OR email = ?', (clerkId, clerkEmail))
        existing_user = cursor.fetchone()

        if existing_user:
            print("User already exists. No new user created.")
        else:
            conn.execute('INSERT INTO clerk (name, email,phone, clerkID) VALUES (?, ?, ?, ?)', (clerkName, clerkEmail,clerkNumber, clerkId))
            conn.commit()
            print("User created")

    elif requestType == "user.deleted":
        # Delete user from the database using clerk_id
        conn.execute('DELETE FROM clerk WHERE clerkID = ?', (clerkId,))
        conn.commit()
        print("User deleted")

    elif requestType == "user.updated":
        # Update user information in the database using clerk_id
        conn.execute('UPDATE clerk SET name = ?, email = ?, phone = ? WHERE clerkID = ?', (clerkName, clerkEmail,clerkNumber, clerkId))
        conn.commit()
        print("User updated")

    # elif requestType == "session.created":
    #     session['clerkId'] = clerkId
    #     print("session ::::::::" ,session.get('clerkId'))


    conn.close()
    # print(clerkName,clerkEmail,clerkId,requestType)
    return("Success")


def extractClerk(data):
    requestType=data['type']
    if requestType == "session.created":
        clerkId=data['data']['user_id']
        clerkName="NA"
        clerkEmail="NA"
        return(clerkId,clerkName,clerkEmail,requestType)


    if requestType == "user.deleted":
            clerkId=data['data']['id']
            clerkName="NA"
            clerkEmail="NA"
            clerkNumber="NA"
            return(clerkId,clerkName,clerkEmail,clerkNumber,requestType)
    clerkId=data['data']['id']

    clerkName=data['data']['first_name']
    clerkEmail=data['data']['email_addresses'][0]['email_address']
    if len(data['data']['phone_numbers'])==0:
        clerkNumber="None"
    else:
        clerkNumber=data['data']['phone_numbers'][0]['phone_number']
    print("clerk Number :: ",clerkNumber)



    return (clerkId,clerkName,clerkEmail,clerkNumber,requestType)



def get_db_connection():
    conn = sqlite3.connect('./userData.db')
    # /home/kunal/Documents/major_project/CognitiveBerg
    conn.row_factory = sqlite3.Row  # Allows us to return rows as dictionaries
    return conn



# if __name__ == "__main__":
#     app.run(debug=True,port=5050,host='0.0.0.0')
#     # app.run(host='0.0.0.0', port=5000)

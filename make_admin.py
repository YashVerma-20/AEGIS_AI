import os
import psycopg2
import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase
cred_path = os.path.join('backend', 'firebase-adminsdk.json')
cred = credentials.Certificate(cred_path)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

email = "khusverma2004@gmail.com"

try:
    # 1. Get Firebase UID by Email
    user = auth.get_user_by_email(email)
    uid = user.uid
    print(f"Found user {email} in Firebase with UID: {uid}")

    # 2. Update PostgreSQL Database
    conn = psycopg2.connect(
        host='localhost',
        port='5433',
        database='fdm_metadata',
        user='fdm_admin',
        password='fdm_secure_password'
    )
    cursor = conn.cursor()
    
    # Update the user's role to 'admin' (checking both UID and email just in case)
    cursor.execute("UPDATE user_roles SET role = 'admin' WHERE username = %s OR username = %s", (uid, email))
    updated_rows = cursor.rowcount
    
    if updated_rows > 0:
        print(f"Success! Updated existing database record to 'admin'.")
    else:
        print("Record not found in Postgres. Creating new admin record...")
        cursor.execute("INSERT INTO user_roles (username, role) VALUES (%s, 'admin')", (uid,))
        print("Success! Inserted new admin record.")
        
    conn.commit()
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error occurred: {e}")

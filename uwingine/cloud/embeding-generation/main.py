import boto3
import psycopg2
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import os
from dotenv import load_dotenv

# Load environment variables from .env file
# load_dotenv()
load_dotenv(dotenv_path='../../../.env')


aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION')

s3_bucket_name = os.getenv('S3_BUCKET_NAME_DATA')

dynamodb_table_name = os.getenv('DYNAMODB_TABLE_NAME')

rds_host = os.getenv('RDS_HOSTNAME')
rds_port = os.getenv('RDS_PORT')
rds_db_name = os.getenv('RDS_DB_NAME')
rds_username = os.getenv('RDS_USERNAME')
rds_password = os.getenv('RDS_PASSWORD')

# Initialize boto3 with AWS credentials
boto3.setup_default_session(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)


class S3Manager:
    def __init__(self, bucket_name):
        self.s3 = boto3.client('s3')
        self.bucket_name = bucket_name

    def upload_file(self, file_name, object_name=None):
        if object_name is None:
            object_name = file_name

        # Validate inputs
        if file_name is None:
            print("Error: file_name cannot be None.")
            return
        if self.bucket_name is None:
            print("Error: bucket_name cannot be None.")
            return

        try:
            self.s3.upload_file(file_name, self.bucket_name, object_name)
            print(f"File {file_name} uploaded to {
                  self.bucket_name}/{object_name}")
        except (NoCredentialsError, PartialCredentialsError) as e:
            print(f"Credentials error: {e}")

    def download_file(self, object_name, file_name):
        try:
            self.s3.download_file(self.bucket_name, object_name, file_name)
            print(f"File {object_name} downloaded from {
                  self.bucket_name} to {file_name}")
        except (NoCredentialsError, PartialCredentialsError) as e:
            print(f"Credentials error: {e}")


class DynamoDBManager:
    def __init__(self, table_name):
        self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table(table_name)

    def create_item(self, item):
        self.table.put_item(Item=item)
        print(f"Item {item} created in table {self.table.name}")

    def read_item(self, key):
        response = self.table.get_item(Key=key)
        item = response.get('Item')
        print(f"Item read from table {self.table.name}: {item}")
        return item

    def update_item(self, key, update_expression, expression_attribute_values):
        self.table.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        print(f"Item with key {key} updated in table {self.table.name}")

    def delete_item(self, key):
        self.table.delete_item(Key=key)
        print(f"Item with key {key} deleted from table {self.table.name}")


class RDSManager:
    def __init__(self, db_name, user, password, host, port):
        self.connection = psycopg2.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.cursor = self.connection.cursor()

    def create_record(self, query, values):
        self.cursor.execute(query, values)
        self.connection.commit()
        print(f"Record created with query: {query}")

    def read_record(self, query, values):
        self.cursor.execute(query, values)
        result = self.cursor.fetchone()
        print(f"Record read with query: {query}, result: {result}")
        return result

    def update_record(self, query, values):
        self.cursor.execute(query, values)
        self.connection.commit()
        print(f"Record updated with query: {query}")

    def delete_record(self, query, values):
        self.cursor.execute(query, values)
        self.connection.commit()
        print(f"Record deleted with query: {query}")

    def get_all_records(self, query):
        self.cursor.execute(query)
        result = self.cursor.fetchall()
        print(f"Records read with query: {query}, result: {result}")
        return result

    def execute_query(self, query):
        self.cursor.execute(query)
        self.connection.commit()
        print(f"Query executed: {query}")

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
        print("Database connection closed")

# Example usage S3Manager
# s3_manager = S3Manager(s3_bucket_name)
# s3_manager.upload_file('file.txt')
# s3_manager.download_file('file.txt', 'downloaded_file.txt')

# Example usage DynamoDBManager
# dynamodb_manager = DynamoDBManager(dynamodb_table_name)
# dynamodb_manager.create_item({'type': 'calender', 'title': 'Test Doc'})
# dynamodb_manager.read_item({'type': 'calender', 'title': 'Test Doc'})
# dynamodb_manager.update_item({'type': 'calender' , 'title':'Test Doc'}, 'SET created_by = :created_by', {':created_by': 'Bob'})
# dynamodb_manager.delete_item({'type': 'calender', 'title': 'Test Doc'})

# Example usage RDSManager
rds_manager = RDSManager(rds_db_name, rds_username, rds_password, rds_host, rds_port)
# rds_manager.create_record('INSERT INTO users (name) VALUES (%s)', ('Alice',))
# rds_manager.read_record('SELECT * FROM users WHERE name= %s', ('Alice',))
# rds_manager.update_record('UPDATE users SET name = %s WHERE name = %s', ('Bob', 'Alice'))
# rds_manager.delete_record('DELETE FROM users WHERE name = %s', ('Bob',))
# rds_manager.execute_query('CREATE EXTENSION IF NOT EXISTS vector;')
# rds_manager.get_all_records('SELECT * FROM pg_extension')
rds_manager.read_record('SELECT * FROM pg_extension WHERE extname = %s', ('vector',))
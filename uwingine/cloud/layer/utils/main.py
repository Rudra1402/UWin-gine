import boto3
import psycopg2
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import os
from dotenv import load_dotenv

# Initialize boto3 with AWS credentials
# Load environment variables from .env file
load_dotenv(dotenv_path='../../.env')

aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION')

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
        try:
            self.s3.upload_file(file_name, self.bucket_name, object_name)
            print(f"File {file_name} uploaded to {self.bucket_name}/{object_name}")
        except (NoCredentialsError, PartialCredentialsError) as e:
            print(f"Credentials error: {e}")

    def download_file(self, object_name, file_name):
        try:
            self.s3.download_file(self.bucket_name, object_name, file_name)
            print(f"File {object_name} downloaded from {self.bucket_name} to {file_name}")
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

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
        print("Database connection closed")
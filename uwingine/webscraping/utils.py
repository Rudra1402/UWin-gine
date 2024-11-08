import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import os

region_name = os.getenv('AWS_REGION', 'us-east-1')

s3_bucket_name = os.getenv('S3_BUCKET_NAME_DATA', 'uwingine-data')

dynamodb_table_name = os.getenv('DYNAMODB_TABLE_NAME', 'Uwingine-Metadata')

# Initialize boto3 with AWS credentials
boto3.setup_default_session(
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
            return f"https://{self.bucket_name}.s3.amazonaws.com/{object_name}"
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

    def scan_items(self):
        # all items in the table if there is LastEvaluatedKey
        response = self.table.scan()
        items = response.get('Items')
        while 'LastEvaluatedKey' in response:
            response = self.table.scan(
                ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response['Items'])
        print(f"Items scanned from table {self.table.name}: {items}")
        return items


class DynamoDBToS3Downloader:
    def __init__(self, table_name, bucket_name, download_directory):
        self.s3_manager = S3Manager(bucket_name)
        self.dynamodb_manager = DynamoDBManager(table_name)
        self.download_directory = download_directory

        if not os.path.exists(download_directory):
            os.makedirs(download_directory)

    def scan_and_download(self):
        response = self.dynamodb_manager.scan_items()
        for item in response:
            file_url = item.get('local_path')
            title = item.get('title')
            local_file_path = os.path.join(
                self.download_directory, os.path.basename(f'{title}.pdf'))
            self.s3_manager.download_file(file_url, local_file_path)
            print(f"Downloaded file {file_url} from {local_file_path}")

        return {item['title']: {key: value for key, value in item.items() if key != 'title'} for item in response}
    
    def scan(self):
        response = self.dynamodb_manager.scan_items()
        for item in response:
            file_url = item.get('local_path')
            title = item.get('title')
            local_file_path = os.path.join(
                self.download_directory, os.path.basename(f'{title}.pdf'))
            # self.s3_manager.download_file(file_url, local_file_path)
            # print(f"Downloaded file {file_url} from {local_file_path}")

        return {item['title']: {key: value for key, value in item.items() if key != 'title'} for item in response}


# Example usage S3Manager
# s3_manager = S3Manager(s3_bucket_name)
# s3_manager.upload_file('file.txt')
# s3_manager.download_file('file.txt', 'downloaded_file.txt')

# Example usage DynamoDBManager
# dynamodb_manager = DynamoDBManager(dynamodb_table_name)
# dynamodb_manager.create_item({'title': 'Test Doc'})
# dynamodb_manager.read_item({'title': 'Test Doc'})
# dynamodb_manager.update_item({'title':'Test Doc'}, 'SET created_by = :created_by', {':created_by': 'Bob'})
# dynamodb_manager.delete_item({'title': 'Test Doc'})

# try:
#     # # Example usage S3Manager
#     # s3_manager = S3Manager(s3_bucket_name)
#     # s3_manager.upload_file('file.txt')
#     # s3_manager.download_file('file.txt', 'downloaded_file.txt')

#     # # Example usage DynamoDBManager
#     # dynamodb_manager = DynamoDBManager(dynamodb_table_name)
#     # dynamodb_manager.create_item({'title': 'Test Doc'})
#     # dynamodb_manager.read_item({'title': 'Test Doc'})
#     # dynamodb_manager.update_item({'title': 'Test Doc'}, 'SET created_by = :created_by', {':created_by': 'Bob'})
#     # dynamodb_manager.delete_item({'title': 'Test Doc'})
#     # Example usage DynamoDBToS3Downloader
#     downloader = DynamoDBToS3Downloader(dynamodb_table_name, s3_bucket_name, 'downloads')
#     items = downloader.scan_and_download()

#     print(f"Items downloaded: {items}")
# except Exception as e:
#     print(f"Error: {e}")
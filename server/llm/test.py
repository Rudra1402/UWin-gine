import sys,os
from dotenv import load_dotenv
load_dotenv()
import boto3
sys.path.append(os.path.abspath('..'))
from webscraping.utils import *

os.environ['AWS_ACCESS_KEY_ID'] = os.getenv(key="aws_access_key_id")
os.environ['AWS_SECRET_ACCESS_KEY'] = os.getenv(key="aws_secret_access_key")
os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

dynamodb = boto3.resource('dynamodb', region_name=os.environ['AWS_DEFAULT_REGION'])
table_name = 'Uwingine-Metadata'
table = dynamodb.Table(table_name)

print(table)
# downloader = DynamoDBToS3Downloader
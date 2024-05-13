import json
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return json.JSONEncoder.default(self, obj)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DrMentTable')

def lambda_handler(event, context):
    org = event["pathParameters"]["org_id"]
    response = table.query(
        IndexName='parent_id-timestamp-index',
        KeyConditionExpression=Key('parent_id').eq(org)
    )
    print(response)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': json.dumps(response['Items'], cls=JSONEncoder)
    }
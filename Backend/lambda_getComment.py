import json
import uuid
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Comments")


def lambda_handler(event, context):
    body = json.loads(event['body'])
    res_body = {"code": 1, "output": "Commented Successfully"}
    parent_id = ""
    
    response = table.query(
        KeyConditionExpression=Key('parent_id').eq(parent_id)
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        "body": json.dumps(res_body),
    }
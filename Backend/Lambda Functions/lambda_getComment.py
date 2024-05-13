import json
import uuid
import boto3
import time
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("DrMentTable")


def lambda_handler(event, context):
    doc_id = event["pathParameters"]["doc_id"]
    
    response = table.query(
        IndexName='parent_id-timestamp-index',
        KeyConditionExpression=Key('parent_id').eq(doc_id)
    )
    
    res = sorted(response['Items'], key=lambda x: x["timestamp"])
    res = [{"id": entry["id"], "user_id": entry["user_id"], "comment": entry["comment"], "posted_time": time.ctime(int(entry['timestamp']))} for entry in res]

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        "body": json.dumps(res),
    }

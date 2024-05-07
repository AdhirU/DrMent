import json
import uuid
import time
import base64
import boto3
import macro

s3 = boto3.client("s3")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("DrMentTable")


def lambda_handler(event, context):
    print("event", event)
    # body = event["body"]
    body = json.loads(event['body'])
    file_content = body["file"]
    decoded_content = base64.b64decode(file_content.split(",")[1])
    with open("/tmp/uploaded_file", "wb") as f:
        f.write(decoded_content)

    macro_res = macro.ScanMacro("/tmp/uploaded_file")
    print("macro res", macro_res)

    if macro_res["code"] == 2:
        res_body = {"code": 0, "output": macro_res["output"]}
    else:
        res_body = {"code": 1, "output": "Document uploaded successfully"}
        # Generate UUID for document
        doc_id = str(uuid.uuid4())
        # Put document in S3 bucket
        s3.put_object(Bucket="drment-doc-storage", Key=doc_id, Body=decoded_content)
        # Put document metadata in DB
        table.put_item(
            Item={
                'id': doc_id,
                'name': body['name'],
                'description': body['description'],
                'parent_id': body['org'],
                'user_id': body['user_id'],
                'timestamp': int(time.time())
            })

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        "body": json.dumps(res_body),
    }

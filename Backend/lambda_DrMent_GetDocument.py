import json
import boto3

s3 = boto3.client("s3")

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("DrMentTable")


def lambda_handler(event, context):
    bucket_name = "drment-doc-storage"
    file_name = event["pathParameters"]["doc_id"]

    url = s3.generate_presigned_url("get_object", Params={"Bucket": bucket_name, "Key": file_name, "ExpiresIn":600})

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        "body": json.dumps({"url": url}),
    }

import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    
    bucket_name=event["queryStringParameters"]['bucketname']
    object_name=event["queryStringParameters"]['filename']
    fields=None
    conditions=None
    expiration=300


    # # Generate a presigned S3 POST URL
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_post(bucket_name, object_name, Fields=fields, Conditions=conditions, ExpiresIn=expiration)
    except ClientError as e:
        print(e)
        return None
    
    return response
    
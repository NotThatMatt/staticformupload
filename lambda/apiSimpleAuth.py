import json

def lambda_handler(event, context):
    
    
    if event["headers"]["authorization"] == "superSecret" :
        response = {
            "isAuthorized": True
            }
    else :
        response = {
            "isAuthorized": False
            }
    
    return response
    
import logging

import azure.functions as func
from azure.cognitiveservices.vision.face import FaceClient
from azure.cognitiveservices.vision.face.models import FaceAttributeType
from msrest.authentication import CognitiveServicesCredentials

import sys
import base64
import io
from PIL import Image, ImageDraw
from matplotlib import pyplot as plt

def init():
    cog_endpoint = 'https://faceemotiondetection.cognitiveservices.azure.com/'
    cog_key = 'dfc196ccd9ff4451b92b3b5ee55c22eb'

    credentials = CognitiveServicesCredentials(cog_key)
    face_client = FaceClient(cog_endpoint, credentials)
    return face_client

def DetectFaces(face_client, image):
    features = [FaceAttributeType.age,
            FaceAttributeType.emotion]
    emotions = {}
    # Get faces
    detected_faces = face_client.face.detect_with_stream(image=image,
                                                              return_face_attributes=features)
    if len(detected_faces) > 0:
        print(len(detected_faces), 'faces detected.')
        # Draw and annotate each face
        for face in detected_faces:
            detected_attributes = face.face_attributes.as_dict()
            emotions[face.face_id] = detected_attributes['emotion']
            
    return emotions

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    if req.files and req.files["filename"]:
        face_client = init()
        img = req.files["filename"] 
        #img = Image.open(img)
        #sz = sys.getsizeof(img)
        emotions = DetectFaces(face_client, img)
        emotions = str(emotions)
        emotions = emotions.replace("'", "\"")
        return func.HttpResponse(
                str(emotions),
                status_code=200
            )
    return func.HttpResponse("Imagen no enviada", status_code=200)
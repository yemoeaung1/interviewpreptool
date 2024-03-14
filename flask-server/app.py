from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from openai import OpenAI
import wave
import os
import mimetypes
from dotenv import load_dotenv
# import speech_recognition as sr

#run pip install -r requirements.txt
from FacialDetection import EmotionDetector



# recognizer = sr.Recognizer()
load_dotenv()
app = Flask(__name__)

CORS(app)

# Define routes and their respective functions
@app.route('/flask', methods=['GET'])
def index():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

# You can define more routes here...
@app.route('/audio-parse', methods=['POST'])
def audio_parse():
    try:
        qID = request.args.get('qID')
        if qID:
        # Process the qID
            print(f'qID: {qID}')
        else:
            print(f'qID: {qID}')

        audio_blob = request.files['audio']

        print(audio_blob)
        audio_blob.seek(0)

        audio_path = 'audio.webm'


        with open(audio_path, 'wb') as file:
            file.write(audio_blob.read())

        text = "DUDE"
        print('created audio file')

        client = OpenAI(api_key = os.environ.get('GPT_API_KEY')) 

        print('created client')

        audio_file= open(audio_path, "rb")
        translation = client.audio.translations.create(
        model="whisper-1", 
        file=audio_file
        )

        print(translation.text)

        data = text
        # # Add answer to appropriate question
        # status = dboperations.add_content(qID, answer=data)

        return jsonify({'message': translation.text }), 200
    except Exception as e:
        return jsonify({'message':'bad'}), 400
    
@app.route('/uploadresponse', methods=['POST'])
def processResponse():
    try:
        qID = request.args.get('qID')
        if qID:
        # Process the qID
            print(f'qID: {qID}')
        else:
            print(f'qID: {qID}')

        video_blob = request.files['file']
        video_path = 'video.webm'

        with open(video_path, 'wb') as file:
            file.write(video_blob.read())

        print("yur file worked")

        detector = EmotionDetector(video_path)
        response = detector.single_thread()

        # status = dboperations.add_content(qID, video = video_blob, emotion_freq = response)
        
        
        return jsonify({'message': response}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)




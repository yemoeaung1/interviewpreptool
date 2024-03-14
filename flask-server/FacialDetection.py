import cv2
from deepface import DeepFace
import time
import numpy as np
from multiprocessing import Pool, cpu_count


class EmotionDetector:
    def __init__(self, video_path):
        self.video_path = video_path
        self.num_processes = cpu_count()
        self.total_emotion_freq = {}

    def convert_webm_to_mp4(self, output_file):
        # Load the WebM file
        clip = VideoFileClip(self.video_path)

        # Write the clip to an MP4 file
        clip.write_videofile(output_file)

        # Close the clip
        clip.close()

    def detect_emotions(self, frame_jump_unit, group_number):
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        emotion_classifier = cv2.imread('haarcascade_frontalface_default.xml')
        emotion_freq = {}
        video = self.video_path.read()
        cap = cv2.VideoCapture(video)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_jump_unit * group_number)

        proc_frames = 0
        try:
            while proc_frames < frame_jump_unit:
                ret, frame = cap.read()
                if not ret:
                    break

                frame = cv2.resize(frame, (640, 480))
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                kernel = np.ones((3, 3), np.float32) / 9
                filtered = cv2.filter2D(gray, -1, kernel)
                faces = face_cascade.detectMultiScale(filtered, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

                for (x, y, w, h) in faces:
                    objs = DeepFace.analyze(img_path=frame, actions=['emotion'], enforce_detection=False)
                    if objs:
                        dominant_emotion = objs[0]['dominant_emotion']
                        print(dominant_emotion)
                        emotion_freq[dominant_emotion] = emotion_freq.get(dominant_emotion, 0) + 1

                proc_frames += 1
        except Exception as e:
            print(e)
        finally:
            cap.release()
        return emotion_freq

    def multi_process(self):
        start = time.time()
        frame_jump_unit = self.get_frame_jump_unit(self.num_processes)
        p = Pool(self.num_processes)
        subset_frequencies = p.starmap(self.detect_emotions,
                                       [(frame_jump_unit, group_number) for group_number in range(self.num_processes)])
        p.close()
        p.join()

        # total_frequency = {}
        for freq_dict in subset_frequencies:
            for emotion, count in freq_dict.items():
                self.total_emotion_freq[emotion] = self.total_emotion_freq.get(emotion, 0) + count

        end = time.time()
        execution_time = end - start
        print(f'Program took {execution_time} seconds')
        print(self.total_emotion_freq)
        return self.total_emotion_freq

    def get_frame_jump_unit(self, num_processes):
        cap = cv2.VideoCapture(self.video_path)
        length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        print(length)
        cap.release()
        return length // num_processes

    def single_thread(self):
        start = time.time()

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        emotion_classifier = cv2.imread('haarcascade_frontalface_default.xml')
        emotion_freq = {}
        cap = cv2.VideoCapture(self.video_path)

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                frame = cv2.resize(frame, (640, 480))
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                kernel = np.ones((3, 3), np.float32) / 9
                filtered = cv2.filter2D(gray, -1, kernel)
                faces = face_cascade.detectMultiScale(filtered, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

                for (x, y, w, h) in faces:
                    objs = DeepFace.analyze(img_path=frame, actions=['emotion'], enforce_detection=False)
                    if objs:
                        dominant_emotion = objs[0]['dominant_emotion']
                        print(dominant_emotion)
                        self.total_emotion_freq[dominant_emotion] = self.total_emotion_freq.get(dominant_emotion, 0) + 1

        except Exception as e:
            print(e)
        finally:
            cap.release()
            end = time.time()
            print(f'run time:{end - start}')
        return self.total_emotion_freq



detector = EmotionDetector(0)
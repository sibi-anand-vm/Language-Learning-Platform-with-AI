import { useState, useRef } from 'react';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export const useAudioRecorder = (onUploadSuccess) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [feedback, setFeedback] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentWordIndexRef = useRef(null);

  const startRecording = async (wordIndex) => {
    try {
      currentWordIndexRef.current = wordIndex;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await uploadRecording(audioBlob);
      };

      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      alert("Microphone error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const uploadRecording = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("resource_type", CLOUDINARY_CONFIG.resourceType);

    try {
      const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      if (onUploadSuccess) {
        onUploadSuccess(data.secure_url);
      }

      // For now, using dummy feedback
      setFeedback(prev => ({
        ...prev,
        [currentWordIndexRef.current]: {
          score: Math.floor(Math.random() * 40) + 60,
          feedback: "Good pronunciation!",
        },
      }));

    } catch (err) {
      alert("Upload error:", err);
      setFeedback(prev => ({
        ...prev,
        [currentWordIndexRef.current]: {
          error: "Failed to upload recording",
        },
      }));
    }
  };

  return {
    isRecording,
    recordings,
    feedback,
    startRecording,
    stopRecording,
  };
}; 
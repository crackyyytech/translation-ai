'use client';

import { useState, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          audioChunksRef.current = [];
          setIsRecording(false);
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description:
          'Could not access the microphone. Please check your browser permissions.',
      });
      setIsRecording(false);
    }
  }, [isRecording, toast]);

  return { isRecording, startRecording, stopRecording };
};

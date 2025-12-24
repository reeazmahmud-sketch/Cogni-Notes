
import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';

// Manual base64 encoding as per GenAI SDK requirements for Live API
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const useVoiceProcessor = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const finalizedTranscriptRef = useRef('');

  const stopRecordingFlow = useCallback(() => {
    if (scriptProcessorRef.current) {
      try { scriptProcessorRef.current.disconnect(); } catch (e) {}
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) {}
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }
    setIsRecording(false);
    setIsConnecting(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording || isConnecting) return;
    
    setError(null);
    setTranscript('');
    finalizedTranscriptRef.current = '';
    setIsConnecting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Initialize GoogleGenAI right before connecting to ensure the latest API key is used.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = ctx;
            
            const source = ctx.createMediaStreamSource(stream);
            const script = ctx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = script;
            
            script.onaudioprocess = (ev) => {
              const inputData = ev.inputBuffer.getChannelData(0);
              const blob = createBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves to send data.
              sessionPromise.then(session => {
                if (session) session.sendRealtimeInput({ media: blob });
              }).catch(err => {
                console.error("Failed to send audio chunk:", err);
              });
            };
            
            source.connect(script);
            script.connect(ctx.destination);
            
            setIsConnecting(false);
            setIsRecording(true);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              finalizedTranscriptRef.current += text;
              setTranscript(finalizedTranscriptRef.current);
            }
          },
          onerror: (e) => {
            console.error("Live API error:", e);
            setError("রেকর্ডিং সেশনের সময় একটি সমস্যা হয়েছে।");
            stopRecordingFlow();
          },
          onclose: () => {
            stopRecordingFlow();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}, 
          systemInstruction: 'You are a transcriber. Convert Bengali speech to text accurately. Do not reply, only transcribe.',
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("মাইক্রোফোন সংযোগ করা যায়নি। দয়া করে পারমিশন চেক করুন।");
      setIsConnecting(false);
    }
  }, [isRecording, isConnecting, stopRecordingFlow]);

  return { 
    isRecording, 
    isConnecting, 
    transcript, 
    error, 
    startRecording, 
    stopRecording: stopRecordingFlow,
    setTranscript 
  };
};

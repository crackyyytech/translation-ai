'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { jsPDF } from 'jspdf';
import { transcribeAudioToTamil } from '@/ai/flows/transcribe-audio-to-tamil';
import { normalizeSlangTamil } from '@/ai/flows/normalize-slang-tamil';
import { translateTamilToTargetLanguage } from '@/ai/flows/translate-tamil-to-target-language';
import { detectEmotionTone } from '@/ai/flows/detect-emotion-tone';
import { correctTamilGrammar } from '@/ai/flows/correct-tamil-grammar';
import { summarizeTextContent } from '@/ai/flows/summarize-text-content';
import { textToSpeechPlayback } from '@/ai/flows/text-to-speech-playback';
import { useToast } from '@/hooks/use-toast';
import { useRecorder } from '@/hooks/use-recorder';
import AppHeader from '@/components/app/header';
import TranscriptionPane from '@/components/app/transcription-pane';
import TranslationPane from '@/components/app/translation-pane';
import OriginalTextPane from '@/components/app/original-text-pane';
import { Progress } from '@/components/ui/progress';

type LoadingState = {
  active: boolean;
  message: string;
  progress: number;
};

export default function Home() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    active: false,
    message: '',
    progress: 0,
  });
  const [originalText, setOriginalText] = useState('');
  const [normalizedText, setNormalizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [emotion, setEmotion] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<{
    tamil: string;
    translated: string;
  } | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const { toast } = useToast();
  const { isRecording, startRecording, stopRecording } = useRecorder();

  const blobToDataUri = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  const resetState = () => {
    setOriginalText('');
    setNormalizedText('');
    setTranslatedText('');
    setEmotion(null);
    setSummaries(null);
  };

  const processAudio = async (audioBlob: Blob) => {
    resetState();
    setLoadingState({ active: true, message: 'Starting...', progress: 0 });

    try {
      const audioDataUri = await blobToDataUri(audioBlob);

      setLoadingState({
        active: true,
        message: 'Transcribing audio to Tamil...',
        progress: 25,
      });
      const { transcription } = await transcribeAudioToTamil({ audioDataUri });
      setOriginalText(transcription);

      setLoadingState({
        active: true,
        message: 'Normalizing slang text...',
        progress: 50,
      });
      const { normalizedTamilText } = await normalizeSlangTamil({
        tamilText: transcription,
      });
      setNormalizedText(normalizedTamilText);

      setLoadingState({
        active: true,
        message: `Translating to ${targetLanguage}...`,
        progress: 75,
      });
      const { translatedText: translation } =
        await translateTamilToTargetLanguage({
          tamilText: normalizedTamilText,
          targetLanguage,
        });
      setTranslatedText(translation);

      setLoadingState({
        active: true,
        message: 'Analyzing emotional tone...',
        progress: 100,
      });
      const { emotion: detectedEmotion } = await detectEmotionTone({
        text: translation,
      });
      setEmotion(detectedEmotion);

      toast({
        title: 'Success!',
        description: 'Your audio has been fully processed.',
      });
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: errorMessage,
      });
    } finally {
      setLoadingState({ active: false, message: '', progress: 0 });
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        processAudio(audioBlob);
      }
    } else {
      startRecording();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAudio(file);
    }
  };

  const handleGrammarCheck = async () => {
    if (!normalizedText) return;
    setLoadingState({
      active: true,
      message: 'Correcting grammar...',
      progress: 50,
    });
    try {
      const { correctedTamilText } = await correctTamilGrammar({
        tamilText: normalizedText,
      });
      setNormalizedText(correctedTamilText);
      toast({
        title: 'Grammar Corrected',
        description: 'The Tamil text has been updated.',
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Grammar Check Failed',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setLoadingState({ active: false, message: '', progress: 0 });
    }
  };

  const handleSummarization = async () => {
    if (!originalText) {
      toast({
        variant: 'destructive',
        title: 'No text to summarize',
        description: 'Please transcribe an audio file first.',
      });
      return;
    }

    setLoadingState({
      active: true,
      message: 'Summarizing content...',
      progress: 50,
    });
    try {
      const { tamilSummary, translatedSummary } = await summarizeTextContent({
        textContent: originalText,
        targetLanguage,
      });
      setSummaries({ tamil: tamilSummary, translated: translatedSummary });
      toast({ title: 'Summarization Complete' });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    } finally {
      setLoadingState({ active: false, message: '', progress: 0 });
    }
  };

  const handleTTS = async () => {
    if (!translatedText) return;
    setIsPlayingTTS(true);
    try {
      const { media } = await textToSpeechPlayback({ text: translatedText });
      const audio = new Audio(media);
      audio.play();
      audio.onended = () => setIsPlayingTTS(false);
    } catch (err) {
      console.error(err);
      setIsPlayingTTS(false);
      toast({
        variant: 'destructive',
        title: 'Playback Failed',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // It's important to use a font that supports the characters you want to display.
    // The default fonts in jsPDF may not support Tamil.
    // We'll use 'PT Sans', which is loaded by the app and has broader character support.
    doc.setFont('PT Sans', 'bold');
    doc.setFontSize(18);
    doc.text('Tamil Transcribe AI Report', 14, 22);

    doc.setFont('PT Sans', 'normal');
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

    let y = 50;

    const addSection = (title: string, content: string) => {
      if (!content) return;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('PT Sans', 'bold');
      doc.setFontSize(14);
      doc.text(title, 14, y);
      y += 10;
      
      doc.setFont('PT Sans', 'normal');
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(content, 180);
      doc.text(splitContent, 14, y);
      y += splitContent.length * 7 + 12;
    };

    addSection('Original Transcription (Tamil)', originalText);
    addSection('Normalized Text (Tamil)', normalizedText);
    addSection(`Translation (${targetLanguage})`, translatedText);
    addSection('Emotion Tone', emotion || 'Not analyzed');

    if (summaries) {
      addSection('Tamil Summary', summaries.tamil);
      addSection('Translated Summary', summaries.translated);
    }
    
    doc.save('tamil-transcribe-ai-report.pdf');
  };

  const hasContent = useMemo(() => !!originalText, [originalText]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader
        isRecording={isRecording}
        isLoading={loadingState.active}
        hasContent={hasContent}
        onRecord={handleRecording}
        onFileChange={handleFileChange}
        onLanguageChange={setTargetLanguage}
        onSummarize={handleSummarization}
        onDownload={handleDownload}
        targetLanguage={targetLanguage}
      />

      {loadingState.active && (
        <div className="px-8 pt-4">
          <Progress value={loadingState.progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {loadingState.message}
          </p>
        </div>
      )}

      <main className="flex-1 grid grid-cols-1 gap-6 p-4 md:p-6">
        <OriginalTextPane
          originalText={originalText}
          isLoading={loadingState.active}
        />
        <TranscriptionPane
          normalizedText={normalizedText}
          onNormalizedTextChange={setNormalizedText}
          onGrammarCheck={handleGrammarCheck}
          isLoading={loadingState.active}
          summary={summaries?.tamil}
          hasContent={hasContent}
        />
        <TranslationPane
          translatedText={translatedText}
          emotion={emotion}
          isLoading={loadingState.active}
          isPlayingTTS={isPlayingTTS}
          onTTS={handleTTS}
          summary={summaries?.translated}
          hasContent={hasContent}
        />
      </main>
    </div>
  );
}

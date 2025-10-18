'use client';

import { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
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
  const [generatedDate, setGeneratedDate] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const { isRecording, startRecording, stopRecording } = useRecorder();

  useEffect(() => {
    // This will run only on the client, after hydration.
    setGeneratedDate(new Date().toLocaleString());
  }, []);

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
    const reportElement = reportRef.current;
    if (!reportElement) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not find report content to download.',
      });
      return;
    }
  
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    });
  
    doc.html(reportElement, {
      callback: function (doc) {
        doc.save('tamil-transcribe-ai-report.pdf');
      },
      x: 15,
      y: 15,
      width: 416, // A4 width in pixels at 72 dpi is ~595. 595 - 30 (margins) = 565. Use smaller for safety.
      windowWidth: reportElement.scrollWidth,
    });
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

      {/* Hidden div for PDF generation */}
      <div className="absolute -z-10 -left-[9999px] top-0 w-[446px] p-4 bg-background text-foreground" ref={reportRef}>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold font-headline">Tamil Transcribe AI Report</h1>
            <p className="text-sm">Generated on {generatedDate || '...'}</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-headline border-b pb-1">Original Transcription (Tamil)</h2>
            <p className="font-headline text-sm">{originalText || 'Not available'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold font-headline border-b pb-1">Normalized Text (Tamil)</h2>
            <p className="font-headline text-sm">{normalizedText || 'Not available'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold font-headline border-b pb-1">Translation ({targetLanguage})</h2>
            <p className="text-sm">{translatedText || 'Not available'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold font-headline border-b pb-1">Emotion Tone</h2>
            <p className="text-sm capitalize">{emotion || 'Not analyzed'}</p>
          </div>

          {summaries && (
            <>
              <div className="space-y-2">
                <h2 className="text-lg font-bold font-headline border-b pb-1">Tamil Summary</h2>
                <p className="font-headline text-sm">{summaries.tamil}</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold font-headline border-b pb-1">Translated Summary</h2>
                <p className="text-sm">{summaries.translated}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

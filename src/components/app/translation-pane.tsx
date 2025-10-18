'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, LoaderCircle, BookOpen } from 'lucide-react';
import EmotionIcon from './emotion-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '../ui/separator';

type TranslationPaneProps = {
  translatedText: string;
  emotion: string | null;
  isLoading: boolean;
  isPlayingTTS: boolean;
  onTTS: () => void;
  summary?: string | null;
};

export default function TranslationPane({
  translatedText,
  emotion,
  isLoading,
  isPlayingTTS,
  onTTS,
  summary,
}: TranslationPaneProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">Translation</span>
          {emotion && <EmotionIcon emotion={emotion} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : translatedText ? (
          <>
            <Textarea
              value={translatedText}
              readOnly
              className="h-48 flex-1 text-base bg-muted/50"
              placeholder="Translation will appear here..."
              aria-label="Translated Text"
            />
            {summary && (
              <div>
                <Separator className="my-4" />
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Translated Summary
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {summary}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">
              Translation will appear here after processing.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onTTS}
          disabled={isLoading || isPlayingTTS || !translatedText}
          className="w-full"
        >
          {isPlayingTTS ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          {isPlayingTTS ? 'Playing...' : 'Read Aloud'}
        </Button>
      </CardFooter>
    </Card>
  );
}

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
import { SpellCheck, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '../ui/separator';

type TranscriptionPaneProps = {
  normalizedText: string;
  onNormalizedTextChange: (text: string) => void;
  onGrammarCheck: () => void;
  isLoading: boolean;
  summary?: string | null;
  hasContent: boolean;
};

export default function TranscriptionPane({
  normalizedText,
  onNormalizedTextChange,
  onGrammarCheck,
  isLoading,
  summary,
  hasContent,
}: TranscriptionPaneProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          Normalized & Corrected Tamil
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : hasContent ? (
          <>
            <div>
              <Textarea
                id="normalized-text"
                value={normalizedText}
                onChange={(e) => onNormalizedTextChange(e.target.value)}
                className="h-48 font-headline text-base"
                placeholder="Normalized Tamil will appear here..."
              />
            </div>
            {summary && (
              <div>
                <Separator className="my-4" />
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Tamil Summary
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md font-headline">
                  {summary}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">
              Normalized text will appear here.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onGrammarCheck}
          disabled={isLoading || !normalizedText}
          className="w-full"
        >
          <SpellCheck className="mr-2 h-4 w-4" />
          Correct Grammar
        </Button>
      </CardFooter>
    </Card>
  );
}

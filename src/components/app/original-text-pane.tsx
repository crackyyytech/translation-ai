'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

type OriginalTextPaneProps = {
  originalText: string;
  isLoading: boolean;
};

export default function OriginalTextPane({
  originalText,
  isLoading,
}: OriginalTextPaneProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          Original Transcription
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : originalText ? (
          <Textarea
            value={originalText}
            readOnly
            className="h-full flex-1 font-headline text-base bg-muted/50"
            aria-label="Original Tamil Transcription"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">
              Record or upload audio to begin.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

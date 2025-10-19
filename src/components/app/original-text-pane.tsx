'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type OriginalTextPaneProps = {
  originalText: string;
  isLoading: boolean;
  onCopy: () => void;
};

export default function OriginalTextPane({
  originalText,
  isLoading,
  onCopy,
}: OriginalTextPaneProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-headline">Original Transcription</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCopy}
                  disabled={!originalText || isLoading}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Text</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

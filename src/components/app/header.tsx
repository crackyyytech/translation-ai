'use client';

import type { ChangeEvent } from 'react';
import {
  Mic,
  Upload,
  Download,
  BookText,
  Bot,
  Square,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './language-selector';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from './theme-toggle';

type AppHeaderProps = {
  isRecording: boolean;
  isLoading: boolean;
  hasContent: boolean;
  onRecord: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (language: string) => void;
  onSummarize: () => void;
  onDownload: () => void;
  targetLanguage: string;
};

export default function AppHeader({
  isRecording,
  isLoading,
  hasContent,
  onRecord,
  onFileChange,
  onLanguageChange,
  onSummarize,
  onDownload,
  targetLanguage,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Bot className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">
          Tamil Transcribe AI
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onRecord}
                disabled={isLoading}
                className={
                  isRecording
                    ? 'animate-pulse bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : ''
                }
              >
                {isRecording ? (
                  <Square className="h-5 w-5 fill-current" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRecording ? 'Stop Recording' : 'Start Recording'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <label htmlFor="audio-upload">
                  <Upload className="h-5 w-5" />
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={onFileChange}
                    disabled={isLoading}
                  />
                </label>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload Audio File</p>
            </TooltipContent>
          </Tooltip>

          <LanguageSelector
            onLanguageChange={onLanguageChange}
            disabled={isLoading}
            value={targetLanguage}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onSummarize}
                disabled={isLoading || !hasContent}
              >
                <BookText className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Summarize Content</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
               <Button
                variant="outline"
                size="icon"
                onClick={onDownload}
                disabled={isLoading || !hasContent}
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Report</p>
            </TooltipContent>
          </Tooltip>

          <ThemeToggle />

           <Tooltip>
            <TooltipTrigger asChild>
               <Button
                variant="ghost"
                size="icon"
                disabled
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings (coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}

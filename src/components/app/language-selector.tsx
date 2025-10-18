'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const supportedLanguages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Japanese',
  'Chinese',
  'Arabic',
  'Russian',
];

type LanguageSelectorProps = {
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
  value: string;
};

export function LanguageSelector({
  onLanguageChange,
  disabled,
  value,
}: LanguageSelectorProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <Select
          onValueChange={onLanguageChange}
          disabled={disabled}
          defaultValue={value}
        >
          <TooltipTrigger asChild>
            <SelectTrigger className="w-[60px] md:w-[150px]">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 shrink-0" />
                <span className="hidden md:inline">
                  <SelectValue placeholder="Language" />
                </span>
              </div>
            </SelectTrigger>
          </TooltipTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TooltipContent>
          <p>Select Target Language</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

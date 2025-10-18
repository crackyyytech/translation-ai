'use client';

import { Smile, Frown, Angry, Meh } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type EmotionIconProps = {
  emotion: string | null;
};

export default function EmotionIcon({ emotion }: EmotionIconProps) {
  if (!emotion) return null;

  const emotionData = {
    happy: {
      icon: <Smile className="h-5 w-5 text-green-500" />,
      label: 'Happy',
    },
    sad: { icon: <Frown className="h-5 w-5 text-blue-500" />, label: 'Sad' },
    angry: {
      icon: <Angry className="h-5 w-5 text-red-500" />,
      label: 'Angry',
    },
    neutral: {
      icon: <Meh className="h-5 w-5 text-gray-500" />,
      label: 'Neutral',
    },
  };

  const currentEmotion = emotion.toLowerCase();
  const { icon, label } =
    emotionData[currentEmotion as keyof typeof emotionData] ||
    emotionData.neutral;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{icon}</TooltipTrigger>
        <TooltipContent>
          <p>Detected Emotion: {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

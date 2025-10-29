
import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  audioUrl: string;
  transcript?: {
    json?: {
      words: {
        start: number;
        end: number;
        word: string;
      }[];
    }[];
  };
};

const AudioPlayer = ({ audioUrl, transcript }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cues, setCues] = useState<{ start: number; end: number; text: string }[]>([]);
  const [activeCue, setActiveCue] = useState<{ start: number; end: number; text: string } | null>(null);

  useEffect(() => {
    if (transcript?.json) {
      const newCues = transcript.json.map((segment) => {
        const text = segment.words.map((w) => w.word).join(' ');
        const start = segment.words[0].start;
        const end = segment.words[segment.words.length - 1].end;
        return { start, end, text };
      });
      setCues(newCues);
    }
  }, [transcript]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const activeCues = cues.filter(
        (cue) => cue.start <= audio.currentTime && cue.end >= audio.currentTime
      );
      setActiveCue(activeCues[0] || null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [cues]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={audioUrl} controls />
      {cues.length > 0 && (
        <div className="transcript mt-4">
          {cues.map((cue, index) => (
            <p
              key={index}
              className={`p-2 rounded-md ${cue === activeCue ? 'bg-primary/20' : ''}`}
            >
              {cue.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

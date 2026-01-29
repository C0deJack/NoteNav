import { type AudioPlayer, createAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ERROR_SOUND_FILE, NOTES } from '@/constants/PianoConfig';
import type { NoteName } from '@/types/piano';

type PlayerMap = Record<string, AudioPlayer>;

// Sound file mapping (static, defined once)
const SOUND_FILES: Record<string, number> = {
  'c1.wav': require('@/assets/sounds/c1.wav'),
  'c1s.wav': require('@/assets/sounds/c1s.wav'),
  'd1.wav': require('@/assets/sounds/d1.wav'),
  'd1s.wav': require('@/assets/sounds/d1s.wav'),
  'e1.wav': require('@/assets/sounds/e1.wav'),
  'f1.wav': require('@/assets/sounds/f1.wav'),
  'f1s.wav': require('@/assets/sounds/f1s.wav'),
  'g1.wav': require('@/assets/sounds/g1.wav'),
  'g1s.wav': require('@/assets/sounds/g1s.wav'),
  'a1.wav': require('@/assets/sounds/a1.wav'),
  'a1s.wav': require('@/assets/sounds/a1s.wav'),
  'b1.wav': require('@/assets/sounds/b1.wav'),
  'kick.wav': require('@/assets/sounds/kick.wav'),
};

export function usePianoAudio() {
  const playersRef = useRef<PlayerMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Create players for all notes
    for (const [noteName, noteData] of Object.entries(NOTES)) {
      const source = SOUND_FILES[noteData.soundFile];
      if (source) {
        playersRef.current[noteName] = createAudioPlayer(source);
      }
    }

    // Create error sound player
    const errorSource = SOUND_FILES[ERROR_SOUND_FILE];
    if (errorSource) {
      playersRef.current.error = createAudioPlayer(errorSource);
    }

    setLoaded(true);

    // Cleanup on unmount
    return () => {
      for (const player of Object.values(playersRef.current)) {
        player.remove();
      }
      playersRef.current = {};
    };
  }, []);

  const playNote = useCallback(
    (note: NoteName) => {
      if (!loaded) return;
      const player = playersRef.current[note];
      if (player) {
        player.seekTo(0);
        player.play();
      }
    },
    [loaded],
  );

  const playError = useCallback(() => {
    if (!loaded) return;
    const player = playersRef.current.error;
    if (player) {
      player.seekTo(0);
      player.play();
    }
  }, [loaded]);

  return { playNote, playError, loaded };
}

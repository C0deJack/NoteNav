import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';
import { ERROR_SOUND_FILE, NOTES } from '@/constants/PianoConfig';
import type { NoteName } from '@/types/piano';

type SoundMap = Record<string, Audio.Sound>;

export function usePianoAudio() {
  const soundsRef = useRef<SoundMap>({});
  const loadedRef = useRef(false);

  useEffect(() => {
    async function loadSounds() {
      if (loadedRef.current) return;

      try {
        // Set audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Sound file mapping
        const soundFiles: Record<string, any> = {
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

        // Load all note sounds
        for (const [noteName, noteData] of Object.entries(NOTES)) {
          const { sound } = await Audio.Sound.createAsync(
            soundFiles[noteData.soundFile],
          );
          soundsRef.current[noteName] = sound;
        }

        // Load error sound
        const { sound: errorSound } = await Audio.Sound.createAsync(
          soundFiles[ERROR_SOUND_FILE],
        );
        soundsRef.current.error = errorSound;

        loadedRef.current = true;
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    }

    loadSounds();

    return () => {
      // Cleanup sounds on unmount
      Object.values(soundsRef.current).forEach((sound) => {
        sound.unloadAsync();
      });
    };
  }, []);

  const playNote = useCallback(async (note: NoteName) => {
    const sound = soundsRef.current[note];
    if (sound) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing note:', error);
      }
    }
  }, []);

  const playError = useCallback(async () => {
    const sound = soundsRef.current.error;
    if (sound) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing error sound:', error);
      }
    }
  }, []);

  return { playNote, playError };
}

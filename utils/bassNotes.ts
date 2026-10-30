import type { AudioPlayer } from 'expo-audio';

import type { NoteName } from '@/types/piano';
import { getOctave } from '@/utils/notes';

// Temporary: bass notes reuse the octave-4 samples, slowed down to sound
// lower. Once dedicated samples (g2.wav ... b3.wav) are added, delete this
// file and its calls in hooks/usePianoAudio.ts.

// Slowed samples ring 2-4x longer than treble ones, so they're stopped once
// they've played for the sample's normal length
const FALLBACK_SAMPLE_SECONDS = 0.5;
const FADE_STEPS = 5;
const FADE_STEP_MS = 20;

/**
 * Speed to play a note's octave-4 sample at: 0.5 is one octave down, 0.25
 * two. Octave 5 stays at 1 until it has its own samples.
 */
export function getPlaybackRate(note: NoteName): number {
  return Math.min(1, 2 ** (getOctave(note) - 4));
}

export function createBassNotePlayback() {
  const stopTimers: Partial<Record<NoteName, ReturnType<typeof setTimeout>>> =
    {};

  return {
    /** Slows the player for bass notes; call once after creating it */
    setUp(player: AudioPlayer, note: NoteName) {
      const rate = getPlaybackRate(note);
      if (rate !== 1) {
        // Let the pitch drop with the speed so the sample sounds lower
        player.shouldCorrectPitch = false;
        player.setPlaybackRate(rate);
      }
    },

    /** Call before replaying a note so an earlier cap doesn't cut it short */
    cancelStop(note: NoteName) {
      clearTimeout(stopTimers[note]);
    },

    /** Fades out and pauses a bass note after the sample's normal length */
    scheduleStop(player: AudioPlayer, note: NoteName) {
      if (getPlaybackRate(note) === 1) return;

      const capMs =
        (player.duration || FALLBACK_SAMPLE_SECONDS) * 1000 -
        FADE_STEPS * FADE_STEP_MS;
      const fadeOut = (stepsLeft: number) => {
        if (stepsLeft === 0) {
          player.pause();
          return;
        }
        player.volume = (stepsLeft - 1) / FADE_STEPS;
        stopTimers[note] = setTimeout(
          () => fadeOut(stepsLeft - 1),
          FADE_STEP_MS,
        );
      };
      stopTimers[note] = setTimeout(
        () => fadeOut(FADE_STEPS),
        Math.max(0, capMs),
      );
    },

    dispose() {
      for (const timer of Object.values(stopTimers)) {
        clearTimeout(timer);
      }
    },
  };
}

import React from 'react';
import styles from './SongsWindow.module.css';
import { useDraggable } from '../hooks/useDraggable';

interface Note {
  frequency: number;
  duration: number; // in milliseconds
}

interface Song {
  title: string;
  notes: Note[];
}

const SONGS: Song[] = [
  {
    title: "Twinkle, Twinkle Little Star",
    notes: [
      { frequency: 261.63, duration: 500 }, // C4
      { frequency: 261.63, duration: 500 }, // C4
      { frequency: 392.00, duration: 500 }, // G4
      { frequency: 392.00, duration: 500 }, // G4
      { frequency: 440.00, duration: 500 }, // A4
      { frequency: 440.00, duration: 500 }, // A4
      { frequency: 392.00, duration: 1000 }, // G4
      { frequency: 349.23, duration: 500 }, // F4
      { frequency: 349.23, duration: 500 }, // F4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 261.63, duration: 1000 }, // C4
    ]
  },
  {
    title: "Mary Had a Little Lamb",
    notes: [
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 261.63, duration: 500 }, // C4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 329.63, duration: 1000 }, // E4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 293.66, duration: 1000 }, // D4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 392.00, duration: 500 }, // G4
      { frequency: 392.00, duration: 1000 }, // G4
    ]
  },
  {
    title: "Ode to Joy",
    notes: [
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 349.23, duration: 500 }, // F4
      { frequency: 392.00, duration: 500 }, // G4
      { frequency: 392.00, duration: 500 }, // G4
      { frequency: 349.23, duration: 500 }, // F4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 261.63, duration: 500 }, // C4
      { frequency: 261.63, duration: 500 }, // C4
      { frequency: 293.66, duration: 500 }, // D4
      { frequency: 329.63, duration: 500 }, // E4
      { frequency: 329.63, duration: 750 }, // E
      { frequency: 293.66, duration: 250 }, // D4
      { frequency: 293.66, duration: 1000 }, // D4
    ]
  }
];

interface SongsWindowProps {
  position: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onPlayNote: (frequency: number) => void;
  onStopNote: () => void;
  zIndex: number;
  onActivate: () => void;
  onManualPianoPlay: number;
}

export default function SongsWindow({ 
  position,
  onPositionChange,
  onPlayNote,
  onStopNote,
  zIndex,
  onActivate,
  onManualPianoPlay
}: SongsWindowProps) {
  const { position: currentPosition, handleMouseDown } = useDraggable(position);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState<Song | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const playbackRef = React.useRef({
    isPlaying: false,
    isPaused: false,
    currentSong: null as Song | null,
    currentNoteIndex: 0
  });

  const stopPlayback = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onStopNote();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentNoteIndex(0);
    setCurrentSong(null);
    playbackRef.current = {
      isPlaying: false,
      isPaused: false,
      currentSong: null,
      currentNoteIndex: 0
    };
  }, [onStopNote]);

  const previousManualPlayRef = React.useRef(onManualPianoPlay);

  React.useEffect(() => {
    if (previousManualPlayRef.current !== onManualPianoPlay) {
      previousManualPlayRef.current = onManualPianoPlay;
      stopPlayback();
    }
  }, [onManualPianoPlay, stopPlayback]);

  // Report position changes to parent
  React.useEffect(() => {
    onPositionChange?.(currentPosition);
  }, [currentPosition, onPositionChange]);

  const playNotes = React.useCallback((song: Song, startIndex: number = 0) => {
    if (!playbackRef.current.isPlaying || playbackRef.current.isPaused || startIndex >= song.notes.length) {
      if (startIndex >= song.notes.length) {
        stopPlayback();
      }
      return;
    }

    const note = song.notes[startIndex];
    onPlayNote(note.frequency);
    setCurrentNoteIndex(startIndex);
    playbackRef.current.currentNoteIndex = startIndex;

    timeoutRef.current = setTimeout(() => {
      playNotes(song, startIndex + 1);
    }, note.duration);
  }, [onPlayNote]);

  const startPlayback = React.useCallback((song: Song, startFromBeginning: boolean = true) => {
    const startIndex = startFromBeginning ? 0 : currentNoteIndex;
    setCurrentSong(song);
    setIsPlaying(true);
    setIsPaused(false);
    if (startFromBeginning) {
      setCurrentNoteIndex(0);
    }
    
    playbackRef.current = {
      isPlaying: true,
      isPaused: false,
      currentSong: song,
      currentNoteIndex: startIndex
    };

    playNotes(song, startIndex);
  }, [currentNoteIndex, playNotes]);

  const playSong = (song: Song) => {
    // If clicking the same song while playing, toggle pause
    if (currentSong?.title === song.title && isPlaying) {
      togglePause();
      return;
    }

    // Stop current playback if any
    stopPlayback();

    // Start new song
    startPlayback(song, true);
  };

  const togglePause = () => {
    if (!currentSong) return;

    if (isPaused) {
      // Resume playback from current note
      setIsPaused(false);
      playbackRef.current.isPaused = false;
      playNotes(currentSong, currentNoteIndex);
    } else {
      // Pause playback
      setIsPaused(true);
      playbackRef.current.isPaused = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const playNextSong = () => {
    if (!currentSong) return;
    const currentIndex = SONGS.findIndex(song => song.title === currentSong.title);
    const nextIndex = (currentIndex + 1) % SONGS.length;
    startPlayback(SONGS[nextIndex], true);
  };

  const playPreviousSong = () => {
    if (!currentSong) return;
    const currentIndex = SONGS.findIndex(song => song.title === currentSong.title);
    const previousIndex = (currentIndex - 1 + SONGS.length) % SONGS.length;
    startPlayback(SONGS[previousIndex], true);
  };

  return (
    <div 
      className={styles.window} 
      style={{ 
        left: currentPosition.x, 
        top: currentPosition.y,
        zIndex
      }}
      onMouseDown={(e) => {
        handleMouseDown(e);
        onActivate();
      }}
    >
      <div className={styles.titleBar}>
        <div className={styles.windowControls} data-draggable="false">
          <button className={styles.closeButton} />
          <button className={styles.minimizeButton} />
          <button className={styles.zoomButton} />
        </div>
        <div className={styles.titleText}>Songs</div>
      </div>
      <div className={styles.content} data-draggable="false">
        <div className={styles.songDisplay}>
          <div className={styles.songTitle}>
            {currentSong ? currentSong.title : 'Select a Song'}
          </div>
          <div className={styles.songStatus}>
            {isPlaying ? (isPaused ? 'Paused' : 'Now Playing...') : 'Ready to Play'}
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.songList}>
            {SONGS.map((song) => (
              <button
                key={song.title}
                className={`${styles.songButton} ${currentSong?.title === song.title ? styles.playing : ''}`}
                onClick={() => playSong(song)}
              >
                {song.title}
                {currentSong?.title === song.title && isPlaying && !isPaused && (
                  <span className={styles.playingIndicator}>▶</span>
                )}
              </button>
            ))}
          </div>
          <div className={styles.playbackControls}>
            <button 
              className={styles.controlButton}
              onClick={playPreviousSong}
              disabled={!currentSong}
            >
              ◀◀
            </button>
            <button 
              className={styles.controlButton}
              onClick={togglePause}
              disabled={!currentSong || !isPlaying}
            >
              {isPaused ? '▶' : '❚❚'}
            </button>
            <button 
              className={styles.controlButton}
              onClick={playNextSong}
              disabled={!currentSong}
            >
              ▶▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
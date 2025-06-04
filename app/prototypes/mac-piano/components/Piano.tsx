import React from 'react';
import styles from './Piano.module.css';

interface PianoProps {
  onPlayNote: (frequency: number) => void;
  onStopNote: () => void;
  onManualPlay?: () => void;
}

// First octave (C4 to B4)
const FIRST_OCTAVE = [
  { note: 'C4', frequency: 261.63, type: 'white' },
  { note: 'C#4', frequency: 277.18, type: 'black' },
  { note: 'D4', frequency: 293.66, type: 'white' },
  { note: 'D#4', frequency: 311.13, type: 'black' },
  { note: 'E4', frequency: 329.63, type: 'white' },
  { note: 'F4', frequency: 349.23, type: 'white' },
  { note: 'F#4', frequency: 369.99, type: 'black' },
  { note: 'G4', frequency: 392.00, type: 'white' },
  { note: 'G#4', frequency: 415.30, type: 'black' },
  { note: 'A4', frequency: 440.00, type: 'white' },
  { note: 'A#4', frequency: 466.16, type: 'black' },
  { note: 'B4', frequency: 493.88, type: 'white' },
];

// Second octave (C5 to B5) - multiply first octave frequencies by 2
const SECOND_OCTAVE = FIRST_OCTAVE.map(note => ({
  note: note.note.replace('4', '5'),
  frequency: note.frequency * 2,
  type: note.type,
}));

// Combine both octaves
const NOTES = [...FIRST_OCTAVE, ...SECOND_OCTAVE];

export default function Piano({ onPlayNote, onStopNote, onManualPlay }: PianoProps) {
  const handleNotePlay = (frequency: number) => {
    onPlayNote(frequency);
    if (onManualPlay) {
      onManualPlay();
    }
  };

  return (
    <div className={styles.piano}>
      <div className={styles.keys}>
        {NOTES.map((note, index) => (
          <button
            key={`${note.note}-${index}`}
            className={`${styles.key} ${styles[note.type]}`}
            onMouseDown={() => handleNotePlay(note.frequency)}
            onMouseUp={onStopNote}
            onMouseLeave={onStopNote}
            data-note={note.note}
          />
        ))}
      </div>
      <div className={styles.labels}>
        {NOTES.filter(note => note.type === 'white').map((note, index) => (
          <span key={`label-${note.note}-${index}`} className={styles.label}>
            {note.note}
          </span>
        ))}
      </div>
    </div>
  );
} 
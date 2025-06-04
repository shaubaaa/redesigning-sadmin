import React from 'react';
import Piano from './components/Piano';
import SongsWindow from './components/SongsWindow';
import OscillatorWindow from './components/OscillatorWindow';
import styles from './App.module.css';

export default function App() {
  const [activeWindow, setActiveWindow] = React.useState<string | null>(null);
  const [windowPositions, setWindowPositions] = React.useState({
    songs: { x: 400, y: 20 },
    oscillator: { x: 20, y: 20 },
  });
  const [manualPianoTrigger, setManualPianoTrigger] = React.useState(0);
  const [oscillatorType, setOscillatorType] = React.useState<OscillatorType>('sine');
  const [currentFrequency, setCurrentFrequency] = React.useState<number | null>(null);

  const audioContext = React.useRef<AudioContext | null>(null);
  const oscillatorRef = React.useRef<OscillatorNode | null>(null);
  const gainNodeRef = React.useRef<GainNode | null>(null);

  const playNote = (frequency: number) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    oscillatorRef.current = audioContext.current.createOscillator();
    gainNodeRef.current = audioContext.current.createGain();

    oscillatorRef.current.type = oscillatorType;
    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContext.current.destination);

    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    gainNodeRef.current.gain.setValueAtTime(0.5, audioContext.current.currentTime);

    oscillatorRef.current.start();
    setCurrentFrequency(frequency);
  };

  const stopNote = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
      setCurrentFrequency(null);
    }
  };

  const handleOscillatorTypeChange = (type: OscillatorType) => {
    setOscillatorType(type);
    // If a note is currently playing, replay it with the new oscillator type
    if (currentFrequency !== null) {
      playNote(currentFrequency);
    }
  };

  const handleSongsWindowPositionChange = (position: { x: number; y: number }) => {
    setWindowPositions(prev => ({
      ...prev,
      songs: position,
    }));
  };

  const handleOscillatorWindowPositionChange = (position: { x: number; y: number }) => {
    setWindowPositions(prev => ({
      ...prev,
      oscillator: position,
    }));
  };

  const handleWindowActivate = (windowName: string) => {
    setActiveWindow(windowName);
  };

  const getWindowZIndex = (windowName: string) => {
    return activeWindow === windowName ? 2 : 1;
  };

  const handleManualPianoPlay = () => {
    setManualPianoTrigger(prev => prev + 1);
  };

  return (
    <div className={styles.app}>
      <Piano 
        onPlayNote={playNote}
        onStopNote={stopNote}
        onManualPlay={handleManualPianoPlay}
      />
      <SongsWindow
        position={windowPositions.songs}
        onPositionChange={handleSongsWindowPositionChange}
        onPlayNote={playNote}
        onStopNote={stopNote}
        zIndex={getWindowZIndex('songs')}
        onActivate={() => handleWindowActivate('songs')}
        onManualPianoPlay={manualPianoTrigger}
      />
      <OscillatorWindow
        waveform={oscillatorType}
        onWaveformChange={handleOscillatorTypeChange}
        position={windowPositions.oscillator}
        onPositionChange={handleOscillatorWindowPositionChange}
        zIndex={getWindowZIndex('oscillator')}
        onActivate={() => handleWindowActivate('oscillator')}
      />
    </div>
  );
} 
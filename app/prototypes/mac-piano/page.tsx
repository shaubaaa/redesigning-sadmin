"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';
import Piano from './components/Piano';
import OscillatorWindow from './components/OscillatorWindow';
import Visualizer from './components/Visualizer';
import SongsWindow from './components/SongsWindow';
import { useDraggable } from './hooks/useDraggable';

interface WindowPosition {
  x: number;
  y: number;
}

export default function MacPiano() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState(0.7);
  const [showOscillator, setShowOscillator] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [showSongs, setShowSongs] = useState(true);
  const [activeWindow, setActiveWindow] = useState<'piano' | 'oscillator' | 'visualizer' | 'songs'>('piano');
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [manualPianoTrigger, setManualPianoTrigger] = useState(0);

  // Calculate initial positions
  const mainWindowWidth = 800;
  const initialPositions = {
    piano: { x: 20, y: 20 },
    oscillator: { x: mainWindowWidth + 40, y: 20 },
    visualizer: { x: mainWindowWidth + 40, y: 280 },
    songs: { x: mainWindowWidth + 40, y: 540 }
  };

  // Store last known positions for windows
  const [lastOscillatorPosition, setLastOscillatorPosition] = useState<WindowPosition>(initialPositions.oscillator);
  const [lastVisualizerPosition, setLastVisualizerPosition] = useState<WindowPosition>(initialPositions.visualizer);
  const [lastSongsPosition, setLastSongsPosition] = useState<WindowPosition>(initialPositions.songs);

  const { position: pianoPosition, handleMouseDown: handlePianoMouseDown } = useDraggable(initialPositions.piano);

  useEffect(() => {
    // Initialize Web Audio API context
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyzer = ctx.createAnalyser();
    analyzer.fftSize = 2048;
    analyzerRef.current = analyzer;
    analyzer.connect(ctx.destination);
    setAudioContext(ctx);

    // Set initial window positions to prevent overlapping
    const pianoRight = initialPositions.piano.x + mainWindowWidth;
    
    setLastOscillatorPosition({
      x: Math.max(pianoRight + 20, initialPositions.oscillator.x),
      y: initialPositions.oscillator.y
    });

    setLastVisualizerPosition({
      x: Math.max(pianoRight + 20, initialPositions.visualizer.x),
      y: Math.max(initialPositions.oscillator.y + 260, initialPositions.visualizer.y)
    });

    setLastSongsPosition({
      x: Math.max(pianoRight + 20, initialPositions.songs.x),
      y: Math.max(initialPositions.visualizer.y + 260, initialPositions.songs.y)
    });

    return () => {
      ctx.close();
    };
  }, []);

  const playNote = (frequency: number) => {
    if (!audioContext || !analyzerRef.current) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

    // Connect through analyzer
    oscillator.connect(gainNode);
    gainNode.connect(analyzerRef.current);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  };

  const handleOscillatorPositionChange = (newPosition: WindowPosition) => {
    setLastOscillatorPosition(newPosition);
  };

  const handleVisualizerPositionChange = (newPosition: WindowPosition) => {
    setLastVisualizerPosition(newPosition);
  };

  const toggleOscillator = () => {
    setShowOscillator(!showOscillator);
  };

  const toggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };

  const toggleSongs = () => {
    setShowSongs(!showSongs);
  };

  const handleSongsPositionChange = (newPosition: WindowPosition) => {
    setLastSongsPosition(newPosition);
  };

  const handleWindowClick = (window: 'piano' | 'oscillator' | 'visualizer' | 'songs') => {
    setActiveWindow(window);
  };

  const handleManualPianoPlay = () => {
    setManualPianoTrigger(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.buttonContainer}>
          <Link href="/" className={styles.backButton}>←</Link>
        </div>
        <div 
          className={styles.window}
          style={{ 
            position: 'absolute',
            left: pianoPosition.x,
            top: pianoPosition.y,
            zIndex: activeWindow === 'piano' ? 4 : 1
          }}
          onMouseDown={(e) => {
            handlePianoMouseDown(e);
            handleWindowClick('piano');
          }}
        >
          <div className={styles.titleBar}>
            <div className={styles.windowControls} data-draggable="false">
              <button className={styles.closeButton} />
              <button className={styles.minimizeButton} />
              <button className={styles.zoomButton} />
            </div>
            <div className={styles.titleText}>Mac Piano</div>
          </div>
          <div className={styles.content} data-draggable="false">
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <label className={styles.label}>Volume:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.button}
                  onClick={toggleOscillator}
                >
                  {showOscillator ? 'Hide' : 'Show'} Oscillator
                </button>
                <button
                  className={styles.button}
                  onClick={toggleVisualizer}
                >
                  {showVisualizer ? 'Hide' : 'Show'} Visualizer
                </button>
                <button
                  className={styles.button}
                  onClick={toggleSongs}
                >
                  {showSongs ? 'Hide' : 'Show'} Songs
                </button>
              </div>
            </div>
            <Piano onPlayNote={playNote} onManualPlay={handleManualPianoPlay} />
            <div className={styles.footer}>
              <span className={styles.footerText}>© 2024 Mac Piano</span>
            </div>
          </div>
        </div>
        {showOscillator && (
          <OscillatorWindow
            waveform={waveform}
            onWaveformChange={setWaveform}
            position={lastOscillatorPosition}
            onPositionChange={handleOscillatorPositionChange}
            zIndex={activeWindow === 'oscillator' ? 4 : 1}
            onActivate={() => handleWindowClick('oscillator')}
          />
        )}
        {showVisualizer && (
          <Visualizer
            audioContext={audioContext}
            analyzer={analyzerRef.current}
            position={lastVisualizerPosition}
            onPositionChange={handleVisualizerPositionChange}
            zIndex={activeWindow === 'visualizer' ? 4 : 1}
            onActivate={() => handleWindowClick('visualizer')}
          />
        )}
        {showSongs && (
          <SongsWindow
            position={lastSongsPosition}
            onPositionChange={handleSongsPositionChange}
            onPlayNote={playNote}
            zIndex={activeWindow === 'songs' ? 4 : 1}
            onActivate={() => handleWindowClick('songs')}
            onManualPianoPlay={manualPianoTrigger}
          />
        )}
      </main>
    </div>
  );
} 
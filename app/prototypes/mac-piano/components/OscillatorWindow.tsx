import React from 'react';
import styles from './OscillatorWindow.module.css';
import { useDraggable } from '../hooks/useDraggable';

interface OscillatorWindowProps {
  waveform: OscillatorType;
  onWaveformChange: (waveform: OscillatorType) => void;
  position: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  zIndex: number;
  onActivate: () => void;
}

export default function OscillatorWindow({ 
  waveform, 
  onWaveformChange,
  position,
  onPositionChange,
  zIndex,
  onActivate
}: OscillatorWindowProps) {
  const { position: currentPosition, handleMouseDown } = useDraggable(position);

  // Report position changes to parent
  React.useEffect(() => {
    onPositionChange?.(currentPosition);
  }, [currentPosition, onPositionChange]);

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
        <div className={styles.titleText}>Oscillator</div>
      </div>
      <div className={styles.content} data-draggable="false">
        <div className={styles.waveformDisplay}>
          {/* Visual representation of the current waveform */}
          <svg className={styles.waveformSvg} viewBox="0 0 100 40">
            {waveform === 'sine' && (
              <path
                d="M 0,20 C 25,20 25,5 50,5 C 75,5 75,35 100,35"
                className={styles.waveformPath}
              />
            )}
            {waveform === 'square' && (
              <path
                d="M 0,35 L 25,35 L 25,5 L 75,5 L 75,35 L 100,35"
                className={styles.waveformPath}
              />
            )}
            {waveform === 'sawtooth' && (
              <path
                d="M 0,35 L 50,5 L 50,35 L 100,5"
                className={styles.waveformPath}
              />
            )}
            {waveform === 'triangle' && (
              <path
                d="M 0,35 L 25,5 L 75,35 L 100,5"
                className={styles.waveformPath}
              />
            )}
          </svg>
        </div>
        <div className={styles.controls}>
          <div className={styles.radioGroup}>
            {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
              <label key={type} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="waveform"
                  value={type}
                  checked={waveform === type}
                  onChange={(e) => onWaveformChange(e.target.value as OscillatorType)}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
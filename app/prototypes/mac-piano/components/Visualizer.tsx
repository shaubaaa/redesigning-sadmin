import React, { useRef, useEffect } from 'react';
import styles from './Visualizer.module.css';
import { useDraggable } from '../hooks/useDraggable';

interface VisualizerProps {
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  position: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  zIndex: number;
  onActivate: () => void;
}

export default function Visualizer({ 
  audioContext,
  analyzer,
  position,
  onPositionChange,
  zIndex,
  onActivate
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastWaveformRef = useRef<Uint8Array | null>(null);
  const { position: currentPosition, handleMouseDown } = useDraggable(position);

  // Report position changes to parent
  useEffect(() => {
    onPositionChange?.(currentPosition);
  }, [currentPosition, onPositionChange]);

  useEffect(() => {
    if (!canvasRef.current || !analyzer) return;

    // Adjust analyzer settings for better visualization
    analyzer.fftSize = 1024; // Smaller FFT size for more frequent updates
    analyzer.smoothingTimeConstant = 0.5; // Reduce smoothing for more responsive visualization

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    lastWaveformRef.current = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      analyzer.getByteTimeDomainData(dataArray);

      // Calculate the difference between current and last waveform
      let maxDiff = 0;
      if (lastWaveformRef.current) {
        for (let i = 0; i < bufferLength; i++) {
          const diff = Math.abs(dataArray[i] - lastWaveformRef.current[i]);
          maxDiff = Math.max(maxDiff, diff);
        }
      }

      // Create a fade effect that's more pronounced when the waveform changes significantly
      const fadeAlpha = Math.max(0.1, Math.min(0.3, 1 - (maxDiff / 128)));
      ctx.fillStyle = `rgba(0, 17, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Draw the main waveform
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00FF00';
      ctx.beginPath();

      // Draw the glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FF00';

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother visualization
          const xc = (x + (x - sliceWidth)) / 2;
          const yc = (y + (dataArray[i - 1] / 128.0 * height / 2)) / 2;
          ctx.quadraticCurveTo(xc, yc, x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw an echo effect for significant changes
      if (maxDiff > 20) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 255, 0, ${Math.min(1, maxDiff / 128)})`;
        ctx.lineWidth = 1;
        x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const xc = (x + (x - sliceWidth)) / 2;
            const yc = (y + (dataArray[i - 1] / 128.0 * height / 2)) / 2;
            ctx.quadraticCurveTo(xc, yc, x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();
      }

      // Store the current waveform for the next frame
      lastWaveformRef.current.set(dataArray);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyzer]);

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
        <div className={styles.titleText}>Waveform</div>
      </div>
      <div className={styles.content} data-draggable="false">
        <canvas 
          ref={canvasRef}
          className={styles.canvas}
          width={300}
          height={150}
        />
      </div>
    </div>
  );
} 
"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function TypographyExperiments() {
  const [text, setText] = useState('I love typography woah cool');
  const [words, setWords] = useState<{ text: string; style: string; color: string; size: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const WORDS_PER_LINE = 6; // Adjust this number to control line length

  // Available style types
  const styleTypes = {
    short: ['neonText', 'glitchText', 'wavyText', 'variable', 'rainbow3d', 'pulse', 'spiral', 'magneticText', 'shimmerText', 'distortText', 'liquidText'],
    long: ['circle', 'gradientText', 'rotate3dText', 'glitch3d', 'perspectiveText', 'floatingText']
  };

  // Color palette
  const colors = [
    'var(--neon-pink)',
    'var(--electric-blue)',
    'var(--toxic-green)',
    'var(--plasma-purple)',
    'var(--hot-red)',
    'var(--cyber-yellow)',
    'var(--laser-orange)',
    'var(--digital-lime)'
  ];

  // Get random style based on word length
  const getRandomStyle = (word: string) => {
    // Force circular style for longer words
    if (word.length > 6) {
      return 'circle';
    }
    const availableStyles = word.length > 6 ? styleTypes.long : styleTypes.short;
    return availableStyles[Math.floor(Math.random() * availableStyles.length)];
  };

  // Get random color combination
  const getRandomColors = () => {
    const mainColor = colors[Math.floor(Math.random() * colors.length)];
    const accentColor = colors[Math.floor(Math.random() * colors.length)];
    return { main: mainColor, accent: accentColor };
  };

  // Get random font size
  const getRandomSize = (style: string) => {
    if (style === 'circle') {
      return 2 + Math.random() * 0.5; // Increased base size for circular text
    }
    // Smaller size range for cursive fonts
    if (style === 'wavyText' || style === 'wavyGradient') {
      return 3 + Math.random() * 1.5;
    }
    // Default size range for other styles
    return 2.5 + Math.random() * 2;
  };

  useEffect(() => {
    // Split text into words and assign random styles
    const processedWords = text
      .split('\n')
      .flatMap(line => line.split(' '))
      .filter(word => word.trim().length > 0)
      .map(word => {
        const style = getRandomStyle(word);
        const { main: color } = getRandomColors();
        const size = getRandomSize(style);
        return {
          text: word.trim(),
          style,
          color,
          size
        };
      });
    setWords(processedWords);

    // Adjust container position based on content height
    if (containerRef.current) {
      const container = containerRef.current;
      const contentHeight = container.scrollHeight;
      const viewportHeight = window.innerHeight;
      const offset = Math.max(0, (contentHeight - viewportHeight + 150) / 2);
      container.style.transform = `translateY(-${offset}px)`;
    }
  }, [text]);

  // Group words into rows based on line breaks
  const wordRows = text.split('\n').map(line => 
    line.split(' ')
      .filter(word => word.trim().length > 0)
      .map((_, index) => words[words.findIndex((w, i) => 
        text.split('\n').flatMap(l => l.split(' ')).indexOf(w.text) === index
      )])
      .filter(Boolean)
  ).filter(row => row.length > 0);

  // Render circle text
  const renderCircleText = (text: string, color: string, size: number) => {
    const letters = text.split('').map((char, i) => {
      const rotation = (i * 360) / text.length;
      const radius = 25 + text.length * 1.2; // Increased radius for more letter spacing
      return (
        <span
          key={i}
          style={{ 
            transform: `rotate(${rotation}deg) translateY(-${radius}px)`,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformOrigin: `0 ${radius}px`,
            color,
            fontSize: `${size}rem`,
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            letterSpacing: '0.1em'
          }}
        >
          {char}
        </span>
      );
    });
    return (
      <div className={styles.circleText} style={{ width: `${text.length * 10}px`, height: `${text.length * 10}px` }}>
        {letters}
      </div>
    );
  };

  const getStyleProps = (word: { text: string, style: string, color: string, size: number }) => {
    const { color, size } = word;
    const baseStyle = { 
      fontSize: `${size}rem`,
      color,
      // Add extra vertical space for cursive fonts
      ...(word.style.includes('wavy') && {
        padding: '1rem 0.5rem',
        lineHeight: '1.6'
      })
    };
    
    switch (word.style) {
      case 'neonText':
        return {
          ...baseStyle,
          textShadow: `0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px ${color},
            0 0 42px ${color}`
        };
      case 'splitColor':
        const { main: strokeColor } = getRandomColors();
        return {
          ...baseStyle,
          WebkitTextStroke: `2px ${strokeColor}`
        };
      case 'glitchText':
        const { main: glitchColor1, accent: glitchColor2 } = getRandomColors();
        return {
          ...baseStyle,
          textShadow: `0.05em 0 0 ${glitchColor1}, -0.05em -0.025em 0 ${glitchColor2}`
        };
      default:
        return baseStyle;
    }
  };

  const renderWord = (word: { text: string, style: string, color: string, size: number }, index: number) => {
    const styleProps = getStyleProps(word);

    switch (word.style) {
      case 'circle':
        return renderCircleText(word.text, word.color, word.size);
      case 'wavyText':
        return (
          <div className={styles.wavyContainer}>
            {word.text.split('').map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={styles.wavyText}
                style={{
                  ...styleProps,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {char}
              </span>
            ))}
          </div>
        );
      case 'wavyGradient':
        return <div className={styles.wavyGradient} style={styleProps}>{word.text}</div>;
      case 'gradientText':
        return <div className={styles.gradientText} style={styleProps}>{word.text}</div>;
      case 'glitch3d':
        return <div className={styles.glitch3d} style={styleProps}>{word.text}</div>;
      case 'variable':
        return <div className={styles.variable} style={styleProps}>{word.text}</div>;
      case 'rainbow3d':
        return <div className={styles.rainbow3d} style={styleProps}>{word.text}</div>;
      case 'neonText':
        return <div className={styles.neonText} style={styleProps}>{word.text}</div>;
      case 'splitColor':
        return <div className={styles.splitColor} style={styleProps}>{word.text}</div>;
      case 'glitchText':
        return <div className={styles.glitchText} style={styleProps}>{word.text}</div>;
      case 'bounce':
        return (
          <div>
            {word.text.split('').map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={styles.bounceText}
                style={{
                  ...styleProps,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {char}
              </span>
            ))}
          </div>
        );
      case 'floating':
        return <div className={styles.floatingText} style={styleProps}>{word.text}</div>;
      case 'perspectiveText':
        return <div className={styles.perspectiveText} style={styleProps}>{word.text}</div>;
      case 'pulse':
        return <div className={styles.pulseText} style={styleProps}>{word.text}</div>;
      case 'rotate3d':
        return <div className={styles.rotate3dText} style={styleProps}>{word.text}</div>;
      case 'spiral':
        return <div className={styles.spiralText} style={styleProps}>{word.text}</div>;
      case 'shimmerText':
        return <div className={styles.shimmerText} style={styleProps}>{word.text}</div>;
      case 'distortText':
        return <div className={styles.distortText} style={styleProps}>{word.text}</div>;
      case 'liquidText':
        return <div className={styles.liquidText} style={styleProps}>{word.text}</div>;
      case 'magneticText':
        return <div className={styles.magneticText} style={styleProps}>{word.text}</div>;
      default:
        return <div style={styleProps}>{word.text}</div>;
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.typographyContainer} ref={containerRef}>
        {wordRows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.wordRow}>
            {row.map((word, wordIndex) => (
              <div key={`${word.text}-${rowIndex}-${wordIndex}`} className={styles.wordContainer}>
                {renderWord(word, wordIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.input}
        placeholder="Enter your text..."
      />
    </main>
  );
} 
"use client";
//
import Link from "next/link";
import styles from './styles/home.module.css';
import { instrumentSerif, ibmPlexSans } from './fonts';

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Death Admin Exhibition Poster',
      description: 'Interactive exhibition poster layouts exploring the administrative burden during bereavement',
      path: '/prototypes/death-admin-poster',
    },
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Confetti button',
      description: 'An interactive button that creates a colorful confetti explosion',
      path: '/prototypes/confetti-button'
    },
    {
      title: 'Mac Piano',
      description: 'A retro-styled digital piano interface inspired by classic Mac OS',
      path: '/prototypes/mac-piano'
    },
    {
      title: 'Typography Experiments',
      description: 'Interactive typography effects using pure CSS, including circular text, 3D transforms, and wave animations',
      path: '/prototypes/typography-experiments'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${ibmPlexSans.className}`}>
      <header className={styles.header}>
        <h1 className={instrumentSerif.className}>Shauna's prototypes</h1>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
            >
              <h3 className={instrumentSerif.className}>{prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

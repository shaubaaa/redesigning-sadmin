"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';
import { useState } from 'react';

export default function DeathAdminPoster() {
  const [selectedLayout, setSelectedLayout] = useState(1);

  return (
    <div className={styles.container}>
      <div className={styles.poster}>
        {/* Left Column - White Section */}
        <div className={styles.whiteSection}>
          <div className={styles.projectHeader}>
            <p className={styles.year}>2025</p>
            <h1 className={styles.title}>Redesigning<br />Sadmin</h1>
          </div>
          
          <div className={styles.projectContent}>
            <div className={styles.section}>
              <h2>Project Statement</h2>
              <p>This project responds to a profound truth: that the bureaucracy of death is a paradox...</p>
            </div>

            <div className={styles.section}>
              <h2>Who</h2>
              <p>The bereaved, public service providers...</p>
            </div>

            <div className={styles.section}>
              <h2>What</h2>
              <p>This research systematically explores...</p>
            </div>

            <div className={styles.section}>
              <h2>Why</h2>
              <p>Making these services more human...</p>
            </div>

            <div className={styles.section}>
              <h2>How</h2>
              <p>By centering grief in the conversation...</p>
            </div>

            <div className={styles.workLabel}>
              MAJOR PROJECT /<br />
              WORK IN<br />
              PROGRESS
            </div>
          </div>
        </div>

        {/* Right Section - Dark */}
        <div className={styles.darkSection}>
          <div className={styles.researchSection}>
            <h2 className={styles.researchTitle}>PRIMARY<br />RESEARCH</h2>
            <div className={styles.methodTags}>
              <span>Expert Interviews</span>
              <span>Survey</span>
              <span>Experience Mapping</span>
            </div>
            <div className={styles.affinityMap}>
              {/* Affinity map sticky notes with insights */}
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Improving these public services can reflect practical government support</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Allowing the bereaved to eir limited energy on emotive tasks</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>The current system adds unnecessary stress during grief</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Multiple notifications create emotional burden</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Time constraints affect ability to process loss</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Services lack empathy in their current form</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Repetitive processes compound grief</p>
              </div>
              <div className={styles.stickyNote}>
                <p className={styles.insightText}>Need for centralized notification system</p>
              </div>
            </div>
          </div>

          <div className={styles.journeySection}>
            <div className={styles.journeyItem}>
              <div className={styles.journeyContent}>
                <span className={styles.stepNumber}>01.</span>
                <div className={styles.itemSpace}>
                  {/* Space for flowers */}
                </div>
                <div className={styles.textContent}>
                  <h3>Initial Contact</h3>
                  <p>When you are mourning and in shock, the doctor who pronounces the death has to give you a death notification form. This form becomes your first interaction with the administrative process while still processing the immediate loss.</p>
                </div>
              </div>
            </div>

            <div className={styles.journeyItem}>
              <div className={styles.journeyContent}>
                <span className={styles.stepNumber}>02.</span>
                <div className={styles.itemSpace}>
                  {/* Space for rings and socks */}
                </div>
                <div className={styles.textContent}>
                  <h3>Registration Process</h3>
                  <p>You must register the death in person, often in a shared space where others are celebrating births and marriages. This juxtaposition of grief and joy can be particularly challenging for the bereaved.</p>
                </div>
              </div>
            </div>

            <div className={styles.journeyItem}>
              <div className={styles.journeyContent}>
                <span className={styles.stepNumber}>03.</span>
                <div className={styles.itemSpace}>
                  {/* Space for keys */}
                </div>
                <div className={styles.textContent}>
                  <h3>Multiple Notifications</h3>
                  <p>With proof of death, begins the exhausting process of notifying every service and department. The repetitive nature of these notifications adds to the emotional burden during an already difficult time.</p>
                </div>
              </div>
            </div>

            <div className={styles.journeyItem}>
              <div className={styles.journeyContent}>
                <span className={styles.stepNumber}>04.</span>
                <div className={styles.itemSpace}>
                  {/* Space for phone and papers */}
                </div>
                <div className={styles.textContent}>
                  <h3>Return to Reality</h3>
                  <p>Back to work with barely any time to grieve. Incomplete notifications may result in triggering letters or calls for your deceased loved one, reopening emotional wounds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
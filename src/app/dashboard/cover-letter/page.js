// src/app/dashboard/cover-letter/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './cover-letter.module.css';

export default function CoverLetterPage() {
  const [step, setStep] = useState('input'); // input, generated
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    tone: 'Professional'
  });

  const generateCoverLetter = async () => {
    if (!formData.jobTitle || !formData.company) {
      toast.error('Please fill in Job Title and Company');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCoverLetter(data.coverLetter);
        setStep('generated');
        toast.success('Cover letter generated!');
      } else {
        toast.error('Failed to generate cover letter');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard!');
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.company}_CoverLetter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded!');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Cover Letter Generator</h1>
        <p className={styles.subtitle}>Create personalized cover letters with AI</p>
      </header>

      <div className={styles.content}>
        {step === 'input' && (
          <div className={styles.inputCard}>
            <h2 className={styles.cardTitle}>Tell us about the job</h2>

            <div className={styles.formGroup}>
              <label>Job Title *</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g., Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Company Name *</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Job Description (Optional)</label>
              <textarea
                className={styles.textarea}
                rows={6}
                placeholder="Paste the job description here for a more tailored cover letter..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              />
              <div className={styles.hint}>
                💡 Including the job description helps create a more targeted letter
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Tone</label>
              <div className={styles.toneGrid}>
                {['Professional', 'Enthusiastic', 'Formal', 'Creative'].map((tone) => (
                  <button
                    key={tone}
                    className={`${styles.toneButton} ${formData.tone === tone ? styles.selected : ''}`}
                    onClick={() => setFormData({ ...formData, tone })}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={styles.primaryButton}
              onClick={generateCoverLetter}
              disabled={loading}
            >
              {loading ? '🤖 Generating...' : '✨ Generate Cover Letter with AI'}
            </button>
          </div>
        )}

        {step === 'generated' && (
          <div className={styles.generatedCard}>
            <div className={styles.successHeader}>
              <div className={styles.successIcon}>✅</div>
              <div>
                <h2 className={styles.successTitle}>Cover Letter Generated!</h2>
                <p className={styles.successSubtitle}>
                  For {formData.jobTitle} at {formData.company}
                </p>
              </div>
            </div>

            <div className={styles.letterContainer}>
              <div className={styles.letterContent}>
                {coverLetter.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={copyToClipboard}>
                📋 Copy to Clipboard
              </button>
              <button className={styles.actionButton} onClick={downloadAsText}>
                💾 Download as .txt
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => {
                  setStep('input');
                  setFormData({
                    jobTitle: '',
                    company: '',
                    jobDescription: '',
                    tone: 'Professional'
                  });
                }}
              >
                ✨ Generate Another
              </button>
            </div>

            <div className={styles.editSection}>
              <h3 className={styles.editTitle}>Edit Cover Letter</h3>
              <textarea
                className={styles.editArea}
                rows={15}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <div className={styles.hint}>
                💡 Feel free to customize the letter above
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
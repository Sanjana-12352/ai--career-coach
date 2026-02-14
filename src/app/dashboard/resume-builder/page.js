// src/app/dashboard/resume-builder/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './resume-builder.module.css';

export default function ResumeBuilderPage() {
  const [step, setStep] = useState('build'); // build, analyze
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [resumeData, setResumeData] = useState({
    title: '',
    targetRole: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    },
    summary: '',
    experience: [
      { company: '', role: '', duration: '', achievements: '' }
    ],
    education: [
      { school: '', degree: '', year: '' }
    ],
    skills: '',
  });

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', role: '', duration: '', achievements: '' }]
    });
  };

  const removeExperience = (index) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...resumeData.experience];
    newExperience[index][field] = value;
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { school: '', degree: '', year: '' }]
    });
  };

  const removeEducation = (index) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index)
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...resumeData.education];
    newEducation[index][field] = value;
    setResumeData({ ...resumeData, education: newEducation });
  };

  const analyzeResume = async () => {
    if (!resumeData.targetRole || !resumeData.personalInfo.fullName) {
      toast.error('Please fill in at least your name and target role');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setStep('analyze');
        toast.success('Resume analyzed!');
      } else {
        toast.error('Failed to analyze resume');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Resume Builder</h1>
        <p className={styles.subtitle}>Create ATS-optimized resumes with AI assistance</p>
      </header>

      <div className={styles.content}>
        {step === 'build' && (
          <div className={styles.builderCard}>
            <h2 className={styles.cardTitle}>Build Your Resume</h2>

            {/* Basic Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Resume Title *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Software Engineer Resume"
                    value={resumeData.title}
                    onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Target Role *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Senior Software Engineer"
                    value={resumeData.targetRole}
                    onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Sanjana"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="sanjana@gmail.com"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="+91 9502245756"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="New York, NY"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    className={styles.input}
                    placeholder="linkedin.com/in/johndoe"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Professional Summary</h3>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="Brief summary of your professional background and career goals..."
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              />
            </div>

            {/* Experience */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Work Experience</h3>
                <button className={styles.addButton} onClick={addExperience}>
                  + Add Experience
                </button>
              </div>

              {resumeData.experience.map((exp, index) => (
                <div key={index} className={styles.experienceCard}>
                  <div className={styles.cardHeader}>
                    <span>Experience {index + 1}</span>
                    {resumeData.experience.length > 1 && (
                      <button
                        className={styles.removeButton}
                        onClick={() => removeExperience(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Company</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Role</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Duration</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Jan 2020 - Present"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Key Achievements</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                      value={exp.achievements}
                      onChange={(e) => updateExperience(index, 'achievements', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Education</h3>
                <button className={styles.addButton} onClick={addEducation}>
                  + Add Education
                </button>
              </div>

              {resumeData.education.map((edu, index) => (
                <div key={index} className={styles.experienceCard}>
                  <div className={styles.cardHeader}>
                    <span>Education {index + 1}</span>
                    {resumeData.education.length > 1 && (
                      <button
                        className={styles.removeButton}
                        onClick={() => removeEducation(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>School</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="University Name"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Degree</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Bachelor of Science in Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Year</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="2018 - 2022"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Skills</h3>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="List your skills separated by commas: JavaScript, React, Node.js, Python, etc."
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
              />
            </div>

            <button
              className={styles.primaryButton}
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? '🤖 Analyzing...' : '✨ Analyze with AI'}
            </button>
          </div>
        )}

        {step === 'analyze' && analysis && (
          <div className={styles.analysisCard}>
            <h2 className={styles.cardTitle}>ATS Analysis Results</h2>

            <div className={styles.scoreSection}>
              <div className={styles.scoreCircle}>
                <div className={styles.score}>{analysis.atsScore}</div>
                <div className={styles.scoreLabel}>ATS Score</div>
              </div>
              <div className={styles.scoreText}>
                {analysis.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized.' :
                 analysis.atsScore >= 60 ? '👍 Good! Some improvements recommended.' :
                 '⚠️ Needs improvement for better ATS performance.'}
              </div>
            </div>

            <div className={styles.analysisSection}>
              <h3 className={styles.analysisTitle}>✅ Strengths</h3>
              <ul className={styles.analysisList}>
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className={styles.analysisSection}>
              <h3 className={styles.analysisTitle}>🎯 Improvements</h3>
              <ul className={styles.analysisList}>
                {analysis.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div className={styles.analysisSection}>
              <h3 className={styles.analysisTitle}>🔑 Recommended Keywords</h3>
              <div className={styles.keywordsList}>
                {analysis.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keyword}>{keyword}</span>
                ))}
              </div>
            </div>

            <div className={styles.analysisSection}>
              <h3 className={styles.analysisTitle}>📝 Summary</h3>
              <p className={styles.summaryText}>{analysis.summary}</p>
            </div>

            <div className={styles.buttonGroup}>
              <button
                className={styles.secondaryButton}
                onClick={() => setStep('build')}
              >
                ← Edit Resume
              </button>
              <button className={styles.primaryButton} onClick={() => {
                toast.success('Resume saved to your dashboard!');
                setTimeout(() => window.location.href = '/dashboard', 1500);
              }}>
                💾 Save Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
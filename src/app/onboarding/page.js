// src/app/onboarding/page.js
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './onboarding.module.css';

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales',
  'Education', 'Consulting', 'Manufacturing', 'Retail', 'Other'
];

const EXPERIENCE_LEVELS = [
  'Junior (0-2 years)',
  'Mid-Level (3-5 years)',
  'Senior (6-10 years)',
  'Lead (10+ years)'
];

const CAREER_GOALS = [
  'Get a new job',
  'Career transition',
  'Skill development',
  'Salary negotiation',
  'Leadership role',
  'Start a business'
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    industry: '',
    currentRole: '',
    experienceLevel: '',
    careerGoals: [],
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  // Check if user already completed onboarding
  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.user?.onboardingComplete) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.industry) {
      toast.error('Please select an industry');
      return;
    }
    if (step === 2 && (!formData.currentRole || !formData.experienceLevel)) {
      toast.error('Please fill in all fields');
      return;
    }
    if (step === 3 && formData.careerGoals.length === 0) {
      toast.error('Please select at least one career goal');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal) => {
    if (formData.careerGoals.includes(goal)) {
      setFormData({
        ...formData,
        careerGoals: formData.careerGoals.filter(g => g !== goal)
      });
    } else {
      setFormData({
        ...formData,
        careerGoals: [...formData.careerGoals, goal]
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile completed! 🎉');
        router.push('/dashboard');
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.logo}>SENSAI</h1>
          <p className={styles.welcome}>Welcome, {user?.firstName || 'there'}! 👋</p>
          <p className={styles.subtitle}>Let's personalize your experience</p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progress}>
          <div className={styles.progressSteps}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.progressCircle}>1</div>
              <span className={styles.progressLabel}>Industry</span>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.progressCircle}>2</div>
              <span className={styles.progressLabel}>Role</span>
            </div>
            <div className={styles.progressLine}></div>
            <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
              <div className={styles.progressCircle}>3</div>
              <span className={styles.progressLabel}>Goals</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={styles.form}>
          {/* Step 1: Industry */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>What industry are you in?</h2>
              <p className={styles.stepDescription}>
                This helps us provide relevant career insights and opportunities
              </p>
              
              <div className={styles.optionsGrid}>
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    className={`${styles.optionButton} ${
                      formData.industry === industry ? styles.selected : ''
                    }`}
                    onClick={() => setFormData({ ...formData, industry })}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Role & Experience */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Tell us about your role</h2>
              <p className={styles.stepDescription}>
                Help us understand your current position and experience
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Current Role</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Experience Level</label>
                <div className={styles.optionsGrid}>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      className={`${styles.optionButton} ${
                        formData.experienceLevel === level ? styles.selected : ''
                      }`}
                      onClick={() => setFormData({ ...formData, experienceLevel: level })}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Skills (Optional)</label>
                <div className={styles.skillInput}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Add a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button className={styles.addButton} onClick={addSkill}>
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className={styles.skillsList}>
                    {formData.skills.map((skill, index) => (
                      <div key={index} className={styles.skillTag}>
                        {skill}
                        <button
                          className={styles.removeSkill}
                          onClick={() => removeSkill(skill)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Career Goals */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>What are your career goals?</h2>
              <p className={styles.stepDescription}>
                Select all that apply - we'll personalize your experience accordingly
              </p>

              <div className={styles.optionsGrid}>
                {CAREER_GOALS.map((goal) => (
                  <button
                    key={goal}
                    className={`${styles.optionButton} ${
                      formData.careerGoals.includes(goal) ? styles.selected : ''
                    }`}
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                    {formData.careerGoals.includes(goal) && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className={styles.navigation}>
          {step > 1 && (
            <button className={styles.backButton} onClick={handleBack}>
              ← Back
            </button>
          )}
          <button 
            className={styles.nextButton} 
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Saving...' : step === 3 ? 'Complete ✨' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
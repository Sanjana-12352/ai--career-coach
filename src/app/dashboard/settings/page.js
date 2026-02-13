// src/app/dashboard/settings/page.js
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './settings.module.css';

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

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    industry: '',
    currentRole: '',
    experienceLevel: '',
    careerGoals: [],
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.user) {
        setFormData({
          industry: data.user.industry || '',
          currentRole: data.user.currentRole || '',
          experienceLevel: data.user.experienceLevel || '',
          careerGoals: data.user.careerGoals || [],
          skills: data.user.skills || []
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.industry || !formData.currentRole || !formData.experienceLevel) {
      toast.error('Please fill in Industry, Role, and Experience Level');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Settings</h1>
      </header>

      <div className={styles.content}>
        {/* Account Info */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Name</label>
              <p>{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Professional Information</h3>

          <div className={styles.formGroup}>
            <label>Industry *</label>
            <select
              className={styles.select}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              <option value="">Select Industry</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Current Role *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g., Software Engineer"
              value={formData.currentRole}
              onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Experience Level *</label>
            <select
              className={styles.select}
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              <option value="">Select Experience Level</option>
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Skills</h3>

          <div className={styles.formGroup}>
            <label>Add Skills</label>
            <div className={styles.skillInputGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g., Python, Leadership"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button className={styles.addButton} onClick={addSkill}>
                Add
              </button>
            </div>
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

        {/* Career Goals */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Career Goals</h3>
          <p className={styles.cardSubtitle}>Select all that apply</p>

          <div className={styles.goalsGrid}>
            {CAREER_GOALS.map((goal) => (
              <button
                key={goal}
                className={`${styles.goalButton} ${
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

        {/* Save Button */}
        <div className={styles.saveSection}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
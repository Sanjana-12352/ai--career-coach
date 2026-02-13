// src/app/dashboard/page.js
'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUserData(data.user);
        
        if (!data.user.onboardingComplete) {
          router.push('/onboarding');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/" className={styles.logoLink}>
              <h1 className={styles.logo}>SENSAI</h1>
            </Link>
            <p className={styles.welcome}>
              Welcome back, {user?.firstName || 'there'}! 👋
            </p>
          </div>
          <div className={styles.userMenu}>
            <Link href="/dashboard/settings" className={styles.settingsButton}>
              ⚙️ Settings
            </Link>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              🚪 Sign Out
            </button>
            <img 
              src={user?.imageUrl} 
              alt={user?.firstName}
              className={styles.avatar}
            />
          </div>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Career Sessions</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Interview Practices</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📄</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Resumes Created</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✉️</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Cover Letters</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <Link href="/dashboard/career-guidance" className={styles.actionCard}>
              <div className={styles.actionIcon}>🤖</div>
              <h3 className={styles.actionTitle}>AI Career Guidance</h3>
              <p className={styles.actionText}>
                Get personalized career advice from AI
              </p>
            </Link>

            <Link href="/dashboard/interview-prep" className={styles.actionCard}>
              <div className={styles.actionIcon}>💼</div>
              <h3 className={styles.actionTitle}>Interview Prep</h3>
              <p className={styles.actionText}>
                Practice with AI-generated questions
              </p>
            </Link>

            <Link href="/dashboard/resume-builder" className={styles.actionCard}>
              <div className={styles.actionIcon}>📄</div>
              <h3 className={styles.actionTitle}>Resume Builder</h3>
              <p className={styles.actionText}>
                Create ATS-optimized resumes
              </p>
            </Link>

            <Link href="/dashboard/cover-letter" className={styles.actionCard}>
              <div className={styles.actionIcon}>✉️</div>
              <h3 className={styles.actionTitle}>Cover Letter</h3>
              <p className={styles.actionText}>
                Generate professional cover letters
              </p>
            </Link>
            <Link href="/dashboard/industry-insights" className={styles.actionCard}>
      <div className={styles.actionIcon}>📊</div>
      <h3 className={styles.actionTitle}>Industry Insights</h3>
      <p className={styles.actionText}>
        Explore salary trends and market data
      </p>
    </Link>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Profile</h2>
          <div className={styles.profileCard}>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Industry:</span>
              <span className={styles.profileValue}>{userData?.industry || 'Not set'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Current Role:</span>
              <span className={styles.profileValue}>{userData?.currentRole || 'Not set'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Experience Level:</span>
              <span className={styles.profileValue}>{userData?.experienceLevel || 'Not set'}</span>
            </div>
            {userData?.careerGoals && userData.careerGoals.length > 0 && (
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Career Goals:</span>
                <div className={styles.goalsList}>
                  {userData.careerGoals.map((goal, index) => (
                    <span key={index} className={styles.goalTag}>{goal}</span>
                  ))}
                </div>
              </div>
            )}
            <Link href="/dashboard/settings" className={styles.editProfile}>
              Edit Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
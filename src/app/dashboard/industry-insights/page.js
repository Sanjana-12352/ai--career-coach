// src/app/dashboard/industry-insights/page.js
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './industry-insights.module.css';

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales',
  'Education', 'Consulting', 'Manufacturing', 'Retail', 'Other'
];

export default function IndustryInsightsPage() {
  const { user } = useUser();
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

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
        setSelectedIndustry(data.user.industry || 'Technology');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadInsights = async () => {
    if (!selectedIndustry) {
      toast.error('Please select an industry');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/industry-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: selectedIndustry }),
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
        toast.success('Insights loaded!');
      } else {
        toast.error('Failed to load insights');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIndustry) {
      loadInsights();
    }
  }, [selectedIndustry]);

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Industry Insights</h1>
        <p className={styles.subtitle}>Explore salary trends, top skills, and market opportunities</p>
      </header>

      <div className={styles.content}>
        {/* Industry Selector */}
        <div className={styles.selectorCard}>
          <label className={styles.selectorLabel}>Select Industry</label>
          <select
            className={styles.select}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="">Choose an industry...</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className={styles.loadingCard}>
            <div className={styles.spinner}></div>
            <p>Loading industry insights...</p>
          </div>
        )}

        {insights && !loading && (
          <>
            {/* Overview */}
            <div className={styles.overviewCard}>
              <h2 className={styles.cardTitle}>{insights.industry} Industry Overview</h2>
              <p className={styles.overviewText}>{insights.overview}</p>
              <div className={styles.growthBadge}>
                <span className={styles.growthLabel}>Growth Rate:</span>
                <span className={`${styles.growthValue} ${insights.growthRate >= 0 ? styles.positive : styles.negative}`}>
                  {insights.growthRate >= 0 ? '+' : ''}{insights.growthRate}%
                </span>
              </div>
            </div>

            {/* Salary Ranges */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💰 Average Salary Ranges</h3>
              <div className={styles.salaryGrid}>
                <div className={styles.salaryCard}>
                  <div className={styles.salaryLevel}>Junior (0-2 years)</div>
                  <div className={styles.salaryAmount}>{formatSalary(insights.averageSalary.junior)}</div>
                </div>
                <div className={styles.salaryCard}>
                  <div className={styles.salaryLevel}>Mid-Level (3-5 years)</div>
                  <div className={styles.salaryAmount}>{formatSalary(insights.averageSalary.mid)}</div>
                </div>
                <div className={styles.salaryCard}>
                  <div className={styles.salaryLevel}>Senior (6-10 years)</div>
                  <div className={styles.salaryAmount}>{formatSalary(insights.averageSalary.senior)}</div>
                </div>
                <div className={styles.salaryCard}>
                  <div className={styles.salaryLevel}>Lead (10+ years)</div>
                  <div className={styles.salaryAmount}>{formatSalary(insights.averageSalary.lead)}</div>
                </div>
              </div>
            </div>

            {/* Top Skills */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔥 Top In-Demand Skills</h3>
              <div className={styles.skillsList}>
                {insights.topSkills.map((skill, index) => (
                  <div key={index} className={styles.skillItem}>
                    <div className={styles.skillHeader}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillDemand}>{skill.demand}%</span>
                    </div>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillBarFill}
                        style={{ width: `${skill.demand}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Roles */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🚀 Emerging Roles</h3>
              <div className={styles.rolesGrid}>
                {insights.emergingRoles.map((role, index) => (
                  <div key={index} className={styles.roleCard}>
                    <div className={styles.roleTitle}>{role.title}</div>
                    <div className={styles.roleGrowth}>
                      <span className={styles.growthIcon}>📈</span>
                      {role.growth}% growth
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📊 Market Trends</h3>
              <ul className={styles.trendsList}>
                {insights.marketTrends.map((trend, index) => (
                  <li key={index}>{trend}</li>
                ))}
              </ul>
            </div>

            {/* Challenges & Opportunities */}
            <div className={styles.twoColumnGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>⚠️ Challenges</h3>
                <ul className={styles.challengesList}>
                  {insights.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>✨ Opportunities</h3>
                <ul className={styles.opportunitiesList}>
                  {insights.opportunities.map((opportunity, index) => (
                    <li key={index}>{opportunity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// src/app/dashboard/interview-prep/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './interview-prep.module.css';

export default function InterviewPrepPage() {
  const [step, setStep] = useState('setup'); // setup, practice, feedback
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    count: 5,
    difficulty: 'Medium',
    category: 'Mixed'
  });

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setQuestions(data.questions);
        setStep('practice');
        setCurrentQuestionIndex(0);
        toast.success('Questions generated!');
      } else {
        toast.error('Failed to generate questions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please write an answer first');
      return;
    }

    setLoading(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      const response = await fetch('/api/ai/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answer,
          category: currentQuestion.category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback(data.feedback);
        setStep('feedback');
        toast.success('Feedback received!');
      } else {
        toast.error('Failed to get feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get feedback');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setFeedback(null);
      setStep('practice');
    } else {
      setStep('complete');
    }
  };

  const startOver = () => {
    setStep('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>AI Interview Prep</h1>
        <p className={styles.subtitle}>Practice with AI-generated questions and get instant feedback</p>
      </header>

      <div className={styles.content}>
        {/* Setup */}
        {step === 'setup' && (
          <div className={styles.setupCard}>
            <h2 className={styles.cardTitle}>Configure Your Practice Session</h2>

            <div className={styles.formGroup}>
              <label>Number of Questions</label>
              <select
                className={styles.select}
                value={settings.count}
                onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) })}
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Difficulty Level</label>
              <div className={styles.buttonGroup}>
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    className={`${styles.optionButton} ${settings.difficulty === level ? styles.selected : ''}`}
                    onClick={() => setSettings({ ...settings, difficulty: level })}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Question Category</label>
              <div className={styles.buttonGroup}>
                {['Mixed', 'Behavioral', 'Technical', 'Situational'].map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.optionButton} ${settings.category === cat ? styles.selected : ''}`}
                    onClick={() => setSettings({ ...settings, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={styles.primaryButton}
              onClick={generateQuestions}
              disabled={loading}
            >
              {loading ? '🤖 Generating...' : '✨ Generate Questions with AI'}
            </button>
          </div>
        )}

        {/* Practice */}
        {step === 'practice' && questions.length > 0 && (
          <div className={styles.practiceCard}>
            <div className={styles.progress}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <div className={styles.questionCard}>
              <div className={styles.questionMeta}>
                <span className={styles.badge}>{questions[currentQuestionIndex].category}</span>
                <span className={styles.badge}>{questions[currentQuestionIndex].difficulty}</span>
              </div>
              <h2 className={styles.question}>{questions[currentQuestionIndex].question}</h2>
              <div className={styles.tip}>
                💡 <strong>Tip:</strong> {questions[currentQuestionIndex].tip}
              </div>
            </div>

            <div className={styles.answerSection}>
              <label className={styles.label}>Your Answer</label>
              <textarea
                className={styles.textarea}
                rows={8}
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <button
              className={styles.primaryButton}
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
            >
              {loading ? '⏳ Analyzing...' : '✨ Get AI Feedback'}
            </button>
          </div>
        )}

        {/* Feedback */}
        {step === 'feedback' && feedback && (
          <div className={styles.feedbackCard}>
            <div className={styles.scoreCircle}>
              <div className={styles.score}>{feedback.score}</div>
              <div className={styles.scoreLabel}>Score</div>
            </div>

            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackTitle}>✅ Strengths</h3>
              <ul className={styles.feedbackList}>
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackTitle}>🎯 Areas for Improvement</h3>
              <ul className={styles.feedbackList}>
                {feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackTitle}>📝 Detailed Feedback</h3>
              <p className={styles.feedbackText}>{feedback.detailedFeedback}</p>
            </div>

            <button className={styles.primaryButton} onClick={nextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Session ✓'}
            </button>
          </div>
        )}

        {/* Complete */}
        {step === 'complete' && (
          <div className={styles.completeCard}>
            <div className={styles.completeIcon}>🎉</div>
            <h2 className={styles.completeTitle}>Session Complete!</h2>
            <p className={styles.completeText}>
              Great job! You've completed all {questions.length} questions.
            </p>
            <button className={styles.primaryButton} onClick={startOver}>
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
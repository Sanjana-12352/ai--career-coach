// src/app/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is SENSAI?",
      answer: "SENSAI is an AI-powered career coach that provides personalized career guidance, interview preparation, resume building, and industry insights to help you land your dream job."
    },
    {
      question: "How does the AI career guidance work?",
      answer: "Our AI analyzes your profile, industry, and career goals to provide tailored advice. You can chat with the AI about any career-related questions and get instant, personalized responses."
    },
    {
      question: "Is SENSAI free to use?",
      answer: "Yes! SENSAI offers a free tier with access to core features including AI career guidance, interview practice, and resume building. Premium features may be added in the future."
    },
    {
      question: "What industries does SENSAI support?",
      answer: "SENSAI supports 50+ industries including Technology, Finance, Healthcare, Marketing, Sales, Education, and more. Our AI is trained on diverse industry data to provide relevant insights."
    },
    {
      question: "Can SENSAI help me prepare for interviews?",
      answer: "Absolutely! SENSAI generates custom interview questions based on your industry and role, provides AI-powered feedback on your answers, and gives you a score with detailed improvement suggestions."
    },
    {
      question: "How accurate is the resume ATS scoring?",
      answer: "Our ATS scoring system analyzes your resume against industry standards and common Applicant Tracking Systems. It provides actionable feedback to improve your resume's chances of passing initial screenings."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      image: "👩‍💻",
      text: "SENSAI helped me land my dream job at Google! The AI interview prep was incredibly accurate, and the resume feedback boosted my ATS score from 65 to 92."
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "Meta",
      image: "👨‍💼",
      text: "The career guidance feature is like having a personal mentor 24/7. It helped me transition from engineering to product management seamlessly."
    },
    {
      name: "Emily Johnson",
      role: "Marketing Director",
      company: "Amazon",
      image: "👩‍🎨",
      text: "I was stuck in my career for years. SENSAI's personalized advice and industry insights gave me the confidence to apply for senior roles. Now I'm a Marketing Director at Amazon!"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <h1 className={styles.logo}>SENSAI</h1>
          <div className={styles.navLinks}>
            <Link href="#features" className={styles.navLink}>Features</Link>
            <Link href="#testimonials" className={styles.navLink}>Testimonials</Link>
            <Link href="#faq" className={styles.navLink}>FAQ</Link>
            <Link href="/sign-in" className={styles.navLink}>Sign In</Link>
            <Link href="/sign-up" className={styles.navButton}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Your AI-Powered <span className={styles.gradient}>Career Coach</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Get personalized career guidance, ace your interviews, and land your dream job with cutting-edge AI technology.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/sign-up" className={styles.primaryButton}>
              Start Your Journey Free
            </Link>
            <Link href="#features" className={styles.secondaryButton}>
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Powerful AI Features</h2>
          <p className={styles.sectionSubtitle}>Everything you need to accelerate your career growth</p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>AI Career Guidance</h3>
              <p className={styles.featureText}>
                Get personalized career advice powered by advanced AI. Ask anything about your career path and receive tailored insights.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💼</div>
              <h3 className={styles.featureTitle}>Interview Preparation</h3>
              <p className={styles.featureText}>
                Practice with AI-generated questions specific to your industry and role. Get instant feedback with detailed scores.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3 className={styles.featureTitle}>Smart Resume Builder</h3>
              <p className={styles.featureText}>
                Create ATS-optimized resumes with AI assistance. Get real-time scores and suggestions to beat applicant tracking systems.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✉️</div>
              <h3 className={styles.featureTitle}>Cover Letter Generator</h3>
              <p className={styles.featureText}>
                Generate professional, personalized cover letters in seconds. Multiple tones available to match your style.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Industry Insights</h3>
              <p className={styles.featureText}>
                Access salary trends, top skills, market growth data, and emerging opportunities in your industry.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Personalized Roadmap</h3>
              <p className={styles.featureText}>
                Get a customized career development plan based on your goals, experience level, and target roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContent}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Career Sessions Completed</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>Interview Success Rate</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Industries Supported</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>AI-Powered Support</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Success Stories</h2>
          <p className={styles.sectionSubtitle}>See how SENSAI helped professionals like you land their dream jobs</p>
          
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialQuote}>"</div>
                <p className={styles.testimonialText}>{testimonial.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{testimonial.image}</div>
                  <div className={styles.testimonialInfo}>
                    <div className={styles.testimonialName}>{testimonial.name}</div>
                    <div className={styles.testimonialRole}>{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>How SENSAI Works</h2>
          <p className={styles.sectionSubtitle}>Get started in 3 simple steps</p>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Create Your Profile</h3>
              <p className={styles.stepText}>
                Tell us about your industry, current role, experience level, and career goals in our quick onboarding process.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Get AI-Powered Insights</h3>
              <p className={styles.stepText}>
                Receive personalized career guidance, practice interviews with AI feedback, and build optimized resumes.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Land Your Dream Job</h3>
              <p className={styles.stepText}>
                Apply with confidence using ATS-optimized resumes, professional cover letters, and interview-ready skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles.faq}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Everything you need to know about SENSAI</p>
          
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${openFaq === index ? styles.faqIconOpen : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Career?</h2>
          <p className={styles.ctaText}>
            Join thousands of professionals who are accelerating their careers with AI-powered guidance
          </p>
          <Link href="/sign-up" className={styles.ctaButton}>
            Start Free Today - No Credit Card Required
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3 className={styles.footerLogo}>SENSAI</h3>
            <p className={styles.footerTagline}>Your AI-Powered Career Coach</p>
          </div>
          <div className={styles.footerLinks}>
            <p className={styles.footerCopyright}>
              © 2026 SENSAI. All rights reserved. Built with ❤️ for career success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
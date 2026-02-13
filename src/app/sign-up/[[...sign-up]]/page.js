// src/app/sign-up/[[...sign-up]]/page.js
import { SignUp } from '@clerk/nextjs';
import styles from './SignUp.module.css';

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.logo}>SENSAI</h1>
          <p className={styles.tagline}>AI-Powered Career Coach</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: styles.clerkRoot,
              card: styles.clerkCard
            }
          }}
        />
      </div>
    </div>
  );
}
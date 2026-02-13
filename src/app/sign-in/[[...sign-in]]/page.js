// src/app/sign-in/[[...sign-in]]/page.js
import { SignIn } from '@clerk/nextjs';
import styles from './SignIn.module.css';

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.logo}>SENSAI</h1>
          <p className={styles.tagline}>AI-Powered Career Coach</p>
        </div>
        <SignIn 
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
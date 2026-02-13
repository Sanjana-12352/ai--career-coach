// src/app/api/user/onboarding/route.js
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const data = await req.json();

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // User doesn't exist, create them first
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          imageUrl: clerkUser.imageUrl || '',
          industry: data.industry,
          currentRole: data.currentRole,
          experienceLevel: data.experienceLevel,
          careerGoals: data.careerGoals,
          skills: data.skills,
          onboardingComplete: true,
        },
      });
    } else {
      // User exists, just update
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          industry: data.industry,
          currentRole: data.currentRole,
          experienceLevel: data.experienceLevel,
          careerGoals: data.careerGoals,
          skills: data.skills,
          onboardingComplete: true,
        },
      });
    }

    return Response.json({ success: true, user });
  } catch (error) {
    console.error('Onboarding error:', error);
    return Response.json({ 
      error: 'Failed to save profile',
      details: error.message 
    }, { status: 500 });
  }
}
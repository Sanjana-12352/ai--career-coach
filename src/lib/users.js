// src/lib/users.js
import prisma from './prisma';

export async function getUserByClerkId(clerkId) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUserProfile(clerkId, data) {
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        industry: data.industry,
        currentRole: data.currentRole,
        experienceLevel: data.experienceLevel,
        careerGoals: data.careerGoals,
        skills: data.skills,
        onboardingComplete: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function createOrUpdateUser(clerkId, data) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: data,
      create: {
        clerkId,
        ...data,
      },
    });
    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

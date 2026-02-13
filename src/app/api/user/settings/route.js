// src/app/api/user/settings/route.js
import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        industry: data.industry,
        currentRole: data.currentRole,
        experienceLevel: data.experienceLevel,
        careerGoals: data.careerGoals,
        skills: data.skills,
      },
    });

    return Response.json({ success: true, user });
  } catch (error) {
    console.error('Settings update error:', error);
    return Response.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
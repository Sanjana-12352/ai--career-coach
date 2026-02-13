// src/app/api/user/profile/route.js
import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    return Response.json({ success: true, user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
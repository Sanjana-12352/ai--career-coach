// src/app/api/ai/career-guidance/route.js
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import prisma from '../../../../lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationHistory } = await req.json();

    // Get user profile for context
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Build system prompt with user context
    const systemPrompt = `You are SENSAI, an AI career coach. You provide personalized career advice, guidance, and mentorship.

User Profile:
- Industry: ${user?.industry || 'Not specified'}
- Current Role: ${user?.currentRole || 'Not specified'}
- Experience Level: ${user?.experienceLevel || 'Not specified'}
- Career Goals: ${user?.careerGoals?.join(', ') || 'Not specified'}
- Skills: ${user?.skills?.join(', ') || 'Not specified'}

Provide thoughtful, actionable advice. Be encouraging but realistic. Keep responses concise (2-3 paragraphs max) unless asked for detailed analysis.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save conversation to database
    try {
      await prisma.careerSession.create({
        data: {
          userId: user.id,
          messages: {
            user: message,
            assistant: aiResponse,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (dbError) {
      console.error('Error saving conversation:', dbError);
      // Continue even if save fails
    }

    return Response.json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
    console.error('AI Career Guidance error:', error);
    return Response.json({ 
      error: 'Failed to get AI response',
      details: error.message 
    }, { status: 500 });
  }
}
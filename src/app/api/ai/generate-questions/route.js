// src/app/api/ai/generate-questions/route.js
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

    const { count, difficulty, category } = await req.json();

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const prompt = `Generate ${count} ${difficulty} interview questions for a ${user?.currentRole || 'professional'} in the ${user?.industry || 'general'} industry.

Category: ${category === 'Mixed' ? 'Mix of behavioral, technical, and situational' : category}

Return ONLY a JSON array with this exact structure:
[
  {
    "question": "the interview question",
    "category": "Behavioral/Technical/Situational",
    "difficulty": "${difficulty}",
    "tip": "a helpful tip for answering this question"
  }
]

Make questions relevant to their experience level: ${user?.experienceLevel || 'general professional'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert interview coach. Generate realistic, relevant interview questions. Return ONLY valid JSON, no markdown or explanations.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    let questions;
    try {
      const response = completion.choices[0].message.content;
      // Remove markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      questions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      questions 
    });

  } catch (error) {
    console.error('Generate questions error:', error);
    return Response.json({ 
      error: 'Failed to generate questions',
      details: error.message 
    }, { status: 500 });
  }
}
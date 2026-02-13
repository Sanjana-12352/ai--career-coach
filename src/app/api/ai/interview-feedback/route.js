// src/app/api/ai/interview-feedback/route.js
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

    const { question, answer, category } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const prompt = `Evaluate this interview answer:

Question: ${question}
Category: ${category}
Answer: ${answer}

Provide feedback in this EXACT JSON format:
{
  "score": <number 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "detailedFeedback": "2-3 sentences of overall feedback"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert interview coach. Provide constructive, encouraging feedback. Return ONLY valid JSON.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    let feedback;
    try {
      const response = completion.choices[0].message.content;
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      feedback = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return Response.json({ error: 'Failed to parse feedback' }, { status: 500 });
    }

    // Save to database
    try {
      await prisma.interviewSession.create({
        data: {
          userId: user.id,
          question,
          userAnswer: answer,
          aiFeedback: feedback.detailedFeedback,
          score: feedback.score,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
          category,
          difficulty: 'Medium',
        },
      });
    } catch (dbError) {
      console.error('Error saving session:', dbError);
    }

    return Response.json({ 
      success: true, 
      feedback 
    });

  } catch (error) {
    console.error('Interview feedback error:', error);
    return Response.json({ 
      error: 'Failed to get feedback',
      details: error.message 
    }, { status: 500 });
  }
}
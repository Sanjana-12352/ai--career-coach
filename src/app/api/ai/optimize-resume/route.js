// src/app/api/ai/optimize-resume/route.js
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

    const { resumeData } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const prompt = `Analyze this resume and provide ATS optimization feedback:

Resume Content:
${JSON.stringify(resumeData, null, 2)}

Target Role: ${resumeData.targetRole}
Industry: ${user?.industry || 'General'}

Provide response in this EXACT JSON format:
{
  "atsScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "summary": "2-3 sentences overall assessment"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert resume reviewer and ATS optimization specialist. Provide actionable, specific feedback. Return ONLY valid JSON.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    let analysis;
    try {
      const response = completion.choices[0].message.content;
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Save resume to database
    try {
      await prisma.resume.create({
        data: {
          userId: user.id,
          title: resumeData.title || 'My Resume',
          targetRole: resumeData.targetRole,
          content: resumeData,
          atsScore: analysis.atsScore,
        },
      });
    } catch (dbError) {
      console.error('Error saving resume:', dbError);
    }

    return Response.json({ 
      success: true, 
      analysis 
    });

  } catch (error) {
    console.error('Resume optimization error:', error);
    return Response.json({ 
      error: 'Failed to optimize resume',
      details: error.message 
    }, { status: 500 });
  }
}
// src/app/api/ai/generate-cover-letter/route.js
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

    const { jobTitle, company, jobDescription, tone } = await req.json();

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const prompt = `Write a professional cover letter for this job application:

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription || 'Not provided'}

Applicant Profile:
- Name: ${user?.firstName} ${user?.lastName}
- Current Role: ${user?.currentRole || 'Professional'}
- Industry: ${user?.industry || 'General'}
- Experience Level: ${user?.experienceLevel || 'Mid-Level'}
- Skills: ${user?.skills?.join(', ') || 'Various professional skills'}
- Career Goals: ${user?.careerGoals?.join(', ') || 'Career advancement'}

Tone: ${tone}

Write a compelling, personalized cover letter that:
1. Opens with a strong hook
2. Highlights relevant experience and skills
3. Shows enthusiasm for the role and company
4. Demonstrates cultural fit
5. Closes with a call to action

Keep it to 3-4 paragraphs, professional yet engaging. Use the applicant's actual background.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are an expert career coach and professional writer. Write compelling, personalized cover letters that help candidates stand out. Match the ${tone} tone requested.` 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const coverLetter = completion.choices[0].message.content;

    // Save to database
    try {
      await prisma.coverLetter.create({
        data: {
          userId: user.id,
          jobTitle,
          company,
          content: coverLetter,
          tone,
        },
      });
    } catch (dbError) {
      console.error('Error saving cover letter:', dbError);
    }

    return Response.json({ 
      success: true, 
      coverLetter 
    });

  } catch (error) {
    console.error('Cover letter generation error:', error);
    return Response.json({ 
      error: 'Failed to generate cover letter',
      details: error.message 
    }, { status: 500 });
  }
}
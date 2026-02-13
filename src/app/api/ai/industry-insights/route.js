// src/app/api/ai/industry-insights/route.js
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

    const { industry } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const targetIndustry = industry || user?.industry || 'Technology';

    const prompt = `Provide comprehensive industry insights for the ${targetIndustry} industry.

Return ONLY valid JSON in this EXACT format:
{
  "industry": "${targetIndustry}",
  "overview": "2-3 sentences about the current state of the industry",
  "growthRate": <number between -10 and 20 representing percentage>,
  "averageSalary": {
    "junior": <number>,
    "mid": <number>,
    "senior": <number>,
    "lead": <number>
  },
  "topSkills": [
    {"name": "skill1", "demand": <number 0-100>},
    {"name": "skill2", "demand": <number 0-100>},
    {"name": "skill3", "demand": <number 0-100>},
    {"name": "skill4", "demand": <number 0-100>},
    {"name": "skill5", "demand": <number 0-100>}
  ],
  "emergingRoles": [
    {"title": "role1", "growth": <number 0-100>},
    {"title": "role2", "growth": <number 0-100>},
    {"title": "role3", "growth": <number 0-100>}
  ],
  "marketTrends": [
    "trend 1",
    "trend 2",
    "trend 3",
    "trend 4"
  ],
  "challenges": [
    "challenge 1",
    "challenge 2",
    "challenge 3"
  ],
  "opportunities": [
    "opportunity 1",
    "opportunity 2",
    "opportunity 3"
  ]
}

Use realistic, current 2024-2025 data. Salary in USD.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an industry analyst. Provide accurate, data-driven insights. Return ONLY valid JSON, no markdown or explanations.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    let insights;
    try {
      const response = completion.choices[0].message.content;
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      insights = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      insights 
    });

  } catch (error) {
    console.error('Industry insights error:', error);
    return Response.json({ 
      error: 'Failed to get industry insights',
      details: error.message 
    }, { status: 500 });
  }
}
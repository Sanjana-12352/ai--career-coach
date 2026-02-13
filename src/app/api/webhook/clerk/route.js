// src/app/api/webhook/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    try {
      await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          imageUrl: evt.data.image_url || '',
        },
      });
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error: Database error', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    try {
      await prisma.user.update({
        where: { clerkId: evt.data.id },
        data: {
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
          imageUrl: evt.data.image_url || '',
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { clerkId: evt.data.id },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
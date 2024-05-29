import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response(`Error occured -- ${err}`, {
      status: 400
    })
  }

  // Get the type of the event
  const eventType = evt.type;
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, username } = evt.data;
    const mongoUser = await createUser({
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username ?? id,
      profilePic: image_url
    });
    return NextResponse.json({ message: "User created successfully", user: mongoUser })
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, image_url, username } = evt.data;
    const mongoUser = await updateUser({
      clerkId: id,
      updateData: {
        email: email_addresses[0].email_address,
        username: username ?? id,
        profilePic: image_url
      },
    });
    return NextResponse.json({ message: "User updated successfully", user: mongoUser })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (!id) {
      return new Response('Error occured -- no user id', { status: 400 })
    }
    const mongoUser = await deleteUser({ clerkId: id });
    return NextResponse.json({ message: "User deleted successfully", user: mongoUser })
  }

  return NextResponse.json({ message: 'OK' })
}

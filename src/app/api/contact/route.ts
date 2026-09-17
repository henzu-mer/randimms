import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, type } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long (max 5000 chars)' }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Log to file (in production, send email via Resend, SendGrid, etc.)
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const logPath = path.join(dataDir, 'contact_messages.jsonl');
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
      type: type || 'general',
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || '',
    };

    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');

    // In real production, you'd send email here:
    // await resend.emails.send({ from: ..., to: ..., subject: ..., text: ... })

    console.log('New contact message:', entry);

    return NextResponse.json({ success: true, message: 'Message received' });
  } catch (e: any) {
    console.error('Contact error:', e);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Contact API - POST to send message', methods: ['POST'] });
}

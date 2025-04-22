import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { to, message } = req.body;
  
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing "to" or "message"' });
    }
  
    try {
      const sms = await client.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER!,
        body: message,
      });
  
      res.status(200).json({ success: true, sid: sms.sid });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to send SMS', details: err.message });
    }
  }
  
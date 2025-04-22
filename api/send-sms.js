const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSms(to, message) {
  return await client.messages.create({
    body: message,
    to: to,
    from: process.env.TWILIO_PHONE_NUMBER
  });
}

module.exports = async (req, res) => {
  const clientApiKey = req.headers['x-api-key'];
  if (clientApiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      details: 'Invalid or missing API key'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Both "to" (phone number) and "message" are required'
    });
  }

  if (!to.startsWith('+')) {
    return res.status(400).json({ 
      error: 'Invalid phone number format',
      details: 'Phone number must start with "+" (E.164 format)'
    });
  }

  try {
    const sms = await sendSms(to, message);

    return res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      sid: sms.sid
    });

  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
};

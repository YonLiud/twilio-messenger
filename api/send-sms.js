const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract data from request body
  const { to, message } = req.body;

  // Validate required fields
  if (!to || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Both "to" (phone number) and "message" are required'
    });
  }

  // Validate phone number format
  if (!to.startsWith('+')) {
    return res.status(400).json({ 
      error: 'Invalid phone number format',
      details: 'Phone number must start with "+" (E.164 format)'
    });
  }

  try {
    // Send SMS
    const sms = await client.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    // Return success
    return res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      sid: sms.sid
    });

  } catch (error) {
    // Handle errors
    console.error('Twilio error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
};
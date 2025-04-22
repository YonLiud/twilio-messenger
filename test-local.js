require('dotenv').config();

const sendSms = require('./api/send-sms');

const mockRequest = {
  method: 'POST',
  body: {
    to: process.env.TEST_PHONE_NUMBER || '+1234567890',
    message: 'Hello from the local test script!'
  }
};

const mockResponse = {
  status: function(code) {
    console.log('Status Code:', code);
    return this;
  },
  json: function(data) {
    console.log('Response Data:', data);
    return this;
  }
};

sendSms(mockRequest, mockResponse).catch(err => {
  console.error('Unhandled error:', err);
});
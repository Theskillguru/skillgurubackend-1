const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Get environment variables
const APP_ID = 'f3c2d6e28d7a4ccdbd047e41842e96f6';
const APP_CERTIFICATE = 'e991452edac94c4bb6a13d133b2746f4';

app.get('/generate-token', (req, res) => {
  
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  const uid = 0; // Use 0 for the auto-generated user ID
  const role = RtcRole.PUBLISHER; // Role can be PUBLISHER or SUBSCRIBER
  const expirationTimeInSeconds = 3600; // Token validity (in seconds)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  console.log(token);
  // Return the token
  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
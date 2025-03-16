const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = 3000;

// Get environment variables
const APP_ID = 'f3c2d6e28d7a4ccdbd047e41842e96f6';
const APP_CERTIFICATE = 'e991452edac94c4bb6a13d133b2746f4';

app.use(cors());

// In-memory cache for storing tokens
const tokenCache = {};

// Function to generate a random channel name
const generateRandomChannelName = (baseName) => {
  return `${baseName}_${Math.floor(1000 + Math.random() * 9000)}`;
};

// Function to generate a token
const generateToken = (channelName) => {
  const uid = 0; // Auto-generated user ID
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  tokenCache[channelName] = { token, expiry: privilegeExpiredTs };

  console.log(`Generated token for channel "${channelName}": ${token}`);
  return token;
};

// Function to periodically generate tokens for predefined channels
const predefinedChannels = ['channel1'];
const startTokenGeneration = () => {
  setInterval(() => {
    console.log(`Token generation started at: ${new Date().toISOString()}`);

    predefinedChannels.forEach((baseChannelName) => {
      const channelName = generateRandomChannelName(baseChannelName);
      const token = generateToken(channelName);
      console.log(`Generated token for ${channelName}:`, token);
    });

    console.log('Updated tokenCache:', tokenCache);
  }, 300000);
};

// API endpoint to get a token with a random channel name
app.get('/generate-token', (req, res) => {
  const baseChannelName = req.query.channelName || 'defaultChannel';
  const channelName = generateRandomChannelName(baseChannelName);

  const token = generateToken(channelName);
  return res.json({ channelName, token });
});

// Start the server and periodic token generation
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startTokenGeneration();
});

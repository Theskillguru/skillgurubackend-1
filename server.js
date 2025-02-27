const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const cors = require("cors"); // Import CORS

require('dotenv').config();

const app = express();
const PORT = 3000;

// Get environment variables
const APP_ID = 'f3c2d6e28d7a4ccdbd047e41842e96f6';
const APP_CERTIFICATE = 'e991452edac94c4bb6a13d133b2746f4';
app.use(cors()); 


// In-memory cache for storing tokens
const tokenCache = {};

// Function to generate a token
const generateToken = (channelName) => {
  const uid = 0; // Use 0 for auto-generated user ID
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

  // Cache the token along with its expiry
  tokenCache[channelName] = {
    token,
    expiry: privilegeExpiredTs,
  };

  console.log("Generated token for channel "${channelName}": ${token}");
  return token;
};

// Function to periodically generate tokens for predefined channels
const predefinedChannels = ['channel1']; // Add your channels here
const startTokenGeneration = () => {
  setInterval(() => {
    console.log(Token generation started at: ${new Date().toISOString()});
    predefinedChannels.forEach((channelName) => {
      const token = generateToken(channelName);
      console.log(Generated token for ${channelName}:, token);
    });
    console.log('Updated tokenCache:', tokenCache);
  }, 300000); // Run every 5 minutes (300,000 ms)
};

// API endpoint to get the latest token (if needed for debugging)
app.get('/generate-token', (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: 'channelName is required' });
  }

  // Check if the token is already cached
  const cachedToken = tokenCache[channelName];
  if (cachedToken) {
    return res.json({ token: cachedToken.token, expiry: cachedToken.expiry });
  }

  // If no token exists in the cache, generate a new one
  const token = generateToken(channelName);
  return res.json({ token });
});

// Start the server and periodic token generation
app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
  startTokenGeneration(); // Start auto-generation of tokens
});

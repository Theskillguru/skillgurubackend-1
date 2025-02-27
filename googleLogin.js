const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // Replace with your Client ID
const client = new OAuth2Client(CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub']; // Unique identifier for the user
    const userEmail = payload['email']; // User email

    // Here, you can create a session, save user info to the database, etc.

    res.status(200).json({ message: 'User signed in successfully', userId, userEmail });
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID token', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

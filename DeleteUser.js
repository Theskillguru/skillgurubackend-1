const express = require('express');
const admin = require('firebase-admin');
const app = express();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

app.use(express.json()); // Ensure body parsing for JSON requests

app.post('/deleteUser', async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).send('User ID is required');

  try {
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user: ${uid}`);
    res.status(200).send(`User ${uid} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Failed to delete user');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

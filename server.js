const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'feedback.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup (JSON File)
function readFeedbacks() {
      if (!fs.existsSync(DB_FILE)) {
                return [];
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return data ? JSON.parse(data) : [];
}

function saveFeedback(feedback) {
      const feedbacks = readFeedbacks();
      feedback.id = feedbacks.length ? feedbacks[feedbacks.length - 1].id + 1 : 1;
      feedback.created_at = new Date().toISOString();
      feedbacks.push(feedback);
      fs.writeFileSync(DB_FILE, JSON.stringify(feedbacks, null, 2));
      return feedback.id;
}

// Telegram notification function
async function sendTelegramNotification(feedback) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'your_bot_token_here') {
              console.log('Telegram bot token or chat ID is missing or invalid. Skipping notification.');
              return;
    }

    const message = `New Feedback Received:
    Name: ${feedback.name}
    Email: ${feedback.email}
    Rating: ${feedback.rating}
    Experience: ${feedback.experience}`;

    try {
              await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                            chat_id: chatId,
                            text: message
              });
              console.log('Telegram notification sent successfully.');
    } catch (error) {
              console.error('Error sending Telegram notification:', error.message);
    }
}

// API Endpoints
app.post('/submit-feedback', (req, res) => {
      const { name, email, rating, experience } = req.body;

             // Validation
             if (!name || !email || !rating) {
                       return res.status(400).json({ error: 'Name, email, and rating are required.' });
             }

             try {
                       const newFeedback = { name, email, rating, experience };

          // Save to JSON file
          const id = saveFeedback(newFeedback);

          // Send notification asynchronously
          sendTelegramNotification(newFeedback);

          res.status(200).json({ 
                                           message: 'Feedback submitted successfully!', 
                        id: id 
          });
             } catch (err) {
                       console.error('File write error:', err.message);
                       res.status(500).json({ error: 'Failed to save feedback.' });
             }
});

// Start Server
app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});

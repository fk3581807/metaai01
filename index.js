const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const GOOGLE_DRIVE_API_KEY = 'YOUR_GOOGLE_DRIVE_API_KEY';

const bot = new TelegramBot(TOKEN, { polling: true });

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Enter a Google Drive file link:');
});

bot.on('message', (msg) => {
  const link = msg.text;
  const fileId = extractFileId(link);
  if (fileId) {
    const downloadLink = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_DRIVE_API_KEY}`;
    bot.sendMessage(msg.chat.id, `Direct Download Link: ${downloadLink}`, {
      caption: 'Direct Download Link',
    });
  } else {
    bot.sendMessage(msg.chat.id, 'Invalid Google Drive file link format.');
  }
});

function extractFileId(link) {
  const regex = /\/file\/d\/([^\/]+)/;
  const match = link.match(regex);
  return match && match[1];
}

// Export the app as a serverless function
module.exports = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

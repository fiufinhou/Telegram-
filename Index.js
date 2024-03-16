const TelegramBot = require('node-telegram-bot-api');
const NodeWebcam = require('node-webcam');

// Replace 'YOUR_TOKEN' with your actual Telegram bot token
const token = '7144792402:AAH-6HPuQyk2bZrWQXxj1r7rYvRYlFNToC4';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Create webcam instance
const Webcam = NodeWebcam.create({
  width: 640,
  height: 480,
  quality: 100,
  delay: 0,
  saveShots: false,
  output: 'jpeg',
  device: false,
  callbackReturn: 'buffer',
  verbose: false
});

// Function to handle Button 1 click - Capture and send front camera image
function handleButton1(msg) {
  const chatId = msg.chat.id;

  // Options to capture image from front camera
  const options = {
    width: 1280,
    height: 720,
    quality: 100,
    callbackReturn: 'buffer',
    saveShots: true,
    output: 'jpeg',
    device: false,
    verbose: false
  };

  // Capture image from front camera
  Webcam.capture('front_camera', options, (err, data) => {
    if (err) {
      bot.sendMessage(chatId, 'Error capturing image from front camera.');
    } else {
      // Send image to user
      bot.sendPhoto(chatId, data);
    }
  });
}

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Keyboard buttons
  const keyboard = {
    reply_markup: JSON.stringify({
      keyboard: [
        ['Capture Front Camera Image', 'Button 2'],
        ['Button 3', 'Button 4'],
        ['Button 5', 'Button 6']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    })
  };

  // Send message with keyboard
  bot.sendMessage(chatId, 'Choose one option:', keyboard);
});

// Listen for button clicks and call appropriate functions
bot.on('message', (msg) => {
  const text = msg.text;
  switch (text) {
    case 'Capture Front Camera Image':
      handleButton1(msg);
      break;
    // Add cases for other buttons as needed
    default:
      // Handle other messages
      break;
  }
});
const TelegramBot = require('node-telegram-bot-api');
const pcsc = require('nfc-pcsc');

// Replace 'YOUR_TOKEN' with your actual Telegram bot token
const token = '7144792402:AAH-6HPuQyk2bZrWQXxj1r7rYvRYlFNToC4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Keyboard buttons
  const keyboard = {
    reply_markup: JSON.stringify({
      keyboard: [
        ['Scan NFC Card', 'Button 2'],
        ['Button 3', 'Button 4'],
        ['Button 5', 'Button 6']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    })
  };

  bot.sendMessage(chatId, 'Choose one option:', keyboard);
});

// Listen for the 'Scan NFC Card' button
bot.onText(/Scan NFC Card/, (msg) => {
  const chatId = msg.chat.id;

  // Start NFC scanning process
  const nfc = new pcsc.NFC();

  nfc.on('reader', reader => {
    console.log(`${reader.reader.name}  device attached`);

    reader.autoProcessing = false;
    reader.on('card', card => {
      console.log(`${reader.reader.name}  card detected`, card.uid);

      // Read card data
      const data = card.getData();
      bot.sendMessage(chatId, 'NFC Card Data: ' + JSON.stringify(data));

      reader.close();
      nfc.close();
    });

    reader.on('error', err => {
      console.log(`${reader.reader.name}  an error occurred`, err);
      reader.close();
      nfc.close();
    });

    reader.on('end', () => {
      console.log(`${reader.reader.name}  device removed`);
    });
  });

  nfc.on('error', err => {
    console.log('an error occurred', err);
    nfc.close();
  });
});

// Listen for any message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'You said: ' + msg.text);
});

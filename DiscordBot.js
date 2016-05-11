console.log(`> Discord Bot Project`);
console.log(`> Node.js version: ${process.version}`);
console.log(`> `);


// =========================================================
// load core variables outside block.
// Disregard initialization on declaration
var discord;
var authDetails;

try {
  console.log(`> Loading files:`);

  discord = require(`discord.js`);
  console.log(`> Loaded 'discord.js'`);

  authDetails = require(`./DiscordBot-AuthDetails.json`);
  console.log(`> Loaded 'DiscordBot-AuthDetails.json'`);

  config = require(`./DiscordBot-Config.json`);
  console.log(`> Loaded 'DiscordBot-AuthDetails.json'`);

  console.log(`> `);
} catch (e) {
  console.log(`> `);
  console.log(`> Something went wrong!`);
  console.log(`> `);
  console.log(`> ${e.stack}`);
  process.exit();
}


// =========================================================
// Load discord client
bot = new discord.Client();

// =========================================================
// Load event files
try {
  // When the bot is ready.
  require(`./events/ready.js`);
  console.log(`> Event file 'ready.js' loaded.`);

  // When the bot gets disconnected.
  require(`./events/disconnected.js`);
  console.log(`> Event file 'disconnected.js' loaded.`);

  // When the bot receives a message.
  require(`./events/message.js`);
  console.log(`> Event file 'message.js' loaded.`);
} catch (e) {
  console.log(`> `);
  console.log(`> Something went wrong!`);
  console.log(`> `);
  console.log(`> ${e.stack}`);
  process.exit();
}


// =========================================================
// Authentication
console.log(`> `);
console.log(`> Connecting...`);
// bot.login(authDetails.username, authDetails.password)
bot.loginWithToken(authDetails.token);

// =========================================================
// Discord Bot Project

console.log("> Discord Bot Project");
console.log(`> Node.js version: ${process.version}`);
console.log("> ");


// =========================================================
// Loading Discord.js
console.log("> Loading discord.js");

// load core variables outside block. Disregard initialization on declaration
var discord;
var authDetails;

try {
  discord = require("discord.js");
} catch (e) {
  console.log("> ");
  console.log("> ERROR: discord.js failed to load");
  console.log(`> ${e}`);
  process.exit();
}


// =========================================================
// Loading authentication details
console.log("> Loading authentication details");
try {
  authDetails = require("./DiscordBot-Auth.json");
} catch (e) {
  console.log("> ");
  console.log("> ERROR: Authentication details failed to load");
  console.log(`> ${e}`);
  process.exit();
}


// =========================================================
// Loading configurations
console.log("> Loading configurations");
try {
  config = require("./DiscordBot-Config.json");
} catch (e) {
  console.log("> ");
  console.log("> ERROR: Configuration failed to load!");
  console.log(`> ${e}`);
  process.exit();
}


// =========================================================
// Load discord client
bot = new discord.Client();


// =========================================================
// When the bot is ready
bot.on("ready", () => {
  console.log("> Connected");
  console.log("> ");
  console.log("> ======================= BOT SETTINGS ===");
  console.log(`>             BOT ID | ${bot.user.id}`);
  console.log(`>       BOT OWNER ID | ${config.botOwnerID}`);
  console.log(`>  SERVERS CONNECTED | ${bot.servers.length}`);
  console.log(">                    | ");
  console.log(`>            ENABLED | ${config.isEnabled}`);
  console.log(">                    | ");
  console.log("> ==================== SERVER SETTINGS ===");
  console.log(`>      SYSTEM PREFIX | ${config.commandPrefixSystem}`);
  console.log(`>      NORMAL PREFIX | ${config.commandPrefixNormal}`);
  console.log(">                    | ");
  console.log(`>      ADMIN ROLE ID | ${config.roleIDAdministrator}`);
  console.log(`>        MOD ROLE ID | ${config.roleIDModerator}`);
  console.log(`> RESTRICTED ROLE ID | ${config.roleIDRestricted}`);
  console.log("> ========================================");
  console.log("> ");
  bot.setStatus("online", `${config.commandPrefixNormal}help`);
});


// =========================================================
// When the bot gets disconnected
bot.on("disconnected", () => {
  console.log("> ");
  console.log("> Disconnected!");
  console.log("");
  process.exit(1);
});

// =========================================================
// Separate message events list into a seperate folder
require("./events/message.js");

// =========================================================
// Authentication
console.log("> ");
console.log("> Connecting...");
if (!authDetails.token) {
  bot.login(authDetails.username, authDetails.password, (error) => {
    console.log(`> Failed: ${error}`);
  });
} else {
  bot.loginWithToken(authDetails.token);
}

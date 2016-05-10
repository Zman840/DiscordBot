"use strict";

class UserCommands {
  // check to see if a command is the same. If not, go to next access level..
  execute(command, text, msg, getInfo) {
    this.mentions = msg.mentions;     // Array of mentions
    this.server = msg.channel.server; // Current Server
    switch (command) {
    default:
      this.success = false;
      break;
    case "h":
      this.help(msg);
      break;
    case "help":
      this.help(msg);
      break;
    }

    return this.success;
  }

  // Help Command
  help(msg) {
    var Message = "";

    Message += "```Help is currently unavailable.```";
    bot.sendMessage(msg.channel, Message);
  }
}

module.exports = new UserCommands();

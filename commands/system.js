"use strict";

// wait delay
var wait = (time, callback) => {
  var nt = new Date().getTime();

  while (new Date().getTime() < nt + time) {
    // Do nothing. Intended to stall as a synchronous function.
  }
  callback();
};

class SystemCommands {
  execute(command, text, msg, info) {
    switch (command) {
    default: break;
    case "logout": {
      this.shutOff();
      break;
    }
    case "off": {
      this.shutOff();
      break;
    }
    case "status": {
      this.setStatus(text, msg);
      break;
    }
    case "play": {
      this.setStatus(text, msg);
      break;
    }
    case "send": {
      this.send(msg, text, info);
      break;
    }
    case "say": {
      this.send(msg, text, info);
      break;
    }
    case "up": {
      this.uptime(msg);
      break;
    }
    case "uptime": {
      this.uptime(msg);
      break;
    } }
  }

  // turns off bot
  shutOff() {
    console.log("> Executed logout.");
    wait(500, () => {
      bot.logout();
    });
  }

  // Sets what the bot is playing
  setStatus(text, msg) {
    switch (text) {
    case "with myself":
      bot.sendMessage(msg.channel, "I can't accept that!");
      break;

    case "dead":
      bot.sendMessage(msg.channel, "I'm not a dog! >_<");
      break;

    default:
      bot.setStatus("online", text);
      bot.sendMessage(msg.channel, `Playing **${text}**`);
      console.log(`> SETSTATUS: ${text}`);
      break;

    }
  }

  // Sends a message to a channel
  send(msg, text, info) {
    var chan = info.channel(text.split(" ")[0]);
    var message = text.substr(text.indexOf(" ") + 1);

    if (!chan) {
      bot.sendMessage(msg.channel, `#${text.split(" ")[0]} doesn't exist`);
    } else {
      if (!message) {
        bot.sendMessage(msg.channel, "You didn't say what I should write.");
      } else {
        bot.sendMessage(chan, message);
      }
    } }

  // Show system uptime
  uptime(msg) {
    var sec = bot.uptime / 1000;

    bot.sendMessage(msg.channel, `\`\`\`Uptime: ${sec} seconds\`\`\``);
  }
}

module.exports = new SystemCommands();

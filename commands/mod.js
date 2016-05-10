"use strict";

// Locally import configs
var config = require("./../DiscordBot-Config.json");

class ModeratorCommands {
  execute(command, text, msg, getInfo, getInfoByID) {
    console.log(`> ${command}`);
    this.mentions = msg.mentions;     // Array of mentions
    this.server = msg.channel.server; // Current Server

    switch (command) {
    default:
      this.success = false;
      break;

    case "k": {
      this.mute(msg, getInfoByID);
      this.success = true;
      break;
    }
    case "kill":
      this.mute(msg, getInfoByID);
      this.success = true;
      break;
    case "mute":
      this.mute(msg, getInfoByID);
      this.success = true;
      break;

    case "u": {
      this.unmute(msg, getInfoByID);
      this.success = true;
      break;
    }
    case "unkill": {
      this.unmute(msg, getInfoByID);
      this.success = true;
      break;
    }
    case "unmute": {
      this.unmute(msg, getInfoByID);
      this.success = true;
      break;
    }

    case "role": {
      this.roleInfo(text, msg, getInfo);
      this.success = true;
      break;
    }

    case "roleinfo": {
      this.roleInfo(text, msg, getInfo);
      this.success = true;
      break;
    }

    case "user": {
      this.userInfo(text, msg, getInfo);
      this.success = true;
      break;
    }
    case "ava": {
      this.avatar(msg);
      this.success = true;
      break;
    }
    }
  }

  // Mute command
  mute(msg, getInfoByID) {
    // mute code
    var Role = config.roleIDRestricted === -1 ? null : getInfoByID.role(config.roleIDRestricted);

    if (!Role) {
      bot.sendMessage(msg.channel, "Role was not found");
    } else {
      for (var i = 0; i < this.mentions.length; i++) {
        bot.addMemberToRole(this.mentions[i], Role);
        bot.sendMessage(msg.channel, `${this.mentions[i].name} has been restricted`);
      }
    }
  }

  // Unmute command
  unmute(msg, getInfoByID) {
    var Role = config.roleIDRestricted === -1 ? "" : getInfoByID.role(config.roleIDRestricted);

    if (!Role) {
      bot.sendMessage(msg.channel, "Role was not found");
    } else {
      for (var i = 0; i < this.mentions.length; i++) {
        bot.removeMemberFromRole(this.mentions[i], Role);
        bot.sendMessage(msg.channel, `${this.mentions[i].name} is no longer restricted`);
      }
    }
  }

  // Role Information command
  roleInfo(text, msg, getInfo) {
    var roleInfo = getInfo.role(text.substr(text.indexOf(" ") + 1));

    if (!roleInfo) {
      bot.sendMessage(msg.channel, "Role not found!");
    } else {
      var Message = `\`\`\`Role Information\n`;

      Message += `Name: ${roleInfo.name}\n`;
      Message += `ID: ${roleInfo.id}\n`;
      Message += `Position: ${roleInfo.position}\n`;
      Message += `Color: ${roleInfo.colorAsHex()}\n`;
      Message += "```";
      bot.sendMessage(msg.channel, Message);
    }
  }

  // User Information command
  userInfo(text, msg, getInfo) {
    // userInfo code
    if (this.mentions.length === 1) {
      var User = this.mentions[0];
      var userRoles = this.server.rolesOfUser(this.mentions[0]);
      var Text = "**User Information**\n";

      Text += `Name: ${User.name}#${User.discriminator}\n`;
      Text += `ID: ${User.id}\n`;

      if (userRoles.length > 0) {
        Text += `Roles: ${userRoles.length}\n`;

        for (var i = 0; i < userRoles.length; i++) {
          Text += ` ${i + 1}. ${userRoles[i].name}\n`;
        }
      } else {
        Text += "This user doesn't have any roles.\n";
      }
      Text += `Avatar: ${User.avatarURL}`;
      bot.sendMessage(msg.channel, Text);
    } else {
      bot.sendMessage(msg.channel, "You haven't mentioned anyone.");
    }
  }

  // avatar
  avatar(msg) {
    // avatar code
    if (this.mentions.length === 1) {
      var User = this.mentions[0];

      bot.sendMessage(msg.channel, User.avatarURL);
    } else {
      bot.sendMessage(msg.channel, "You haven't mentioned anyone.");
    }
  }
}

module.exports = new ModeratorCommands();

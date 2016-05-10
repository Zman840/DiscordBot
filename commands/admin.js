"use strict";

class AdminCommands {
  // check to see if a command is the same. If not, go to next access level..
  execute(command, text, msg, getInfo) {
    this.mentions = msg.mentions;     // Array of mentions
    this.server = msg.channel.server; // Current Server
    switch (command) {
    default:
      this.success = false;
      break;
    case "ban": {
      this.ban(text, msg);
      this.success = true;
      break;
    }
    case "-": {
      this.removeRole(text, msg, getInfo);
      this.success = true;
      break;
    }
    case "removerole": {
      this.removeRole(text, msg, getInfo);
      this.success = true;
      break;
    }
    case "+": {
      this.addRole(text, msg, getInfo);
      this.success = true;
      break;
    }
    case "addrole": {
      this.addRole(text, msg, getInfo);
      this.success = true;
      break;
    }
    }

    return this.success;
  }

  // Ban users
  ban(text, msg) {
    var Members = "";               // List of members

    console.log(this.mentions);
    for (var i = 0; i < this.mentions.length; i++) {
      Members += `${this.mentions[i].name}, `;
      bot.banMember(this.mentions[i], this.server, 0, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    bot.sendMessage(msg.channel, `${Members} has been banned.`);
  }

  // Removing a user from a role
  removeRole(text, msg, getInfo) {
    if (this.mentions.length === 1) {
      var Role = getInfo.role(text.replace(`${this.mentions[0]} `, ""));

      if (!Role) {
        bot.sendMessage(msg.channel, "Role not found!");
      } else {
        bot.removeMemberFromRole(this.mentions[0], Role);
        bot.sendMessage(msg.channel, `${this.mentions[0].name}  has been removed from: ${Role.name}`);
      }
    }
  }

  // Adding a user to a role
  addRole(text, msg, getInfo) {
    if (this.mentions.length === 1) {
      var Role = getInfo.role(text.replace(`${this.mentions[0]} `, ""));

      if (!Role) {
        bot.sendMessage(msg.channel, "Role not found!");
      } else {
        bot.addMemberToRole(this.mentions[0], Role);
        bot.sendMessage(msg.channel, `${this.mentions[0].name}  has been added to: ${Role.name}`);
      }
    }
  }
}

module.exports = new AdminCommands();

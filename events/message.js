bot.on(`message`, (msg) => {


  // ======================================================
  // Variables
  var S = msg.content.split(` `); // Splits message by spaces
  var mentions = msg.mentions; // Mentions
  var thisServer = msg.channel.server; // Current Server
  var me = bot.user; // Bot Information

  // Variables from configuration
  var botOwnerID = config.botOwnerID; // Bot Owner's ID
  var commandPrefixSystem = config.commandPrefixSystem; // Command Prefix (System)
  var commandPrefixNormal = config.commandPrefixNormal; // Command Prefix (Normal)


  // Separate system level command from user command
  var cPrefix = S[0].replace(/\.(.*$)/, ``);
  var command = S[0].replace(/^(.*)\./, ``);

  // ======================================================
  // Functions

  /* Removes an array of strings from the message based on index. */
  var parseText = (count) => {
    var Message = msg.content.split(` `);

    for (var i = 0; i < count; i++) {
      Message.shift();
    }
    Message = Message.join(` `);

    return Message;
  };


  /*
  // Wait for a certain period (ms)
  var wait = (time, callback) => {
    var nt = new Date().getTime();
    while (new Date().getTime() < nt + time) {
    }
    callback();
  };
  */


  /* Gets info based on written string */
  var getInfo = {

    // Returns the server information based on serverName if it exists.
    server: (serverName) => {
      var Serv = msg.channel.server.get(`name`, serverName);

      return Serv;
    },

    // Returns the user information based on username if it exists.
    user: (username) => {
      var User = msg.channel.server.members.get(`username`, username);

      return User;
    },


    // Returns the role information based on roleName if it exists.
    role: (roleName) => {
      var Role = msg.channel.server.roles.get(`name`, roleName);

      return Role;
    },


    // Returns the channel information based on channelName if it exists.
    channel: (channelName) => {
      var Chan = bot.channels.get(`name`, channelName);

      return Chan;
    }
  };


  /* Gets info based on written ID */
  var getInfoByID = {

    server: (id) => {
      var Serv = msg.channel.server.get(`id`, id);

      return Serv;
    },


    user: (id) => {
      var User = msg.channel.server.members.get(`id`, id);

      return User;
    },


    role: (id) => {
      var Role = msg.channel.server.roles.get(`id`, id);

      return Role;
    },


    channel: (id) => {
      var Chan = bot.channels.get(`id`, id);

      return Chan;
    }
  };

  // Do not respond to self
  if (msg.author.id === me.id) {
    return;
  }

  // =========================================================
  // Main Activity


  // =========================================================
  // System Level Access (Owner)
  if (msg.sender.id === botOwnerID && cPrefix === commandPrefixSystem.substring(0, commandPrefixSystem.length - 1)) {
    var sysCommands = require(`./../commands/system`);
    sysCommands.execute(command, parseText(1), msg, getInfo);
  }

  // =========================================================
  // Administrator Level Access
  try {
    var AdminRole = config.roleIDAdministrator === -1 ? null : getInfoByID.role(config.roleIDAdministrator);
    var AdminAccess = AdminRole === null ? false : bot.userHasRole(msg.sender, AdminRole);

    if (msg.sender.id === botOwnerID || AdminAccess) {
      switch (S[0]) {
        default: break;

        // Ban users
        case `${commandPrefixNormal}ban`:
          if (mentions.length == 1) {
            var User = mentions[0]
            bot.banMember(mentions[0],thisServer,0);
            bot.sendMessage(msg.channel, mentions[0].name + ` (#` + mentions[0].id +`) has been banned from this server.`);
          }
          else {
            bot.sendMessage(msg.channel, `You haven't mentioned anyone.`);
          }
        break;

        // Kick users
				case `${commandPrefixNormal}kick`:
					if (mentions.length == 1) {
						var User = mentions[0]
						bot.kickMember(mentions[0],thisServer,0);
						bot.sendMessage(msg.channel, mentions[0].name + ` (#` + mentions[0].id +`) has been kicked out from this server.`);
					}
					else {
						bot.sendMessage(msg.channel, `You haven't mentioned anyone.`);
					}
				break;

        // Removing a user from a role
				case `${commandPrefixNormal}removerole`:
					if (mentions.length == 1) {
						var Role = getInfo.role(parseText(mentions.length + 1));
						if (!Role) {
							bot.sendMessage(msg.channel, `Role not found!`);
						}
						else {
							bot.removeMemberFromRole(mentions[0], Role);
							bot.sendMessage(msg.channel, mentions[0].name + ` has been removed from: ` + Role.name);
						}
					}
				break;

				// Adding a user to a role
				case `${commandPrefixNormal}addrole`:
					if (mentions.length == 1) {
						var Role = getInfo.role(parseText(mentions.length + 1));
						if (!Role) {
							bot.sendMessage(msg.channel, `Role not found!`);
						}
						else {
							bot.addMemberToRole(mentions[0], Role);
							bot.sendMessage(msg.channel, mentions[0].name + ` has been added to: ` + Role.name);
						}
					}
				break;
      }
    }
  }
  catch (e) {
    console.log(`> error with Admin access`);
    console.log(`> ${e}`);
    return;
  }

  // =========================================================
  // Moderator Level Access
  var ModeratorRole = config.roleIDModerator === -1 ? null : getInfoByID.role(config.roleIDModerator);
  var ModeratorAccess = ModeratorRole === null ? false : bot.userHasRole(msg.sender, ModeratorRole);
  // var variable = condition ? true : false;

  if (msg.sender.id === botOwnerID || AdminAccess || ModeratorAccess) {
    switch (S[0]) {

      default: break;

      // Mute command
      case `${commandPrefixNormal}k`:
      case `${commandPrefixNormal}kill`:
      case `${commandPrefixNormal}mute`:
        var role = config.roleIDRestricted === -1 ? null : getInfoByID.role(config.roleIDRestricted);

        if (!role) {
          console.log(`> Role Mute accessed`);
          bot.sendMessage(msg.channel, `Role was not found`);
        } else {
          for (var i = 0; i < mentions.length; i++) {
          bot.addMemberToRole(mentions[i], Role);
          bot.sendMessage(msg.channel, `${mentions[i].name} has been restricted`);
        }
      }
      break;


      // Unmute command
      case `${commandPrefixNormal}u`:
      case `${commandPrefixNormal}unkill`:
      case `${commandPrefixNormal}unmute`:
        var Role = config.roleIDRestricted === -1 ? `` : getInfoByID.role(config.roleIDRestricted);

        if (!Role) {
          console.log(`> Role unmute accessed`);
          bot.sendMessage(msg.channel, `Role was not found`);
        } else {
          for (i = 0; i < mentions.length; i++) {
            bot.removeMemberFromRole(mentions[i], Role);
            bot.sendMessage(msg.channel, `${mentions[i].name} is no longer restricted`);
          }
        }
      break;


      // Role Information command
      case `${commandPrefixNormal}role`:
      case `${commandPrefixNormal}roleinfo`:
      var roleInfo = getInfo.role(parseText(1));

      if (!roleInfo) {
        bot.sendMessage(msg.channel, `Role not found!`);
      } else {
        var Message = `\`\`\`Role Information\n`;

        Message += `Name: ${roleInfo.name}\n`;
        Message += `ID: ${roleInfo.id}\n`;
        Message += `Position: ${roleInfo.position}\n`;
        Message += `Color: ${roleInfo.colorAsHex()}\n`;
        Message += `\`\`\``;
        bot.sendMessage(msg.channel, Message);
      }
      break;


      // User Information
    case `${commandPrefixNormal}user`:
    case `${commandPrefixNormal}userinfo`:
      if (mentions.length === 1) {
        var User = mentions[0];
        var userRoles = thisServer.rolesOfUser(mentions[0]);
        var Text = `**User Information**\n`;

        Text += `Name: ${User.name}#${User.discriminator}\n`;
        Text += `ID: ${User.id}\n`;

        if (userRoles.length > 0) {

          Text += `Roles: ${userRoles.length}\n`;

          for (var i = 0; i < userRoles.length; i++) {
            Text += ` ${i + 1}. ${userRoles[i].name}\n`;
          }
        } else {
          Text += `This user doesn't have any roles.\n`;
        }
        Text += `Avatar: ${User.avatarURL}`;
        bot.sendMessage(msg.channel, Text);
      } else {
        bot.sendMessage(msg.channel, `You haven't mentioned anyone.`);
      }
      break;


      // Avatar
    case `${commandPrefixNormal}ava`:
    case `${commandPrefixNormal}avatar`:
      if (mentions.length === 1) {
        var User = mentions[0];

        bot.sendMessage(msg.channel, User.avatarURL);
      } else {
        bot.sendMessage(msg.channel, `You haven't mentioned anyone.`);
      }
      break;
    }
  }

  // =========================================================
  // Normal Level Access
  switch (S[0]) {

  default: break;
    // Help command
  case `${commandPrefixNormal}h`:
  case `${commandPrefixNormal}help`:
    var Message = ``;

    Message += `\`\`\`Help is currently unavailable.\`\`\``;
    bot.sendMessage(msg.channel, Message);
    break;
  }


    // END OF COMMANDS
    // =========================================================
});

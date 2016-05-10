// =========================================================
// Message events
bot.on("message", (msg) => {
  // ======================================================
  // Variables
  var S = msg.content.split(" "); // Splits message by spaces
  var mentions = msg.mentions; // Mentions
  var thisServer = msg.channel.server; // Current Server
  var me = bot.user; // Bot Information

  // Variables from configuration
  var botOwnerID = config.botOwnerID; // Bot Owner's ID
  var commandPrefixSystem = config.commandPrefixSystem; // Command Prefix (System)
  var commandPrefixNormal = config.commandPrefixNormal; // Command Prefix (Normal)

  // Separate system level command from user command; updated for d ynamics
  var cPrefix = "";
  var command = "";

  if (S[0].match(commandPrefixSystem)) {
    cPrefix = S[0].substr(0, commandPrefixSystem.length);
    command = S[0].substr(commandPrefixSystem.length);
  } else if (S[0].match(commandPrefixNormal)) {
    cPrefix = S[0].substr(0, commandPrefixNormal.length);
    command = S[0].substr(commandPrefixNormal.length);
  } else {
    // prevent responses if command isn't used. Can be used as something for general messages.
    return;
  }
  console.log(`> Prefix: ${cPrefix}`);
  console.log(`> Command: ${command}`);
  console.log(">");

  // ======================================================
  // Functions

  /* Removes an array of strings from the message based on index. */
  var parseText = (count) => {
    var Message = msg.content.split(" ");

    for (var i = 0; i < count; i++) {
      Message.shift();
    }
    Message = Message.join(" ");

    return Message;
  };

  /* Gets info based on written string */
  var getInfo = {


    // Returns the server information based on serverName if it exists.
    server: (serverName) => {
      var Serv = msg.channel.server.get("name", serverName);

      return Serv;
    },


    // Returns the user information based on username if it exists.
    user: (username) => {
      var User = msg.channel.server.members.get("username", username);

      return User;
    },


    // Returns the role information based on roleName if it exists.
    role: (roleName) => {
      var Role = msg.channel.server.roles.get("name", roleName);

      return Role;
    },


    // Returns the channel information based on channelName if it exists.
    channel: (channelName) => {
      var Chan = bot.channels.get("name", channelName);

      return Chan;
    }
  };


  /* Gets info based on written ID */
  var getInfoByID = {

    server: (id) => {
      var Serv = msg.channel.server.get("id", id);

      return Serv;
    },


    user: (id) => {
      var User = msg.channel.server.members.get("id", id);

      return User;
    },


    role: (id) => {
      var Role = msg.channel.server.roles.get("id", id);

      return Role;
    },


    channel: (id) => {
      var Chan = bot.channels.get("id", id);

      return Chan;
    }
  };

  // =========================================================
  // Do not respond to self
  if (msg.author.id === me.id) {
    return;
  }

  // =========================================================
  // Main Activity

  // =========================================================
  // System Level Access (Owner)
  if (msg.sender.id === botOwnerID && cPrefix === commandPrefixSystem) {
    var sysCommands = require("./../commands/system");

    // go to next access level if not found
    if (sysCommands.execute(command, parseText(1), msg, getInfo)) {
      return;
    }
  }

  // =========================================================
  // Administrator Level Access
  var AdminRole = config.roleIDAdministrator === -1 ? null : getInfoByID.role(config.roleIDAdministrator);
  var AdminAccess = AdminRole === null && cPrefix === commandPrefixNormal ? false : bot.userHasRole(msg.sender, AdminRole);

  // go to next access level if not found
  if (msg.sender.id === botOwnerID || AdminAccess) {
    var AdminCommands = require("./../commands/admin");

    if (AdminCommands.execute(command, parseText(1), msg, getInfo)) {
      return;
    }
  }

  // =========================================================
  // Moderator Level Access
  var ModeratorRole = config.roleIDModerator === -1 ? null : getInfoByID.role(config.roleIDModerator);
  var ModeratorAccess = ModeratorRole === null && cPrefix === commandPrefixNormal ? false : bot.userHasRole(msg.sender, ModeratorRole);

  if (msg.sender.id === botOwnerID || AdminAccess || ModeratorAccess) {
    var ModeratorCommands = require("./../commands/mod");

    // go to next access level if not found
    if (ModeratorCommands.execute(command, parseText(1), msg, getInfo, getInfoByID)) {
      return;
    }
  }

  // =========================================================
  // Normal Level Access

  if (cPrefix === commandPrefixNormal) {
    var UserCommands = require("./../commands/user");

    if (UserCommands.execute(command, parseText(1), msg, getInfo, getInfoByID)) {
      return;
    }
  }

    // END OF COMMANDS
    // =========================================================
});

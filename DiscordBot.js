// =========================================================
// Discord Bot Project

console.log("> Discord Bot Project");
console.log("> Node.js version: " + process.version);
console.log("> ");


// =========================================================
// Loading Discord.js
console.log("> Loading discord.js");
try {
	var discord = require("discord.js");
} catch (e) {
	console.log("> ");
	console.log("> ERROR: discord.js failed to load");
	console.log("> " + e);
	process.exit();
}


// =========================================================
// Loading authentication details
console.log("> Loading authentication details");
try {
	var authDetails = require("./DiscordBot-AuthDetails.json");
} catch (e) {
	console.log("> ");
	console.log("> ERROR: Authentication details failed to load");
	console.log("> " + e);
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
	console.log("> " + e);
	process.exit();
}


// =========================================================
// Load discord client
var bot = new discord.Client();


// =========================================================
// When the bot is ready
bot.on("ready", () => {
 	console.log("> Connected");
 	console.log("> ");
 	console.log("> ======================= BOT SETTINGS ===");
 	console.log(">             BOT ID | " + bot.user.id);
 	console.log(">       BOT OWNER ID | " + config.botOwnerID);
 	console.log(">  SERVERS CONNECTED | " + bot.servers.length);
 	console.log(">                    | ");
 	console.log(">            ENABLED | " + config.isEnabled);
 	console.log(">                    | ");
 	console.log("> ==================== SERVER SETTINGS ===");
 	console.log(">      SYSTEM PREFIX | " + config.commandPrefixSystem);
 	console.log(">      NORMAL PREFIX | " + config.commandPrefixNormal);
 	console.log(">                    | ");
 	console.log(">      ADMIN ROLE ID | " + config.roleIDAdministrator);
 	console.log(">        MOD ROLE ID | " + config.roleIDModerator);
 	console.log("> RESTRICTED ROLE ID | " + config.roleIDRestricted);
 	console.log("> ========================================");
 	console.log("> ");
 	bot.setStatus("online", config.commandPrefixNormal + "help");
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
// Message events
bot.on("message", (msg) => {
	try {


		// ======================================================
		// Variables
		var S = msg.content.split(' '); // Splits message by spaces
		var mentions = msg.mentions; // Mentions
		var thisServer = msg.channel.server // Current Server
		var me = bot.user // Bot Information
	
		// Variables from configuration
		var botOwnerID = config.botOwnerID // Bot Owner's ID
		var commandPrefixSystem = config.commandPrefixSystem // Command Prefix (System)
		var commandPrefixNormal = config.commandPrefixNormal // Command Prefix (Normal)
	
	
		// ======================================================
		// Functions
	
		/* Removes an array of strings from the message based on index. */
		parseText = (count) => {
			var Message = msg.content.split(" ");
			for (i = 0; i < count ; i++) {
				Message.shift();
			}
			Message = Message.join(" ");
			return Message;
		}


		/* Makes delays */
		wait = (time, callback) => {
			var nt = new Date().getTime();
			while(new Date().getTime() < nt + time) {}
			callback();
		}
	

		/* Gets info based on written string */
		var getInfo = {
	
	
			// Returns the server information based on serverName if it exists.
			server: (serverName) => {
				var Serv = msg.channel.server.get('name',serverName);
				return Serv;
			},
		
		
			// Returns the user information based on username if it exists.
			user: (username) => {
				var User = msg.channel.server.members.get('username',username);
				return User;
			},
		
		
			// Returns the role information based on roleName if it exists.
			role: (roleName) => {
				var Role = msg.channel.server.roles.get('name',roleName);
				return Role;
			},
		
		
			// Returns the channel information based on channelName if it exists.
			channel: (channelName) => {
				var Chan = bot.channels.get('name',channelName);
				return Chan;
			}
		};
	
	
		/* Gets info based on written ID */
		var getInfoByID = {

			server: (id) => {
				var Serv = msg.channel.server.get('id',id);
				return Serv;
			},
		
		
			user: (id) => {
				var User = msg.channel.server.members.get('id',id);
				return User;
			},
		
		
			role: (id) => {
				var Role = msg.channel.server.roles.get('id',id);
				return Role;
			},
		
		
			channel: (id) => {
				var Chan = bot.channels.get('id',id);
				return Chan;
			}
		};


		// =========================================================
		// Main Activity


		// =========================================================
		// System Level Access (Owner)
		if (msg.sender.id == botOwnerID) {
			switch(S[0]) {
	

				// Turns off the bot
				case commandPrefixSystem + "logout":
				case commandPrefixSystem + "off":
					console.log("> Executed logout.");
					wait(500, () =>{
						bot.logout();
					});
				break;
	
	
				// Sets what the bot is playing
				case commandPrefixSystem + "status":
				case commandPrefixSystem + "play":
					switch (parseText(1)) {
						
						case "with myself":
							bot.sendMessage(msg.channel, "I can't accept that!");
						break;
						
						case "dead":
							bot.sendMessage(msg.channel, "I'm not a dog! >_<");
						break;
						
						default:
							bot.setStatus("online", parseText(1));
							bot.sendMessage(msg.channel, "Playing **" + parseText(1) + "**");
							console.log("> SETSTATUS: " + parseText(1));
						break;
					}
				break;
	
	
				// Sends a message to a channel
				case commandPrefixSystem + "send":
				case commandPrefixSystem + "say":
					var chan = getInfo.Channel(S[1]);
					var message = parsetext(2);
					if (!chan) {
						bot.sendMessage(msg.channel,"#" + S[1] + " doesn't exist");
					} else {
						if (!message) {
							bot.sendMessage(msg.channel, "You didn't say what I should write.");
						} else {
							bot.sendMessage(chan,message);
						}
					}
				break;
	
	
				// Show system uptime
				case commandPrefixSystem + "up":
				case commandPrefixSystem + "uptime":
					var sec = (bot.uptime / 1000)
					bot.sendMessage(msg.channel, "```Uptime: " + sec + " seconds```");
				break;
			}
		}


		// =========================================================
		// Administrator Level Access

		var AdminRole = getInfoByID.role(config.roleIDAdministrator)
		if ((msg.sender.id == botOwnerID) || (bot.userHasRole(msg.sender, AdminRole))) {
			switch(S[0]) {


				// Ban users
				case commandPrefixNormal + "ban":
					var Members = "";
					for (i = 0; i < mentions.length ; i++) {
						Members += mentions[i].name + ", "
						bot.banMember(mentions[i],thisServer,0);
					}
					bot.sendMessage(Members + " has been banned.");
				break;
	

				// Removing a user from a role
				case commandPrefixNormal + "-":
				case commandPrefixNormal + "removerole":
					if (mentions.length == 1) {
						var Role = getInfo.role(parseText(mentions.length + 1));
						if (!Role) {
							bot.sendMessage(msg.channel, "Role not found!");
						}
						else {
							bot.removeMemberFromRole(mentions[0], Role);
							bot.sendMessage(msg.channel, mentions[0].name + " has been removed from: " + Role.name);
						}
					}
				break;
			

				// Adding a user to a role
				case commandPrefixNormal + "+":
				case commandPrefixNormal + "addrole":
					if (mentions.length == 1) {
						var Role = getInfo.role(parseText(mentions.length + 1));
						if (!Role) {
							bot.sendMessage(msg.channel, "Role not found!");
						}
						else {
							bot.addMemberToRole(mentions[0], Role);
							bot.sendMessage(msg.channel, mentions[0].name + " has been added to: " + Role.name);
						}
					}
				break;
			}
		}


		// =========================================================
		// Moderator Level Access

		var ModeratorRole = getInfoByID.role(config.roleIDModerator)
		if ((msg.sender.id == botOwnerID) || (bot.userHasRole(msg.sender, AdminRole)) || (bot.userHasRole(msg.sender, ModeratorRole))) {
			switch(S[0]) {


				// Mute command
				case commandPrefixNormal + "k":
				case commandPrefixNormal + "kill":
				case commandPrefixNormal + "mute":
					var Role = getInfoByID.role(config.roleIDRestricted);
					if (!Role) {
						bot.sendMessage(msg.channel, "Role was not found");
					}
					else {
						for (i = 0; i < mentions.length ; i++) {
							bot.addMemberToRole(mentions[i], Role);
							bot.sendMessage(msg.channel, mentions[i].name + " has been restricted");
						}
					}
				break;
	

				// Unmute command
				case commandPrefixNormal + "u":
				case commandPrefixNormal + "unkill":
				case commandPrefixNormal + "unmute":
					var Role = getInfoByID.role(config.roleIDRestricted);;
					if (!Role) {
						bot.sendMessage(msg.channel, "Role was not found");
					}
					else {
						for (i = 0; i < mentions.length ; i++) {
							bot.removeMemberFromRole(mentions[i], Role);
							bot.sendMessage(msg.channel, mentions[i].name + " is no longer restricted");
						}
					}
				break;
	
	
				// Role Information command
				case commandPrefixNormal + "role":
				case commandPrefixNormal + "roleinfo":
					var roleInfo = getInfo.role(parseText(1));
					if (!roleInfo) {
						bot.sendMessage(msg.channel, "Role not found!");
					}
					else {
						var Message = "```Role Information \n"
						Message += "Name: " + roleInfo.name + "\n";
						Message += "ID: " + roleInfo.id + "\n";
						Message += "Position: " + roleInfo.position + "\n";
						Message += "Color: " + roleInfo.colorAsHex() + "\n";
						Message += "```"
						bot.sendMessage(msg.channel,Message);
					}
				break;
	
	
				// User Information
				case commandPrefixNormal + "user":
				case commandPrefixNormal + "userinfo":
					if (mentions.length == 1) {
						var User = mentions[0]
						var userRoles = thisServer.rolesOfUser(mentions[0]);
	
						var Text = "**User Information**\n"
						Text += "Name: " + User.name + "#" + User.discriminator + "\n"
						Text += "ID: " + User.id + "\n"
	
						if (userRoles.length > 0) {
	
							Text += "Roles: " + userRoles.length + "\n"
							
							for (i = 0; i < userRoles.length ; i++) {
								Text += "	" + (i + 1) + ". " + userRoles[i].name + "\n";
							}				
						}
						else {
							Text += "This user doesn't have any roles.\n";
						}
						Text += "Avatar: " + User.avatarURL;
						bot.sendMessage(msg.channel, Text);
					}
					else {
						bot.sendMessage(msg.channel, "You haven't mentioned anyone.");
					}
				break;
	
	
				// Avatar
				case commandPrefixNormal + "ava":
				case commandPrefixNormal + "avatar":
					if (mentions.length == 1) {
						var User = mentions[0]
						bot.sendMessage(msg.channel, User.avatarURL);
					}
					else {
						bot.sendMessage(msg.channel, "You haven't mentioned anyone.");
					}
				break;
			}
		}


		// =========================================================
		// Normal Level Access
		switch(S[0]) {


			// Help command
			case commandPrefixNormal + "h":
			case commandPrefixNormal + "help":
				var Message = "";
				Message += "```Help is currently unavailable.```";
				bot.sendMessage(msg.channel, Message);
			break;
		}


	// END OF COMMANDS
	// =========================================================
	}
	catch (e) {
		console.log("> " + e.stack);
		bot.sendMessage(msg.channel, "```" + e + "```");
	}
});

// =========================================================
// Authentication
console.log("> ");
console.log("> Connecting...");
if (!authDetails.token) {
	bot.login(authDetails.username, authDetails.password, (error) => {
		console.log("> Failed: " + error);
	});
} else {
	bot.loginWithToken(authDetails.token);
}

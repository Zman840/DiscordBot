// ==============================================================================================
// Discord Bot Project

console.log("> Discord Bot Project");
console.log("> " + process.version);
console.log("> ");


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


// Load discord client
var bot = new discord.Client();


// When the bot is ready
bot.on("ready", () => {
 	console.log("> Connected");
 	console.log("> ");
 	console.log("> ======================= BOT SETTINGS ===");
 	console.log(">        BOT ID: " + bot.user.id);
 	console.log(">  BOT OWNER ID: " + config.botOwnerID);
 	console.log(">       SERVERS: " + bot.servers.length);
 	console.log("> ");
 	console.log(">       ENABLED: " + config.isEnabled);
 	console.log("> ");
 	console.log("> ==================== SERVER SETTINGS ===");
 	console.log("> SYSTEM PREFIX: " + config.commandPrefixSystem);
 	console.log(">   USER PREFIX: " + config.commandPrefixUser);
 	console.log("> ");
 	console.log("> ADMIN ROLE ID: " + config.roleIDAdministrator);
 	console.log(">   MOD ROLE ID: " + config.roleIDModerator);
 	console.log("> ========================================");
 	console.log("> ");
 	bot.setStatus("online", "use .help");
 	if (config.isEnabled == false) {
 		bot.setStatusIdle();
 	}
});


// When the bot gets disconnected
bot.on("disconnected", () => {
	console.log("> ");
	console.log("> Disconnected!");
	console.log("");
	process.exit(1);
});


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
		var botOwnerID = config.botOwnerID
		var commandPrefixSystem = config.commandPrefixSystem // Command Prefix (Owner)
		var commandPrefixUser = config.commandPrefixUser // Command Prefix (User)
	
	
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
	
	
			// Returns the server information based on ServerName if it exists.
			Server: function(ServerName) {
				var Serv = msg.channel.server.get('name',ServerName);
				return Serv;
			},
		
		
			// Returns the user information based on Username if it exists.
			User: function(Username) {
				var User = msg.channel.server.members.get('username',Username);
				return User;
			},
		
		
			// Returns the role information based on RoleName if it exists.
			Role: function(RoleName) {
				var Role = msg.channel.server.roles.get('name',RoleName);
				return Role;
			},
		
		
			// Returns the channel information based on ChannelName if it exists.
			Channel: function(ChannelName) {
				var Chan = bot.channels.get('name',ChannelName);
				return Chan;
			}
		};
	
	
		/* Gets info based on written ID */
		var getInfoByID = {

			Server: (ID) => {
				var Serv = msg.channel.server.get('id',ID);
				return Serv;
			},
		
		
			User: (ID) => {
				var User = msg.channel.server.members.get('id',ID);
				return User;
			},
		
		
			Role: (ID) => {
				var Role = msg.channel.server.roles.get('id',ID);
				return Role;
			},
		
		
			Channel: (ID) => {
				var Chan = bot.channels.get('id',ID);
				return Chan;
			}
		};


		// =========================================================
		// Main Activity

		switch(S[0]) {

			// Test code
			// Access: System
			case commandPrefixSystem + "test":
				if (msg.sender.id == botOwnerID) {
					for (var i = 0; i < 10; i++) {
						var msgs = msg.channel.messages
						if (msgs[i].sender == me.id) {
							bot.deleteMessage(msg.channel.messages[i], {}, (error) => {
								bot.sendMessage(msg.channel,"```" + error + "```");
							});
						}
					}
				}
			break;

			// Turns off the bot
			// Access: System
			case commandPrefixSystem + "logout":
			case commandPrefixSystem + "off":
				if (msg.sender.id == botOwnerID) {
					console.log("> Logging out...");
					wait(500, () => {
						bot.logout();
					});
				}
			break;


			// Sets what the bot is playing
			// Access: System
			case commandPrefixSystem + "status":
			case commandPrefixSystem + "play":
				if (msg.sender.id == botOwnerID) {
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
				}
			break;


			// Sends a message to a channel
			// Access: System
			case commandPrefixSystem + "send":
			case commandPrefixSystem + "say":
				if (msg.sender.id == botOwnerID) {
					var chan = getInfo.Channel(S[1]);
					var Message = parseText(2);
					if (!chan) {
						bot.sendMessage(msg.channel,"#" + S[1] + " doesn't exist");
					} else {
						if (!Message) {
							bot.sendMessage(msg.channel, "You didn't say what I should write.");
						} else {
							bot.sendMessage(chan,Message);
						}
					}
				}
			break;


			// Show system uptime
			// Access: System
			case commandPrefixSystem + "up":
			case commandPrefixSystem + "uptime":
				var sec = (bot.uptime / 1000)
				bot.sendMessage(msg.channel, "```Uptime: " + sec + " seconds```");
			break;


			// ====================================================
			// Administrator Level Access 

			// nothing


			// ====================================================
			// Moderator Level Access

			// Mute command
			// Access: Moderator
			case commandPrefixSystem + "k":
			case commandPrefixSystem + "kill":
			case commandPrefixSystem + "mute":
				var Role = getInfoByID.Role(config.roleIDRestricted);
				if (!Role) {
					bot.sendMessage(msg.channel, "Role was not found");
				}
				else {
					for (i = 0; i < Mentions.length ; i++) {
						bot.addMemberToRole(Mentions[i], Role);
						bot.sendMessage(msg.channel, Mentions[i].name + " has been muted");
					}
				}
			break;

			// Unmute command
			//  Access: Moderator
			case commandPrefixSystem + "u":
			case commandPrefixSystem + "unkill":
			case commandPrefixSystem + "unmute":
				var Role = getInfoByID.Role(config.roleIDRestricted);;
				if (!Role) {
					bot.sendMessage(msg.channel, "Role was not found");
				}
				else {
					for (i = 0; i < Mentions.length ; i++) {
						bot.removeMemberFromRole(Mentions[i], Role);
						bot.sendMessage(msg.channel, Mentions[i].name + " is no longer muted");
					}
				}
			break;


			// ====================================================
			// User Level Access


			// Help command
			// Access: User
			case commandPrefixSystem + "h":
			case commandPrefixSystem + "help":
			case commandPrefixUser + "h":
			case commandPrefixUser + "help":
				var Message = "";
				Message += "```Help is currently unavailable.```";
				bot.sendMessage(msg.channel, Message);
			break;


		// End of main activity
		}
	}
	catch (e) {
		console.log("> ERROR: " + e);
		bot.sendMessage(msg.channel, "```" + e + "```");
	}
});

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

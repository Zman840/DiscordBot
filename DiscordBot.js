// ==============================================================================================
// Discord Bot Project

console.log("> Discord Bot Project");
console.log("> ");

// Loading Discord.js
console.log("> Loading discord.js");
try {
	var discord = require("discord.js");
} catch (e) {
	console.log("> ERROR: discord.js failed to load");
	console.log("> " + e);
	console.log("> " + process.version);
	
	process.exit();
}


// Reading authentication
console.log("> Reading authentication details");
try {
	var authDetails = require("./DiscordBot AuthDetails.json");
} catch (e) {
	console.log("> ERROR: Authentication details failed to load");
	console.log("> " + e);
	
	process.exit();
}


// Reading configuration
console.log("> Reading configurations");
try {
	config = require("./DiscordBot Config.json");
} catch (e) {
	console.log("> ERROR: Configuration failed to load!");
	console.log("> " + e);
	
}


// Load discord client
var bot = new discord.Client();


// When the bot is ready
bot.on("ready", () => {
 	console.log("> Connected");
 	console.log("> ");
 	console.log(">        BOT ID: " + bot.user.id);
 	console.log(">  BOT OWNER ID: " + config.botOwnerID);
 	console.log(">       SERVERS: " + bot.servers.length);
 	console.log("> ");
 	console.log("> SYSTEM PREFIX: " + config.commandPrefixOwner);
 	console.log(">   USER PREFIX: " + config.commandPrefixUser);
 	console.log("> ");
 	console.log("> ============================================================");
 	console.log("> ");
 	bot.setStatus("online", "maintenance");
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
		var commandPrefixOwner = config.commandPrefixOwner // Command Prefix (Owner)
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

			Server: function(ID) {
				var Serv = msg.channel.server.get('id',ID);
				return Serv;
			},
		
		
			User: function(ID) {
				var User = msg.channel.server.members.get('id',ID);
				return User;
			},
		
		
			Role: function(ID) {
				var Role = msg.channel.server.roles.get('id',ID);
				return Role;
			},
		
		
			Channel: function(ID) {
				var Chan = bot.channels.get('id',ID);
				return Chan;
			}
		};

		// =========================================================
		// Main Activity

		switch(S[0]) {

			// Test code
			case commandPrefixOwner + "test":
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
			// Access: Bot Owner
			case commandPrefixOwner + "logout":
			case commandPrefixOwner + "off":
				if (msg.sender.id == botOwnerID) {
					console.log("> Logging out...");
					wait(500, () => {
						bot.logout();
					});
				}
			break;

			// Sends a message to a channel
			// Access: Bot Owner
			case commandPrefixOwner + "send":
			case commandPrefixOwner + "say":
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

			// Counts the user's role
			case commandPrefixOwner + "rc":
			case commandPrefixOwner + "rolecount":
				if (msg.sender.id == botOwnerID) {
					var Role = getInfo.Role(parseText(1));
					if (!Role) {
						bot.sendMessage(msg.channel, "Role not found!");
						break;
					}
					var Users = thisServer.usersWithRole(Role)
					bot.sendMessage(msg.channel, "There are " + Users.length + " user(s) who have that role.");
				}
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
	bot.login(authDetails.username, authDetails.password, (error,token) => {
		if (!error) {
			conole.log("> Token: " + token);
		} else {
			console.log("> Failed: " + error);
		}
	});
} else {
	bot.loginWithToken(authDetails.token);
}

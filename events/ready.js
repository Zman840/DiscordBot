bot.on(`ready`, () => {
  console.log(`> Connected`);
  console.log(`> `);
  console.log(`> ======================= BOT SETTINGS ===`);
  console.log(`>             BOT ID | ${bot.user.id}`);
  console.log(`>       BOT OWNER ID | ${config.botOwnerID}`);
  console.log(`>  SERVERS CONNECTED | ${bot.servers.length}`);
  console.log(`>                    | `);
  console.log(`> ==================== SERVER SETTINGS ===`);
  console.log(`>      SYSTEM PREFIX | ${config.commandPrefixSystem}`);
  console.log(`>      NORMAL PREFIX | ${config.commandPrefixNormal}`);
  console.log(`>                    | `);
  console.log(`>      ADMIN ROLE ID | ${config.roleIDAdministrator}`);
  console.log(`>        MOD ROLE ID | ${config.roleIDModerator}`);
  console.log(`> RESTRICTED ROLE ID | ${config.roleIDRestricted}`);
  console.log(`> ========================================`);
  console.log(`> `);
  bot.setStatus(`online`, `${config.commandPrefixNormal}help`);
});

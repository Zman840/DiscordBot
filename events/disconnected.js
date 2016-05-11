bot.on(`disconnected`, () => {
  console.log(`> `);
  console.log(`> Disconnected!`);
  console.log(``);
  process.exit(1);
});

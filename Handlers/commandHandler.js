const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../Commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        client.commands.set(command.name, command);
        console.log(`Yüklendi: ${command.name}`);
    }
}

module.exports = { loadCommands };
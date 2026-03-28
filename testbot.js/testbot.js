const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // 🔹 Mutlaka lazım
    ],
});

client.commands = new Collection();
const prefix = ".";

// Tek bir komutu direkt tanımlıyoruz
client.commands.set('ping', {
    name: 'ping',
    description: 'pong!',
    execute: async (message, args) => {
        await message.reply('pong!');
    }
});

// Prefix komutlarını dinle
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("Komut çalıştırılırken bir hata oluştu!");
    }
});

client.once('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

// 🔹 Buraya bot tokenini yaz
client.login(process.env.TOKEN);
const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    Collection, 
    EmbedBuilder, 
    Events 
} = require('discord.js');

const { createCanvas, loadImage } = require("canvas");
const { AttachmentBuilder } = require("discord.js");

const { 
    Guilds, 
    GuildMembers, 
    GuildMessages, 
    MessageContent, 
    GuildMessageReactions, 
    GuildModeration,
    GuildVoiceStates
} = GatewayIntentBits;

const { 
    User, 
    Message, 
    GuildMember, 
    ThreadMember, 
    Channel, 
    DirectMessages 
} = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildVoiceStates, // ✅ düzeltildi
        MessageContent,
        GuildMessageReactions,
        GuildModeration
    ],
    partials: [User, Message, GuildMember, ThreadMember, Channel, DirectMessages],
});

client.commands = new Collection();

const prefix = ".";

client.on("guildMemberAdd", async (member) => {
    const kayitsizRol = member.guild.roles.cache.get("1484197562121457775"); 
    const cezaliRol = member.guild.roles.cache.get("1486816306954113265");
    const sesKanal = member.guild.channels.cache.get("1483961789090627728");
    const kuralKanal = member.guild.channels.cache.get("1483958929984585848");
    const kanal = member.guild.channels.cache.get("1483958766188626030");
    const girisCikisKanal = member.guild.channels.cache.get("1483959286559281172");

    const yetkiliRol1 = member.guild.roles.cache.get("1486757217301430312");
    const yetkiliRol2 = member.guild.roles.cache.get("1486757143993520300");

    const hesapKurulus = member.user.createdAt;
    const simdi = Date.now();
    const yediGunMs = 7 * 24 * 60 * 60 * 1000;
    const hesapYasiMs = simdi - hesapKurulus.getTime();

    const tarih = `<t:${Math.floor(hesapKurulus.getTime() / 1000)}:F>`;
    const uyeSayisi = member.guild.memberCount;

    if (kayitsizRol) {
        member.roles.add(kayitsizRol).catch(console.error);
    }


if (girisCikisKanal) {
    girisCikisKanal.send(`${member.user} aramıza katıldı!`);
}

    if (hesapYasiMs < yediGunMs && cezaliRol) {
        member.roles.add(cezaliRol).catch(console.error);
    }

    if (kanal) {
        kanal.send(`
Sunucumuza hoş geldin ${member}!

Seninle birlikte **${uyeSayisi}** kişi olduk:) 🎉

Kayıt olmak için ${sesKanal} kanalına geçebilirsin.
Yetkililerimiz seninle ilgileneceklerdir.

Sunucuya kayıt olmadan ${kuralKanal} kanalındaki kuralları oku, lütfen unutma kayıt olduğun andan itibaren kuralları kabul etmiş sayılacaksın.

${yetkiliRol1} ${yetkiliRol2}

Hesap oluşturma tarihi: **${tarih}**

İyi eğlenceler dileriz 💖
        `);
    }
});

client.on("guildMemberRemove", (member) => {
    const kanal = member.guild.channels.cache.get("1483959286559281172");
    if (!kanal) return;

    kanal.send(`${member.user} sunucudan ayrıldı.`);
});

    


// ✅ ASIL EKSİK OLAN KISIM (PREFIX COMMAND SİSTEMİ)
client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

console.log("Komut adı:", commandName);
console.log("Komut var mı:", client.commands.has(commandName));

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("Komut çalışırken hata oluştu!");
    }
});


// Sunucuya eklenince mesaj
client.on('guildCreate', guild => {
    const channel = guild.systemChannel;
    if (!channel) return

    const embed = new EmbedBuilder()
        .setColor('#e01444')
        .setTitle('Merhaba!')
        .setDescription("Beni eklediğin için teşekkürler!\nKomutlar için **.help** yazabilirsin :)");

    channel.send({ embeds: [embed] });
});


loadCommands(client);
// loadEvents(client);

client.login(process.env.TOKEN);

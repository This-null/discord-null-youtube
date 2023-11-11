const Discord = require('discord.js');
const { Client, GatewayIntentBits } = Discord;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const fs = require('fs');
const chalk = require('chalk');
const conf = require('./ekmek.json');

const youtubeApiKey = conf.YOUTUBE_API_KEY;
const youtubeChannelId = conf.YOUTUBE_CHANNEL_ID;
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet,subscriberSnippet&channelId=${youtubeChannelId}&maxResults=50&key=${youtubeApiKey}`;

client.once('ready', () => {
    console.log(chalk.green('Hello World.'));
    client.user.setStatus("idle");
    client.user.setActivity(`null 💛 Youtube`);
});

client.on('guildMemberAdd', async (member) => {
    const subscriptions = await fetchYoutubeSubscriptions();
    const userSubscription = subscriptions.items.find(subscription => subscription.subscriberSnippet.subscriberId === member.user.id);

    if (userSubscription) {
        const role = member.guild.roles.cache.find(role => role.name === 'Youtube');
        if (!role) return;
        member.roles.add(role);
        console.log(chalk.green(`Added Youtube Abone role to ${member.user.tag}`));
    }
});

async function fetchYoutubeSubscriptions() {
    try {
        const response = await fetch(youtubeApiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(chalk.red('Error fetching YouTube subscriptions:'), error);
    }
}

client.login(conf.BOT_TOKEN);
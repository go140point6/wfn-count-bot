require('dotenv').config() // Load .env file
const { Client, Intents } = require('discord.js')

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS)

// Create a new client instance
const client = new Client({ intents: myIntents })

async function getWFN () {
  res = await fetch('https://oracles.goplugin.co/api/devicetag/wfn').then(response => response.json())
  let wfn = Object.keys(res).length
  console.log(`WFN: ${wfn}`)

  let wfnRemain = (100 - `${wfn}`)
  console.log(`Remain: ${wfnRemain}`)

  client.user.setPresence({
    activities: [{
      name: `Remaining: ${wfnRemain}`,
      type: `WATCHING`
      }]
    })
  
  client.guilds.cache.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`WFN Active: ${wfn}`)
}

// Runs when client connects to Discord.
client.on('ready', () => {
  console.log('Logged in as', client.user.tag)
  getWFN() // Ping server once on startup
  // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
  // Keep at minimum 1 hour, no need to do it more frequently
  setInterval(getWFN, Math.max(1, process.env.UPDATE_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

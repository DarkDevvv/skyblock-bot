const YAML = require('yaml')
const _fs = require('fs')
require.extensions['.yml'] = function(module, filename) {
  module.exports = YAML.parse(_fs.readFileSync(filename, 'utf8'))
}
const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('client', 'purple')
const dispatcher = require('bot-framework/dispatcher')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.yml')
const lang = require('./lang/en.json')
const fs = _fs.promises
const Util = require('./src/util');

(async () => {
  if (!await Util.exists('./data.json')) await fs.writeFile('./data.json', '{}')
  process.emit('loaded')
})()

client.on('ready', async () => {
  logger.info('Bot is ready!')
})

client.on('message', async msg => {
  if (msg.content.startsWith(config.prefix)) {
    logger.info(`${msg.author.tag} sent command: ${msg.content}`)
    dispatcher(msg, lang, config.prefix, config.owners, config.prefix)
  }
})

process.once('loaded', () => client.login(config.token))

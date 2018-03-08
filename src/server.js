const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');

const Database = require('./database');

const bot = new Telegraf(process.env.BOT_TOKEN);

const COMPLAIN_COMMAND = 'complain';

bot.start(ctx => {
    return ctx.reply('Safe Zone', Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.callbackButton(COMPLAIN_COMMAND, COMPLAIN_COMMAND),
                markup.locationRequestButton('🔍 Am I safe?')
            ])
    })
)});

bot.on('location', ctx => ctx.reply('You are in a safe zone'));
bot.hears(COMPLAIN_COMMAND, (ctx) => ctx.reply('Buy-buy!'));

bot.startPolling();


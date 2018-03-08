const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup')

const Database = require('./database');

const bot = new Telegraf(process.env.BOT_TOKEN);

const COMPLAIN_COMMAND = 'complain';
const ORIGINAL_KEYBOARD = markup => {
    return markup.resize()
        .keyboard([
            markup.callbackButton(COMPLAIN_COMMAND),
            markup.locationRequestButton('🔍 Am I safe?')
        ])
};
const questions = [{
    id: 'feeling',
    answers: [{
        label: '😃',
        value: 'well'
    }, {
        label: '🤔',
        value: 'meh'
    }, {
        label: '😰',
        value: 'anxious'
    }]
}];

const mapQuestion = (m, index) => {
    if (index < 0) {
        throw new Error('index cannot be lower than 0');
    }

    if (index >= questions.length) {
        throw new Error('index out of bounce');
    }

    const question = questions[index];
    return question.answers.map(answer => m.callbackButton(answer.label, `${question.id}-${answer.value}`));
};

bot.start(ctx => {
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD))
});

bot.on('location', ctx => ctx.reply('You are in a safe zone'));

bot.hears(COMPLAIN_COMMAND, ctx => {
    return ctx.reply('I am feeling',
        Extra.load({ caption: 'Caption' })
            .markdown()
            .markup((m) =>
                m.inlineKeyboard([
                    mapQuestion(m, 0)
                ])
            )
    )
});

bot.action(/feeling-.*/, ctx => {
    console.log(ctx);
    ctx.reply('👍');
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
});

bot.startPolling();


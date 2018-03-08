const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');

const Database = require('./database');

const bot = new Telegraf(process.env.BOT_TOKEN);

const SEND_REPORT_LOCATION_COMMAND = 'Send your location';
const REPORT_COMMAND = 'Report';
const ABORT_COMMAND = 'abort';

const ORIGINAL_KEYBOARD = markup => {
    return markup.resize()
        .keyboard([
            markup.callbackButton(REPORT_COMMAND),
            markup.locationRequestButton('🔍 Am I safe?')
        ])
};
const questions = [{
    text: 'I am feeling',
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
}, {
    id: 'area',
    text: 'This area seems',
    answers: [{
        label: '🏘',
        value: 'domestic'
    }, {
        label: '🏭',
        value: 'commercial'
    }, {
        label: '🍻',
        value: 'hangout'
    }]
}];

const getQuestionIndex = question => {
  return questions.findIndex(({ id }) => id === question );
};

const mapQuestion = (m, index) => {
    if (index < 0) {
        throw new Error('index cannot be lower than 0');
    }

    if (index >= questions.length) {
        throw new Error('index out of bounce');
    }

    const question = questions[index];
    const skipButton = m.callbackButton('Skip', `${question.id}-skip`);
    return question.answers.map(answer => m.callbackButton(answer.label, `${question.id}-${answer.value}`)).concat(skipButton);
};

const buildQuestion = (ctx, index) => {
    if (index < 0) {
        throw new Error('index cannot be lower than 0');
    }

    if (index >= questions.length) {
        throw new Error('index out of bounce');
    }

    const question = questions[index];
    const { text } = question;

    return ctx.reply(text,
        Extra.markup((m) =>
            m.inlineKeyboard([
                mapQuestion(m, index)
            ])
        )
    )
};

bot.start(ctx => {
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD))
});

bot.on('location', ctx => {
    const { location, reply_to_message } = ctx.message;
    const { text } = reply_to_message;

    if (text === SEND_REPORT_LOCATION_COMMAND) {
        return buildQuestion(ctx, 0);
    }

    ctx.reply('You are in a safe zone');
});

bot.hears(REPORT_COMMAND, ctx => {
    return ctx.reply(SEND_REPORT_LOCATION_COMMAND, Extra.markup(markup => {
        const newMarkup = markup.keyboard([
            markup.locationRequestButton('Click to send location'),
            markup.callbackButton(ABORT_COMMAND, true)
        ])
            .resize();

        return {...newMarkup, fromReport: true, reply_to_message_id: ctx.message.message_id }

    }));
});

bot.hears(ABORT_COMMAND, ctx => {
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
});

bot.action(/(.*)-(.*)/, ctx => {
    const [messageText, questionId, answerId ] = ctx.match;
    const questionIndex = getQuestionIndex(questionId);

    if (questionIndex < 0) {
        return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
    }
    if (questionIndex === questions.length - 1) {
        return ctx.reply('Thank you for updating', Extra.markup(ORIGINAL_KEYBOARD));
    }

    return buildQuestion(ctx, questionIndex + 1)

});

bot.startPolling();


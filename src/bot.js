const _ = require('lodash');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const fetch = require('node-fetch');

const { questions } = require('./questions.js');

const bot = new Telegraf(process.env.BOT_TOKEN);
const IP = process.env.IP;

const SEND_REPORT_LOCATION_COMMAND = 'Send your location';
const REPORT_COMMAND = 'Rate Location';
const ABORT_COMMAND = 'abort';
const SKIP_ANSWER = 'skip';

let answers = {};

const ORIGINAL_KEYBOARD = markup => {
    return markup.resize()
        .keyboard([
            markup.callbackButton(REPORT_COMMAND),
            markup.locationRequestButton('🔍 Am I safe?')
        ])
};

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
    const skipButton = m.callbackButton('Skip', `${question.id}-${SKIP_ANSWER}`);
    return question.answers.map(answer => m.callbackButton(answer.label, `${question.id}-${answer.value}`)).concat(skipButton);
};

const buildQuestion = ({ ctx, index, replyToMessageId }) => {
    if (index < 0) {
        throw new Error('index cannot be lower than 0');
    }

    if (index >= questions.length) {
        throw new Error('index out of bounce');
    }

    const question = questions[index];
    if (!question) {
        return;
    }

    const { text } = question;

    return ctx.reply(text,
        Extra.markup(markup => {
            const keyboard = markup.inlineKeyboard([
                mapQuestion(markup, index)
            ]).selective();

            const newKeyboard = { ...keyboard, reply_to_message_id: replyToMessageId, remove_keyboard: true };
            return newKeyboard;
        })
    )
};

bot.start(ctx => {
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD))
});

bot.on('location', ctx => {
    const { location, reply_to_message } = ctx.message;
    const { text, message_id } = reply_to_message || { };

    const { latitude, longitude } = location;

    if (text === SEND_REPORT_LOCATION_COMMAND) {
        answers = { location };
        return buildQuestion({ ctx, index: 0, replyToMessageId: message_id });
    }

    fetch(`http://${IP}:3000/issafe`)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            ctx.reply(myJson.message, Extra.markup(markup => {
                return markup.inlineKeyboard([
                    markup.urlButton('Open map', `${IP}:3000?latitude=${latitude}&longitude=${longitude}`),
                ])
                    .resize();
            }));
        });
});

bot.hears(REPORT_COMMAND, ctx => {
    return ctx.reply(SEND_REPORT_LOCATION_COMMAND, Extra.markup(markup => {
        const newMarkup = markup.keyboard([
            markup.locationRequestButton('Click to send location'),
            markup.callbackButton(ABORT_COMMAND, true)
        ])
            .resize();

        return {...newMarkup, from_report: true, reply_to_message_id: ctx.message.message_id }

    }));
});

bot.hears(ABORT_COMMAND, ctx => {
    return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
});

bot.action(/(.*)-(.*)/, ctx => {
    const message_id = _.get(ctx, 'update.callback_query.message.message_id', 0);
    const [messageText, questionId, answerId ] = ctx.match;
    const questionIndex = getQuestionIndex(questionId);

    if (answerId !== SKIP_ANSWER) {
        answers[questionId] = answerId;
    }

    const replyToMessageId = message_id - 2 - questionIndex;

    if (questionIndex < 0) {
        return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
    }
    if (questionIndex === questions.length - 1 || answerId === SKIP_ANSWER) {
        return fetch(`http://${IP}:3000/mark-location`, { method: 'POST', body: JSON.stringify(answers), headers: { 'Content-Type': 'application/json' } })
            .then(res => res.json())
            .then(json => {
                const { markedLocationId, message } = json;
                ctx.reply(message, Extra.markup(markup => {
                    return markup.inlineKeyboard([
                        markup.urlButton('Open map', `${IP}:3000?pinId=${markedLocationId}`),
                    ])
                        .resize();
                }));
                return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
            });
    }

    return buildQuestion({ ctx, index: questionIndex + 1, replyToMessageId: replyToMessageId });
});

bot.startPolling();


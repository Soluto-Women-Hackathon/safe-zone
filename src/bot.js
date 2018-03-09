const _ = require('lodash');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);
const IP = process.env.IP;

const SEND_REPORT_LOCATION_COMMAND = 'Send your location';
const REPORT_COMMAND = 'Rate Location';
const ABORT_COMMAND = 'abort';
const SKIP_ANSWER = 'skip';

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
    text: 'This area seems like',
    answers: [{
        label: '🏡',
        value: 'domestic'
    }, {
        label: '💵',
        value: 'commercial'
    }, {
        label: '🍹',
        value: 'hangout'
    }, {
        label: '🌾',
        value: 'park'
    }]
}, {
    text: 'The lighting is',
    id: 'lighting',
    answers: [{
        label: '🌕',
        value: 'well_lit'
    }, {
        label: '🌗',
        value: 'some_light'
    }, {
        label: '🌑',
        value: 'dark'
    }]
}, {
    text: 'Accessible by transportation',
    id: 'access_trans',
    answers: [{
        label: '👍',
        value: 'yes'
    }, {
        label: '👎',
        value: 'no'
    }]
}, { text: 'Accessible by foot', id: 'access_foot', answers: [{label: '👍', value: 'yes'}, {label: '👎', value: 'no'}]},
    {text: 'Tidiness and maintenance', id: 'clean', answers: [{label: '🌲', value: 'clean_and_tidy'}, {label: '💩', value: 'pretty_shitty'}]},
    {text: 'Signage', id: 'signage', answers: [{label: '👍', value: 'lots_of_signs'}, {label: '👎', value: 'not_enough_signs'}]},
    {text: 'Cellular reception', id: 'reception', answers: [{label: '📡', value: 'good'}, {label: '🚫', value: 'no_reception'}]},
    {text: 'Suspicious fellows', id: 'suspicious', answers: [{label: '👌', value: 'all_clear'}, {label: '👽', value: 'some_shady_ladies'}]}
];

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
    const { text, message_id } = reply_to_message || { };;

    if (text === SEND_REPORT_LOCATION_COMMAND) {
        return buildQuestion({ ctx, index: 0, replyToMessageId: message_id });
    }

    const { latitude, longitude } = location;

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

    const replyToMessageId = message_id - 2 - questionIndex;

    if (questionIndex < 0) {
        return ctx.reply('Safe Zone', Extra.markup(ORIGINAL_KEYBOARD));
    }
    if (questionIndex === questions.length - 1 || answerId === SKIP_ANSWER) {
        return ctx.reply('Thank you for updating', Extra.markup(ORIGINAL_KEYBOARD));
    }

    return buildQuestion({ ctx, index: questionIndex + 1, replyToMessageId: replyToMessageId });
});

bot.startPolling();


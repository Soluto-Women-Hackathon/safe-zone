const questions = [{
    text: 'I am feeling',
    id: 'feeling',
    answers: [{
        label: '😃',
        value: 'well',
        text: 'Safe'
    }, {
        label: '🤔',
        value: 'meh',
        text: 'Im not really sure'
    }, {
        label: '😰',
        value: 'anxious',
        text: 'Im afraid from the Dark!'
    }]
}, {
    id: 'area',
    text: 'This area seems like',
    answers: [{
        label: '🏡',
        value: 'domestic',
        text: 'Domestic Area'
    }, {
        label: '💵',
        value: 'commercial',
        text: 'Commercial Area'
    }, {
        label: '🍹',
        value: 'hangout',
        text: 'Hangout Area'
    }, {
        label: '🌾',
        value: 'park',
        text: 'Park'
    }]
}, {
    text: 'The lighting is',
    id: 'lighting',
    answers: [{
        label: '🌕',
        value: 'well_lit',
        text: 'Lit area'
    }, {
        label: '🌗',
        value: 'some_light',
        text: 'Not quite lit'
    }, {
        label: '🌑',
        value: 'dark',
        text: 'Dark area'
    }]
}, {
    text: 'Accessible by transportation',
    id: 'access_trans',
    answers: [{
        label: '👍',
        value: 'yes',
        text: 'Yes'
    }, {
        label: '👎',
        value: 'no',
        text: 'No'
    }]
}, {
    text: 'Accessible by foot',
    id: 'access_foot',
    answers: [
        {
            label: '👍',
            value: 'yes',
            text: 'yes'
        }, {
            label: '👎',
            value: 'no',
            text: 'No'
        }]
}, {
    text: 'Tidiness and maintenance',
    id: 'clean',
    answers: [
        {
            label: '🌲',
            value: 'clean_and_tidy',
            text: 'Clean and very tidy'
        }, {
            label: '💩',
            value: 'pretty_shitty',
            text: 'Pretty shitty'
        }]
}, {
    text: 'Signage',
    id: 'signage',
    answers: [
        {
            label: '👍',
            value: 'lots_of_signs',
            text: 'Lots of signs'
        }, {
            label: '👎',
            value: 'not_enough_signs',
            text: 'Not enough signs'
        }]
}, {
    text: 'Cellular reception',
    id: 'reception',
    answers: [
        {
            label: '📡',
            value: 'good',
            text: 'Very Good!'
        }, {
            label: '🚫',
            value: 'no_reception',
            text: 'No reception'
        }]
}, {
    text: 'Suspicious fellows',
    id: 'suspicious',
    answers: [
        {
            label: '👌',
            value: 'all_clear',
            text: "All clear"
        }, {
            label: '👽',
            value: 'some_shady_ladies',
            text: 'Some Shady, ladies'
        }]}
];

module.exports = {
    questions
};

/* eslint-disable */

module.exports = {
    parserPreset: 'conventional-changelog-conventionalcommits',
    rules: {
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 72],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 72],
        'header-max-length': [2, 'always', 50],
        'subject-case': [
            2,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'int',
                'add',
                'rmv',
                'mod',
                'doc',
                'ftr',
                'fix',
                'rfc',
                'rvt',
                'sty',
                'tst',
            ],
        ],
    },
};

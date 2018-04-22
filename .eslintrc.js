module.exports = {
    extends: 'airbnb',
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'quote-props': ['error', 'as-needed', { unnecessary: false }],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'no-underscore-dangle': ['error', { allowAfterThis: false }],
        'react/forbid-prop-types': 0,
        'linebreak-style': 0,
        'jsx-a11y/anchor-is-valid': [
            'error',
            {
                components: ['Link'],
                specialLink: ['hrefLeft', 'hrefRight'],
                aspects: ['invalidHref', 'preferButton'],
            },
        ],
        'max-len': [2, 250, 4],
    },
};
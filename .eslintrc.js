"use strict";

module.exports = {
    // parser settings
    parserOptions: {
        // We want new ES2017 stuff like async and await.
        ecmaVersion: 8
        },

        // linting environment
    env: {
        // node globals
        node: true,

        // allow ES6 structures like arrow functions
        es6: true,

        // mocha globals for our testing./
        mocha: true
    },

    // use the recommended settings as a base.
    "extends": "eslint:recommended",

    // Overload these rules though
    rules: {
        // allows variables to be assigned to themselves.
        "no-self-assign": [
        "off"
        ],

        // force tab indentation
        indent: [
            "error",
            "tab",
            { "SwitchCase": 1 }
        ],

        // require semicolons
        semi: [
            "error",
            "always"
        ],

        // require all async functions have an await in them somewhere
        "require-await": [
            "error"
        ],

        // allow constants to be used in conditions like: while(true) {}
        "no-constant-condition": [
            "off"
        ]
    }
};

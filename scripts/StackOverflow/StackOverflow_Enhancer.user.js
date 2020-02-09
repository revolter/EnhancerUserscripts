// ==UserScript==
// @name         StackOverflow Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.8.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/StackOverflow/StackOverflow_Enhancer.user.js
// @match        http*://stackoverflow.com/questions/*
// @match        http*://stackoverflow.com/posts/*
// @match        http*://meta.stackoverflow.com/questions/*
// @match        http*://superuser.com/questions/*
// @match        http*://serverfault.com/questions/*
// @match        http*://*.stackexchange.com/questions/*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant        GM_addStyle
// ==/UserScript==

min.gm.style({
    "#content": {
        "width": "90%"
    },
    "#mainbar": {
        "width": "calc(100% - 320px)"
    },
    ".inner-content, .ask-title-table, .actual-edit-overlay, #questions, .question-summary, #question, #answers, #answers-header, #post-editor": {
        "width": "100%"
    },
    "#wmd-input, #wmd-preview, .question table, .answer table, .postcell, .post-text, .answercell, .answer, .comments": {
        "width": "100%"
    },
    ".wmd-button-bar, .wmd-input.processed, .wmd-preview, .form-item > table, .post-editor": {
        "width": "100%"
    },
    ".sidebyside-diff > .post-text": {
        "width": "49%"
    },
    "#title": {
        "width": "calc(100% - 40px)"
    },
    ".actual-edit-overlay": {
        "width": "calc(100% - 80px)"
    },
    ".grippie": {
        "background-position": "50% -364px",
        "width": "calc(100% - 2px)"
    },
    ".summary": {
        "width": "calc(100% - 94px)"
    },
    ".comments textarea": {
        "width": "calc(100% - 22px)"
    },
    "#wmd-button-bar": {
        "width": "calc(100% - 26px)"
    }
});

// ==UserScript==
// @name		StackOverflow Enhancer
// @namespace	http://iulianonofrei.com
// @version		0.1
// @author		Iulian Onofrei
// @match		http*://stackoverflow.com/questions/*
// @match		http*://meta.stackoverflow.com/questions/*
// @match		http*://superuser.com/questions/*
// @match		http*://*.stackexchange.com/questions/*
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant		GM_addStyle
// ==/UserScript==

min.gm.style([{
	"#content": {
		"width": "90%"
	}
}, {
	"#mainbar": {
		"width": "calc(100% - 320px)"
	}
}, {
	".ask-title-table, .actual-edit-overlay, #questions, .question-summary, #question, #answers, #answers-header, #post-editor, #wmd-input, #wmd-preview, .question table, .answer table, .postcell, .answercell, .post-text, .answer, .comments": {
		"width": "100%"
	}
}, {
	"#title": {
		"width": "calc(100% - 40px)"
	}
}, {
	".actual-edit-overlay": {
		"width": "calc(100% - 80px)"
	}
}, {
	".grippie": {
		"background-position": "50% -364px",
		"width": "calc(100% - 2px)"
	}
}, {
	".summary": {
		"width": "calc(100% - 94px)"
	}
}, {
	".comments textarea": {
		"width": "calc(100% - 22px)"
	}
}, {
	"#wmd-button-bar": {
		"width": "calc(100% - 26px)"
	}
}]);

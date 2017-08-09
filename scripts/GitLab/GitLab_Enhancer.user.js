// ==UserScript==
// @name         GitLab Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        https://gitlab.com/*/milestones/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var
        milestoneButtonsWrapper = min.dom.getByClassName("milestone-buttons"),
        newIssueUrl = window.location.href.replace(/milestones\/.+/, 'issues/new'),
        newIssueButtonHTML = "<a class='hidden-xs hidden-sm btn btn-grouped new-issue-link btn-new btn-inverted' title='New issue' id='new_issue_link' href='" + newIssueUrl + "'>New issue</a>";

    milestoneButtonsWrapper.innerHTML = newIssueButtonHTML + milestoneButtonsWrapper.innerHTML;
})();

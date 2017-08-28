// ==UserScript==
// @name         GitLab Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.3
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/6aef77d50c269aa6d2bfa67362dd6eae/GitLab_Enhancer.user.js
// @match        https://gitlab.com/*/boards*
// @match        https://gitlab.com/*/milestones/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var buttonsWrapper, newIssueUrl, newIssueButtonHTML;

    if (min.isOnPath("boards")) {
        buttonsWrapper = min.dom.getByClassName("filter-dropdown-container");

        newIssueUrl = window.location.href.replace(/boards.+/, 'issues/new');
        newIssueButtonHTML = "<a class='hidden-xs hidden-sm btn btn-grouped new-issue-link btn-new btn-inverted' title='New issue' id='new_issue_link' href='" + newIssueUrl + "'>New issue</a>";
    } else if (min.isOnPath("milestones")) {
        buttonsWrapper = min.dom.getByClassName("milestone-buttons");

        newIssueUrl = window.location.href.replace(/milestones\/.+/, 'issues/new');
        newIssueButtonHTML = "<a class='hidden-xs hidden-sm btn btn-grouped new-issue-link btn-new btn-inverted' title='New issue' id='new_issue_link' href='" + newIssueUrl + "'>New issue</a>";
    }

    buttonsWrapper.innerHTML = newIssueButtonHTML + buttonsWrapper.innerHTML;
})();

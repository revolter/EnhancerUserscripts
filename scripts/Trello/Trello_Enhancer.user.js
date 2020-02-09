// ==UserScript==
// @name        Trello Enhancer
// @description Makes the card popup full-width. Adds the option to automatically deselect all the items in a checklist.
// @namespace   http://iulianonofrei.com
// @version     0.2.1
// @author      Iulian Onofrei
// @updateURL   https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Trello/Trello_Enhancer.user.js
// @include     https://trello.com/*
// @require     https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant       GM_addStyle
// ==/UserScript==

/* eslint-env jquery */

/**
 * - Makes the card popup full-width. Adds the option to automatically deselect
 *   all the items in a checklist.
 *
 * [Install](https://raw.githubusercontent.com/revolter/EnhancerUserscripts/master/scripts/Trello/Trello_Enhancer.user.js)
 * @alias Trello-Enhancer
 */
(() => {
    "use strict";

    const
        DESELECT_DELAY = 200,

        KEY = {
            "QuestionMark": 63
        },

        // eslint-disable-next-line no-shadow
        deselectChecklist = (event) => {
            const
                $element = $(event.currentTarget),
                $checkboxes = $element.parent().parent().find(".checklist-item-state-complete .checklist-item-checkbox");

            $checkboxes.each((index, element) => {
                setTimeout(() => {
                    $(element).click();
                }, index * DESELECT_DELAY);
            });
        },

        addToggle = () => {
            $(".checklist").each((_, element) => {
                const
                    $element = $(element),
                    $icon = $element.find(".window-module-title-icon");

                if ($icon.css("cursor") !== "pointer") {
                    $icon.css("cursor", "pointer");

                    $icon.click(deselectChecklist);
                }
            });
        };

    min.gm.style({
        ".window": {
            "width": "70%"
        },
        ".window-main-col": {
            "width": "90%"
        },
        ".checklist": {
            "margin-bottom": "4px"
        }
    });

    // eslint-disable-next-line no-shadow
    $(window).on("keypress", (event) => {
        if (event.charCode === KEY.QuestionMark) {
            addToggle();
        }
    });
})();

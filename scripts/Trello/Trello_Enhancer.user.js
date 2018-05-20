// ==UserScript==
// @name        Trello Enhancer
// @namespace   http://iulianonofrei.com
// @version     0.2.1
// @author      Iulian Onofrei
// @updateURL	https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/Trello/Trello_Enhancer.user.js
// @include     https://trello.com/*
// @grant       none
// ==/UserScript==

document.head.innerHTML +=
	"<style>\
		.window {\
			width: 70% !important;\
		}\
		.window-main-col {\
			width: 90% !important;\
		}\
		.checklist {\
			margin-bottom: 4px !important;\
		}\
	</style>";

$(window).on("keypress", function(e) {
	if(e.charCode === 63) {
		addToggle();
	}
});

function addToggle() {
	$(".checklist").each(function(index, element) {
	 var
		 $element = $(element),
		 $icon = $element.find(".window-module-title-icon");

		if ($icon.css("cursor") !== "pointer") {
			$icon.css("cursor", "pointer");

			$icon.click(deselectChecklist);
		}
	});
}

function deselectChecklist() {
	var
		$element = $(this),
		$checkboxes = $element.parent().parent().find(".checklist-item-state-complete .checklist-item-checkbox");

	$checkboxes.each(function(index, element) {
		setTimeout(function() {
			$(element).click();
		}, index * 200);
	});
}

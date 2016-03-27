// ==UserScript==
// @name		990 Enhancer
// @version		2.4.1
// @author		Iulian Onofrei
// @namespace	http://iulianonofrei.com
// @updateURL	https://gist.github.com/raw/542f358fde617da25712/990_Enhancer.user.js
// @match		http://www.990.ro/seriale*-*-*
// @match		http://www.990.ro/player-*-*
// @match		http://superweb.rol.ro/video/*
// @require		https://code.jquery.com/jquery-2.1.4.min.js
// @require		https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @require		https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant		GM_xmlhttpRequest
// ==/UserScript==

var SeekSeconds = 5;

var PageType = {
	Series: 1,
	Links: 2,
	Temp: 3,
	Player: 4
};

var VideoType = {
	Flash: {
		VolumeIncrement: 10
	},
	HTML5: {
		VolumeIncrement: 0.1
	}
};

var ActionType = {
	PlayPause: 1,
	Fullscreen: 2,
	Bookmark: {
		Save: 3,
		Restore: 4
	},
	Seek: {
		Forwards: {
			Slow: 5,
			Fast: 6
		},
		Backwards: {
			Slow: 7,
			Fast: 8
		}
	},
	Volume: {
		Up: 9,
		Down: 10
	}
};

var
	pageType, videoType, video,
	isOnSeriesPage = window.location.href.indexOf("/seriale-") !== -1,
	isOnTempPage = window.location.href.indexOf("player-") !== -1,
	isOnPlayerPage = /video\/(\d|m)/.test(window.location.href);

if (window.location.href.indexOf("/seriale-") !== -1) {
	pageType = PageType.Series;
} else if (/seriale\d-/.test(window.location.href)) {
	pageType = PageType.Links;
} else if (window.location.href.indexOf("player-") !== -1) {
	pageType = PageType.Temp;
} else if (/video\/(\d|m)/.test(window.location.href)) {
	pageType = PageType.Player;
}

removeAds();

switch (pageType) {
	case PageType.Series:
		enhanceSeriesPage();

		break;
	case PageType.Links:
		enhanceLinksPage();

		break;
	case PageType.Temp:
		redirectToPlayerPage();

		break;
	case PageType.Player:
		enhancePlayerPage();

		break;
}

function removeAds() {

	min.dom.onNodeExists(min.dom.getById, "paPontonCore", function(element) {
		// min.dom.removeNode(element);
	});

	// $("#paPontonCore").remove();
}

function enhanceSeriesPage() {

	$("#content > div:nth-of-type(6)").insertBefore($("#content > div:nth-of-type(2)"));
	$("#content > div:nth-of-type(2) .link").attr("target", "_blank");
	$("#content > div:nth-of-type(2) .link").each(function(index, element) {
		var
			$element = $(element),
			$clone = $element.clone(),
			clone = $clone.get(0);

		$clone.css("margin-left", "6px");
		$clone.text("");

		$clone.insertAfter($element);

		min.gm.xhr($element.get(0).href, function(document, clone) {
			var element = min.dom.getByQuery(".linkviz .link", 0, document);

			min.gm.xhr(element.href, function(document, clone) {
				var element = min.dom.getByQuery(".player5x a", 0, document);

				min.gm.xhr(element.href, function(document, clone) {
					var element = min.dom.getByTagName("iframe", 0, document);

					min.gm.xhr(element.src, function(document, clone) {
						var
							script = min.dom.getByQuery("video script", 0, document),
							decoded = decode(script.textContent);

						eval(decoded);

						clone.href = window.vs;
						clone.textContent = "(direct)";
					}, clone);
				}, clone);
			}, clone);
		}, clone;
	});
}

function enhanceLinksPage() {

	if (window.location.search.indexOf("direct") !== -1) {
		window.location.href = $(".linkviz .link").get(0).href;
	} else {
		$(".linkviz").insertBefore($("#content > div:nth-of-type(2)"));
		$(".linkviz > *:not([style*=border-bottom])").remove();
	}
}

function redirectToPlayerPage() {

	window.location.href = $(".player5x a").attr("href").replace(/video\/\d/, "video/3");
}

function enhancePlayerPage() {

	var
		videoFileURL, subtitleFileURL,

		$document = $(document),

		bookmark = window.location.search.match(/\d+/),
		isHTML5Player = window.location.href.indexOf("video/3") !== -1,

		$menuButton = $(".hcontent a:last-child"),

		$downloadVideoButton = $menuButton.clone(),
		$downloadVideoButtonContent = $downloadVideoButton.find("div"),

		$downloadSubtitleButton = $menuButton.clone(),
		$downloadSubtitleButtonContent = $downloadSubtitleButton.find("div");

	videoType = isHTML5Player ? VideoType.HTML5 : VideoType.Flash;

	switch (videoType) {
		case VideoType.Flash:
			video = jwplayer("fileplayer");

			break;
		case VideoType.HTML5:
			video = $("#myvideo").get(0);

			break;
	}

	$("body > *:not(:has(.hline)):not(:has(video)):not(:has(object)):not(:has(#fileplayer))").remove();
	$("#jw5 > div:last").remove();

	$("#html5_b").text("Player HTML 5");

	$("<style type='text/css'>.hcontent a {display: inline-block;}</style>").appendTo("head");

	switch (videoType) {
		case VideoType.Flash:
			videoFileURL = video.config.file;

			// remove logo

			var config = video.config;

			delete config.logo;

			video.setup(config);

			break;
		case VideoType.HTML5:
			var
				$video = $("#myvideo"),
				$videoSource = $video.find("source"),
				$trackSource = $video.find("track");

			if (/\.flv$/.test($videoSource.attr("src"))) {
				window.location.href = window.location.href.replace("video/3", "video/2");
			}

			$("#html5").css("width", "60%").css("margin", "10px auto");

			$video.on("click", function() {runActionForVideo(ActionType.PlayPause);});

			$document.on("keyup", null, "f", function() {
				video.webkitRequestFullscreen();
			});

			videoFileURL = $videoSource.attr("src");
			subtitleFileURL = $trackSource.attr("src");

			break;
	}

	// add download buttons

	$downloadSubtitleButton.attr("href", subtitleFileURL);
	$downloadSubtitleButton.attr("download", "subtitle.srt");
	$downloadSubtitleButtonContent.text("Download subtitle");
	$downloadSubtitleButtonContent.removeClass("active");
	$downloadSubtitleButtonContent.removeAttr("id");
	$downloadSubtitleButton.insertAfter($menuButton);

	$downloadVideoButton.attr("href", videoFileURL);
	$downloadVideoButton.attr("download", "video");
	$downloadVideoButtonContent.text("Download video");
	$downloadVideoButtonContent.removeClass("active");
	$downloadVideoButtonContent.removeAttr("id");
	$downloadVideoButton.insertAfter($menuButton);

	if (bookmark) {
		var bookmarkTime = parseInt(bookmark[0]);

		runActionForVideo(ActionType.Bookmark.Restore, bookmarkTime);
	}

	$(window).bind("popstate", function(event) {
		var
			data = event.originalEvent.state,
			bookmarkTime = data ? data.bookmark : 0;

		runActionForVideo(ActionType.Bookmark.Restore, bookmarkTime);
	});

	$document.on("keydown", null, "space", function(e) {e.preventDefault();});
	$document.on("keyup", null, "space", function() {runActionForVideo(ActionType.PlayPause);});

	$document.on("keydown", null, "up", function(e) {runActionForVideo(ActionType.Volume.Up, e);});
	$document.on("keydown", null, "down", function(e) {runActionForVideo(ActionType.Volume.Down, e);});

	$document.on("keydown", null, "left", function(e) {runActionForVideo(ActionType.Seek.Backwards.Slow, e);});
	$document.on("keydown", null, "right", function(e) {runActionForVideo(ActionType.Seek.Forwards.Slow, e);});

	$document.on("keydown", null, "alt+left", function(e) {runActionForVideo(ActionType.Seek.Backwards.Fast, e);});
	$document.on("keydown", null, "alt+right", function(e) {runActionForVideo(ActionType.Seek.Forwards.Fast, e);});

	$document.on("keyup", null, "b", function() {runActionForVideo(ActionType.Bookmark.Save);});
}

function runActionForVideo(actionType, data) {

	if (data && data.preventDefault) {
		data.preventDefault();
	}

	switch (actionType) {
		case ActionType.PlayPause:
			var isPaused;

			switch (videoType) {
				case VideoType.Flash:
					var videoState = video.getState();

					isPaused = videoState === "IDLE" || videoState === "PAUSED";

					break;
				case VideoType.HTML5:
					isPaused = video.paused;

					break;
			}

			if (isPaused) {
				video.play();
			} else {
				video.pause();
			}

			break;
		case ActionType.Volume.Up:
		case ActionType.Volume.Down:
			var signMultiplier;

			switch (actionType) {
				case ActionType.Volume.Up:
					signMultiplier = 1;

					break;
				case ActionType.Volume.Down:
					signMultiplier = -1;

					break;
			}

			var newVolumeSummand = signMultiplier * videoType.VolumeIncrement;

			switch (videoType) {
				case VideoType.Flash:
					var newVolume;

					newVolume = video.getVolume();
					newVolume += newVolumeSummand;
					newVolume = newVolume < 0 ? 0 : (newVolume > 100 ? 100 : newVolume);

					video.setVolume(newVolume);

					break;
				case VideoType.HTML5:
					video.volume += newVolumeSummand;

					break;
			}

			break;
		case ActionType.Seek.Backwards.Slow:
		case ActionType.Seek.Backwards.Fast:
		case ActionType.Seek.Forwards.Slow:
		case ActionType.Seek.Forwards.Fast:
			var signMultiplier, secondsMultiplier;

			switch (actionType) {
				case ActionType.Seek.Backwards.Slow:
					signMultiplier = -1;
					secondsMultiplier = 1;

					break;
				case ActionType.Seek.Backwards.Fast:
					signMultiplier = -1;
					secondsMultiplier = 2;

					break;
				case ActionType.Seek.Forwards.Slow:
					signMultiplier = 1;
					secondsMultiplier = 1;

					break;
				case ActionType.Seek.Forwards.Fast:
					signMultiplier = 1;
					secondsMultiplier = 2;

					break;
			}

			var
				oldProgressSeconds = getVideoPosition(),
				newProgressSeconds = oldProgressSeconds + signMultiplier * secondsMultiplier * SeekSeconds;

			seekVideoToPosition(newProgressSeconds);

			break;
		case ActionType.Bookmark.Save:
			var
				currentTime = getVideoPosition(),
				bookmarkTime = Math.floor(currentTime),
				historyData = {bookmark: currentTime};

			window.history.pushState(historyData, "", "?t=" + bookmarkTime);

			break;
		case ActionType.Bookmark.Restore:
			var bookmarkTime = data;

			seekVideoToPosition(bookmarkTime);

			break;
	}
}

function getVideoPosition() {

	switch (videoType) {
		case VideoType.Flash:
			return video.getPosition();
		case VideoType.HTML5:
			return video.currentTime;
	}
}

function seekVideoToPosition(time) {

	switch (videoType) {
		case VideoType.Flash:
			video.seek(time);

			break;
		case VideoType.HTML5:
			video.currentTime = time;

			break;
	}
}

function decode(text) {
	var evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
	var decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
	var evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
	var decodePostamble = ") ());";

	// strip beginning/ending space.
	text = text.replace(/^\s*/, "").replace(/\s*$/, "");

	// returns empty text for empty input.
	if (/^\s*$/.test(text)) {
		return "";
	}
	// check if it is encoded.
	if (text.lastIndexOf(evalPreamble) < 0) {
		throw new Error("Given code is not encoded as aaencode.");
	}
	if (text.lastIndexOf(evalPostamble) != text.length - evalPostamble.length) {
		throw new Error("Given code is not encoded as aaencode.");
	}

	var decodingScript = text.replace(evalPreamble, decodePreamble).replace(evalPostamble, decodePostamble);

	return eval(decodingScript);
}

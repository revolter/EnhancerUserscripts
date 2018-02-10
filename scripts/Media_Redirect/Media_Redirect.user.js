// ==UserScript==
// @name         Media Redirect
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        https://www.facebook.com/*
// @match        https://www.instagram.com/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// ==/UserScript==

(function() {
    'use strict';

    function getRedirectURL(completion) {
        var element;

        if (min.isOnWebsite("facebook.com")) {
            if (!min.isOnPath("/photo.php")) {
                completion(null);
            }

            min.dom.onNodeExists(min.dom.getByXPath, "//img[@class = 'spotlight']/@src", function(element) {
                if (!element) {
                    completion(null);
                }

                completion(element.value);
            });
        } else if (min.isOnWebsite("instagram.com")) {
            if (!min.isOnPath(/^\/p\/\w+/)) {
                completion(null);
            }

            element = min.dom.getByXPath("//head/meta[@property = 'og:video']/@content");

            if (!element) {
                completion(null);
            }

            completion(element.value);
        }
    }

    getRedirectURL(function(redirectURL) {
        if (redirectURL) {
            window.location.href = redirectURL;
        }
    });
})();

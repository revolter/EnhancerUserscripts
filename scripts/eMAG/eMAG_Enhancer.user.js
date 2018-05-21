// ==UserScript==
// @name         eMAG Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.4.2
// @author       Iulian Onofrei
// @updateURL    https://github.com/revolter/EnhancerUserscripts/raw/master/scripts/eMag/eMag_Enhancer.user.js
// @match        https://www.emag.ro/history/shopping*
// @require      https://raw.githubusercontent.com/revolter/min/master/min.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    min.forEach(min.dom.getByClassName("order-hist-box", min.dom.ALL), function(order) {
        var link = min.dom.getByXPath("/div/a", 0, order);

        if (!link) {
            return;
        }

        min.gm.xhr(link.href, function(doc) {
            var products = Array.from(min.dom.getByXPath("//ul[contains(@class, 'product-list')]/li", min.dom.ALL, doc));

            min.forEach(products, function(product) {
                var image = min.dom.getByTagName("img", 0, product);

                image.style.marginRight = "10px";

                order.appendChild(product);
            });
        });
    });
})();

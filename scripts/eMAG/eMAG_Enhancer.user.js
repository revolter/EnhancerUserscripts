// ==UserScript==
// @name         eMAG Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.4
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/11dd7546dceceb569596c71125304597/eMAG_Enhancer.user.js
// @match        https://www.emag.ro/history/shopping*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
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

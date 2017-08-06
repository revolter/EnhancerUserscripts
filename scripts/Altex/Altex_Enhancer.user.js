// ==UserScript==
// @name         Altex Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
// @match        https://altex.ro/sales/order/history/
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    min.forEach(min.dom.getByXPath("//div[@class = 'my-account']/div[@class = 'u-container-reset']/table/tbody/tr", min.dom.ALL), function(order) {
        var link = min.dom.getByXPath("/td/div/a", 0, order);

        if (!link) {
            return;
        }

        min.gm.xhr(link.href, function(doc) {
            var products = Array.from(min.dom.getByXPath("//table[@id = 'my-orders-table']/tbody/tr", min.dom.ALL, doc));

            console.debug(products);

            min.forEach(products, function(product) {
                product.style.backgroundColor = "#EEE";

                min.dom.insertAfter(product, order);
            });
        });
    });
})();

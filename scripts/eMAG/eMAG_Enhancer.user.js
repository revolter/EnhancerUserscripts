// ==UserScript==
// @name         eMAG Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.1
// @author       Iulian Onofrei
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
            var
                index,
                images = Array.from(min.dom.getByClassName("product-img", min.dom.ALL, doc)),
                descriptions = min.dom.getByClassName("product-description", min.dom.ALL, doc);

            for (index = 0; index < images.length && index < descriptions.length; index++) {
                var
                    image = images[index],
                    description = descriptions[index],
                    figure = document.createElement("figure"),
                    figcaption = document.createElement("figcaption");

                figure.style.margin = "0";
                figcaption.innerText = description.innerText.trim();

                figure.appendChild(image);
                figure.appendChild(figcaption);

                order.appendChild(figure);
            }
        });
    });
})();

// ==UserScript==
// @name         Altex Enhancer
// @namespace    http://iulianonofrei.com
// @version      0.7
// @author       Iulian Onofrei
// @updateURL    https://gist.github.com/raw/7ac990d744d61db126742beefa49870c/Altex_Enhancer.user.js
// @match        https://altex.ro/sales/order/history/*
// @require      https://gist.githubusercontent.com/raw/dab432d4b4bbb672896b/min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var confirmedOrderBackgroundColor = "rgba(0, 128, 0, 0.2)";

    min.forEach(min.dom.getByXPath("//div[@class = 'my-account']/div[@class = 'u-container-reset']/table/tbody/tr", min.dom.ALL), function(order) {
        var
            link = min.dom.getByXPath("/td/div/a", 0, order),
            linkWrapper = order.lastElementChild,
            orderStatus = linkWrapper.previousElementSibling.firstElementChild,
            isOrderConfirmed = orderStatus.textContent === "Confirmat integral";

        if (!link) {
            return;
        }

        if (isOrderConfirmed) {
            order.style.backgroundColor = confirmedOrderBackgroundColor;
        }

        min.gm.xhr(link.href, function(doc) {
            var products = Array.from(min.dom.getByXPath("//table[@id = 'my-orders-table']/tbody/tr", min.dom.ALL, doc));

            linkWrapper.rowSpan = products.length + 1;

            min.forEach(products, function(product) {
                var
                    productTitle = min.dom.getByXPath("/td[1]/div", 0, product),
                    productTitleText = productTitle.textContent,
                    productSlug = productTitleText.replace(/\W+/g, "-").toLowerCase();

                productTitle.innerHTML = "<a href='https://altex.ro/" + productSlug + "'>" + productTitleText + "</a>";

                product.style.backgroundColor = isOrderConfirmed ? confirmedOrderBackgroundColor : "#EEE";

                min.dom.insertAfter(product, order);
            });
        });
    });
})();

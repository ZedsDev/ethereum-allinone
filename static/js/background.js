var Background;
Background = {

    /**
     * Change badge text and color on Chrome icon
     * @param text
     * @param color
     */
    changeBadge: function (text, color) {
        chrome.browserAction.setBadgeText({
            text: text
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        })
    },

    /**
     * Call Kraken API and show the ticker price in the badge with the right background color
     */
    getTickerPrice: function () {
        var _this = this;

        App.getTicker(function (response) {
            var res, price;

            if (response.readyState === XMLHttpRequest.DONE) {
                if (response.status === 200) {
                    res = JSON.parse(response.responseText)['result']['XETHZ' + Config.user.currency];
                    price = res['c'][0];

                    if (price > res['o']) {
                        _this.changeBadge(App.priceFormatter(price, false, false), Options.badgeColorGreen);
                    } else {
                        _this.changeBadge(App.priceFormatter(price, false, false), Options.badgeColorRed);
                    }
                }
            }
        });
    },

    /**
     * Init and start the interval
     */
    init: function () {
        var _this = this;
        App.updateConfig();
        _this.getTickerPrice();

        window.setInterval(function () {
            App.updateConfig();
            _this.getTickerPrice();
        }, options.badgeRefreshInterval);
    }

};

Background.init();
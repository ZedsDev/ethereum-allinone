var App;
App = {

    /**
     * Get user configuration or default one
     */
    updateConfig: function () {
        for (var k in Config.default) {
            Config.user[k] = localStorage[k] || Config.default[k];
        }
    },

    /**
     * Format price by using user configuration
     * @param price
     * @param withDecimals
     * @param withCurrency
     * @returns {*}
     */
    priceFormatter: function (price, withDecimals, withCurrency) {
        withDecimals = (withDecimals !== undefined) ? withDecimals : true;
        withCurrency = (withCurrency !== undefined) ? withCurrency : true;

        price = (withDecimals) ? price.substring(0, Math.max(price.indexOf('.'), 0) + 3) : price.substring(0, Math.max(price.indexOf('.'), 0));

        if (withCurrency) {
            return Currency[Config.user.currency].prefix ? Currency[Config.user.currency].symbol + price : price + Currency[Config.user.currency].symbol;
        } else {
            return price;
        }
    },

    /**
     * Get ticker by using user configuration
     * @param callback
     */
    getTicker: function (callback) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.kraken.com/0/public/Ticker?pair=ETH' + Config.user.currency;

        xhr.onreadystatechange = function (event) {
            if (typeof callback === 'function') {
                callback(this);
            }
        };

        xhr.open('GET', url, true);
        xhr.send(null);
    },

    getAddressInfo: function (address, callback) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.ethplorer.io/getAddressInfo/' + address + '?apiKey=freekey';

        xhr.open('GET', url, false);
        xhr.send(null);

        if(xhr.status === 200) {
            return xhr.responseText;
        } else {
            return null;
        }
    }

};
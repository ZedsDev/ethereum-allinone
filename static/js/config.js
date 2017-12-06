var options = {
    'available-wallets': 2,

    // Badge
    'badgeRefreshInterval': 60000, // 1 min
    'badgeColorGreen': '#388E3C',
    'badgeColorRed': '#D32F2F'
};

var config = {};
var defaultConfig = {
    "currency": "USD",
    "wallets": '{}'
};

var currencyConfig = {
    'USD': {
        "symbol": "$",
        "prefix": true
    },
    'EUR': {
        "symbol": " \u20AC",
        "prefix": false
    }
};

///// v NEW w ////

var Options, Config, Currency;
Options = {
    availableWallets: 2,

    // Badge
    badgeRefreshInterval: 300000, // 5 min
    badgeColorGreen: '#388E3C',
    badgeColorRed: '#D32F2F'
};

Config = {
    user: {},
    default: {
        "currency": "USD",
        "wallets": '{}'
    }
};

Currency = {
    'USD': {
        "symbol": "$",
        "prefix": true
    },
    'EUR': {
        "symbol": " \u20AC",
        "prefix": false
    }
};
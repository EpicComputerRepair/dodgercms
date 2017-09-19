// file: tests/math-test.js
var o = require("mithril/ospec/ospec");
global.CMS = {};
var app = require("../../package/js/util/Auth");

function localStorageMockWithCreds() {
    return {
        getItem: function (item) {
            if(item === "epiccms-data-bucket"){
                return "databucket";
            }else if(item === "epiccms-assets-bucket"){
                return "assetsbucket";
            }else if(item === "epiccms-site-bucket"){
                return "sitebucket";
            }else if(item === "epiccms-access-key-id"){
                return "accesskey";
            }else if(item === "epiccms-secret-access-key"){
                return "secretKey";
            }else if(item === "epiccms-region"){
                return "us-east-1";
            }
        }
    };
}

o.spec("Auth", function() {
    o("Has login", function() {
        o(app.login).notEquals(undefined);
    });
    o("login with localstorage empty creds", function() {
        //Mock
        global.localStorage = {
            getItem: function (item) {

            }
        };
        app.login(function (msg) {
            o(msg).equals('Could not login due to lack of user credentials.');
        });
    });
    o("login with localstorage some creds", function() {
        //Mock
        global.localStorage = {
            getItem: function (item) {
                if(item === "epiccms-data-bucket"){
                    return "databucket";
                }
            }
        };
        app.login(function (msg) {
            o(msg).equals('Could not login due to lack of user credentials.');
        });
    });
    o("login with empty params", function() {
        app.login({ },function (msg) {
            o(msg).equals('dataBucket is a required field.');
        });
    });
    o("login with some params", function() {
        app.login({
            dataBucket: "data",
            assetsBucket: "assets"
        },function (msg) {
            o(msg).equals('siteBucket is a required field.');
        });
    });
    o("login with valid params", function() {
        var called = false;
        global.AWS = {
            STS: function () {
                return {
                    getFederationToken: function () {
                        called = true;
                    }
                }
            }
        };
        app.login({
            dataBucket: "data",
            assetsBucket: "assets",
            siteBucket: "site",
            accessKey: "key",
            accessSecret: "secret",
            region: "us-east-1"
        },function (msg) {
        });
        o(called).equals(true);
    });
    o("getFederationToken called on valid login", function() {
        var called = false;
        //Mock
        global.localStorage = localStorageMockWithCreds();
        global.AWS = {
            STS: function () {
                return {
                    getFederationToken: function () {
                        called = true;
                    }
                }
            }
        };
        app.login(true);
        o(called).equals(true);
    });
    o("getFederationToken handle error", function() {
        var called = false;
        //Mock
        global.localStorage = localStorageMockWithCreds();
        global.AWS = {
            STS: function () {
                return {
                    getFederationToken: function (params,callback) {
                        callback(true);
                    }
                }
            }
        };
        app.login(function (msg) {
            o(msg).equals('Access Denied. Please make sure the acccess key and secret are correct and try again.');
        });
    });
    o("Test buckets empty response", function() {
        var called = false;
        //Mock
        global.localStorage = localStorageMockWithCreds();
        global.AWS = {
            STS: function () {
                return {
                    getFederationToken: function (params,callback) {
                        callback(false,{});
                    }
                }
            }
        };
        app.login(function (msg) {
            o(msg).equals('Missing Credentials for federated token.');
        });
    });
    o("Has Logout", function() {
        o(app.logout).notEquals(undefined);
    });
});

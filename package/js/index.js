'use strict';

Raven.config('https://a161988fe3574441832441831d7d0a5a@sentry.io/212000').install();

require("../../build/css/index.css");

const Nav = require("./views/Nav");
const Login = require("./views/Login");
const Dashboard = require("./views/Dashboard");
const Auth = require("./util/Auth");


var routerInitilized = false;

/*
* Auth routes
* @private
* @method onmatch
*/
function onmatch(page) {
    try {
        //When running from file:///
        //Error occurs SecurityError: The operation is insecure.

        if (!sessionStorage.getItem('epiccms-token-access-key-id')) {
            m.route.set("/login");
        } else {
            return page;
        }
    } catch(e) {
        if (e.name !== "SecurityError") {
            throw e;
        }else{
            if(!Auth.isLoggedIn()){
                m.route.set("/login");
            } else {
                return page;
            }
        }
    }
}

/*
 * Setup the [Mithril Router](http://lhorie.github.io/mithril/mithril.route.html)
 * @private
 * @method initRoutes
 */
function initRoutes() {
    if (!routerInitilized) {
        routerInitilized = true;

        m.route.mode = "hash";

        m.route(document.body, "/", {
            "/": Nav.Home,
            "/login":Login,
            "/dashboard": {
                onmatch: onmatch.bind(null,Dashboard)
            }
        });
    }
}

/*
 * Startup when script is loaded in browser
 */
initRoutes();
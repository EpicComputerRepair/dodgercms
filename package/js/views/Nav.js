'use strict';

const Home = require("./Home");
const View = require("./components/View");
const UserPanel = require("./components/UserPanel");
const LeftNavButton = require("./components/LeftNavButton");
const Menu = require("./components/Menu");

function createView(view){
    return m(View, {
        sidebar: [
            m(UserPanel),
            m(LeftNavButton, {
                menu: Menu
            })
        ],
        main: m(view)
    });
}

module.exports = {
    Home: {
        view: function view(){
            Menu[0].active = true;
            return createView(Home);
        }
    }
};
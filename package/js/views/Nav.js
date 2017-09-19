'use strict';

const Home = require("./Home");
const Template = require("./Template");
const Editor = require("./Editor");
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
            Menu[1].active = false;
            Menu[2].active = false;
            return createView(Home);
        }
    },
    Editor: {
        view: function view(){
            Menu[0].active = false;
            Menu[1].active = true;
            Menu[2].active = false;
            return createView(Editor);
        }
    },
    Template: {
        view: function view(){
            Menu[0].active = false;
            Menu[1].active = false;
            Menu[2].active = true;
            return createView(Template);
        }
    }
};
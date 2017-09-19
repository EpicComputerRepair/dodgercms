'use strict';

const Fork = require("./Fork");
const Sidebar = require("./Sidebar");
const MainArea = require("./MainArea");
const TopNav = require("./TopNav");
const Menu = require("./Menu");

module.exports = {
    view: function(vnode) {
        return [
            m(Fork),
            m(TopNav, {
                menu: Menu
            }),
            m("div", {class: "wrapper"}, m(Sidebar, {
                items: vnode.attrs.sidebar
             }), m(MainArea, {
                items: vnode.attrs.main
            }))
        ];
    }
};
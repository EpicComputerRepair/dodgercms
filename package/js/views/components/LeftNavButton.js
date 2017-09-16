'use strict';

module.exports = {
    view: function(vnode) {
        return m("nav", {class: "navbar navbar-default"}, m("ul", {class: "nav bar-nav nav-stacked"}, vnode.attrs.menu.map(function createMenu(item){
            return m("li", {class: (item.active) ? "active" : ""},
                m("a", {href: item.href, oncreate: m.route.link}, (item.badge) ? [
                        (item.icon) ? m("i", {class: item.icon}) : "",
                        item.name,
                        m("span", {class: "badge pull-right"},item.badge)
                    ] : (item.icon) ? [m("i", {class: item.icon}), " ", item.name] : [item.name]
                ));
        })));
    }
};

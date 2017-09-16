'use strict';

//TODO: Change INFO
module.exports = {
    view: function(vnode) {
        return m("nav", {class: "navbar navbar-default navbar-fixed-top", style:{minHeight: "35px"}},
            m("div", {style:{marginLeft: "0px"}}, [
                m("div", {class: "navbar-header"}, [
                    m("h3", {class: "logo", style:{marginTop: "0px",  textAlign: "center", margin: "0px"}}, "Epic CMS"),
                ]),
                m("button", {type: "button", class: "navbar-toggle collapsed", style: {position: "fixed", top: "-8px", left: "5px"}, 'data-toggle': "collapse", 'data-target': "#navbar"}, [
                    m("span", {class: "icon-bar"}),
                    m("span", {class: "icon-bar"}),
                    m("span", {class: "icon-bar"})
                ]),
                m("div", {id: "navbar", class: "navbar-collapse collapse"},
                    m("div", {class: "navbar-right"},
                        m("ul", {class: "nav navbar-nav"},
                            vnode.attrs.menu.map(function createNav(item) {
                                return m("li", {class: item.active ? "active" : ""}, m("a", {href: item.href, oncreate: m.route.link, style:{paddingLeft: "5px", paddingRight: "5px", paddingTop: "20px", paddingBottom: "17px"}}, m("i", {class: item.icon+" margin-right"}), item.name));
                            })
                        )
                    )
                )
            ])
        );
    }
};

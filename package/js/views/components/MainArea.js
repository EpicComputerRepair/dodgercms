'use strict';

module.exports = {
    view: function(vnode) {
        return m("div", {id: "page-content-wrapper"},
            m("div", { class: "page-content" },
                m("div", {class: "mainArea"},
                    m("div", {class: "row"},
                        m("div", {class: "col-md-12"}, vnode.attrs.items)
                    )
                )
            )
        );
    }
};

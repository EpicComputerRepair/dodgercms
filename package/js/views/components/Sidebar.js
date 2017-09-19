'use strict';

module.exports = {
    view: function(vnode) {
        return m("div", { id: "sidebar-wrapper" },
            m("div", {class: "leftNav"},
                vnode.attrs.items
            )
        );
    }
};

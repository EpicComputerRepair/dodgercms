'use strict';

module.exports = {
    view: function(vnode) {
        return m("div", { class: "alert alert-danger alert-dismissible", style: { display: vnode.attrs.hasError ? "block" : "none" } }, [
            m("button", { class: "close", onclick: vnode.attrs.resetError }, [
                m("i", { class: "fa fa-times" })
            ]),
            m("i", { class: "fa fa-lg fa-ban", style: { 'margin-right': "5px" } }),
            m("b", vnode.attrs.error)
        ]);
    }
};
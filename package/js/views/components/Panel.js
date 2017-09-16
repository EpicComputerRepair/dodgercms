'use strict';

const Table = require("./Table");

module.exports = {
    view: function view(vnode) {
        return m("div", { class: "panel panel-" + vnode.attrs.type + ((vnode.attrs.dismiss) ? " panel-dismissible" : "") + ((vnode.attrs.size !== "") ? " "+vnode.attrs.size : ""), style: {padding: "0px"} }, [
            (vnode.attrs.dismiss) ? m("button", { class: "close", 'data-dismiss': "panel" }, m("i", { class: "fa fa-times" })) : "",
            (vnode.attrs.title !== "") ? m("div", { class: "panel-heading" }, [
                m("h3", { style: {margin: "0px"} },
                    vnode.attrs.titleIcon !== "" ? m("i", {class: vnode.attrs.titleIcon+" margin-right"}) : "",
                    vnode.attrs.title
                )
            ]) : "",
            (vnode.attrs.body !== "") ? m("div", { class: "panel-body" }, vnode.attrs.body) : "",
            (vnode.attrs.table !== "") ? m(Table, vnode.attrs.table) : ""
        ]);
    }
};

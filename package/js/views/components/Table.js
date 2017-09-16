'use strict';

module.exports = {
    view: function view(vnode) {
        return m("table", {class: "table table-hover"}, [
            vnode.attrs.headers ? m("thead", [
                m("tr", vnode.attrs.headers.map(function createHeaders(header){
                    return m("th", header);
                }))
            ]) : "",
            vnode.attrs.rows ? m("tbody", [
                vnode.attrs.rows.map(function createRows(row){
                    return m("tr", row.columns.map(function createColumn(column){
                        return m("td", column);
                    }));
                })
            ]) : ""
        ]);
    }
};

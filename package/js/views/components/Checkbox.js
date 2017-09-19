'use strict';

module.exports = {
    view: function(vnode) {
        return m("div", { class: "form-group" }, vnode.attrs.checkboxes.map(function createCheckbox(checkbox){
            return m("div", { class: checkbox.class ? checkbox.class : "" }, [
                m("div", { class: "checkbox" }, [
                    m("label", m("input", { type: "checkbox", checked: checkbox.checked, onchange: m.withAttr("checked", checkbox.update) }), checkbox.text)
                ])
            ]);
        }));
    }
};
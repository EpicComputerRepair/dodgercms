'use strict';

module.exports = {
    view: function() {
        return m("div", {class: "user-panel"}, [
            m("div", {class: "info"}, [
                m("h1", {class: "logo"}, "Epic CMS")
            ])
        ]);
    }
};

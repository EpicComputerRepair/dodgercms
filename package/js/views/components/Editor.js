'use strict';

let codeMirror = null;
let text = "", mode = "";


marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

function getCodeMirror(element,newText){
    if(codeMirror === null) {
        codeMirror = new CodeMirror(element, {
            value: newText,
            mode: mode,
            lineNumbers: true,
            styleActiveLine: true,
            readOnly: false
        });
        codeMirror.setOption("theme", "mdn-like");
        codeMirror.on("change", function(codeMirror) {
            text = codeMirror.getValue();
            m.redraw();
        });
    }
    return codeMirror;
}

module.exports = {
    setText: function (newText) {
        text = newText;
        if(codeMirror !== null) {
            codeMirror.setValue(text);
        }
    },
    setMode: function (newMode) {
        mode = newMode;
        if(codeMirror !== null) {
            codeMirror.setOption("mode", mode);
        }
    },
    setTextAtMouse: function (text) {
        if(codeMirror !== null) {
            let doc = codeMirror.getDoc();
            doc.replaceRange(text, doc.getCursor());
        }
    },
    view: function view(vnode) {
        let viewText = vnode.attrs.text ? vnode.attrs.text : text;
        if(vnode.attrs.mode){
            this.setMode(vnode.attrs.mode);
        }
        if(vnode.attrs.visible) {
            return [
                m("div", {
                    id: "codeView", oncreate: function () {
                        getCodeMirror(document.getElementById("codeView"), viewText);
                    }
                }),
                m("div", m.trust(mode === "gfm" ? marked(viewText) : viewText))
            ];
        }
        return "";
    }
};
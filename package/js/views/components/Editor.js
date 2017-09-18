'use strict';

let codeMirror = null;
let text = "", mode = "", setLastText = "";


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

let redrawTemplate = _.debounce(function (){
    m.redraw();
}, 1000);

function getCodeMirror(element,newText){
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
        if(codeMirror.getOption("mode") === "htmlmixed"){
            redrawTemplate();
        }else{
            m.redraw();
        }
    });
    return codeMirror;
}

Handlebars.registerHelper('selected', function(option, value) {
    return (option === value) ? ' selected="selected"' : '';
});

// Helper to prevent blocks of template code from getting rendered
Handlebars.registerHelper('raw-helper', function(options) {
    return options.fn();
});

module.exports = {
    setText: function (newText,ignore) {
        if(setLastText !== newText) {
            setLastText = newText;
            text = newText;
            if (codeMirror !== null && !ignore) {
                codeMirror.setValue(text);
            }
        }
    },
    getText: function () {
        return text;
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
        if(vnode.attrs.text){
            this.setText(vnode.attrs.text,true);
        }
        if(vnode.attrs.mode){
            this.setMode(vnode.attrs.mode);
        }
        let display = "";
        if(mode === "gfm"){
            display = m.trust(marked(text));
        }else{
            let content = Handlebars.compile(text)({
                key: "Key",
                title: "Title Here",
                modified: new Date().toLocaleString(),
                body: "Content Here",
                endpoint: localStorage.getItem('epiccms-site-endpoint'),
                dataKey: '.epiccms/data.json'
            });
            //Doesn't work well with content change
            //display = m("iframe", {style: {width: "100%", height: "100%", border: "none"}, src: "data:text/html;charset=utf-8," + encodeURI(content)});
            display = m.trust("<iframe style=\"width: 100%; height: 100%; border: none\" src=\"data:text/html;charset=utf-8,"+encodeURI(content)+"\"></iframe>");
        }
        return [
            m("div", {
                id: "codeView", oncreate: function () {
                    getCodeMirror(document.getElementById("codeView"), text);
                }
            }),
            m("div", mode !== "gfm" ? {style: {height: "800px"}} : {}, display)
        ];
    }
};
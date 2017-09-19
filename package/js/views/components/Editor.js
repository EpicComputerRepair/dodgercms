'use strict';

let codeMirror = null;
let text = "", mode = "", setLastText = "", textFunction = null;


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
        if(textFunction !== null){
            textFunction(text);
        }
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

function updateIframe(content){
    let iframe = document.getElementById('preview');

    let iframedoc = iframe.document;
    if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
    }else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
    }

    if (iframedoc){
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(content);
        iframedoc.close();
    }
}

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
    setOnchange: function (txtFunction) {
        textFunction = txtFunction;
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
                title: vnode.attrs.templateTitle ? vnode.attrs.templateTitle : "Title Here",
                modified: new Date().toLocaleString(),
                body: vnode.attrs.templateText ? marked(vnode.attrs.templateText) : "Content Here",
                endpoint: localStorage.getItem('epiccms-site-endpoint'),
                dataKey: '.epiccms/data.json'
            });
            display = m("iframe", {id: "preview", src: "about:blank", style: {width: "100%", height: "100%", border: "none"}, oncreate: function(){updateIframe(content);}, onupdate: function(){updateIframe(content);}});
            //display = m.trust("<iframe style=\"width: 100%; height: 100%; border: none\" src=\"data:text/html;charset=utf-8,"+encodeURI(content)+"\"></iframe>");
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
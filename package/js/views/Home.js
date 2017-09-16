'use strict';

const Editor = require("./components/Editor");

module.exports = {
    view: function() {
        return [
            m("div", {class: "well"}, [
                m(Editor),
                m("h3", "Flowchart support"),
                m("p", m("i","TODO implement into markdown")),
                m("div", {id: "diagram", oncreate: function (){
                    var diagram = flowchart.parse("st=>start: Start:>http://www.google.com[blank]\n" +
                        "e=>end:>http://www.google.com\n" +
                        "op1=>operation: My Operation\n" +
                        "sub1=>subroutine: My Subroutine\n" +
                        "cond=>condition: Yes\n" +
                        "or No?:>http://www.google.com\n" +
                        "io=>inputoutput: catch something...\n" +
                        "\n" +
                        "st->op1->cond\n" +
                        "cond(yes)->io->e\n" +
                        "cond(no)->sub1(right)->op1");
                    diagram.drawSVG('diagram');
                }}),
                m("h3", "Math Equations support"),
                m("p", m("i","TODO implement into markdown")),
                m("div", m.trust(katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}")))/*,
                TODO: Figure out how to fix
                m("div", {id: "diagram2", oncreate: function(){
                    var d = Diagram.parse("A->B: Does something");
                    var options = {theme: 'hand'};
                    d.drawSVG('diagram2', options);
                }})
                */
            ]),
            "Welcome Info Here"
        ];
    }
};
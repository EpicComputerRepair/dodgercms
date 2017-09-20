'use strict';

const Editor = require("./components/Editor");

var sampleText = "Live Epic CMS Markdown Editor\n" +
    "========================\n" +
    "![Epic](https://media.giphy.com/media/b09xElu8in7Lq/giphy.gif)  \n" +
    "Everything from markdown plus GFM features\n" +
    "\n" +
    "Getting the Gist of Markdown's Formatting Syntax\n" +
    "------------------------------------------------\n" +
    "\n" +
    "This page offers a brief overview of what it's like to use Markdown.\n" +
    "Markdown should be very easy to pick up simply by\n" +
    "looking at a few examples of it in action. The examples on this page\n" +
    "are written in a before/after style, showing example syntax and the\n" +
    "HTML output produced by Markdown.\n" +
    "\n" +
    "**Note:** This document is itself written using Markdown; you can edit above and see the changes immediately.\n" +
    "\n" +
    "## Paragraphs, Headers, Blockquotes ##\n" +
    "\n" +
    "A paragraph is simply one or more consecutive lines of text, separated\n" +
    "by one or more blank lines. (A blank line is any line that looks like\n" +
    "a blank line -- a line containing nothing but spaces or tabs is\n" +
    "considered blank.) Normal paragraphs should not be indented with\n" +
    "spaces or tabs.\n" +
    "\n" +
    "Markdown offers two styles of headers: *Setext* and *atx*.\n" +
    "Setext-style headers for `<h1>` and `<h2>` are created by\n" +
    "\"underlining\" with equal signs (`=`) and hyphens (`-`), respectively.\n" +
    "To create an atx-style header, you put 1-6 hash marks (`#`) at the\n" +
    "beginning of the line -- the number of hashes equals the resulting\n" +
    "HTML header level.\n" +
    "\n" +
    "Blockquotes are indicated using email-style '`>`' angle brackets.\n" +
    "\n" +
    "Markdown:\n" +
    "\n" +
    "    A First Level Header\n" +
    "    ====================\n" +
    "\n" +
    "    A Second Level Header\n" +
    "    ---------------------\n" +
    "\n" +
    "    Now is the time for all good men to come to\n" +
    "    the aid of their country. This is just a\n" +
    "    regular paragraph.\n" +
    "\n" +
    "    The quick brown fox jumped over the lazy\n" +
    "    dog's back.\n" +
    "\n" +
    "    ### Header 3\n" +
    "\n" +
    "    > This is a blockquote.\n" +
    "    >\n" +
    "    > This is the second paragraph in the blockquote.\n" +
    "    >\n" +
    "    > ## This is an H2 in a blockquote\n" +
    "\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <h1>A First Level Header</h1>\n" +
    "\n" +
    "    <h2>A Second Level Header</h2>\n" +
    "\n" +
    "    <p>Now is the time for all good men to come to\n" +
    "    the aid of their country. This is just a\n" +
    "    regular paragraph.</p>\n" +
    "\n" +
    "    <p>The quick brown fox jumped over the lazy\n" +
    "    dog's back.</p>\n" +
    "\n" +
    "    <h3>Header 3</h3>\n" +
    "\n" +
    "    <blockquote>\n" +
    "        <p>This is a blockquote.</p>\n" +
    "\n" +
    "        <p>This is the second paragraph in the blockquote.</p>\n" +
    "\n" +
    "        <h2>This is an H2 in a blockquote</h2>\n" +
    "    </blockquote>\n" +
    "\n" +
    "\n" +
    "\n" +
    "### Phrase Emphasis ###\n" +
    "\n" +
    "Markdown uses asterisks and underscores to indicate spans of emphasis.\n" +
    "\n" +
    "Markdown:\n" +
    "\n" +
    "    Some of these words *are emphasized*.\n" +
    "    Some of these words _are emphasized also_.\n" +
    "\n" +
    "    Use two asterisks for **strong emphasis**.\n" +
    "    Or, if you prefer, __use two underscores instead__.\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>Some of these words <em>are emphasized</em>.\n" +
    "    Some of these words <em>are emphasized also</em>.</p>\n" +
    "\n" +
    "    <p>Use two asterisks for <strong>strong emphasis</strong>.\n" +
    "    Or, if you prefer, <strong>use two underscores instead</strong>.</p>\n" +
    "\n" +
    "\n" +
    "\n" +
    "## Lists ##\n" +
    "\n" +
    "Unordered (bulleted) lists use asterisks, pluses, and hyphens (`*`,\n" +
    "`+`, and `-`) as list markers. These three markers are\n" +
    "interchangable; this:\n" +
    "\n" +
    "    *   Candy.\n" +
    "    *   Gum.\n" +
    "    *   Booze.\n" +
    "\n" +
    "this:\n" +
    "\n" +
    "    +   Candy.\n" +
    "    +   Gum.\n" +
    "    +   Booze.\n" +
    "\n" +
    "and this:\n" +
    "\n" +
    "    -   Candy.\n" +
    "    -   Gum.\n" +
    "    -   Booze.\n" +
    "\n" +
    "all produce the same output:\n" +
    "\n" +
    "    <ul>\n" +
    "    <li>Candy.</li>\n" +
    "    <li>Gum.</li>\n" +
    "    <li>Booze.</li>\n" +
    "    </ul>\n" +
    "\n" +
    "Ordered (numbered) lists use regular numbers, followed by periods, as\n" +
    "list markers:\n" +
    "\n" +
    "    1.  Red\n" +
    "    2.  Green\n" +
    "    3.  Blue\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <ol>\n" +
    "    <li>Red</li>\n" +
    "    <li>Green</li>\n" +
    "    <li>Blue</li>\n" +
    "    </ol>\n" +
    "\n" +
    "If you put blank lines between items, you'll get `<p>` tags for the\n" +
    "list item text. You can create multi-paragraph list items by indenting\n" +
    "the paragraphs by 4 spaces or 1 tab:\n" +
    "\n" +
    "    *   A list item.\n" +
    "\n" +
    "        With multiple paragraphs.\n" +
    "\n" +
    "    *   Another item in the list.\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <ul>\n" +
    "    <li><p>A list item.</p>\n" +
    "    <p>With multiple paragraphs.</p></li>\n" +
    "    <li><p>Another item in the list.</p></li>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "\n" +
    "### Links ###\n" +
    "\n" +
    "Markdown supports two styles for creating links: *inline* and\n" +
    "*reference*. With both styles, you use square brackets to delimit the\n" +
    "text you want to turn into a link.\n" +
    "\n" +
    "Inline-style links use parentheses immediately after the link text.\n" +
    "For example:\n" +
    "\n" +
    "    This is an [example link](http://example.com/).\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>This is an <a href=\"http://example.com/\">\n" +
    "    example link</a>.</p>\n" +
    "\n" +
    "Optionally, you may include a title attribute in the parentheses:\n" +
    "\n" +
    "    This is an [example link](http://example.com/ \"With a Title\").\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>This is an <a href=\"http://example.com/\" title=\"With a Title\">\n" +
    "    example link</a>.</p>\n" +
    "\n" +
    "Reference-style links allow you to refer to your links by names, which\n" +
    "you define elsewhere in your document:\n" +
    "\n" +
    "    I get 10 times more traffic from [Google][1] than from\n" +
    "    [Yahoo][2] or [MSN][3].\n" +
    "\n" +
    "    [1]: http://google.com/        \"Google\"\n" +
    "    [2]: http://search.yahoo.com/  \"Yahoo Search\"\n" +
    "    [3]: http://search.msn.com/    \"MSN Search\"\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>I get 10 times more traffic from <a href=\"http://google.com/\"\n" +
    "    title=\"Google\">Google</a> than from <a href=\"http://search.yahoo.com/\"\n" +
    "    title=\"Yahoo Search\">Yahoo</a> or <a href=\"http://search.msn.com/\"\n" +
    "    title=\"MSN Search\">MSN</a>.</p>\n" +
    "\n" +
    "The title attribute is optional. Link names may contain letters,\n" +
    "numbers and spaces, but are *not* case sensitive:\n" +
    "\n" +
    "    I start my morning with a cup of coffee and\n" +
    "    [The New York Times][NY Times].\n" +
    "\n" +
    "    [ny times]: http://www.nytimes.com/\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>I start my morning with a cup of coffee and\n" +
    "    <a href=\"http://www.nytimes.com/\">The New York Times</a>.</p>\n" +
    "\n" +
    "\n" +
    "### Images ###\n" +
    "\n" +
    "Image syntax is very much like link syntax.\n" +
    "\n" +
    "Inline (titles are optional):\n" +
    "\n" +
    "    ![alt text](/path/to/img.jpg \"Title\")\n" +
    "\n" +
    "Reference-style:\n" +
    "\n" +
    "    ![alt text][id]\n" +
    "\n" +
    "    [id]: /path/to/img.jpg \"Title\"\n" +
    "\n" +
    "Both of the above examples produce the same output:\n" +
    "\n" +
    "    <img src=\"/path/to/img.jpg\" alt=\"alt text\" title=\"Title\" />\n" +
    "\n" +
    "\n" +
    "\n" +
    "### Code ###\n" +
    "\n" +
    "In a regular paragraph, you can create code span by wrapping text in\n" +
    "backtick quotes. Any ampersands (`&`) and angle brackets (`<` or\n" +
    "`>`) will automatically be translated into HTML entities. This makes\n" +
    "it easy to use Markdown to write about HTML example code:\n" +
    "\n" +
    "    I strongly recommend against using any `<blink>` tags.\n" +
    "\n" +
    "    I wish SmartyPants used named entities like `&mdash;`\n" +
    "    instead of decimal-encoded entites like `&#8212;`.\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>I strongly recommend against using any\n" +
    "    <code>&lt;blink&gt;</code> tags.</p>\n" +
    "\n" +
    "    <p>I wish SmartyPants used named entities like\n" +
    "    <code>&amp;mdash;</code> instead of decimal-encoded\n" +
    "    entites like <code>&amp;#8212;</code>.</p>\n" +
    "\n" +
    "\n" +
    "To specify an entire block of pre-formatted code, indent every line of\n" +
    "the block by 4 spaces or 1 tab. Just like with code spans, `&`, `<`,\n" +
    "and `>` characters will be escaped automatically.\n" +
    "\n" +
    "Markdown:\n" +
    "\n" +
    "    If you want your page to validate under XHTML 1.0 Strict,\n" +
    "    you've got to put paragraph tags in your blockquotes:\n" +
    "\n" +
    "        <blockquote>\n" +
    "            <p>For example.</p>\n" +
    "        </blockquote>\n" +
    "\n" +
    "Output:\n" +
    "\n" +
    "    <p>If you want your page to validate under XHTML 1.0 Strict,\n" +
    "    you've got to put paragraph tags in your blockquotes:</p>\n" +
    "\n" +
    "    <pre><code>&lt;blockquote&gt;\n" +
    "        &lt;p&gt;For example.&lt;/p&gt;\n" +
    "    &lt;/blockquote&gt;\n" +
    "    </code></pre>\n" +
    "\n" +
    "## URL autolinking\n" +
    "\n" +
    "Underscores_are_allowed_between_words.\n" +
    "\n" +
    "## Strikethrough text\n" +
    "\n" +
    "GFM adds syntax to strikethrough text, which is missing from standard Markdown.\n" +
    "\n" +
    "~~Mistaken text.~~\n" +
    "~~**works with other formatting**~~\n" +
    "\n" +
    "~~spans across\n" +
    "lines~~\n" +
    "\n" +
    "## Fenced code blocks (and syntax highlighting)\n" +
    "\n" +
    "```javascript\n" +
    "for (var i = 0; i < items.length; i++) {\n" +
    "    console.log(items[i], i); // log them\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "## Task Lists\n" +
    "\n" +
    "- [ ] Incomplete task list item\n" +
    "- [x] **Completed** task list item\n" +
    "\n" +
    "## A bit of GitHub spice\n" +
    "\n" +
    "See http://github.github.com/github-flavored-markdown/.\n" +
    "\n" +
    "(Set `gitHubSpice: false` in mode options to disable):\n" +
    "\n" +
    "* SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2\n" +
    "* User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2\n" +
    "* User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2\n" +
    "* \\#Num: #1\n" +
    "* User/#Num: mojombo#1\n" +
    "* User/Project#Num: mojombo/god#1\n" +
    "\n" +
    "(Set `emoji: false` in mode options to disable):\n" +
    "\n" +
    "* emoji: :smile:\n" +
    "\n" +
    "\n";

module.exports = {
    setSampleText: function (text) {
        sampleText = text;
    },
    getSampleText: function () {
        return sampleText;
    },
    view: function() {
        Editor.setOnchange(this.setSampleText);
        return [
            m("div", {class: "well"}, [
                m("div", {class: "alert alert-info"}, [
                    m("i", {class: "fa fa-fw fa-info margin-right"}),
                    "Learn more about ",
                    m("a", {href: "https://en.wikipedia.org/wiki/Markdown"}, "markdown")
                ]),
                m(Editor, {text: sampleText, mode: "gfm"}),
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
            ])
        ];
    }
};
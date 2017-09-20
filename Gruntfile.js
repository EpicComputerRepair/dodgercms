const webpackConfig = require('./webpack.config');
const MinifyPlugin = require("babel-minify-webpack-plugin");


module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    const awsOptions = {
        accessKeyId: process.env.keydev ? process.env.keydev : '<%= aws.key %>',
        secretAccessKey: process.env.secretdev ? process.env.secretdev : '<%= aws.secret %>',
        bucket: process.env.bucketdev ? process.env.bucketdev : '<%= aws.bucket %>',
        region: process.env.regiondev ? process.env.regiondev : '<%= aws.region %>',
        access: 'public-read',
        params:{
            ContentEncoding: "gzip",
            CacheControl: "public, max-age=3600, must-revalidate",
            Expires: new Date(Date.now() + 3600)
        }
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: grunt.file.readJSON('grunt-aws.json'),
        webpack: {
            options: {
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            },
            prod: function(){
                webpackConfig.devtool = "source-map";
                webpackConfig.plugins = [
                    new MinifyPlugin({},{
                        comments: false
                    })
                ];
                return webpackConfig;
            },
            dev: Object.assign({watch: true}, webpackConfig),
            build: webpackConfig
        },
        base64Less: {
            fonts: {
                prefix: "font-",
                process: ['package/fonts/*', 'bowerBuild/fonts/*'],
                dest: 'package/less/fonts.less'
            },
            img: {
                prefix: "img-",
                process: ["package/img/*"],
                dest: 'package/less/img.less',
                dimensions: true
            },
            icons: {
                prefix: "icons-",
                process: ['bowerBuild/icons/*'],
                dest: 'package/less/icons.less'
            }
        },
        groc: {
            javascript: [
                "package/js/**/*.js", "README.md"
            ],
            options: {
                "out": "build/doc/"
            }
        },
        mkdir: {
            all: {
                options: {
                    mode: 0700,
                    create: ['bowerBuild', 'build', 'build/js', 'bowerBuild/jsCompiled']
                }
            }
        },
        uglify: {
            options: {
                mangle: {
                    reserved: ['jQuery', '$', 'AWS', 'async', 'Choices', 'm', "marked", "CodeMirror", "Diagram", "katex", "flowchart", "_", "InspireTreeDOM", "InspireTree", "Raven"]
                }
            },
            depends: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/js/depends.js.map'
                },
                files: {
                    'build/js/depends.js': ['bowerBuild/js/base/base/*.js','bowerBuild/js/base/*.js','bowerBuild/js/*.js']
                }
            }
        },
        htmlmin: {                                     // Task
            dev: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    collapseBooleanAttributes: true,
                    minifyCSS: true,
                    minifyJS: true
                },
                files: {                                   // Dictionary of files
                    'build/index.html': 'package/index.html',     // 'destination': 'source'
                    'build/404.html': 'package/404.html'
                }
            }
        },
        download: {
            htmlmin: {
                src: ['https://raw.githubusercontent.com/kangax/html-minifier/gh-pages/dist/htmlminifier.min.js'],
                dest: './bowerBuild/js/'
            }
        },
        aws_s3: {
            options: awsOptions,
            dev: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/js/depends.js',
                        dest: 'js/depends.js'
                    },{
                        src: 'dist/js/depends.js.map',
                        dest: 'js/depends.js.map'
                    },{
                        src: 'dist/robots.txt',
                        dest: 'robots.txt'
                    },{
                        src: 'dist/index.html',
                        dest: 'index.html'
                    },{
                        src: 'dist/404.html',
                        dest: '404.html'
                    },{
                        src: 'dist/favicon.png',
                        dest: 'favicon.png'
                    },{
                        src: 'dist/js/index.js',
                        dest: 'js/index.js'
                    },{
                        src: 'dist/js/index.js.map',
                        dest: 'js/index.js.map'
                    },{
                        src: 'dist/css/index.css',
                        dest: 'css/index.css'
                    },{
                        src: 'dist/css/index.css.map',
                        dest: 'css/index.css.map'
                    }
                ]
            },
            depends: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/js/depends.js',
                        dest: 'js/depends.js'
                    }
                ]
            },
            js: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/js/index.js',
                        dest: 'js/index.js'
                    }
                ]
            },
            css: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/css/index.css',
                        dest: 'css/index.css'
                    }
                ]
            },
            html: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/index.html',
                        dest: 'index.html'
                    },{
                        src: 'dist/404.html',
                        dest: '404.html'
                    }
                ]
            },
            robots: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/robots.txt',
                        dest: 'robots.txt'
                    }
                ]
            },
            icon: {
                // These options override the defaults
                options: {
                    maxOperations: 20
                },
                // Files to be uploaded.
                files: [
                    {
                        src: 'dist/favicon.png',
                        dest: 'favicon.png'
                    }
                ]
            }
        },
        clean: {
            git: ["bowerBuild", "bower_components", "build", "dist", "node_modules", "packages", "*.lock"],
            dev: ["build", "dist"],
            dist: ["build", "dist", "bowerBuild"],
            bowerBuildUnneeded: [
                "bowerBuild/css/font-awesome.css",
                "bowerBuild/css/bootstrap.css",
                "bowerBuild/css/choices.css",
                "bowerBuild/css/katex.css",
                "bowerBuild/less/bootstrap.less",
                "bowerBuild/font-awesome.scss",
                "bowerBuild/js/mithriljs.js",
                'bowerBuild/js/snap.svg.js',
                "bowerBuild/js/lodash.js",
                "bowerBuild/js/eve-raphael.js",
                "bowerBuild/js/raphael.js",
                "bowerBuild/js/codemirror.js",
                "bowerBuild/js/bower-webfontloader.js",
                "bowerBuild/js/js-sequence-diagrams.js"
            ]
        },
        concat: {
            bowerUncompiled: {
                src: ['bowerBuild/js/*/*/*.js', 'bowerBuild/js/*/*.js', 'bowerBuild/js/*.js'],
                dest: 'build/js/depends.js'
            },
            css: {
                src: ['bowerBuild/css/*.css', 'build/css/index.css'],
                dest: 'build/css/index.css'
            },
            debug: {
                src: ['package/index.html'],
                dest: 'build/index.html'
            },
            choices: {
                src: ['bowerBuild/css/choices.css'],
                dest: 'bowerBuild/less/choices.less'
            },
            katex: {
                src: ['bowerBuild/css/katex.css'],
                dest: 'bowerBuild/less/katex.less'
            },
            fontloader: {
                src: ['bowerBuild/js/bower-webfontloader.js'],
                dest: 'bowerBuild/js/base/bower-webfontloader.js'
            },
            snap: {
                src: ['bowerBuild/js/snap.svg.js'],
                dest: 'bowerBuild/js/base/snap.svg.js'
            },
            codeMirror: {
                src: ['bowerBuild/js/codemirror.js'],
                dest: 'bowerBuild/js/base/base/codemirror.js'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'bower_components/font-awesome/fonts/', src: ['**'], dest: 'bowerBuild/fonts/'},
                    {expand: true, cwd: 'bower_components/bootstrap/fonts/', src: ['**'], dest: 'bowerBuild/fonts/'},
                    {expand: true, cwd: 'bower_components/choices.js/assets/icons/', src: ['**'], dest: 'bowerBuild/icons/'},
                    {expand: true, cwd: 'node_modules/inspire-tree/dist', src: ['inspire-tree.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'node_modules/inspire-tree-dom/dist', src: ['inspire-tree-dom.js'], dest: 'bowerBuild/js/'},
                    {expand: true, cwd: 'node_modules/inspire-tree-dom/dist', src: ['inspire-tree-light.css'], dest: 'bowerBuild/css/'},
                    {expand: true, cwd: 'bowerBuild/js', src: ['lodash.js'], dest: 'bowerBuild/js/base/base'},
                    {expand: true, cwd: 'bowerBuild/js', src: ['eve-raphael.js'], dest: 'bowerBuild/js/base/base'},
                    {expand: true, cwd: 'bowerBuild/js', src: ['raphael.js'], dest: 'bowerBuild/js/base/base'},
                    {expand: true, cwd: 'bower_components/katex/dist/fonts', src: ['*.eot',"*.ttf","*.woff","*.woff2"], dest: 'bowerBuild/fonts/'},
                    {expand: true, cwd: 'bower_components/js-sequence-diagrams/dist', src: ['sequence-diagram-snap.js'], dest: 'bowerBuild/js/'},
                    {expand: true, cwd: 'bower_components/codemirror/theme', src: ['mdn-like.css'], dest: 'bowerBuild/css/'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/markdown', src: ['markdown.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/xml', src: ['xml.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/javascript', src: ['javascript.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/css', src: ['css.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/addon/mode', src: ['overlay.js','simple.js','multiplex.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/gfm', src: ['gfm.js'], dest: 'bowerBuild/js'},
                    {expand: true, cwd: 'bowerBuild/js', src: ['handlebars.js'], dest: 'bowerBuild/js/base'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/handlebars', src: ['handlebars.js'], dest: 'bowerBuild/js'},
                    {expand: true, cwd: 'bower_components/codemirror/mode/htmlmixed', src: ['htmlmixed.js'], dest: 'bowerBuild/js'},
                    {expand: true, cwd: 'bower_components/handlebars', src: ['handlebars.runtime.js'], dest: 'bowerBuild/js/base/base'},
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/less/',
                        src: ['**'],
                        dest: 'bowerBuild/less/bootstrap'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/less/',
                        src: ['**'],
                        dest: 'bowerBuild/less/font-awesome'
                    }
                ]
            },
            mithril: {
                files: [
                    {expand: true, cwd: 'bower_components/mithriljs', src: ['mithril.js'], dest: 'bowerBuild/js'}
                ]
            },
            site: {
                files: [
                    {
                        expand: true,
                        cwd: 'package/',
                        src: ['index.html', '404.html', 'robots.txt', 'favicon.png'],
                        dest: 'build/'
                    }
                ]
            },
            html: {
                files: [
                    {expand: true, cwd: 'package/', src: ['index.html', '404.html'], dest: 'build/'}
                ]
            },
            robots: {
                files: [
                    {expand: true, cwd: 'package/', src: ['robots.txt'], dest: 'build/'}
                ]
            },
            icon: {
                files: [
                    {expand: true, cwd: 'package/', src: ['favicon.png'], dest: 'build/'}
                ]
            }
        },
        bower: {
            dev: {
                dest: 'bowerBuild/',
                js_dest: 'bowerBuild/js',
                css_dest: 'bowerBuild/css',
                oft_dest: 'bowerBuild/fonts',
                svg_dest: 'bowerBuild/fonts',
                wo_dest: 'bowerBuild/fonts',
                eot_dest: 'bowerBuild/fonts',
                ttf_dest: 'bowerBuild/fonts',
                woff_dest: 'bowerBuild/fonts',
                less_dest: 'bowerBuild/less'
            }
        },
        less: {
            development: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "build/css/index.css": "package/less/style.less"
                }
            }
        },
        purifycss: {
            options: {
                whitelist: ["*choices*", "*inspire-tree*", "*itree*", "*katex*", "*CodeMirror*", "*cm-*"]
            },
            target: {
                src: ['package/js/**/*.js'],
                css: ['build/css/*.css'],
                dest: 'build/css/index.css'
            }
        },
        cssmin: {
            options: {
                sourceMap: true,
                level: {
                    1: {
                        all: true,
                        specialComments: 0
                    },
                    2: {
                        all: false,
                        mergeAdjacentRules: true, // controls adjacent rules merging; defaults to true
                        mergeIntoShorthands: true, // controls merging properties into shorthands; defaults to true
                        mergeMedia: true, // controls `@media` merging; defaults to true
                        mergeNonAdjacentRules: true, // controls non-adjacent rule merging; defaults to true
                        mergeSemantically: false, // controls semantic merging; defaults to false
                        overrideProperties: true, // controls property overriding based on understandability; defaults to true
                        removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`
                        reduceNonAdjacentRules: true, // controls non-adjacent rule reducing; defaults to true
                        removeDuplicateFontRules: true, // controls duplicate `@font-face` removing; defaults to true
                        removeDuplicateMediaBlocks: true, // controls duplicate `@media` removing; defaults to true
                        removeDuplicateRules: true, // controls duplicate rules removing; defaults to true
                        removeUnusedAtRules: true, // controls unused at rule removing; defaults to false (available since 4.1.0)
                        restructureRules: true // controls rule restructuring; defaults to false
                    }
                }
            },
            target: {
                files: {
                    'build/css/index.css': ['build/css/index.css']
                }
            },
            dev: {
                options: {
                    sourceMap: false,
                    level: {
                        1: {
                            all: false,
                            specialComments: 0
                        }
                    },
                    format: 'beautify'
                },
                files: {
                    'build/css/index.css': ['build/css/index.css']
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*', '!jsCompiled/*', '!jsCompiled/**/*'],
                dest: 'dist/'
            }
        },
        imagemin: {
            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'package/img/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'build/img'                  // Destination path prefix
                }]
            }
        },
        rename: {
            fixDep: {
                src: 'bowerBuild/js/jquery.js',
                dest: 'bowerBuild/js/base/base/'
            }
        },
        replace: {
            fontAwesomeInline: {
                src: ['bowerBuild/less/font-awesome/path.less'],
                dest: 'bowerBuild/less/font-awesome/path.less',
                replacements: [{
                    from: "'@{fa-font-path}/fontawesome-webfont.eot?v=@{fa-version}'",
                    to: "'@{font-fontawesome-webfont_eot}'"
                }, {
                    from: "'@{fa-font-path}/fontawesome-webfont.eot?#iefix&v=@{fa-version}'",
                    to: "'@{font-fontawesome-webfont_eot}'"
                }, {
                    from: "'@{fa-font-path}/fontawesome-webfont.woff?v=@{fa-version}'",
                    to: "'@{font-fontawesome-webfont_woff}'"
                }, {
                    from: "'@{fa-font-path}/fontawesome-webfont.woff2?v=@{fa-version}'",
                    to: "'@{font-fontawesome-webfont_woff}'"
                }, {
                    from: "'@{fa-font-path}/fontawesome-webfont.ttf?v=@{fa-version}'",
                    to: "'@{font-fontawesome-webfont_ttf}'"
                }, {
                    from: "'@{fa-font-path}/fontawesome-webfont.svg?v=@{fa-version}#fontawesomeregular'",
                    to: "'@{font-fontawesome-webfont_svg}'"
                }, {
                    from: "'@{fa-font-path}/FontAwesome.otf'",
                    to: "'@{font-FontAwesome_otf}'"
                }]
            },
            bootstrapInline: {
                src: ['bowerBuild/less/bootstrap/glyphicons.less'],
                dest: 'bowerBuild/less/bootstrap/glyphicons.less',
                replacements: [{
                    from: "'@{icon-font-path}@{icon-font-name}.eot'",
                    to: "'@{font-glyphicons-halflings-regular_eot}'"
                }, {
                    from: "'@{icon-font-path}@{icon-font-name}.eot?#iefix'",
                    to: "'@{font-fontawesome-webfont_eot}'"
                }, {
                    from: "'@{icon-font-path}@{icon-font-name}.woff'",
                    to: "'@{font-glyphicons-halflings-regular_woff}'"
                }, {
                    from: "'@{icon-font-path}@{icon-font-name}.woff2'",
                    to: "'@{font-glyphicons-halflings-regular_woff2}'"
                }, {
                    from: "'@{icon-font-path}@{icon-font-name}.ttf'",
                    to: "'@{font-glyphicons-halflings-regular_ttf}'"
                }, {
                    from: "'@{icon-font-path}@{icon-font-name}.svg#@{icon-font-svg-id}'",
                    to: "'@{font-glyphicons-halflings-regular_svg}'"
                }]
            },
            choicesInline: {
                src: ['bowerBuild/less/choices.less'],
                dest: 'bowerBuild/less/choices.less',
                replacements: [{
                    from: "\"../../icons/cross-inverse.svg\"",
                    to: "'@{icons-cross-inverse_svg}'"
                }, {
                    from: "\"../../icons/cross.svg\"",
                    to: "'@{icons-cross_svg}'"
                }]
            },
            katexInline: {
                src: ['bowerBuild/less/katex.less'],
                dest: 'bowerBuild/less/katex.less',
                replacements: [{
                    from: "'fonts/KaTeX_AMS-Regular.eot'",
                    to: "'@{font-KaTeX_AMS-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_AMS-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_AMS-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_AMS-Regular.woff2'",
                    to: "'@{font-KaTeX_AMS-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_AMS-Regular.woff'",
                    to: "'@{font-KaTeX_AMS-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_AMS-Regular.ttf'",
                    to: "'@{font-KaTeX_AMS-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Caligraphic-Bold.eot'",
                    to: "'@{font-KaTeX_Caligraphic-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Bold.eot#iefix'",
                    to: "'@{font-KaTeX_Caligraphic-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Bold.woff2'",
                    to: "'@{font-KaTeX_Caligraphic-Bold_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Bold.woff'",
                    to: "'@{font-KaTeX_Caligraphic-Bold_woff}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Bold.ttf'",
                    to: "'@{font-KaTeX_Caligraphic-Bold_ttf}'"
                },{
                    from: "'fonts/KaTeX_Caligraphic-Regular.eot'",
                    to: "'@{font-KaTeX_Caligraphic-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Caligraphic-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Regular.woff2'",
                    to: "'@{font-KaTeX_Caligraphic-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Regular.woff'",
                    to: "'@{font-KaTeX_Caligraphic-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Caligraphic-Regular.ttf'",
                    to: "'@{font-KaTeX_Caligraphic-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Fraktur-Bold.eot'",
                    to: "'@{font-KaTeX_Fraktur-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Bold.eot#iefix'",
                    to: "'@{font-KaTeX_Fraktur-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Bold.woff2'",
                    to: "'@{font-KaTeX_Fraktur-Bold_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Bold.woff'",
                    to: "'@{font-KaTeX_Fraktur-Bold_woff}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Bold.ttf'",
                    to: "'@{font-KaTeX_Fraktur-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Fraktur-Regular.eot'",
                    to: "'@{font-KaTeX_Fraktur-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Fraktur-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Regular.woff2'",
                    to: "'@{font-KaTeX_Fraktur-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Regular.woff'",
                    to: "'@{font-KaTeX_Fraktur-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Fraktur-Regular.ttf'",
                    to: "'@{font-KaTeX_Fraktur-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Main-Bold.eot'",
                    to: "'@{font-KaTeX_Main-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Bold.eot#iefix'",
                    to: "'@{font-KaTeX_Main-Bold_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Bold.woff2'",
                    to: "'@{font-KaTeX_Main-Bold_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Main-Bold.woff'",
                    to: "'@{font-KaTeX_Main-Bold_woff}'"
                }, {
                    from: "'fonts/KaTeX_Main-Bold.ttf'",
                    to: "'@{font-KaTeX_Main-Bold_ttf}'"
                },{
                    from: "'fonts/KaTeX_Main-Italic.eot'",
                    to: "'@{font-KaTeX_Main-Italic_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Italic.eot#iefix'",
                    to: "'@{font-KaTeX_Main-Italic_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Italic.woff2'",
                    to: "'@{font-KaTeX_Main-Italic_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Main-Italic.woff'",
                    to: "'@{font-KaTeX_Main-Italic_woff}'"
                }, {
                    from: "'fonts/KaTeX_Main-Italic.ttf'",
                    to: "'@{font-KaTeX_Main-Italic_ttf}'"
                },{
                    from: "'fonts/KaTeX_Main-Regular.eot'",
                    to: "'@{font-KaTeX_Main-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Main-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Main-Regular.woff2'",
                    to: "'@{font-KaTeX_Main-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Main-Regular.woff'",
                    to: "'@{font-KaTeX_Main-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Main-Regular.ttf'",
                    to: "'@{font-KaTeX_Main-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Math-Italic.eot'",
                    to: "'@{font-KaTeX_Math-Italic_eot}'"
                }, {
                    from: "'fonts/KaTeX_Math-Italic.eot#iefix'",
                    to: "'@{font-KaTeX_Math-Italic_eot}'"
                }, {
                    from: "'fonts/KaTeX_Math-Italic.woff2'",
                    to: "'@{font-KaTeX_Math-Italic_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Math-Italic.woff'",
                    to: "'@{font-KaTeX_Math-Italic_woff}'"
                }, {
                    from: "'fonts/KaTeX_Math-Italic.ttf'",
                    to: "'@{font-KaTeX_Math-Italic_ttf}'"
                },{
                    from: "'fonts/KaTeX_SansSerif-Regular.eot'",
                    to: "'@{font-KaTeX_SansSerif-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_SansSerif-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_SansSerif-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_SansSerif-Regular.woff2'",
                    to: "'@{font-KaTeX_SansSerif-Italic_woff2}'"
                }, {
                    from: "'fonts/KaTeX_SansSerif-Regular.woff'",
                    to: "'@{font-KaTeX_SansSerif-Italic_woff}'"
                }, {
                    from: "'fonts/KaTeX_SansSerif-Regular.ttf'",
                    to: "'@{font-KaTeX_SansSerif-Italic_ttf}'"
                },{
                    from: "'fonts/KaTeX_Script-Regular.eot'",
                    to: "'@{font-KaTeX_Script-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Script-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Script-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Script-Regular.woff2'",
                    to: "'@{font-KaTeX_Script-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Script-Regular.woff'",
                    to: "'@{font-KaTeX_Script-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Script-Regular.ttf'",
                    to: "'@{font-KaTeX_Script-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Size1-Regular.eot'",
                    to: "'@{font-KaTeX_Size1-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size1-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Size1-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size1-Regular.woff2'",
                    to: "'@{font-KaTeX_Size1-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Size1-Regular.woff'",
                    to: "'@{font-KaTeX_Size1-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Size1-Regular.ttf'",
                    to: "'@{font-KaTeX_Size1-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Size2-Regular.eot'",
                    to: "'@{font-KaTeX_Size2-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size2-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Size2-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size2-Regular.woff2'",
                    to: "'@{font-KaTeX_Size2-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Size2-Regular.woff'",
                    to: "'@{font-KaTeX_Size2-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Size2-Regular.ttf'",
                    to: "'@{font-KaTeX_Size2-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Size3-Regular.eot'",
                    to: "'@{font-KaTeX_Size3-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size3-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Size3-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size3-Regular.woff2'",
                    to: "'@{font-KaTeX_Size3-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Size3-Regular.woff'",
                    to: "'@{font-KaTeX_Size3-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Size3-Regular.ttf'",
                    to: "'@{font-KaTeX_Size3-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Size4-Regular.eot'",
                    to: "'@{font-KaTeX_Size4-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size4-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Size4-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Size4-Regular.woff2'",
                    to: "'@{font-KaTeX_Size4-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Size4-Regular.woff'",
                    to: "'@{font-KaTeX_Size4-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Size4-Regular.ttf'",
                    to: "'@{font-KaTeX_Size4-Regular_ttf}'"
                },{
                    from: "'fonts/KaTeX_Typewriter-Regular.eot'",
                    to: "'@{font-KaTeX_Typewriter-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Typewriter-Regular.eot#iefix'",
                    to: "'@{font-KaTeX_Typewriter-Regular_eot}'"
                }, {
                    from: "'fonts/KaTeX_Typewriter-Regular.woff2'",
                    to: "'@{font-KaTeX_Typewriter-Regular_woff2}'"
                }, {
                    from: "'fonts/KaTeX_Typewriter-Regular.woff'",
                    to: "'@{font-KaTeX_Typewriter-Regular_woff}'"
                }, {
                    from: "'fonts/KaTeX_Typewriter-Regular.ttf'",
                    to: "'@{font-KaTeX_Typewriter-Regular_ttf}'"
                }]
            },
            bootstrap1: {
                src: ['bowerBuild/less/bootstrap/variables.less'],
                dest: 'bowerBuild/less/bootstrap/variables.less',
                replacements: [{
                    from: "//## Define colors for form feedback states and, by default, alerts.",
                    to: "//## Define colors for form feedback states and, by default, alerts.\n@state-purple-text:             #743D74;\n@state-purple-bg:               #C266C2;\n@state-purple-border:           darken(spin(@state-purple-bg, -10), 5%);\n@alert-purple-bg:            @state-purple-bg;\n@alert-purple-text:          @state-purple-text;\n@alert-purple-border:        @state-purple-border;\n@brand-purple:          #8A008A;\n@btn-purple-color:              #fff;\n@btn-purple-bg:                 @brand-purple;\n@btn-purple-border:             darken(@btn-purple-bg, 5%);\n@label-purple-bg:            @brand-purple;\n@progress-bar-purple-bg:     @brand-purple;\n"
                }]
            },
            bootstrap2: {
                src: ['bowerBuild/less/bootstrap/alerts.less'],
                dest: 'bowerBuild/less/bootstrap/alerts.less',
                replacements: [{
                    from: "// Generate contextual modifier classes for colorizing the alert.",
                    to: "// Generate contextual modifier classes for colorizing the alert.\n.alert-purple { .alert-variant(@alert-purple-bg; @alert-purple-border; @alert-purple-text); }\n"
                }]
            },
            bootstrap3: {
                src: ['bowerBuild/less/bootstrap/progress-bars.less'],
                dest: 'bowerBuild/less/bootstrap/progress-bars.less',
                replacements: [{
                    from: "// Variations",
                    to: "// Variations\n.progress-bar-purple { .progress-bar-variant(@progress-bar-purple-bg); }\n"
                }]
            },
            bootstrap4: {
                src: ['bowerBuild/less/bootstrap/labels.less'],
                dest: 'bowerBuild/less/bootstrap/labels.less',
                replacements: [{
                    from: "// Contextual variations (linked labels get darker on :hover)",
                    to: "// Contextual variations (linked labels get darker on :hover)\n.label-purple { .label-variant(@label-purple-bg); }\n"
                }]
            }
        }
    });

    // local
    grunt.registerTask('localJS', ['buildDebugJS']);
    grunt.registerTask('localLess', ['buildLessDebug']);
    grunt.registerTask('localHtml', ['buildHtmlDebug']);
    grunt.registerTask('localBower', ['bowerSetup', 'concat:bowerUncompiled']);
    grunt.registerTask('local', ['clean:dist', 'localBower', 'localLess', 'localJS', 'localHtml']);

    grunt.registerTask('default', ['local']);

    grunt.registerTask('cleanBower', ['clean:dist']);
    grunt.registerTask('bowerSetup', ['mkdir', 'bower', 'download:htmlmin', 'copy:main', 'concat:choices', 'concat:katex', 'concat:snap', 'concat:fontloader', 'concat:codeMirror', 'clean:bowerBuildUnneeded', 'copy:mithril', 'replace:fontAwesomeInline', 'replace:bootstrapInline', 'replace:choicesInline', 'replace:katexInline', 'replace:bootstrap1', 'replace:bootstrap2', 'replace:bootstrap3', 'replace:bootstrap4', 'rename:fixDep']);
    grunt.registerTask('bowerBuild', ['bowerSetup','bowerFlattenCompress']);
    grunt.registerTask('bowerFlattenCompress', ['clean:dev', 'uglify:depends', 'compress']);
    grunt.registerTask('bowerDeploy', ['aws_s3:depends']);
    grunt.registerTask('bowerBuildDeploy', ['bowerBuild', 'bowerDeploy']);

    grunt.registerTask('cleanHtml', ['clean:dev']);
    grunt.registerTask("buildHtmlDebug", ['concat:debug']);
    grunt.registerTask('buildHtml', ['htmlmin:dev']);
    grunt.registerTask('deployHtml', ['aws_s3:html']);
    grunt.registerTask('buildDeployHtml', ['cleanHtml', 'buildHtml', 'deployHtml', 'compress']);
    grunt.registerTask("buildDeployHtmlDebug", ['cleanHtml', 'buildHtmlDebug', 'deployHtml', 'compress']);

    grunt.registerTask('buildRobots', ['clean:dev', 'copy:robots', 'compress']);
    grunt.registerTask('deployRobots', ['aws_s3:robots']);
    grunt.registerTask('buildDeployRobots', ['buildRobots', 'deployRobots']);

    grunt.registerTask('buildImg', ['imagemin']);
    grunt.registerTask('buildFonts', ['base64Less:fonts']);
    grunt.registerTask('buildImages', ['base64Less:img','base64Less:icons']);

    grunt.registerTask('buildIcon', ['clean:dev', 'copy:icon', 'compress']);
    grunt.registerTask('deployIcon', ['aws_s3:icon']);
    grunt.registerTask('buildDeployIcon', ['buildIcon', 'deployIcon']);

    grunt.registerTask('cleanLess', ['clean:dev']);
    grunt.registerTask('buildLessDebug', ['buildFonts', 'buildImages', 'less', 'concat:css', 'cssmin:dev']);
    grunt.registerTask('buildLess', ['buildLessDebug', 'cssmin:target']);
    grunt.registerTask('deployLess', ['aws_s3:css']);
    grunt.registerTask('buildDeployLess', ['cleanLess', 'buildLess', 'compress', 'deployLess']);

    grunt.registerTask('cleanDebugJS', ['clean:dev']);
    grunt.registerTask('buildDebugJS', ['webpack:build']);
    grunt.registerTask('buildJS', ['webpack:prod']);
    grunt.registerTask('deployJS', ['aws_s3:js']);
    grunt.registerTask('cleanJS', ['clean:dev']);
    grunt.registerTask('buildDeployJS', ['cleanJS', 'buildJS', 'compress', 'deployJS']);

    grunt.registerTask('build', ['local', 'copy:robots', 'copy:icon', 'compress']);
    grunt.registerTask('buildProd', ['bowerBuild', 'buildLess', 'buildHtml', 'buildJS', 'copy:robots', 'copy:icon', 'compress']);
    grunt.registerTask('git', ['clean:git']);
    grunt.registerTask('deployDev', ['build', 'aws_s3:dev']);
    grunt.registerTask('deployProd', ['buildProd', 'aws_s3:dev']);
};


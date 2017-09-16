'use strict';

const Editor = require("./components/Editor");
const S3 = require("../util/S3");
const View = require("./components/View");
const UserPanel = require("./components/UserPanel");

const CONTENT_TYPE = 'text/plain; charset=UTF-8';
const TEMPLATE_TYPE = 'text/html; charset=UTF-8';

/**
 * Sets up the connection to S3.
 *
 * @param {Object} force Flag to force the regeneration of the s3 object
 */
function s3init(force) {
    var accessKeyId = sessionStorage.getItem('epiccms-token-access-key-id');
    var secretAccessKey = sessionStorage.getItem('epiccms-token-secret-access-key');
    var sessionToken = sessionStorage.getItem('epiccms-token-session-token');
    var region = localStorage.getItem('epiccms-region');

    if (!accessKeyId || !secretAccessKey || !sessionToken || !region) {
        m.route.set("/login");
    }

    // Init the s3 connection
    S3.init(accessKeyId, secretAccessKey, sessionToken, region, force);
}

function getDir(callback){
    var DATA_BUCKET = localStorage.getItem('epiccms-data-bucket');
    // Get all the key objects from the bucket
    S3.listObjects(DATA_BUCKET, function(err, data) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            // Need the meta information for each object
            S3.headObjects(data.Contents, DATA_BUCKET, function (err, data) {

                if(err){
                    callback(err);
                }

                var files = [];
                // Loop through each key object from S3
                for (var i = 0; i < data.length; i+=1) {
                    var object = data[i];
                    var key = object.Key;

                    // Split into folder parts and remove last slash (if exists)
                    var parts = key.replace(/\/\s*$/, '').split('/');
                    for (var j = 0; j < parts.length; j += 1) {
                        object.folder = false;

                        // If the last part in the key has a trailing slash or if the part
                        // is in not the last element it is a path
                        if ((j === parts.length - 1 && key.substr(-1) === '/') || j !== parts.length - 1) {
                            object.folder = true;
                        }
                    }
                    files.push(object);
                }
                callback(false,files);
            });
        }
    });
}

function findAll(path, items) {
    var i = 0, found, result = [];

    for (; i < items.length; i++) {
        if (items[i].path === path) {
            result.push(items[i]);
        } else if (_.isArray(items[i].children)) {
            found = findAll(path, items[i].children);
            if (found.length) {
                result = result.concat(found);
            }
        }
    }

    return result;
}

var viewModel = {
    currentView: "editor",
    editor: {
        text: "",
        originalText: "",
        key: "",
        originalKey: "",
        title: "",
        visible: false,
        setTitle: function (text) {
            viewModel.editor.title = text;
        },
        setKey: function (text) {
            viewModel.editor.key = text;
        }
    },
    siteFiles: null,
    templateFiles: null
};

var imgTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'];
var videoTypes = ['video/x-ms-wmv'];
var docTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword'];
var excelTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel'];
var publisherTypes = ['application/x-mspublisher'];
var powerpointTypes = ["application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-powerpoint"];
var calendarTypes = ["text/calendar"];

function renameTemplate(key, callback) {
    if(key !== viewModel.editor.originalKey){
        // The slug needs to be between 1 and 32 characters
        if (!/^([a-zA-Z0-9-_]){1,32}$/.test(key.substring(key.lastIndexOf("/")+1))) {
            callback(true,'The url slug must be at most 32 characters, and can only contain letters, numbers, dashes, underscores.');
        }

        let dataBucket = localStorage.getItem('epiccms-data-bucket');

        S3.renameObjects(viewModel.editor.originalKey, key, dataBucket, function(err, data1) {
            if (err) {
                callback(true,err);
            } else {
                S3.deleteObjects(key, dataBucket, function(err, data2) {
                    if (err) {
                        callback(true,err);
                    } else {
                        callback(true, null, data1, data2);
                    }
                });
            }
        });
    }else{
        callback(false);
    }
}

function save(key,callback) {
    if(viewModel.editor.text !== viewModel.editor.originalText){
        // Create the new key in s3
        let params = {
            Bucket: localStorage.getItem('epiccms-data-bucket'),
            Key: key,
            Body: viewModel.editor.text,
            ContentEncoding: 'utf-8',
            ContentType:  viewModel.currentView === "editor" ? CONTENT_TYPE : TEMPLATE_TYPE,
            Expires: 0,
            CacheControl: 'public, max-age=0, no-cache',
            Metadata: {
                'title': viewModel.editor.title
            }
        };

        S3.putObject(params, function(err, data) {
            if (err) {
                callback(true,err);
            } else {
                callback(true,null,data);
            }
        });
    }else{
        callback(false);
    }
}

function renameDoc(key, callback) {
    if(key !== viewModel.editor.originalKey){
        // The slug needs to be between 1 and 32 characters
        if (!/^([a-zA-Z0-9-_]){1,32}$/.test(key.substring(key.lastIndexOf("/")+1))) {
            callback(true,'The url slug must be at most 32 characters, and can only contain letters, numbers, dashes, underscores.');
        }
        S3.entry.rename(viewModel.editor.originalKey, key, localStorage.getItem('epiccms-data-bucket'), localStorage.getItem('epiccms-site-bucket'), function(err, data) {
            if (err) {
                callback(true,err);
            } else {
                callback(true,null,data);
            }
        });
    }else{
        callback(false);
    }
}

function filesAndFolders(data) {
    //Create base folders
    var foldersAndFiles = data.map(function (element){
        if(!element.folder) {
            return null;
        }else{
            var path = element.Key.replace(/\/\s*$/, '');
            if(path.indexOf("/") <= -1 && path !== "templates") {
                return {
                    path: path,
                    text: path,
                    children: []
                };
            }else{
                return null;
            }
        }
    }).filter(function (element){
        return element !== null;
    });

    //Add sub folders
    data.sort(function (a,b){
        return a.Key.replace(/\/\s*$/, '').split('/').length - b.Key.replace(/\/\s*$/, '').split('/').length;
    }).map(function (element){
        if(!element.folder) {
            return null;
        }else{
            var path = element.Key.replace(/\/\s*$/, '');
            var parts = path.split('/');
            var folder = parts.slice(0, parts.length-1).join('/');

            var folderObj = findAll(folder,foldersAndFiles);

            if(folderObj.length > 0){
                folderObj[0].children.push({
                    path: path,
                    text: path.substring(path.lastIndexOf("/")+1),
                    children: []
                });
            }
        }
    });

    //Add files
    data.map(function (element){
        if(!element.folder) {

            var path = element.Key.replace(/\/\s*$/, '');
            var parts = path.split('/');
            var folder = parts.slice(0, parts.length-1).join('/');

            var folderObj = findAll(folder,foldersAndFiles);

            if(folderObj.length > 0){
                folderObj[0].children.push({
                    path: path,
                    text: path.substring(path.lastIndexOf("/")+1)
                });
            }else{
                if(path.indexOf("/") > -1){
                    foldersAndFiles.push({
                        path: path,
                        text: path.substring(path.lastIndexOf("/")+1)
                    });
                }else {
                    foldersAndFiles.push({
                        path: path,
                        text: path
                    });
                }
            }
        }
    });

    return foldersAndFiles;
}

function loadTemplate(view,text,path,title){
    viewModel.currentView = view;
    viewModel.editor.visible = true;
    viewModel.editor.text = text;
    viewModel.editor.originalText = text;
    viewModel.editor.key = path;
    viewModel.editor.originalKey = path;
    viewModel.editor.title = title;
    Editor.setMode(view === "template" ? "htmlmixed" : "gfm");
    Editor.setText(text);
    m.redraw();
}


module.exports = {
    view: function() {
        // Setup connection to S3
        s3init(false);
        if(viewModel.siteFiles === null) {
            getDir(function (error, data) {
                if (!error) {
                    viewModel.siteFiles = data;
                    viewModel.templateFiles = viewModel.siteFiles.map(function (element){
                        if(!element.folder) {

                            var path = element.Key.replace(/\/\s*$/, '');
                            var parts = path.split('/');
                            var folder = parts.slice(0, parts.length-1).join('/');

                            if(folder === "templates"){
                                if(path.indexOf("/") > -1){
                                    return {
                                        path: path,
                                        text: path.substring(path.lastIndexOf("/")+1)
                                    };
                                }else {
                                    return {
                                        path: path,
                                        text: path
                                    };
                                }
                            }
                        }
                    }).filter(function (value) {
                        return value !== undefined;
                    });
                    m.redraw();
                } else {
                    console.error(error);
                }
            });
        }
        let context = viewModel.editor;
        return m(View, {
                sidebar: [
                    m(UserPanel),
                    m("h4", "Templates", m("i", {class: "fa fa-fw fa-plus text-success", style: {cursor: "pointer"}, onclick: function () {
                        loadTemplate("template","","templates/","");
                    }})),
                    m("hr"),
                    viewModel.templateFiles && viewModel.templateFiles.length > 0 ? m("div", {id: "templateTree", oncreate: function (){

                        let tree = new InspireTree({
                            data: viewModel.templateFiles
                        });

                        tree.on('node.selected', function (node) {
                            //console.log("Selected Node", node);
                            S3.getObject(node.path, localStorage.getItem('epiccms-data-bucket'), function (err, data) {
                                if (!err && data) {
                                    //console.log(err, data);
                                    let title = "";
                                    if (data.Metadata && data.Metadata.title) {
                                        title = data.Metadata.title;
                                    }
                                    loadTemplate("template",data.Body.toString(),node.path,title);
                                }
                            });
                        });

                        new InspireTreeDOM(tree, {
                            target: '#templateTree'
                        });
                    }}) : (!viewModel.templateFiles ? m("i", { class: "fa fa-refresh fa-spin fa-fw" }) : m("span", m("i", { class: "fa fa-file-code-o fa-fw" }), "No templates created")),
                    m("h4", "Site", m("i", {class: "fa fa-fw fa-plus text-success", style: {cursor: "pointer"}, onclick: function () {
                        loadTemplate("editor","","","");
                    }})),
                    m("hr"),
                    viewModel.siteFiles ? m("div", {id: "treeDiv", oncreate: function (){
                        let tree = new InspireTree({
                            data: filesAndFolders(viewModel.siteFiles)
                        });

                        tree.on('node.selected', function (node) {
                            //console.log("Selected Node", node);
                            S3.getObject(node.path, localStorage.getItem('epiccms-data-bucket'), function (err, data) {
                                if (!err && data) {
                                    //console.log(err, data);
                                    let title = "";
                                    if (data.Metadata && data.Metadata.title) {
                                        title = data.Metadata.title;
                                    }
                                    loadTemplate("editor",data.Body.toString(),node.path,title);
                                    m.redraw();
                                }
                            });
                        });

                        new InspireTreeDOM(tree, {
                            target: '#treeDiv'
                        });
                    }}) :  m("i", { class: "fa fa-refresh fa-spin fa-fw" })
                ],
                main: [
                    m("div", {class: "well"},
                        context && context.text !== undefined && context.visible ? [
                            m("div", {class: "row"},
                                m("div", { class: "col-xs-12 col-sm-6" }, [
                                    m("div", { class: "form-group" }, [
                                        m("div", { class: "input-group" }, [
                                            m("span", { class: "input-group-addon" }, [
                                                m("i", { class: "fa fa-bars fa-fw", style: { width: "14px" } })
                                            ]),
                                            m("input", { class: "form-control", type: "text", placeholder: "Title", value: context.title, onchange: m.withAttr("value", context.setTitle) })
                                        ])
                                    ])
                                ]),
                                m("div", { class: "col-xs-12 col-sm-6" }, [
                                    m("div", { class: "form-group" }, [
                                        m("div", { class: "input-group" }, [
                                            m("span", { class: "input-group-addon" }, [
                                                m("i", { class: "fa fa-folder-open fa-fw", style: { width: "14px" } })
                                            ]),
                                            m("input", { class: "form-control", type: "text", placeholder: "Path", value: context.key, onchange: m.withAttr("value", context.setKey) })
                                        ])
                                    ])
                                ])
                            ),
                            m("div",{class: "row"},
                                m("div", { class: "col-xs-12" }, [
                                    m("input", {type: "file", id: "fileElem", multiple: true, style: "display:none", onchange: function () {
                                        let i = 0;
                                        for(; i < this.files.length; i++){
                                            let file = this.files[i];
                                            if(file) {
                                                let prefix = "uncategorized/";
                                                let image = false;
                                                if (imgTypes.indexOf(file.type) > -1) {
                                                    prefix = "images/";
                                                    image = true;
                                                }else if(videoTypes.indexOf(file.type) > -1){
                                                    prefix = "videos/";
                                                }else if(docTypes.indexOf(file.type) > -1){
                                                    prefix = "documents/document/";
                                                }else if(excelTypes.indexOf(file.type) > -1){
                                                    prefix = "documents/spreadsheet/";
                                                }else if(publisherTypes.indexOf(file.type) > -1){
                                                    prefix = "documents/publisher/";
                                                }else if(powerpointTypes.indexOf(file.type) > -1){
                                                    prefix = "documents/powerpoint/";
                                                }else if(calendarTypes.indexOf(file.type) > -1){
                                                    prefix = "documents/calendar/";
                                                }else if("application/pdf".indexOf(file.type) > -1){
                                                    prefix = "documents/pdf/";
                                                }

                                                // Replace any illegal characters from the filename
                                                let filename = prefix + file.name.replace(/\s|\\|\/|\(|\)/g,'-');

                                                //TODO: support both http and https
                                                let ASSETS_BUCKET = localStorage.getItem('epiccms-assets-bucket');
                                                let link = 'https://' + ASSETS_BUCKET + '/' + filename;

                                                S3.upload({
                                                    Bucket: ASSETS_BUCKET,
                                                    Key: filename,
                                                    ContentType: file.type,
                                                    Body: file
                                                }, function(err, data) { // jshint ignore:line
                                                    if (err) {
                                                        console.error(err);
                                                    } else {
                                                        //console.log(data);
                                                        Editor.setTextAtMouse((image ? '!' : '') + '[' + file.name + ']' + '(' + link + ')  ');
                                                    }
                                                });
                                            }
                                        }
                                    }}),
                                    m("button", { type: "button", class: "btn btn-default", onclick: function () {
                                        if(fileElem){ // jshint ignore:line
                                            fileElem.click();// jshint ignore:line
                                        }
                                    }}, [
                                        m("i", { class: "fa fa-cloud-upload fa-fw"})
                                    ]),
                                    m("button", { type: "button", class: "btn btn-success", onclick: function () {
                                        let newKey = context.key.toLowerCase();

                                        if (!context.title.length || context.title.length > 64) {
                                            console.error('The title needs to be between 1 and 64 characters.');
                                            return;
                                        }

                                        if(viewModel.currentView === "editor") {
                                            renameDoc(newKey, function (needed, error/*, data*/) {
                                                if (!needed || !error) {
                                                    save(newKey, function (needed, error/*, data*/) {
                                                        if (!needed || !error) {

                                                        }else if(error){
                                                            console.error(error);
                                                        }
                                                    });
                                                }else if(error){
                                                    console.error(error);
                                                }
                                            });
                                        }else if(viewModel.currentView === "template"){
                                            renameTemplate(newKey, function (needed, error/*, data*/) {
                                                if (!needed || !error) {
                                                    save(newKey, function (needed, error/*, data*/) {
                                                        if (!needed || !error) {

                                                        }else if(error){
                                                            console.error(error);
                                                        }
                                                    });
                                                }else if(error){
                                                    console.error(error);
                                                }
                                            });
                                        }

                                    }}, [
                                        "Save"
                                    ])
                                ])
                            ),
                            m(Editor, {visible: context.visible})
                        ] : [""]
                    )
                ]
            });
    }
};
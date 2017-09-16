'use strict';

const Fork = require("./components/Fork");
const Panel = require("./components/Panel");
const Checkbox = require("./components/Checkbox");
const ErrorMsg = require("./components/ErrorMsg");
const Auth = require("../util/Auth");

const Item = require("./templates/choices/Item");
const Choice = require("./templates/choices/Choice");

var ViewModel = function ViewModel() {
        var self = this;
        self.accessKey = localStorage.getItem('epiccms-access-key-id');
        self.rememberMe = localStorage.getItem('epiccms-remember');
        self.focusPass = false;
        self.accessSecret = localStorage.getItem('epiccms-secret-access-key');
        self.dataBucket = localStorage.getItem('epiccms-data-bucket');
        self.assetBucket = localStorage.getItem('epiccms-assets-bucket');
        self.siteBucket = localStorage.getItem('epiccms-site-bucket');
        self.region = localStorage.getItem('epiccms-region') ? localStorage.getItem('epiccms-region') : "us-east-1";
        self.loggingIn = false;
        self.login = function login() {
            self.loggingIn = true;
            self.resetError();
            var currentSelection = self.choices.currentState.items[self.choices.currentState.items.length - 1];
            Auth.login({
                accessKey: self.accessKey,
                accessSecret: self.accessSecret,
                dataBucket: self.dataBucket,
                assetsBucket: self.assetBucket,
                siteBucket: self.siteBucket,
                region: currentSelection.value,
                remember: self.rememberMe
            },function (error) {
                self.loggingIn = false;
                if(error) {
                    self.setError(error);
                }else{
                    m.route.set("/dashboard");
                }
            });
        };
        self.updateAccessKey = function (value) {
            self.accessKey = value;
        };
        self.updateSecretKey = function (value) {
            self.accessSecret = value;
        };
        self.updateDataBucket = function (value) {
            self.dataBucket = value;
        };
        self.updateSiteBucket = function (value) {
            self.siteBucket = value;
        };
        self.updateAssetBucket = function (value) {
            self.assetBucket = value;
        };
        self.updateRememberMe = function (value) {
            self.rememberMe = value;
        };
        self.setError = function setError(error) {
            self.error = error;
            self.hasError = true;
            m.redraw();
        };
        self.resetError = function resetError() {
            self.hasError = false;
            m.redraw();
        };
        self.hasError = false;
        self.error = "";
        return self;
    },
    viewModelInstance = new ViewModel(),
    self = {};

//TODO: Fix auto select previous region
self.createLoginPanelView = function createLoginPanelView(vnode) {
    return [
        m(ErrorMsg, {
            hasError: vnode.viewModel.hasError,
            resetError: vnode.viewModel.resetError,
            error: vnode.viewModel.error
        }),
        m("form", { class: "form-horizontal" }, [
            m("div", { class: "col-xs-12" }, [
                m("div", { class: "form-group" }, [
                    m("div", { class: "input-group" }, [
                        m("span", { class: "input-group-addon" }, [
                            m("i", { class: "fa fa-key", style: { width: "14px" } })
                        ]),
                        m("input", { class: "form-control", type: "text", placeholder: "AWS AccessKey", value: vnode.viewModel.accessKey, onchange: m.withAttr("value", vnode.viewModel.updateAccessKey) })
                    ])
                ])
            ]),
            m("div", { class: "col-xs-12" }, [
                m("div", { class: "form-group" }, [
                    m("div", { class: "input-group" }, [
                        m("span", { class: "input-group-addon" }, [
                            m("i", { class: "fa fa-lock", style: { width: "14px" } })
                        ]),
                        m("input", { class: "form-control", type: "text", placeholder: "AWS AccessSecret", value: vnode.viewModel.accessSecret, onchange: m.withAttr("value", vnode.viewModel.updateSecretKey) })
                    ])
                ])
            ]),
            m("div", { class: "col-xs-12" }, [
                m("div", { class: "form-group" }, [
                    m("div", { class: "input-group" }, [
                        m("span", { class: "input-group-addon" }, [
                            m("i", { class: "fa fa-hdd-o fa-fw", style: { width: "14px" } })
                        ]),
                        m("input", { class: "form-control", type: "text", placeholder: "S3 Data Bucket", value: vnode.viewModel.dataBucket, onchange: m.withAttr("value", vnode.viewModel.updateDataBucket) })
                    ])
                ])
            ]),
            m("div", { class: "col-xs-12" }, [
                m("div", { class: "form-group" }, [
                    m("div", { class: "input-group" }, [
                        m("span", { class: "input-group-addon" }, [
                            m("i", { class: "fa fa-hdd-o fa-fw", style: { width: "14px" } })
                        ]),
                        m("input", { class: "form-control", type: "text", placeholder: "S3 Asset Bucket", value: vnode.viewModel.assetBucket, onchange: m.withAttr("value", vnode.viewModel.updateAssetBucket) })
                    ])
                ])
            ]),
            m("div", { class: "col-xs-12" }, [
                m("div", { class: "form-group" }, [
                    m("div", { class: "input-group" }, [
                        m("span", { class: "input-group-addon" }, [
                            m("i", { class: "fa fa-hdd-o fa-fw", style: { width: "14px" } })
                        ]),
                        m("input", { class: "form-control", type: "text", placeholder: "S3 Site Bucket", value: vnode.viewModel.siteBucket, onchange: m.withAttr("value", vnode.viewModel.updateSiteBucket) })
                    ])
                ])
            ]),
            m("div", { class: "col-xs-12", style:{marginBottom: "10px", zIndex: "9999"} },
                m("select", {id: "regions", oncreate: function () {
                    var element = document.getElementById('regions');
                    vnode.viewModel.choices = new Choices(element, {
                        maxItemCount: 1,
                        choices: [
                            {
                                value: 'us-east-1',
                                label: 'US East (N. Virginia) - us-east-1',
                                selected: vnode.viewModel.region === 'us-east-1'
                            }, {
                                value: 'us-east-2',
                                label: 'US East (Ohio) - us-east-2',
                                selected: vnode.viewModel.region === 'us-east-2'
                            }, {
                                value: 'us-west-1',
                                label: 'US West (N. California) - us-west-1',
                                selected: vnode.viewModel.region === 'us-west-1'
                            }, {
                                value: 'us-west-2',
                                label: 'US West (Oregon) - us-west-2',
                                selected: vnode.viewModel.region === 'us-west-2'
                            }, {
                                value: 'ca-central-1',
                                label: 'Canada (Central) - ca-central-1',
                                selected: vnode.viewModel.region === 'ca-central-1'
                            }, {
                                value: 'eu-west-1',
                                label: 'EU (Ireland) - eu-west-1',
                                selected: vnode.viewModel.region === 'eu-west-1'
                            }, {
                                value: 'eu-central-1',
                                label: 'EU (Frankfurt) - eu-central-1',
                                selected: vnode.viewModel.region === 'eu-central-1'
                            }, {
                                value: 'eu-west-2',
                                label: 'EU (London) - eu-west-2',
                                selected: vnode.viewModel.region === 'eu-west-2'
                            }, {
                                value: 'ap-northeast-1',
                                label: 'Asia Pacific (Tokyo) - ap-northeast-1',
                                selected: vnode.viewModel.region === 'ap-northeast-1'
                            }, {
                                value: 'ap-northeast-2',
                                label: 'Asia Pacific (Seoul) - ap-northeast-2',
                                selected: vnode.viewModel.region === 'ap-northeast-2'
                            }, {
                                value: 'ap-southeast-1',
                                label: 'Asia Pacific (Singapore) - ap-southeast-1',
                                selected: vnode.viewModel.region === 'ap-southeast-1'
                            }, {
                                value: 'ap-southeast-2',
                                label: 'Asia Pacific (Sydney) - ap-southeast-2',
                                selected: vnode.viewModel.region === 'ap-southeast-2'
                            }, {
                                value: 'ap-south-1',
                                label: 'Asia Pacific (Mumbai) - ap-south-1',
                                selected: vnode.viewModel.region === 'ap-south-1'
                            }, {
                                value: 'sa-east-1',
                                label: 'South America (São Paulo) - sa-east-1',
                                selected: vnode.viewModel.region === 'sa-east-1'
                            }
                        ],
                        callbackOnCreateTemplates: function (template) {
                            var classNames = this.config.classNames;
                            return {
                                item: (data) => {
                                return template(Item.view.call(this,data,classNames));
                        },
                            choice: (data) => {
                                return template(Choice.view.call(this,data,classNames));
                            },
                        };
                        }
                    });
                }})
            ),
            m("div", { class: "col-xs-3" },
                m("button", { class: "btn btn-success", onclick: vnode.viewModel.login, disabled: vnode.viewModel.loggingIn }, m("i", {class: "fa fa-user"}), " Sign In")
            ),
            m(Checkbox, {
                checkboxes: [
                    {
                        checked: vnode.viewModel.rememberMe,
                        update: vnode.viewModel.updateRememberMe,
                        text: "Remember Me",
                        class: "col-xs-4"
                    }
                ]
            })
        ])
    ];
};

self.view = function view(vnode) {
    vnode.viewModel = viewModelInstance;
    return[
        m(Fork),
        m("div", [
            m("h1", {class: "row fontMinotaur", style: {textAlign: "center"}}, "Epic CMS"),
            m("div", { class: "row" }, [
                m("div", { class: "col-sm-2 col-md-4 col-lg-4" }),
                m(Panel, {
                    type: "success",
                    title: "Login",
                    body: self.createLoginPanelView(vnode),
                    size: "col-sm-8 col-md-4 col-lg-4",
                    dismiss: false
                }),
                m("div", { class: "col-sm-2 col-md-4 col-lg-4" })
            ])
        ])
    ];
};


module.exports = self;
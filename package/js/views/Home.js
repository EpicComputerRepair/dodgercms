'use strict';

module.exports = {
    view: function() {
        return [
            m("div", {class: "well"}, [
                m("div", {class: "row"},
                    m("m", {class: "col-xs-12"},
                        m("h1", m("i", {class: "fa fa-fw fa-lock margin-right"}), "Secure"),
                        m("p", "No need to have an admin login page on your website. No backend server to be compromised."),
                        m("p",
                            m("ul",
                                m("li", "Can be ran locally ", m("code", "file:///"),
                                    m("ul", m("li", "Open ", m("code", "./build/index.html")))
                                ),
                                m("li", m("a", {href: "http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html"}, "Federated token")," with access just to requested S3 buckets",
                                    m("ul", m("li", "Token renews every 36 hours, if the access key and secret are stored in local browser storage"))
                                ),
                                m("li", "Can be deployed to S3 or other hosting solutions",
                                    m("ul", m("li", "S3 use ", m("code", "grunt deployProd"),
                                        m("ul", m("li", "Edit creds in ",m("code", "grunt-aws.json")," or use env vars"))
                                    )),
                                    m("ul", m("li", "Other hosting copy ",m("code", "./build")))
                                )
                            )
                        ),
                        m("h1", m("i", {class: "fa fa-fw fa-github margin-right"}), "Open Source"),
                        m("p", "Licensed under ",m("a", {href: "https://raw.githubusercontent.com/EpicComputerRepair/epiccms/dev/LICENSE"}, "MIT"),", feel free to make changes."),
                        m("ul",
                            m("li", m("code", "git clone https://github.com/EpicComputerRepair/epiccms.git")),
                            m("li", "Main Stable Branch",
                                m("ul", m("li", m("a", {href: "https://github.com/EpicComputerRepair/epiccms"}, "https://github.com/EpicComputerRepair/epiccms"))),
                                m("ul", m("li", "Deployed To ", m("a", {href: "https://cms.epic-computer-repair.com"}, "cms.epic-computer-repair.com")))
                            ),
                            m("li", "Development Branch",
                                m("ul", m("li", m("a", {href: "https://github.com/EpicComputerRepair/epiccms/tree/dev"}, "https://github.com/EpicComputerRepair/epiccms/tree/dev"))),
                                m("ul", m("li", "Deployed To ", m("a", {href: "https://cms-dev.epic-computer-repair.com"}, "cms-dev.epic-computer-repair.com"))),
                                m("ul", m("li", m("i", "Pull requests should be made against this branch")))
                            )
                        ),
                        m("h1", m("i", {class: "fa fa-fw fa-cog margin-right"}), "No Maintenance"),
                        m("p", "No software to update or hardware to maintain, ", m("a",{href: "https://aws.amazon.com/s3/"},"AWS S3")," provides storage and hosting."),
                        m("h1", m("i", {class: "fa fa-fw fa-edit margin-right"}), "Powerful Editor"),
                        m("p", m("a", {href: "/editor", oncreate: m.route.link}, "markdown editor")," Our editor "),
                        m("h1", m("i", {class: "fa fa-fw fa-file-code-o margin-right"}), "Developer Friendly"),
                        m("p", "HTML ", m("a", {href: "http://handlebarsjs.com/"}, "Handlebars"), " templates for creating fully customizable sites.")
                    )
                )
            ])
        ];
    }
};
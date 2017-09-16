Epic CMS Dev
========================================
[![CircleCI](https://circleci.com/gh/EpicComputerRepair/epiccms/tree/dev.svg?style=svg)](https://circleci.com/gh/EpicComputerRepair/epiccms/tree/dev) [![Grunt](https://cdn.rawgit.com/aleen42/badges/master/src/grunt.svg)](http://gruntjs.com/) [![Bower](https://cdn.rawgit.com/aleen42/badges/master/src/bower.svg)](https://bower.io/) [![Webpack](https://cdn.rawgit.com/aleen42/badges/master/src/webpack.svg)](https://webpack.js.org/)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)  

Static website generation from markdown built for [Amazon S3](https://aws.amazon.com/s3/). Forked originally from the project [dodgercms](https://github.com/ChrisZieba/dodgercms).
This repo is deployed to [Dev CMS - cms-dev.epic-computer-repair.com](https://cms-dev.epic-computer-repair.com)

Epic CMS is a clean and simple alternative to heavy content management systems. There are no databases to manage, deployments to monitor, or massive configuration files. Just focus on writing your content and the results are live immediately.

The only requirement for Epic CMS is an account with [Amazon Web Services](http://aws.amazon.com/). Content is uploaded into the manager and then converted to `HTML` each time the document is updated. Epic CMS also keeps a data `JSON` file with up to date with information used by the application.

Epic CMS Features
-------------
* Can be ran locally `file:///`
    * Open `./build/index.html`
* Federated token with access just to requested S3 buckets
    * Token renews every 36 hours, if the access key and secret are stored in local browser storage
* Can be deployed to S3 or other hosting solutions
    * S3 use `grunt deployProd`
        * Edit creds in `grunt-aws.json` or use env vars
  * Other hosting copy `./build`
* Markdown syntax and editor
    * Preview changes
* Asset uploads
* Responsive
    * Edit websites on an mobile device
  
Generated Website Features
-------------
* Site templates
* Saved changes are live immediately
    * No deployments needed
* No Backend needed
    * Everything should be handled on build or on the client

Planned Features
-------------
* Tags
* Categories
* Search
* Authors

Install Dependencies
-------------
***npm for build***  
`npm install`  
***bower for browser***  
`npm run bower install`

Grunt
-------------
* `npm run grunt` to build local copy
* list of commands `npm run grunt --help`

Code Documentation
-------------
1. `npm run grunt groc`
2. Open `./build/doc/index.html` in browser

Running Locally
-------------
***Rebuilds Bower, HTML, LESS, Images, Fonts, JS***  
1. `npm run grunt local`
2. Open `./build/index.html` in browser

Updating Local JS Changes
-------------
***Must have local already built***  
1. `npm run grunt localJS`
2. Open `./build/index.html` in browser

Unit Tests
-------------
`npm test`

'use strict';

var loggedIn = false;

/**
 * Get authentication crendentials for the buckets.
 *
 * @param {Boolean} allOrNothing Optional parameter to return null if any of the crendtials are null
 * @return {Object}
 */
var getCredentials = function(allOrNothing) {
    var credentials = {
        dataBucket: localStorage.getItem('epiccms-data-bucket'),
        assetsBucket: localStorage.getItem('epiccms-assets-bucket'),
        siteBucket: localStorage.getItem('epiccms-site-bucket'),
        accessKey: localStorage.getItem('epiccms-access-key-id'),
        accessSecret: localStorage.getItem('epiccms-secret-access-key'),
        region: localStorage.getItem('epiccms-region')
    };

    // Exit if any credentials are missing
    if (allOrNothing) {
        for (var property in credentials) {
            if (credentials.hasOwnProperty(property)) {
                if (!credentials[property]) {
                    return null;
                }
            }
        }
    }

    return credentials;
};

/**
 * Returns an endpoint for the application.
 *
 * @param {String} protocol Either http or https
 * @param {String} bucket The bucket being referenced
 * @param {String} location The data center the bucket resided in
 * @return {String}
 */
var getEndpoint = function(protocol, bucket) {
    return protocol + bucket +'/';
};

/**
 * Get an IAM policy for the federated user.
 *
 * @param {String} dataBucket The bucket for the markdown content
 * @param {String} assetsBucket The bucket for the uploads
 * @param {String} siteBucket The bucket for the front end website
 * @return {String}
 */
var getPolicy = function(dataBucket, assetsBucket, siteBucket) {
    // This is the same policy as the user from where the token was generated
    var policy = '{' +
        '"Version": "2012-10-17",' +
        '"Statement": [' +
        '{' +
        '"Sid": "Stmt1427944232000",' +
        '"Effect": "Allow",' +
        '"Action": [' +
        '"s3:ListBucket",' +
        '"s3:GetObject",' +
        '"s3:DeleteObject",' +
        '"s3:PutObject",' +
        '"s3:GetBucketWebsite",' +
        '"s3:PutBucketWebsite",' +
        '"s3:DeleteBucketWebsite",' +
        '"s3:GetBucketLogging",' +
        '"s3:GetBucketVersioning",' +
        '"s3:GetBucketLocation"' +
        '],' +
        '"Resource": [' +
        '"arn:aws:s3:::' + dataBucket + '",' +
        '"arn:aws:s3:::' + dataBucket + '/*",' +
        '"arn:aws:s3:::' + assetsBucket + '",' +
        '"arn:aws:s3:::' + assetsBucket + '/*",' +
        '"arn:aws:s3:::' + siteBucket + '",' +
        '"arn:aws:s3:::' + siteBucket + '/*"' +
        ']' +
        '}' +
        ']' +
        '}';

    return policy;
};

/**
 * Handles the federated token creation and policy generation.
 *
 * @param {Object} params The bucket for the markdown content
 * @param {Boolean} callback
 */
function login(params, callback) {
    // No params, just a callback
    if (arguments.length === 1) {
        // Swap the arguments
        callback = params;

        // Try and get the login info from local storage
        params = getCredentials(true);

        if (!params) {
            // The info was not present in storage, therefore the user needs to enter them again
            return callback('Could not login due to lack of user credentials.');
        }

        // Since they were already remembered
        params.remember = true;
    }

    // Make sure all fields are present
    var required = ['dataBucket', 'assetsBucket', 'siteBucket', 'accessKey', 'accessSecret','region'];
    for (var i=0; i < required.length; i+=1) {
        if (!params.hasOwnProperty(required[i]) || !params[required[i]]) {
            // Pass the error message back
            return callback(required[i] + ' is a required field.');
        }
    }

    params.remember = params.hasOwnProperty('remember') ? Boolean(params.remember) : false;

    var sts = new AWS.STS({
        accessKeyId: params.accessKey,
        secretAccessKey: params.accessSecret,
        sslEnabled: true,
        apiVersion: '2011-06-15',
        region: params.region
    });

    // This is the same policy as the IAM user from where the token was generated
    var policy = getPolicy(params.dataBucket, params.assetsBucket, params.siteBucket);

    var stsParams = {
        Name: 'epiccms-buckets-policy',
        Policy: policy,
        // Duration of 36 hours
        DurationSeconds: 129600,
    };

    // Create the federated token for access to the buckets
    sts.getFederationToken(stsParams, function(err, data) {
        if (err) {
            return callback('Access Denied. Please make sure the acccess key and secret are correct and try again.');
        } else {

            if(!data || !data.Credentials || !data.Credentials.AccessKeyId || !data.Credentials.SecretAccessKey || !data.Credentials.SessionToken){
                return callback('Missing Credentials for federated token.');
            }

            var s3 = new AWS.S3({
                accessKeyId: data.Credentials.AccessKeyId,
                secretAccessKey: data.Credentials.SecretAccessKey,
                sessionToken: data.Credentials.SessionToken,
                sslEnabled: true,
                region: params.region
            });

            // Test the connection to each bucket
            async.each([params.dataBucket, params.assetsBucket], function(bucket, cb) {
                    s3.headBucket({ Bucket: bucket }, function(err) {
                        if (err) {
                            cb('Access Denied. Please make sure the user attached to the access key has access to ' + bucket + ' and correct region selected. '+err);
                        } else {
                            cb();
                        }
                    });
                },
                // Handle any errors from the calls to the buckets
                function(err) {
                    if (err) {
                        return callback(err);
                    } else {
                        // Get the webiste information. This is needed so we can get the
                        // domain and any redirect rules that we need.
                        async.parallel([
                                function(cb1) {
                                    s3.getBucketWebsite({ Bucket: params.siteBucket }, function(err, websiteData) {
                                        if (err) {
                                            cb1('Access Denied. Please make sure the user attached to the access key has access to ' + params.siteBucket + ' and correct region selected. '+err);
                                        } else {
                                            // Success
                                            cb1(null, websiteData);
                                        }
                                    });
                                }
                            ],
                            function(err, results) {
                                if (err) {
                                    callback(err);
                                } else {
                                    var website = results[0];

                                    if(!website.ErrorDocument && !website.IndexDocument && !website.RoutingRules){
                                        callback('Static hosting not enabled on S3 Site Bucket',params.siteBucket,"Enable static hosting to continue...");
                                        return;
                                    }

                                    // The endpoint is needed for the templates
                                    var endpoint = getEndpoint('https://', params.siteBucket);

                                    try {
                                        //When running from file:///
                                        //Error occurs SecurityError: The operation is insecure.

                                        // Store the federated user and bucket in local session data
                                        sessionStorage.setItem('epiccms-token-access-key-id', data.Credentials.AccessKeyId);
                                        sessionStorage.setItem('epiccms-token-secret-access-key', data.Credentials.SecretAccessKey);
                                        sessionStorage.setItem('epiccms-token-session-token', data.Credentials.SessionToken);
                                    } catch(e) {
                                        if (e.name !== "SecurityError") {
                                            throw e;
                                        }
                                    }

                                    // If the user selected "remember me" store their access key and secret in local storage
                                    if (params.remember) {
                                        localStorage.setItem('epiccms-access-key-id', params.accessKey);
                                        localStorage.setItem('epiccms-secret-access-key', params.accessSecret);
                                    }

                                    localStorage.setItem('epiccms-remember', params.remember);

                                    localStorage.setItem('epiccms-data-bucket', params.dataBucket);
                                    localStorage.setItem('epiccms-assets-bucket', params.assetsBucket);
                                    localStorage.setItem('epiccms-site-bucket', params.siteBucket);
                                    localStorage.setItem('epiccms-region', params.region);
                                    localStorage.setItem('epiccms-site-endpoint', endpoint);

                                    loggedIn = true;

                                    // All done
                                    callback(null, data);
                                }
                            });
                    }
                });
        }
    });
}

/**
 * Removes the saved data from local storage.
 */
function logout() {
    localStorage.removeItem('epiccms-access-key-id');
    localStorage.removeItem('epiccms-secret-access-key');
    localStorage.removeItem('epiccms-data-bucket');
    localStorage.removeItem('epiccms-assets-bucket');
    localStorage.removeItem('epiccms-site-bucket');
    localStorage.removeItem('epiccms-site-endpoint');

    m.route.set("/");
}

module.exports = {
    login: login,
    logout: logout,
    isLoggedIn: function () {
        return loggedIn;
    }
};

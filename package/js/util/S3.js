'use strict';

const cache = require("./Cache");
const ENCODING_TYPE = 'url';
const API_VERSION = '2011-06-15';

var s3 = null;

/**
 * Initialize the connection object to S3.
 *
 * @param {String} accessKeyId Access key
 * @param {String} secretAccessKey Secret access key
 * @param {String} sessionToken The session token for the federated user
 * @param {Boolean} force Create a new S3 object if one exists already
 * @return {Object}
 */
function init(accessKeyId, secretAccessKey, sessionToken, region, force) {

    if (!accessKeyId || !secretAccessKey || !sessionToken || !region) {
        throw new Error('Missing arguments');
    }

    if (!s3 || force) {
        s3 = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            region: region,
            sslEnabled: true,
            // Duration of 36 hours
            DurationSeconds: 129600,
            apiVersion: API_VERSION,
            maxRetries: 1
        });
    }

    return s3;
}

/**
 * Returns the API version used by the AWS SDK.
 *
 * @return {String}
 */
function getApiVersion() {
    return API_VERSION;
}

/**
 * Delete a key in S3.
 *
 * @param {String} key The key name
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function deleteObject(key, bucket, callback) {
    var params = {
        Bucket: bucket,
        Key: key
    };

    s3.deleteObject(params, function(err, data) {
        // Do not throw an error if the key does not exist
        if (err && err.code !== 'NoSuckKey') {
            callback(err);
        } else {
            callback(null, data);

        }
    });
}

/**
 * Get a list of all objects in an S3 bucket.
 *
 * @param {String} prefix Optional prefix used when searching for keys
 * @param {String} bucket The bucket to query objects from
 * @param {Function} callback Callback function
 */
function listObjects(prefix, bucket, callback) {

    let cached = cache.get({method: "listObjects", prefix: prefix, bucket: bucket});
    if(cached){
        callback(null,cached);
    } else {
        // The prefix is an optional argument
        if (arguments.length === 2) {
            callback = bucket;
            bucket = prefix;
            prefix = '';
        }

        let params = {
            Bucket: bucket,
            EncodingType: ENCODING_TYPE,
            MaxKeys: 1000,
            Prefix: prefix
        };

        s3.listObjects(params, function (err, data) {
            if (err) {
                callback(err);
            } else {
                cache.put({method: "listObjects", prefix: prefix, bucket: bucket},data);
                callback(null, data);
            }
        });
    }
}

/**
 * Rename an object in S3.
 *
 * @param {String} source The current name of the key
 * @param {String} target The new name of the key
 * @param {String} bucket Where the key resides
 * @param {Function} callback Callback function
 */
function renameObject(source, target, bucket, callback) {
    let params = {
        Bucket: bucket,
        MetadataDirective: 'COPY',
        // Copy Source must mention the source bucket and key: sourcebucket/sourcekey
        CopySource: bucket + '/' + source,
        Key: target
    };

    // Copy the key to a new location
    s3.copyObject(params, function(err) {
        if (err) {
            callback(err);
        } else {
            deleteObject(source, bucket, callback);
        }
    });
}

/**
 * Upload an object to S3.
 *
 * @param {Object} params Parameters
 * @param {Function} callback Callback function
 */
function upload(params, callback) {
    s3.upload(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

/**
 * Upload an object to S3.
 *
 * @param {String} key The key name
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function getObject(key, bucket, callback) {
    let cached = cache.get({method: "getObject", key: key, bucket: bucket});
    if(cached){
        callback(null,cached);
    } else {
        let params = {
            Bucket: bucket,
            Key: key
        };

        s3.getObject(params, function (err, data) {
            if (err) {
                callback(err);
            } else {
                cache.put({method: "getObject", key: key, bucket: bucket},data);
                callback(null, data);
            }
        });
    }
}

/**
 * Get meta information for a key in S3.
 *
 * @param {String} key The key name
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function headObject(key, bucket, callback) {
    let cached = cache.get({method: "headObject", key: key, bucket: bucket});
    if(cached){
        callback(null,cached);
    } else {
        let params = {
            Bucket: bucket,
            Key: key
        };

        s3.headObject(params, function (err, data) {
            if (err) {
                callback(err);
            } else {
                cache.put({method: "headObject", key: key, bucket: bucket},data);
                callback(null, data);
            }
        });
    }
}

/**
 * Upload a key to an S3 bucket.
 *
 * @param {String} key The key name
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function putObject(key, bucket, callback) {
    let params;

    // If there are two arguments and the first is an object we we given the params directly
    if (arguments.length === 2 && typeof key === 'object') {
        params = key;
        callback = bucket;
    } else {
        params = {
            Bucket: bucket,
            Key: key
        };
    }

    s3.putObject(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

/**
 * Copy a key from one location to another.
 *
 * @param {String} source The original location of the key
 * @param {String} target Where to move the key to
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function copyObject(source, target, bucket, callback) {
    let params = {
        Bucket: bucket,
        MetadataDirective: 'COPY',
        // Copy Source must mention the source bucket and key: sourcebucket/sourcekey
        CopySource: bucket + '/' + source,
        Key: target
    };

    s3.copyObject(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);

        }
    });
}

/**
 * Rename multiple objects from one location to another.
 *
 * @param {String} source The original location of the key
 * @param {String} target Where to move the key to
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function renameObjects(source, target, bucket, callback) {
    // If the key is a folder we want to copy each child
    if (source.substr(-1) === '/') {
        // Split the file path into an array of parts
        let parts = source.replace(/\/\s*$/, '').split('/');

        // Remove the last part off the file path
        parts.splice(-1, 1, target);

        // The key to replace the old directory
        let targetPrefix = parts.join('/') + '/';

        listObjects(source, bucket, function(err, data) {
            if (err) {
                callback(err);
            } else {
                let contents = data.Contents;

                // Copy each object in parallel
                async.each(contents, function(object, cb) {
                    // Replace the source with the target
                    let key = targetPrefix + object.Key.substr(source.length);

                    copyObject(object.Key, key, bucket, cb);
                }, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        // Remove all the files from the site bucket
                        callback(null);
                    }
                });
            }
        });
    } else {
        copyObject(source, target, bucket, callback);
    }
}

/**
 * Delete multiple keys in S3.
 *
 * @param {String} key The key name
 * @param {String} bucket The bucket where the key resides
 * @param {Function} callback Callback function
 */
function deleteObjects(key, bucket, callback) {
    // If the key is a folder we want to delete all keys inside the folder, as well so we
    // use the key name as a prefix but if its a file, no prefix will delete only the one item
    if (key.substr(-1) === '/') {
        listObjects(key, bucket, function(err, data) {
            if (err) {
                callback(err);
            } else {
                let contents = data.Contents;
                // Delete each object in parallel
                async.each(contents, function(object, cb) {
                    deleteObject(object.Key, bucket, cb);
                }, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        // Remove all the files from the site bucket
                        callback(null);
                    }
                });
            }
        });
    } else {
        // Just delete the one key
        deleteObject(key, bucket, callback);
    }
}


/**
 * Gets meta data for multiple objects. Need to make a head
 * request for each key. Useful after getting a list of objects.
 *
 * @param {Array} contents A list of keys to query
 * @param {String} bucket The bucket where the keys reside
 * @param {Function} callback Callback function
 */
function headObjects(contents, bucket, callback) {
    let cached = cache.get({method: "headObjects", contents: contents, bucket: bucket});
    if(cached){
        callback(null,cached);
    } else {
        let keys = [];

        // Get each object in parallel
        async.each(contents, function (object, cb) {
                s3.headObject({
                    Bucket: bucket,
                    Key: object.Key
                }, function (err, data) {
                    if (err) {
                        cb(err);
                    } else {
                        // Add the key attribute
                        data.Key = object.Key;
                        keys.push(data);
                        cb(null);
                    }
                });
            },
            function (err) {
                if (err) {
                    callback(err);
                } else {
                    cache.put({method: "headObjects", contents: contents, bucket: bucket},keys);
                    callback(null, keys);
                }
            });
    }
}

module.exports = {
    init: init,
    getApiVersion: getApiVersion,
    getObject: getObject,
    upload: upload,
    headObject: headObject,
    putObject: putObject,
    copyObject: copyObject,
    deleteObject: deleteObject,
    deleteObjects: deleteObjects,
    renameObject: renameObject,
    renameObjects: renameObjects,
    listObjects: listObjects,
    headObjects: headObjects
};
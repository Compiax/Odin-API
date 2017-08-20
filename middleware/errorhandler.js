var debug       = require('debug')('odin-api:middleware:errorhandler');

var JSONAPIResponse = require('../helpers/jsonapiresponse');

debug("Exporting error handler function");
module.exports = function(err, req, res, next) {
    if (err instanceof JSONAPIResponse) {
        return res.send(err);
    } else {
        var response = new JSONAPIResponse();
        response.addError();
        if (err instanceof String) {
            response.addError().detail(err);
        } else {
            response.addError();
        }
        return response;
    }
}
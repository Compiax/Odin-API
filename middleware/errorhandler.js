var debug       = require('debug')('odin-api:middleware:errorhandler');

var JSONAPIResponse = require('../helpers/jsonapiresponse');

debug("Exporting error handler function");
module.exports = function(err, req, res, next) {
    if (err instanceof JSONAPIResponse) {
        debug(err.errors[0].json.status);
        return res.status(err.errors[0].json.status).send(err);
    } else {
        debug("Handling generic response");
        var response = new JSONAPIResponse();
        response.addError();
        if (err instanceof String) {
            response.addError().detail(err);
        } else {
            response.addError();
        }
        return res.status(500).send(response);
    }
}
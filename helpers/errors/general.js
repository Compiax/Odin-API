var debug     = require('debug')('odin-api:middleware:errors:general');
JsonAPIResponse = require('../jsonapiresponse');

module.exports.BadRequestError = function(detail) {
    var err = new JsonAPIResponse();
    err.addError()
        .status("400")
        .title("Bad Request")
        .detail(detail);

    return err;
}

module.exports.UnauthorizedError = function() {
    debug("Building error");
    var err = new JsonAPIResponse();
    err.addError()
        .status("401")
        .title("Unauthorized")
        .detail("Authentication required");

    return err;
}

JsonAPIResponse = require('../jsonapiresponse');

module.exports.UserNotFoundError = function() {
    var err = new JsonAPIResponse();
    err.addError()
        .status("404")
        .title("User Not Found")
        .detail("The requested user does not exist");

    return err;
}
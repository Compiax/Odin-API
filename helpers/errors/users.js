JsonAPIResponse = require('../jsonapiresponse');

module.exports.UserNotFoundError = function() {
    var err = new JsonAPIResponse();
    err.addError()
        .status("404")
        .title("User Not Found")
        .detail("The requested user does not exist");

    return err;
}

module.exports.UserAlreadyExistsError = function() {
    var err = new JsonAPIResponse();
    err.addError()
        .status("400")
        .title("User Already Exists")
        .detail("That username has already been taken");

    return err;
}

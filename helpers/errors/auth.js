JsonAPIResponse = require('../jsonapiresponse')

module.exports.WrongCredentialsError = function() {
    var err = new JsonAPIResponse()
    err.addError()
        .status("400")
        .title("Wrong Credentials")
        .detail("Username or password is incorrect.")

    return err
}

JsonAPIResponse = require('../jsonapiresponse')

module.exports.BadRequestError = function(detail) {
    var err = new JsonAPIResponse()
    err.addError()
        .status("400")
        .title("Bad Request")
        .detail(detail)

    return err
}

module.exports.UnauthorizedError = function() {
    var err = new JsonAPIResponse()
    err.addError()
        .status("401")
        .title("Unauthorized")
        .detail("Authentication required")

    return err
}

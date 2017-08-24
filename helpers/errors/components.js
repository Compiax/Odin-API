JsonAPIResponse = require('../jsonapiresponse');

module.exports.ComponentNotFoundError = function() {
    var err = new JsonAPIResponse();
    err.addError()
        .status("404")
        .title("Component Not Found")
        .detail("The requested component does not exist");

    return err;
}
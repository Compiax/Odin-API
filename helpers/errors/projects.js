module.exports.ProjectNotFoundError = function() {
    var err = new JsonAPIResponse()
    err.addError()
        .status("404")
        .title("Project Not Found")
        .detail("The requested project does not exist")

    return err
}
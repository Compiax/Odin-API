module.exports.IncorrectStructureError = function(detail) {
    var err = new JsonAPIResponse()
    err.addError()
        .status("400")
        .title("Incorrect Structure")
        .detail(detail)

    return err
}

var TwittarghError = module.exports.TwittarghError = function (message, code) {
    this.error = true;
    this.message = message;
    this.code = code;
};

module.exports.InternalError = function() {
    return new TwittarghError("Internal error", 500);
}

module.exports.AuthenticationError = function() {
    return new TwittarghError("Authentication error", 404);
}

module.exports.NotFoundError = function() {
    return new TwittarghError("Not found", 404);
}

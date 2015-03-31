module.exports.include = function (model, fields) {
    fields = fields || [];
    model = model || {};
    
    var result = {};
    fields.forEach(function (field) {
        result[field] = model[field];
    });
    return result;
};

module.exports.exclude = function (model, fields) {
    model = model || {};
    fields = fields || [];

    var result = {};
    Object.keys(model).forEach(function (fieldname) {
        if (!fields.contains(fieldname)) {
            result[fieldname] = model.fieldname;
        }
    });
    return result;
};

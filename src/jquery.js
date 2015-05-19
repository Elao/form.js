$.fn.collection = function(options) {
    return this.each(function() {
        $(this).data('collection', new Collection(this, typeof options == 'object' ? options : {}));
    });
};

$.fn.choice = function(options) {
    return this.each(function() {
        $(this).data('choice', new Choice(this, typeof options == 'object' ? options : {}));
    });
};

$.fn.changeConfirmation = function(parameters, options) {
    if (typeof(parameters) === 'undefined') {
        parameters = {};
    }

    return this.each(function() {
        var element = $(this),
            options = {
                message: typeof(parameters.message) !== 'undefined' ? parameters.message : element.data('confirmation-message')
            };

        if (typeof(parameters.tolerance) !== 'undefined') {
            options.tolerance = parameters.tolerance;
        }

        element.data('change-confirmation', new ChangeConfirmation(element, options));
    });
};

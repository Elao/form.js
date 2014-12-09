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

$.fn.changeConfirmation = function(options) {
    return this.each(function() {
        var options = typeof options == 'object' ? options : {},
            element = $(this);

        if (typeof(options.message) === 'undefined') {
            options.message = element.data('confirmation-message');
        }

        element.data('change-confirmation', new ChangeConfirmation(element, options));
    });
};

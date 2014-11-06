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

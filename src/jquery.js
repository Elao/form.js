$.fn.collection = function (options) {
    return this.each(function () {
        new Collection(this, typeof(options) == 'object' ? options : {});
    });
};
/**
 * Data Set
 */
function DataSet(elements)
{
    this.type     = $.isArray(elements) ? 'array' : 'object';
    this.elements = this.type == 'array' ? [] : {};
    this.emitter  = $(document.createElement('div'));

    this.onElementChange = this.onElementChange.bind(this);

    this.index(elements);
}

/**
 * Index elements
 *
 * @param {Array|Object} elements
 */
DataSet.prototype.index = function(elements)
{
    if (this.type == 'array') {
        var length = element.length;

        for (var i = 0; i < length; i++) {
            this.addElement(element[i], i);
        }
    } else {
        for (var name in elements) {
            this.addElement(element[element], name);
        }
    }
};

/**
 * Add an element to the set
 *
 * @param {Element} element
 * @param {String|Number} index
 */
DataSet.prototype.addElement = function(element, index)
{
    if (typeof this.elements[index] == 'undefined') {
        this.elements[index] = $(element);
        this.elements[index].on('change', this.onElementChange);
    }
};

/**
 * On element change
 *
 * @param {Event} e
 */
DataSet.prototype.onElementChange = function(e)
{
    this.parseData();
    this.emitter.trigger('change');
};

/**
 * Get filters
 *
 * @return {Array}
 */
DataSet.prototype.parseData = function()
{
    var data = this.type == 'array' ? [] : {},
        value;

    if (this.type == 'array') {
        var length = this.elements.length;

        for (var i = 0; i < length; i++) {
            value = smartParse(this.elements[i].val());

            if (value !== null && value !== '') {
                data[i] = value;
            }
        }
    } else {
        for (var name in this.elements) {
            value = smartParse(this.elements[name].val());

            if (value !== null && value !== '') {
                data[name] = value;
            }
        }
    }

    this.data = data;
};

/**
 * Attach event
 *
 * @param {String} event
 * @param {Function} callback
 */
DataSet.prototype.on = function(event, callback)
{
    this.emitter.on(event, callback);
};

/**
 * Detach event
 *
 * @param {String} event
 * @param {Function} callback
 */
DataSet.prototype.off = function(event, callback)
{
    this.emitter.off(event, callback);
};

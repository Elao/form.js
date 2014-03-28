/**
 * Choice
 *
 * @param {Element} element
 */
function Choice(element, options)
{
    this.element  = $(element);
    this.expanded = this.element.prop('tagName').toLowerCase() != 'select';
    this.multiple = (this.expanded ? $('input[type="checkbox"]', this.element).length : this.element.prop('multiple') ) ? true : false;
    this.choices  = [];
    this.value    = null;

    var children = this.element.children(),
        length = children.length;

    for (var i = 0; i < length; i++) {
        var option = new Option(children[i], this, typeof(options.data) != 'undefined' ? options.data : null);

        if (option.value !== '' && option.value !== null) {
            this.choices.push(option);
        }
    }

    this.element.on('change', this.updateValue.bind(this));
    this.updateValue();
}

Choice.prototype.matchers = {};

/**
 * Update value
 */
Choice.prototype.updateValue = function()
{
    var value = this.getValueFromSelection();

    if (this.value != value) {
        this.value = value;
    }
};

/**
 * Alias for jQuery compatibility
 *
 * @return {mixed}
 */
Choice.prototype.val = function()
{
    return this.value;
};

/**
 * Get value from selection
 *
 * @return {String}
 */
Choice.prototype.getValueFromSelection = function()
{
    if (this.expanded) {

        var selection = this.getSelection();

        if (this.multiple) {

            var length = selection.length,
                values = [];

            for (var i = 0; i < length; i++) {
                values.push(selection[i].value);
            }

            return values;
        }

        return selection.value;
    }

    var value = this.element.val();

    if (this.multiple) {
        return value ? $.map(value, function (item) { return smartParse(item); }) : [];
    }

    return smartParse(value);
};

/**
 * Get selection
 *
 * @return {Option|Array}
 */
Choice.prototype.getSelection = function()
{
    var length = this.choices.length,
        selection = [],
        option;

    for (var i = 0; i < length; i++) {

        option = this.choices[i];

        if (option.isSelected()) {
            if (this.multiple) {
                selection.push(option);
            } else {
                return option;
            }
        }
    }

    return selection;
};

/**
 * Update the choice from filters
 */
Choice.prototype.filter = function(filter, matcher)
{
    var length = this.choices.length;
        matcher = this.parseMatcher(matcher);

    for (var i = 0; i < length; i++) {
        this.choices[i].filter(filter, matcher);
    }
};

/**
 * Test if the value of the given options exists in the filter
 *
 * @param {Option} option
 * @param {Array} filter
 *
 * @return {Boolean}
 */
Choice.prototype.matchers.valueOptionMatcher = function(filter, option)
{
    return $.isArray(filter) ? filter.indexOf(option.value) >= 0 : filter === option.value;
};

/**
 * Choose a matcher according to the given options
 *
 * @param {mixed} matcher
 *
 * @return {Function}
 */
Choice.prototype.parseMatcher = function(matcher)
{
    var type = typeof(matcher);

    if (type == 'function') {
        return matcher;
    }

    if (type == 'string' && typeof(this.matchers[matcher]) != 'undefined') {
        return this.matchers[matcher];
    }

    return this.matchers.valueOptionMatcher;
};
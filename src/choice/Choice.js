
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
    this.groups   = [];
    this.value    = null;

    this.addOptions(this.element, typeof options.data != 'undefined' ? options.data : null);

    this.element.on('change', this.updateValue.bind(this));
    this.updateValue();
}

/**
 * Filter groups
 *
 * @type {Boolean}
 */
Choice.prototype.filterGroups = false;

/**
 * Available matchers
 *
 * @type {Object}
 */
Choice.prototype.matchers = {};

/**
 * Add options
 *
 * @param {DOMElement} element
 * @param {Object} data
 */
Choice.prototype.addOptions = function(element, data)
{
    var children = $(element).children(),
        length = children.length;

    for (var i = 0; i < length; i++) {
        this.addOption(children[i], data);
    }
};

/**
 * Add option element
 *
 * @param {DOMElement} element
 * @param {Object} data
 */
Choice.prototype.addOption = function(element, data)
{
    if (element.tagName.toLowerCase() === 'optgroup') {
        this.groups.push(new OptionGroup(element, this, data));
        this.addOptions(element, data);
    } else {
        var option = new Option(element, this, data);

        if (option.isValid()) {
            this.choices.push(option);
        }
    }
};

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
 *
 * @param {mixed} filter Value to filter by
 * @param {String|Closure} matcher
 */
Choice.prototype.filter = function(filter, matcher)
{
    var choices = this.choices.length,
        groups = this.groups.length;

    matcher = this.parseMatcher(matcher);

    for (var i = 0; i < choices; i++) {
        this.choices[i].filter(filter, matcher);
    }

    for (var g = 0; g < groups; g++) {
        this.groups[g].filter(null, this.matchers.validMatcher);
    }

    return this;
};

/**
 * Update the choice from filters
 */
Choice.prototype.reset = function()
{
    var choices = this.choices.length,
        groups = this.groups.length;

    for (var g = 0; g < groups; g++) {
        this.groups[g].attach();
    }

    for (var i = 0; i < choices; i++) {
        this.choices[i].attach();
    }

    return this;
};

/**
 * Add matcher
 *
 * @param {String} name The name of the matcher
 * @param {Function} callback
 */
Choice.prototype.addMatcher = function(name, callback)
{
    this.matchers[name] = callback;

    return this;
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
 * Test if the option is valid
 *
 * @param {Option} option
 * @param {Array} filter
 *
 * @return {Boolean}
 */
Choice.prototype.matchers.validMatcher = function(filter, option)
{
    return option.isValid();
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
    var type = typeof matcher;

    if (type == 'function') {
        return matcher;
    }

    if (type == 'string' && typeof this.matchers[matcher] != 'undefined') {
        return this.matchers[matcher];
    }

    return this.matchers.valueOptionMatcher;
};

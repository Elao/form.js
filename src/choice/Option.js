/**
 * Option
 *
 * @param {Element} element
 * @param {Choice} parent
 * @param {Function} data
 */
function Option(element, parent, data)
{
    this.element      = $(element);
    this.parent       = parent;
    this.valueElement = this.parent.expanded ? this.element.find('input[type="' + (this.parent.multiple ? 'checkbox' : 'radio') + '"]:first') : this.element;
    this.value        = smartParse(this.valueElement.val());
    this.data         = typeof(data) == 'function' ? data.call(this) : this.element.data();
}

/**
 * Filter the option
 *
 * @param {Array} filter
 */
Option.prototype.filter = function(filter, matcher)
{
    this.detach();

    if (this.match(filter, matcher)) {
        this.attach();
    } else {
        this.handleSelection();
    }

    return this;
};

/**
 * Handle current selection
 */
Option.prototype.handleSelection = function()
{
    if (this.isSelected()) {
        this.valueElement.prop(this.getSelectionProperty(), false);
        this.triggerChange();
    }
};

/**
 * Is the option selected
 *
 * @return {Boolean}
 */
Option.prototype.isSelected = function()
{
    return this.valueElement.is(':' + this.getSelectionProperty());
};

/**
 * Get selection property
 *
 * @return {String}
 */
Option.prototype.getSelectionProperty = function()
{
    return this.parent.expanded ? 'checked' : 'selected';
};

/**
 * Trigger change
 */
Option.prototype.triggerChange = function()
{
    (this.parent.expanded ? this.valueElement : this.parent.element).trigger('change');
};

/**
 * Filter
 *
 * @param {Array} filter
 *
 * @return {Boolean}
 */
Option.prototype.match = function(filter, matcher)
{
    return matcher(filter, this);
};

/**
 * Attach to the DOM
 */
Option.prototype.attach = function()
{
    if (!this.isAttached()) {
        this.parent.element.append(this.element);
    }
};

/**
 * Attach to the DOM
 */
Option.prototype.detach = function()
{
    if (this.isAttached()) {
        this.element.remove();
    }
};

/**
 * Is attached to DOM?
 *
 * @return {Boolean}
 */
Option.prototype.isAttached = function()
{
    return this.element.parent().length;
};

/**
 * Is valid
 */
Option.prototype.isValid = function()
{
    return this.value !== null;
};

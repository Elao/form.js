/**
 * Option
 *
 * @param {Element} element
 * @param {Choice} parent
 * @param {Function} data
 */
function OptionGroup(element, parent, data)
{
    Option.call(this, element, parent, data);
}

OptionGroup.prototype = Object.create(Option.prototype);
OptionGroup.prototype.constructor = OptionGroup;

/**
 * Is valid
 */
OptionGroup.prototype.isValid = function()
{
    return this.element.children().length > 0;
};

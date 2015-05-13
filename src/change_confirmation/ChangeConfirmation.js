/**
 * Form change confirmation
 *
 * @param {DOMElement} element
 * @param {Object} options
 */
function ChangeConfirmation(element, options)
{
    this.element   = $(element);
    this.submitted = null;
    this.changed   = [];

    if (typeof(options.tolerance) !== 'undefined') {
        this.tolerance = options.tolerance;
    }

    if (typeof(options.message) !== 'undefined') {
        this.message = options.message;
    }

    this.onLeave           = this.onLeave.bind(this);
    this.onChange          = this.onChange.bind(this);
    this.onReset           = this.onReset.bind(this);
    this.onSubmit          = this.onSubmit.bind(this);
    this.checkAllForChange = this.checkAllForChange.bind(this);

    this.element.on('submit', this.onSubmit);
    this.element.on('reset', this.onReset);
    this.element.on('change', this.onChange);

    $(window).on('beforeunload', this.onLeave);
}

/**
 * Confirmation message
 *
 * @type {String}
 */
ChangeConfirmation.prototype.message = 'You have unsaved changes. Are you sure you want to quit?';

/**
 * Time tolerance between submit and leave page (in ms)
 *
 * @type {Number}
 */
ChangeConfirmation.prototype.tolerance = 200;

/**
 * When the user is leaving the page
 *
 * @param {Event} e
 *
 * @return {String|Null}
 */
ChangeConfirmation.prototype.onLeave = function(e)
{
    if (this.isChanged() && (this.now() - this.submitted) > this.tolerance) {
        return this.message;
    }
};

/**
 * On form change
 *
 * @param {Event} e
 */
ChangeConfirmation.prototype.onChange = function(e)
{
    this.checkForChange(e.target);
};

/**
 * On form reset
 *
 * @param {Event} e
 */
ChangeConfirmation.prototype.onReset = function(e)
{
    // Needs to be asynchronous
    setTimeout(this.checkAllForChange, 0);
};

/**
 * Check all elements for change
 */
ChangeConfirmation.prototype.checkAllForChange = function()
{
    var elements = this.element[0].elements;

    for (var element, i = elements.length - 1; i >= 0; i--) {
        this.checkForChange(elements[i]);
    }
};

/**
 * Check for change
 *
 * @param {Element} element
 */
ChangeConfirmation.prototype.checkForChange = function(element)
{
    this.toggleChanged(element, element.defaultValue !== element.value);
};

/**
 * Add changed field
 *
 * @param {Element} element
 * @param {Boolean} toggle
 */
ChangeConfirmation.prototype.toggleChanged = function(element, toggle)
{
    var index  = this.changed.indexOf(element),
        exists = index !== -1,
        labels = this.getLabels(element);

    if (toggle && !exists) {
        this.changed.push(element);
        labels.addClass('changed');
    } else if (!toggle && exists) {
        this.changed.splice(index, 1);
        labels.removeClass('changed');
    }
};

/**
 * Is changed
 *
 * @type {Boolean}
 */
ChangeConfirmation.prototype.isChanged = function()
{
    return this.changed.length > 0;
};

/**
 * On form is submitted
 *
 * @param {Event} e
 */
ChangeConfirmation.prototype.onSubmit = function(e)
{
    this.submitted = this.now();
};

/**
 * Get labels
 *
 * @type {NodeList}
 */
ChangeConfirmation.prototype.getLabels = function(element)
{
    if (typeof(element.labels) === 'undefined') {
        element.labels = $('label[for="' + element.id + '"]');
    }

    return $(element.labels);
};

/**
 * Get current timestamp
 *
 * @type {integer}
 */
ChangeConfirmation.prototype.now = function()
{
    return new Date().getTime();
};

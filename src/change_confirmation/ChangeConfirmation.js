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

    this.onLeave  = this.onLeave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.element.on('submit', this.onSubmit);
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
    var changed = e.target.defaultValue !== e.target.value;

    this.getLabels(e.target).toggleClass('changed', changed);
    this.toggleChanged(changed, e.target.id);
};

/**
 * Add changed field
 */
ChangeConfirmation.prototype.toggleChanged = function(toggle, id)
{
    var index = this.changed.indexOf(id),
        exists = index !== -1;

    if (toggle && !exists) {
        this.changed.push(id);
    } else if (!toggle && exists) {
        this.changed.splice(index, 1);
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
        element.labels = element.labels = $('label[for="' + element.id + '"]');
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

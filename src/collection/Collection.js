/**
 * Collection
 *
 * @param {Element} element
 * @param {Object} options
 */
function Collection(element, options)
{
    this.element       = $(element);
    this.replaceKey    = new RegExp(this.element.data('collection'), 'g');
    this.currentKey    = this.count();
    this.allowAdd      = false;
    this.allowDelete   = false;
    this.min           = false;
    this.max           = false;
    this.limitMin      = false;
    this.limitMax      = false;
    this.htmlPrototype = null;
    this.addButton     = null;
    this.items         = null;
    this.clearData     = typeof options.clearData == 'undefined' || options.clearData;
    this.onAdd         = typeof options.onAdd == 'function' ? options.onAdd : false;
    this.onRemove      = typeof options.onRemove == 'function' ? options.onRemove : false;

    this.parseAdd(options);
    this.parseDelete(options);
    this.parseMin(options);
    this.parseMax(options);
    this.parseItems(options);

    if (this.clearData) {
        this.element.removeAttr('data-collection');
    }

    this.element.data('collection', this);
}

/**
 * Update limit
 */
Collection.prototype.updateLimit = function()
{
    if (!this.items) {
        return false;
    }

    if (this.min) {
        this.limitMin = this.count() <= this.min;

        for (var i = this.items.length - 1; i >= 0; i--) {
            this.items[i].toggleDelete(!this.limitMin);
        }
    }

    if (this.max) {
        this.limitMax = this.count() >= this.max;

        this.addButton.toggle(!this.limitMax);
    }
};

/**
 * Get length of the collection
 *
 * @return {Number}
 */
Collection.prototype.count = function()
{
    return this.element.children().length;
};

/**
 * Can add?
 *
 * @return {boolean}
 */
Collection.prototype.canAdd = function(item)
{
    return this.allowAdd && !this.limitMax && (this.onAdd ? this.onAdd.call(this, item) : true);
};

/**
 * Can add?
 *
 * @return {boolean}
 */
Collection.prototype.canRemove = function(item)
{
    return this.allowDelete && !this.limitMin && (this.onRemove ? this.onRemove.call(this, item) : true);
};

/**
 * Add a new item
 *
 * @param {CollectionItem|null} item
 */
Collection.prototype.add = function(item)
{
    if (typeof(item) !== 'object' && item.constructor.name !== 'CollectionItem') {
        item = this.getPrototype();
    }

    if (this.canAdd(item)) {
        this.items.push(item);
        this.element.append(item.element);
        this.currentKey++;
        this.element.trigger('collection:added', [item]);
    }
};

/**
 * Delete an existing item
 *
 * @param {CollectionItem} item
 */
Collection.prototype.remove = function(item)
{
    var index = this.items.indexOf(item);

    if (index >= 0 && this.canRemove(item)) {
        this.items.splice(index, 1);
        item.element.remove();
        this.element.trigger('collection:deleted', [item]);
    }
};

/**
 * Get a new item from the HTML prototype
 *
 * @return {Element}
 */
Collection.prototype.getPrototype = function()
{
    return new CollectionItem(this, this.htmlPrototype.replace(this.replaceKey, this.currentKey));
};

/**
 * Parse add button
 */
Collection.prototype.parseAdd = function()
{
    var addButtonId = this.element.data('collection-add');

    this.htmlPrototype = this.element.data('prototype');
    this.element.removeAttr('data-prototype');

    if (addButtonId) {
        this.allowAdd  = true;
        this.addButton = $('#' + addButtonId);
        this.addButton.on('click', this.onAddClick.bind(this));

        if (this.clearData) {
            this.element.removeAttr('data-collection-add');
        }
    }
};

/**
 * Parse add button
 */
Collection.prototype.parseDelete = function()
{
    if (this.element.data('collection-delete')) {
        this.allowDelete = true;

        if (this.clearData) {
            this.element.removeAttr('data-collection-delete');
        }
    }
};

/**
 * Parse Mininum
 */
Collection.prototype.parseMin = function()
{
    var min = this.element.data('collection-min');

    if (min) {
        this.min = min;
        this.element.on('collection:deleted', this.updateLimit.bind(this));

        if (this.clearData) {
            this.element.removeAttr('data-collection-min');
        }

        this.updateLimit();
    }
};

/**
 * Parse Maximum
 */
Collection.prototype.parseMax = function()
{
    var max = this.element.data('collection-max');

    if (max) {
        this.max = max;
        this.element.on('collection:added', this.updateLimit.bind(this));

        if (this.clearData) {
            this.element.removeAttr('data-collection-max');
        }

        this.updateLimit();
    }
};

/**
 * Parse Items
 *
 * @return {Array}
 */
Collection.prototype.parseItems = function()
{
    if (!this.items) {
        this.items = [];

        var items = this.element.children(),
            length = items.length;

        for (var i = 0; i < length; i++) {
            this.items.push(new CollectionItem(this, items[i]));
        }

        this.updateLimit();
    }
};

/**
 * On add button clicked
 *
 * @param {Event} event
 */
Collection.prototype.onAddClick = function(event)
{
    this.add();
};

/**
 * Collection Item
 *
 * @param {Collection} collection
 * @param {Element} element
 */
function CollectionItem(collection, element)
{
    this.collection   = collection;
    this.element      = $(element);
    this.deleteButton = null;

    this.parseDelete();
}

/**
 * Remove item from collection
 */
CollectionItem.prototype.remove = function()
{
    this.collection.remove(this);
};

/**
 * Toggle delete
 */
CollectionItem.prototype.toggleDelete = function(toggle)
{
    if (this.deleteButton) {
        this.deleteButton.toggle(toggle);
    }
};

/**
 * Parse delete
 */
CollectionItem.prototype.parseDelete = function()
{
    if (this.deleteButton === null) {
        var deleteButton = $('[data-collection-delete="' + this.element[0].id + '"]', this.element);

        if (this.collection.allowDelete && deleteButton) {
            this.deleteButton = deleteButton;
            this.deleteButton.on('click', this.remove.bind(this));
            this.deleteButton.removeAttr('data-collection-delete');
        }
    }
};

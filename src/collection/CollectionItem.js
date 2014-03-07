/**
 * Collection Item
 *
 * @param {Collection} collection
 * @param {Element} element
 */
function CollectionItem (collection, element)
{
    this.collection = collection;
    this.element    = element;

    var deleteButton = $('[data-delete="' + this.element[0].id + '"]', element);

    if (this.collection.allowDelete && deleteButton) {
        this.deleteButton = deleteButton;
        this.deleteButton.on('click', this.remove.bind(this));
    }
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
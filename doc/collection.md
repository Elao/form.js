# Collection

The Collection plugin is meant to be the Javascript side of the [Symfony2 Collection Type](http://symfony.com/doc/current/reference/forms/types/collection.html).

A Collection is a form field that holds a list of sub forms of the same type.
Items can be added or removed from the list (optional).
You can set a minimum and a maximum length for the collection.

## Setting up your form:

The collection needs several options:

__Required configuration:__

* _collection:_ (string) The name of the placeholder to replace in the prototype
* _prototype:_ (string) The HTML code of the prototype of the collection.

__Optional configuration:__

* _add:_ (string) The ID of the add button for the collection. Specifying this option allows the user to add a new element to the collection.
* _delete:_ (string) The Class of the delete buttons for collection items. Specifying this option allows the user to remove existing element from the collection.
* _min:_ (integer) The minimum number of element the collection should contain (prevent item from being deleted if the minimum number of items is not reached).
* _max_:_ (integer) The maximum number of element the collection should contain (prevent item from being added if the  maximum number of items is reached).

The easiest way to specify these options is to set the correct `data-` attribute to the collection root element, as below:

```html
<!-- The collection -->
<form>
    <div
        id="my-collection"
        data-collection="__name__"
        data-prototype="..."
        data-collection-add="my-collection-add"
        data-collection-delete="my-collection-delete"
        data-collection-max="3"
        data-collection-min="1"
    >
    </div>
    <button id="my-collection-add" type="button">Add</button>
</form>
```

```html
<!-- The prototype that should be in the "data-prototype" attribute. -->
<div id="my-collection-__name__-group">
    <input type="text" id="my-collection-__name__" name="my_collection[__name__]"/>
    <button type="button" data-collection-delete="my-collection-__name__-group" class="my-collection-delete">X</button>
</div>
```

## Initialize the collection:

Automatically on all collection fields:

```javascript
$('[data-collection]').collection();
```

or on a specific field:

```javascript
$('#my_collection_field').collection();
```

## Usage

The Collection javascript object that holds all the logic and data of the collection is stored in the 'collection' data attribute of the element.
You can access it like that:

```javascript
$("#my-collection-field").collection();
var collection = $("#my-collection-field").data('collection');
```

__Callbacks:__

Callbacks are called before `adding` and `removing` items in the collection.
They allow you to inject your custom logic and prevent item from being added/removed when you need it.

* _onAdd:_ (function) A callback called in the Collection's context and taking as a parameter the item to add, that should return a boolean: whether the new item should be added.
* _onRemove:_ (function) A callback called in the Collection's context and taking as a parameter the item to remove, that should return a boolean: whether the given item should be removed.

Callbacks have to be specified when setting up the collection, as below:

```javascript
$('#my_collection_field').collection({
    onAdd: function (item) { return confirm('Are you sure you want to add an item?'); },
    onRemove: function (item) { return confirm('Are you sure you want to delete this item?'); },
});
```



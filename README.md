form.js
=======

[![Build Status](http://api.travis-ci.org/Elao/form.js.png)](http://travis-ci.org/Elao/form.js)

Form JS utilities.

## Installation:

### With Bower:

Specify __form.js__ as a dependencie in your `bower.json` file:

```json
  {
    "name": "my-project",
    "dependencies": {
      "elao-form.js": "0.1"
    }
  }
```

Run `bower install`

## Usage:

### Include the source your app:

The jquery plugin minified version can be found in: `dist/form.js`.

(You can also found the full sources in `src/`)

### Set up your forms:

The collection need several options:

__Required options:__

* _collection:_ (string) The name of the placeholder to replace in the prototype
* _prototype:_ (string) The HTML code of the prototype of the collection.

__Optional options:__

* _add:_ (string) The ID of the add button for the collection. Specifying this option allow the the user to new element to the collection.
* _delete:_ (string) The Class of the delete buttons for collection items. Specifying this option allow the user to remove of existing element from the collection.
* _min:_ (integer) The minimum number of element the collection should contain (prevent item from being deleted if the minimum number of items is not reached).
* _max_:_ (integer) The maximum number of element the collection should contain (prevent item from being added if the  maximum number of items is reached).

The easier way to specify this options is to set the correct `data-` attributes to the collection root element, as below:

```html
<!-- The collection -->
<form>
    <div
        id="my-collection"
        data-collection="__name__"
        data-prototype="..."
        data-add="my-collection-add"
        data-delete="my-collection-delete"
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
    <button type="button" data-delete="my-collection-__name__-group" class="my-collection-delete">X</button>
</div>
```

### Initialise the collection:

Automatically on all collection fields:

```javascript
$('[data-collection]').collection();
```

or on a specific field:

```javascript
$('#my_collection_field').collection();
```

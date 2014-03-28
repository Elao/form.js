# Choice

The Choice plugin is ment to be the Javascript side of the [Symfony2 Choice Type](http://symfony.com/doc/current/reference/forms/types/choice.html).

A Choice is a form field that ask the user to pick none, one or several values in a defined set of value.
A Choice field by default is 'collapsed': a `select` tag.
A Choice field can be 'expanded' in wich case it's a group of radio or checkbox inputs.
A Choice field can be 'multiple', allowing the user to pick several values in the set, in witch case it's either a group of checkbox or a select tag with a 'multiple' attribute.

## Initialise the choice:

### Collapsed choice (select tag):

#### Single:

```html
<!-- Collapsed single choice -->
<form>
    <select name="collapsed_single">
        <option value="0">Foo</option>
        <option value="1">Bar</option>
        <option value="2">Dur</option>
    </select>
</form>
```

#### Multiple:

```html
<!-- Collapsed multiple choice -->
<form>
    <select name="collapsed_multiple" multiple="multiple">
        <option value="0">Foo</option>
        <option value="1">Bar</option>
        <option value="2">Dur</option>
    </select>
</form>
```

__Initialise both choices:__

```javascript
$("select").choice();
```

### Expanded choice (radio or checkboxe input tags):

#### Single:

```html
<!-- Expanded single choice -->
<form>
    <fieldset id="expanded-single">
        <label for="expanded-single-0">
            <input type="radio" id="expanded-single-0" name="expanded_single" value="0" />
            Foo
        </label>
        <label for="expanded-single-1">
            <input type="radio" id="expanded-single-1" name="expanded_single" value="1" />
            Bar
        </label>
        <label for="expanded-single-2">
            <input type="radio" id="expanded-single-2" name="expanded_single" value="2" />
            Dur
        </label>
    </fieldset>
</form>

__Initialise this specific choice:__

```javascript
$("#expanded-single").choice();
```

_Note:_ The choice should be initiated on a single container element (it doesn't have to be a `fieldset` tag).
The container should have exactly a children for each choice: no more, no less (it doesn't have to be `label` tags).

#### Multiple:

```html
<!-- Expanded multiple choice -->
<form>
    <fieldset id="expanded-multiple">
        <label for="expanded-multiple-0">
            <input type="checkbox" id="expanded-multiple-0" name="expanded_multiple" value="0" />
            Foo
        </label>
        <label for="expanded-multiple-1">
            <input type="checkbox" id="expanded-multiple-1" name="expanded_multiple" value="1" />
            Bar
        </label>
        <label for="expanded-multiple-2">
            <input type="checkbox" id="expanded-multiple-2" name="expanded_multiple" value="2" />
            Dur
        </label>
    </fieldset>
</form>
```

__Initialise this specific choice:__

```javascript
$("#expanded-multiple").choice();
```

## Features

The Choice javascript object that hold all the logic and data of the choice, it's stored in the 'choice' data attribute of the element.
You can access it like that:

```javascript
$("#my-choice-field").choice();
var choice = $("#my-choice-field").data('choice');
```

The choice object provide a set of useful feature and informations:

### Value

The value is accessible via the 'value' property:

For a single choice, will return a scalar corresponding to the current selected option value:
```javascript
/* (Integer) 1 */
$("#expanded-single").data('choice').value;

For a multiple choice, will return a array of scalar corresponding to the current selected options value:
```javascript
/* (Array) [1,2] */
$("#expanded-multiple").data('choice').value;
```

### Filter

You can easily filter the options available in the choice via the `filter(filter)` method.

Just pass the values that should be available in the choice:
```javascript
$("#expanded-multiple").data('choice').filter([0,2]);
```

The filter method accepts a second parameter 'matcher': `filter(filter, matcher)`
The matcher is a callback function that will be called on each option and that should return weither or not the option match the given filter.

The default matcher juste tests that the option value is contained in the given filter:

```javascript
function(filter, option)
{
    return $.isArray(filter) ? filter.indexOf(option.value) >= 0 : filter === option.value;
};
```

That's what appen when you dont provide a `matcher`.

So you can write your own matcher as long as it's a function that follow that pattern:

```javascript
/**
 * Matcher
 *
 * @param {mixed} Filter Your filter
 * @param {Option} option The current Option element
 *
 * @return {Boolean}
 */
function(filter, option)
{
    // Does the option match the current filter?
}

#### The Option object:

To help you determine if the option match the current filter, the Optino object has two interesting properties:

* `option.value`: is the value of the element.
* `option.data`: an object containing the "data-*" attributes of the element.
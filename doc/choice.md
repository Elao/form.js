# Choice

The Choice plugin is meant to be the Javascript side of the [Symfony2 Choice Type](http://symfony.com/doc/current/reference/forms/types/choice.html).

A Choice is a form field that asks the user to pick none, one or several values in a defined set of values.

A Choice field can be:

* `collapsed` i.e. a select tag (default behaviour)
* `expanded` in which case it's a group of radio or checkbox inputs
* `multiple`, allowing the user to pick several values in the set, in which case it's either a group of checkbox or a select tag with a 'multiple' attribute.

## Initialize the choice

### Collapsed choice (select tag)

#### Single

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

#### Multiple

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

### Expanded choice (radio or checkbox input tags)

#### Single

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
````

__Initialise this specific choice:__

```javascript
$("#expanded-single").choice();
```

_Note:_ The choice should be initialized on a single container element (it doesn't have to be a `fieldset` tag).
The container should have exactly one child for each choice: no more, no less! (it doesn't have to be `label` tags).

#### Multiple

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

__Initialize this specific choice:__
```javascript
$("#expanded-multiple").choice();
```

## Features

The Choice javascript object that holds all the logic and data of the choice is stored in the 'choice' data attribute of the element.
You can access it like that:

```javascript
$("#my-choice-field").choice();
var choice = $("#my-choice-field").data('choice');
```

The choice object provides a set of useful feature and informations.

### Value

The value is accessible via the 'value' property:

For a single choice, it will return a scalar corresponding to the current selected option value:
```javascript
/* (Integer) 1 */
$("#expanded-single").data('choice').value;
````

For a multiple choice, it will return an array of scalars corresponding to the current selected options value:
```javascript
/* (Array) [1,2] */
$("#expanded-multiple").data('choice').value;
```

### Filter

You can easily filter the available options via the `filter(filter)` method.

Just pass the values that should be available in the choice:
```javascript
$("#expanded-multiple").data('choice').filter([0,2]);
```

The filter method accepts a second parameter 'matcher': `filter(filter, matcher)`
The matcher is a callback function that will be called on each option. It should return whether the option matches the given filter.

The default matcher just tests that the option value is contained in the given filter:

```javascript
function(filter, option)
{
    return $.isArray(filter) ? filter.indexOf(option.value) >= 0 : filter === option.value;
};
```

That's what happen when you don't provide a custom `matcher`.

So you can write your own matcher as long as it's a function that follows this pattern:

```javascript
/**
 * Matcher
 *
 * @param {mixed} filter Your filter
 * @param {Option} option The current Option element
 *
 * @return {Boolean}
 */
function(filter, option)
{
    // Does the option match the current filter?
}
```

__Example:__ Filter by `data-*` attribute

```html
<select id="country">
    <option calue>All</option>
    <option value="uk">United Kingdom</option>
    <option value="de">Germany</option>
    <option value="fr">France</option>
</select>

<select id="city">
    <option value="1" data-country="uk">London</option>
    <option value="2" data-country="uk">Manchester</option>
    <option value="3" data-country="de">Berlin</option>
    <option value="4" data-country="fr">Paris</option>
    <option value="5" data-country="fr">Lyon</option>
    <option value="6" data-country="fr">Montpellier</option>
</select>
```

```javascript
var country = $('#country').choice().data('choice'),
    city = $('#city').choice().data('choice');

city.addMatcher('country', function (filter, option) {
    return option.data.country === filter;
});

country.element.on('change', function (e) {
    if (country.value === null) {
        city.reset();
    } else {
        city.filter(country.value, 'country');
    }
});
```

#### The Option object:

To help you determine if the option matches the current filter, the Option object has two interesting properties:

* `option.value`: is the value of the element.
* `option.data`: an object containing all the "data-*" attributes of the element.

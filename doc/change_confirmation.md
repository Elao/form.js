# Change confirmation

The Change Confirmation watches for changes on the given form and display a confimation message to the user when leaving the page with unsaved changes.

## Initialize the change confirmation on a form:

```javascript
$('form').changeConfirmation();
```

## Options:

You can specify the message displayed to the user, in the Javascript call:

```javascript
$('form').changeConfirmation({ message: 'My confirmation message' });
```

Or with the `data-confirmation-message` HTML attribute:

```html
<form data-confirmation-message="My confirmation message">
    <!-- ... -->
</form>
```

If you don't specify anything, the default message will be: `You have unsaved changes. Are you sure you want to quit?`

## Notes:

- The class `changed` will be added to the label of the changed field.
- If a form field goes back to its default value, it will be considered as unchanged.

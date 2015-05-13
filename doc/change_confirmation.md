# Change confirmation

The Change Confirmation watches for changes on the given form and display a confimation message to the user when leaving the page with unsaved changes.

## Initialize the change confirmation on a form:

```javascript
$('form').changeConfirmation();
```
## Options:

You can specify the message displayed to user user, in the Javascript call:

```javascript
$('form').changeConfirmation({ message: 'You have unsaved changes. Are you sur you want to quit?' });
```

Ot with the `data-confirmation-message` HTML attribute:

```html
<form data-confirmation-message="You have unsaved changes. Are you sur you want to quit?">
    <!-- ... -->
</form>
```

## Notes:

- The class `changed` will be added to the label of the changed field.
- If an form field goes back to its default value, it will be considered as unchanged.

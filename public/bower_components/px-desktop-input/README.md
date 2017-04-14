px-input
============

## Using px-input

`px-input` is a standard textbox input.

```html
<px-input placeholder="Enter a Value" auto-validate pattern="[0-9]*"></px-input>
```

## Using px-file-input

`px-file-input` is a file chooser input. It appears initially as a button, but once a file is selected, it displays the filename and a user-specified button to perform an action on the file (optional).

```html
<px-file-input accept="image/*" placeholder="Choose Image...">
	<px-button small icon="px-icons:import"></px-button>
</px-file-input>
```

## Using px-textarea

`px-textarea` is a text area for multi-line text input.

```html
<px-textarea label="Note"  value="" rows="5"></px-textarea>
```
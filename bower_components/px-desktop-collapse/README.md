px-collapse-header / px-collapse
============

## Using px-collapse-header / px-collapse

`px-collapse-header` is a header bar for an expandable/collapsible `px-collapse` section.

Inner components that are px-button, px-icon-button, or have attribute "right" are placed in the upper right side of the header.

```html
<px-collapse-header icon="px-icons:user" controls="#collapse">
	<px-title maintitle="User Settings"></px-title>
</px-collapse-header>
<px-collapse id="collapse">
	...
</px-collapse>
```

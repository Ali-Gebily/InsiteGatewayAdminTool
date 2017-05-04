px-card / px-card-container
============

## Using px-card / px-card-container

`px-card-container` is a container element that manages the layout of `px-card` objects. They can be nested to create more complex card layouts. 
`px-card` is a small rectangular container for holding content. Typically they have an actionbar that contains header information or actions.

```html
<px-card-container horizontal>
	<px-card-container>
		<px-card></px-card>
	</px-card-container>
	<px-card-container vertical>
		<px-card></px-card>
		<px-card></px-card>
	</px-card-container>
</px-card-container>
```

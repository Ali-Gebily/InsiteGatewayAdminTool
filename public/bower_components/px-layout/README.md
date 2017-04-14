px-layout & px-view
============

## Using px-layout

`<px-layout></px-layout>` 

px-layout is a component that does layout related stuff. It has responsive breakpoints built in and can be manipulated using the layout, mobileLayout and tabletLayout attributes.

It accepts `px-navigation`, `px-navigation-container`, `px-navigation-surrogate`, `px-view`, `px-modal`, `px-modal-container`, `px-notification`, `px-reveal`, etc. as content.

```html
<px-layout layout="touch mobilelayout="drawer">
	<px-navigation></px-navigation>
</px-layout>
```

## Using px-view

`<px-view></px-view>` 

px-view is bundled with px-layout. It is a component that handles individual views. Think "actionbar, content and sidebar" types of views. It can control whether a sidebar is visible or not.

It accepts `px-actionbar`, `px-content`, `px-sidebar` as content.

<px-layout sidebar="closed">
	<px-actionbar></px-actionbar>
	<px-content canvas></px-content>
	<px-sidebar></px-sidebar>
</px-layout>
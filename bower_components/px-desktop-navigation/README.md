px-navigation
============

## Using px-navigation

`px-navigation` is a container for `px-tab`s.  It is typically used along the top of a given interface.

```html
<px-navigation extra>
    <span>Connection lost, trying to reconnect...</span>
    <span class="flex"></span>
    <px-tab>Welcome, <b>admin</b>!</px-tab>
    <px-tab>07/16/2015 03:14:27 PM EDT</px-tab>
    <px-tab icon="px-icons:help">Help</px-tab>
    <px-tab icon="px-icons:settings">Settings</px-tab>
    <px-tab app active>Power Xpert Insight</px-tab>
</px-navigation>
<px-navigation>
	<px-tab icon="px-icons:favorite">Favorites</px-tab>
	<px-tab icon="px-icons:alarm" active>Alarms</px-tab>
	<px-tab icon="px-icons:oneline">One-lines</px-tab>
	<px-tab icon="px-icons:energy">Energy</px-tab>
	<px-tab icon="px-icons:capacity">Capacity</px-tab>
</px-navigation>
```
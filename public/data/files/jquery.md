# jQuery
These notes draw upon <a target="_blank" href="https://launchschool.com/">Launch School's</a> course materials and <a target="_blank" href="http://api.jquery.com/">jQuery's</a> official documentation.

## Introduction
Originally conceived as browser support code aimed at providing a consistent API for interacting with the DOM, jQuery is a JS library that provides a set  of convenience methods that can be called on DOM objects or collections of DOM objects.  jQuery is implemented in JS.

We can include jQuery in our application using a **Content Delivery Network (CDN)**.  The code below (which should be pasted into the `head` of our document), allows us to access jQuery without having installed directly on the machine.  It can be found <a target="_blank" href="https://developers.google.com/speed/libraries/">here.</a>

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/<VERSION_NUM>/jquery.min.js"></script>
```

In order to manipulate some aspect of the DOM with jQuery (or with JS, for that matter), the DOM must have properly loaded.  This can be handled by placing the script tag at the bottom of the HTML `body`, or by using the following formulation:

```javascript
$(document).ready(function() {
 // executes after DOM loaded
});
```

or its shorthand:

```javascript
$(function() {
  // executes after DOM loaded
}
```

while this syntax is used for the `load` page event:

```javascript
$(window).load(function() {
 // executed after page finishes rendering
});
```

jQuery can perform CSS query selections using this syntax:

```javascript
$(query_string);
```

which returns a jQuery collection.  Most CSS is recognized by jQuery.

## jQuery Events
Registering event listeners is accomplished in jQuery with the following syntax:

```javascript
$(selectorString).on(eventName, callback);
```

where:

 - `on` is used to assign the event listener, taking an event and callback argument
 - `selectorString` is a string representation of a CSS-style selector the targets the element or elements we want to serve as event target for the listener
 - `eventName` is the kind of event we want to listen for
 - `callback` is the function that will be executed, and is supplied an `event` object

Using this syntax, the code below will output the `tagName` of each element in `body` on which the user clicks:

```javascript
$('body').on('click', function(event) {
  console.log(event.target.tagName);
});
```

Event listeners can be removed from a jQuery selection using:

```javascript
$(selector).off(event);
```

where `event` filters listeners and `selector` filters nodes.

## jQuery DOM Traversal
A full list of jQuery DOM traversal methods can be found <a href="http://api.jquery.com/category/traversing/">here.</a>

### Traversing Down
Traversing down (i.e., returning descendants of the current node) can be accomplished with `find`, which returns a jQuery collection of all of the descendent nodes that match the selector:

```javascript
$('#intro').find('p');
```

The code above will return a collection of all paragraph element nodes that are descendents of the element selected by `'#intro'`.

### Traversing Up
Traversing up (i.e., returning ancestors of the current node) can be accomplished with `closest`, which returns a jQuery collection of the closest single ancestor node (including the current node!) that match the selector:

```javascript
$('article').closest('h1');
```

### Traversing Siblings

|Method|Return Value|
|---|---|
|`next(optSelector)`|A jQuery collection holding the next sibling, optionally filtered by `optSelector`|
|`nextAll(optSelector)`|A jQuery collection holding all next siblins that match `optSelector`|
|`prev(optSelector)`|A jQuery collection holding the previous sibling, optionally filtered by `optSelector`|
|`prevAll(optSelector)`|A jQuery collection holding all previous siblings, optionally filtered by `optSelector`|

NB: for `next` and `prev`, if the next or previous sibling doesn't match the optional selector, no nodes will be returned.

## jQuery Animations
jQuery has set functions for slides and fades, and allows the developer to specify custom animations as well.

### Fades and Slides

|Method|Description|
|---|---|
|`fadeOut`|Sets opacity to 0|
|`fadeIn`|Sets opacity to 1|
|`fadeToggle`|toggles between 0 and 1 opacity|
|`fadeTo(duration, finalOpacity)`|over `duration` transition to `finalOpacity`|

|Method|Description|
|---|---|
|`slideDown`|Slides target element down into view|
|`slideUp`|Slides target element up out of view|
|`slideToggle`|Toggles between down into view and up out of view|

The simple forms of both of these types of animations take optional `duration`, `easing`, and `callback` arguments, which denote the time over which the animation will be executed, the type of transition (`linear` or `swing`), and a function to be invoked upon animation completion, respectively.

### Animate
`animate` performs a custom animation using an argument object that has properties and values corresponding to CSS property names and the finish values for the transition.  The pre-invocation values serve as the start values for the transition:

```javscript
$('div').animate({
  top: 300,
  left: 300,
});
```

Animate also takes optional `duration` and `easing` arguments.  If *relative* values are desired, we use the following format: `left: "+=50",`.

### Utility Methods

|Method|Description|
|---|---|
|`delay(duration)`|Delays an animation for `duration` milliseconds when placed prior to an animation call|
|`stop(stopAll, lastFrame)`|Stops animations in progress. If `stopAll` is true, all subsequent animations will also be stopped. If `lastFrame` true, then the animation jumps to its last frame|
|`finish`|stops the current animation, jumps to last frame, and causes all subsequent animations to jump to last frame as well|

### Resetting Animations
The CSS value changes that cause jQuery animations are applied using the `style` attribute.  Thus, animations can be reset by **removing the `style` attribute from the animated element**:

```javascript
$('div').removeAttr('style');
```

## Event Delegation in jQuery
Event delegation in jQuery can be achieved using the `on` method with an optional second `selector` argument:

```javascript
parent.on(event, selector, function(e) { ... });
```

this code listens for the given event and then, upon encountering it in the bubbling phase, checks whether `e.target` is `selector`.  If so, the handler is invoked.

## jQuery's proxy
jQuery's `$.proxy` method is functionally equivalent to vanilla JS's `bind`.  It takes a function argument and a context argument and returns a new function, bound to the object:

```javascript
var boundFunc = $.proxy(func, context);
```

## Data Attributes in jQuery
Read <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes">here</a> about data attributes in JS.

jQuery provides two methods that access data attributes on DOM elements, `data` and `attr`.

`data` takes as argument the post `-` portion of the attribute's name, and returns the argument.  When used as a setter, however, it creates a property/value pair internal to the DOM element, which is different than the `data` attribute.

`attr` takes the full attribute name, and can be used to set new `data` attributes as expected.  For this reason, **prefer `attr` when interacting with data attributes in jQuery**.

## Interacting with Forms using jQuery
jQuery has <a href="http://api.jquery.com/category/forms/">built-in methods</a> for interacting with form elements.  Most of these are event listeners that bind handlers to specific form events, but the most important are two that serialize forms, that is, that convert forms into different data types that are more conducive to being sent via AJAX requests.

Given the following tag in the document:

```html
<input type="text" name="user_name" />
```

`serialize` will return a string holding the input's name and value:

```javascript
$('input').serialize(); // => "user_name=bob11"
```

while `serializeArray` returns an array of objects holding the input names and values.  In this case, it returns an array with a single object:

```javascript
$('input').serializeArray(); // => [{ name: "user_name", value: "bob11" }]
```

jQuery also has a `val` method that returns the value held by `input` elements.  `val` can also be used as a setter method to set the value held by the given input.

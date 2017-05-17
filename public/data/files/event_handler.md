# EventHandlers vs EventListeners in JavaScript
Since JavaScript is principally an <a target="_blank" href="https://en.wikipedia.org/wiki/Event-driven_programming">event-driven language,</a> especially in the front-end context, waiting for and responding to page or user actions is critically important.  The complex of objects, functions and mixins JavaScript uses to handle this process is often referred to as *the event handler* or the *the event listener*, and the two terms are frequently used interchangeably in resources online.  However, they are not the same thing!  This post aims to clear up the semantic confusion surrounding this topic and provide an overview of adding and removing event listeners in JavaScript.

An **event listener** is a type of JS <a target="_blank" href="https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener">interface</a> that is attached or *registered* on a node and waits for a particular kind of <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Event">event</a> to be fired on that node, upon which it invokes a specific function referred to as the **event handler**.

In pure JavaScript, this process can be implemented in several ways.

## addEventListener

The developer doesn't interact directly with `EventListener`, but rather uses wrapper functions to create and modify it.  One such function is the DOM node method <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" target="_blank">addEventListener</a>, which creates an `EventListener`, registers it on the receiver node (called the `eventTarget`), and specifies the handler, passing it an `event` object upon invocation:

```javascript
eventTarget.addEventListener(eventType, eventHandler);
```

Following this model, below we have code that registers a listener that will wait for the `click` event firing on `document`, and then will invoke a callback that will alert us of the fact:

```javascript
var handler = function(event) {
  alert(event.target.toString() + ' has been clicked on!');
};

document.addEventListener('click', handler);
```

## GlobalEventHandler

A second approach to adding event listeners involves the use of <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers">GlobalEventHandler</a>, a mixin which holds properties corresponding to many event types, a list of which can be found <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers">here</a>.  This approach entails assigning a function to a given `GlobalEventHandler` property.  The function then becomes the handler for that kind of event:

```javascript
eventTarget.eventProperty = eventHandler;
```

The code below is functionally equivalent to the code above implemented with `addEventListener`:

```javascript
var handler = function(event) {
  alert(event.target.toString() + ' has been clicked on!');
};

document.onclick = handler;
```

Here, however, we don't specify the type of event as an argument, but rather by selecting the GlobalEventHandler property that corresponds to the click event, and setting its value to be the function we want invoked when the event is fired on the `eventTarget`.

An important implication of this approach's object-property style is that only a single handler can be added for a given event type.  This is in contrast to `addEventHandler`, which allows for an indefinite number of handlers to be registered on a node for any given event.

## Removing EventListeners
Event listeners must be removed according to the approach by which they were added to the node.

### For addEventListener
For event listeners registered with `addEventListener`, the DOM node method `removeEventListener` must be used:

```javascript
eventTarget.removeEventListener(eventType, eventHandler);
```

Following this pattern, we would remove the event listener we set above as follows:

```javascript
document.removeEventListener('click', handler);
```

It's important to note that, because `handler` must refer to the same `Function` object used when it was registered, an event listener added with an anonymous function expression cannot be removed with `removeEventListener`.

### For GlobalEventHandler
The object-property style of `GlobalEventHandler` makes removing an event listener added with this approach somewhat easier: simply set the desired `eventProperty` to `undefined`.

```javascript
eventTarget.eventProperty = undefined;
```

Following this pattern, we would remove the event listener set above like this:

```javascript
document.onclick = undefined;
```

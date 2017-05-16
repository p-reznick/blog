# The DOM
These notes draw on <a target="_blank" href="https://launchschool.com/">Launch School's</a> course materials and <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" target="_blank">MDN's DOM documentation</a>.

The DOM (Document Object Model) is an in-memory object representation of an HTML document that provides a way to interact with the web page using JavaScript.  A DOM is a hierarchy (or tree) of Nodes, with the `document` Node as the root.

`document.querySelector(selector)` or `document.getElementById(id)` are the quickest ways to query the web page for element-type nodes using pure JavaScript.

```javascript
var a = document.querySelector('a');
var header = document.getElementById('page-heading');
```

There are many different types of nodes, but the most commonly encountered types in web development are element, text, and comment.  Element nodes represent HTML tags, while text nodes represent all text in the HTML.  Comments, unsurprisingly, represent comments.

## Node Properties
Every node has a set of properties that can be used to determine the node's type as well as get a variety of other useful information.  Some of the more useful properties on element nodes are:

 - `nodeName`: for elements, a string that represents the uppercase element name.
 - `nodeType`: a number that corresponds to a constant that is a property on the `Node` object (e.g., `Node.ELEMENT_NODE` returns `1`) that denotes the node's type.
 - `textContent`: returns the textual content of every text node that is a child of the node in question, essentially returning the text content of all of its child nodes concatenated together.

## Determining Node Type

**In the console**, the best way to determine a node's type is to call `toString()` on the node or pass it into the `String` constructor:

```javascript
p.toString(); // "[object HTMLParagraphElement]"
String(p); // "[object HTMLParagraphElement]"
```

For some element types (like anchors), these string methods return a custom result not in line with the standard response.  One means to get around this is to access the `constructor` property:

```javascript
a.constructor; // function HTMLAnchorElement() { [native code] }
```

**In code**, the best way to ascertain a node's type is using the `instanceof` method or `tagName` property:

```javascript
p instanceof HTMLParagraphElement; // true
p.tagName === 'P'; // true
```

## Traversing Nodes
DOM nodes possess properties that map relationships between them. Parent node properties:

|Parent Node Property|Value|
|---|---|
|`firstChild`|`childNodes[0]` or `null`|
|`lastChild`|`childNodes[childNodes.length - 1]` or `null`|
|`childNodes`|*live collection* of all child nodes|

Child node properties:

|Child Node Property|Value|
|---|---|
|`nextSibling`|`parentNode.childNodes[n+1]` or `null`|
|`previousSibling`|`parentNodes.childNodes[n-1]` or `null`|
|`parentNode`|Immediate parent of receiver node|

Element-type parent node properties:
|Parent Element Property|Value|
|---|---|
|`firstElementChild`|`children[0]` or `null`|
|`lastElementChild`|`children[children.length - 1]` or `null`|
|`children`|*live collection* of all child elements|
|`childElementCount`|`children.length`|

NB: Element-type parent node properties aren't available on `document` in IE; use `document.body`.

### Walking the Tree
Walking the tree refers to visiting all of the nodes subordinate to the given nodes in the hierarchy and performing some action for each of them.  This is often accomplished with a recursive function:

```javascript
function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i += 1) {
    walk(node.childNodes[i], callback);
  }
}

walk(document, function(n) {
  console.log(n.nodeName);
});
```

The code above, for example, would visit every node in the document and output the `nodeName` property.

## Element Attributes
Every element-type DOM node has an interface for accessing and setting its attributes:

|Method|Description|Value|
|---|---|---|
|`getAttribute(attr)`|Retrives value of attribute `attr`|String val of `attr`|
|`setAttribute(attr, newValue)`|Sets value of `attr` to `newValue`|`undefined`|
|`hasAttribute(attr)`|Checks whether the element has `attr`|`boolean`|

NB: the `id` attribute can be read and written directly with `id`.

**The `class` attribute** has a special interface, `classList`, a property that holds a reference to an array-like object called `DOMTokenList`.  We can call `add(name)`, `remove(name)`, `toggle(name)`, etc. on `classList` to manipulate the class attribute more easily.

**The `style` attribute** has a similar interface, accessed through the `style` property, that lets of get and set styles (in camelCase format) directly:

```javascript
h1.style.color; // ''
h1.style.color = red;
h1.style.color; // red
```

## Finding DOM Nodes
The following methods (called on `document`) can be used to find DOM nodes.  The methods that return multiple elements use DOM-specific collections, `HTMLCollection` or `NodeList`:

|Method|Returns|
|---|---|
|`getElementById`|The first element node with matching ID attribute val or `null`|
|`getElementsByTagName`|all matching-tagged element nodes|
|`getElementsByClassName`|all element nodes with matching classes|
|`querySelector`|first element node that matches the CSS selector or `null`|
|`querySelectorAll`|`NodeList` of element nodes matching the CSS selector|

## textContent
The `textContent` property returns all of the element and its subordinate nodes' text, and can also be used as a setter.  The setter property is highly destructive, however, replacing all subordinate nodes with a single text node.

```javscript
document.querySelector('p').textContent;
// "Assessment 249 will test your knowledge on JavaScript and general Front End Programming."
document.querySelector('p').textContent = "Boom!";
// "Boom!"
```

## Creating and Moving DOM Nodes
Note that a given node cannot exist in the DOM more than once; a node moved or inserted at a new location entails removal from the original location.

### Creating New Nodes
|Node Creation Method|Returns|
|---|---|
|`document.createElement(tagName)`|A new element node|
|`document.createTextNode(text)`|A new Text node|
|`node.cloneNode(deepCLone)`|A copy of `node`, with subordinate nodes as well if `deepClone` is `true`|

### Adding New Nodes
|Parent Node Method|Description|
|---|---|
|`appendChild(node)`|Append `node` to the end of `parent.childNodes`|
|`insertBefore(node, targetNode)`|Insert `node` into `parent.childNodes` before `targetNode`|
|`replaceChild(node, targetNode)`|Remove `targetNode` from `childNodes` and insert `node` at its former position|

Relative insertion:
|Insertion method|Description|
|---|---|
|`element.insertAdjacentElement(position, newElement)`|Inserts `newElement` at `position` relative to `element`|
|`element.insertAdjacentText(position, text)`|Inserts Text node containing `text` at `position` relative to `element`|

`position` must be one of the following:

|Position|Description|
|---|---|
|`beforebegin`|Before the `element`|
|`afterbegin`|Just inside the element, before first child|
|`beforeend`|Just inside the element, after last child|
|`afterend`|After element itself|

### Removing Nodes
|Method|Description|
|---|---|
|`node.remove()`|Removes `node` from the DOM|
|`parent.removeChild(node)`|Remove `node` from `parent.childNodes`|

# Event Driven Programming in Front-end Development
Web applications are primarily interfaces, and this interface code has two main tasks:

1. Set up the user interface and display it,
2. Handle events resulting from user or browser actions.

The fact that the interface must *wait* for user action results in the asynchronicity of the JavaScript that listeners for and then handles user actions.

## Events
The event object represents any DOM-related event, be it generated by the user, by APIs, or by the page's lifecycle.  The event object contains properties that provide context about the event and the action that triggered it.

### Page Lifecycle Events
A number of events are triggered during the page's lifecycle.  Below is a simplified page-load order, with the timing of two common lifecycle events (`DOMContentLaoded` and `load`) indicated:

1. HTML code received by browser from server
2. HTML parsed and JS evaluated
3. DOM constructed from parsed HTML => **`DOMContentLoaded`** fires on `document`
4. Page displayed on screen
5. Embedded assets are loaded => **`load`** fires on `window`.

### User Events
User events are organized by event-type, keyboard, mouse, touch, window, form, etc., each of which has particular events for specific user actions.  A full reference list can be found <a href="https://developer.mozilla.org/en-US/docs/Web/Events">here.</a>

## Adding Event Listeners
A **event listener** is a type of JS <a href="https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener">interface</a> that is attached or *registered* on a node and waits for a particular kind of event to be fired on that node, upon which it invokes a specific function called the **event handler**.

The developer doesn't interact directly with `EventListener`, but rather uses the DOM node method **`addEventListener`**, which creates the listener, registers it on the receiver node, called `eventTarget`, and specifies the handler, passing it an `event` object upon invocation:

```javascript
eventTarget.addEventListener(eventType, eventHandler(event));
```

Below is code that registers a listener that will wait for the `click` event firing on `document`, and then will invoke a callback that will alert us of the fact:

```javascript
document.addEventListener('click', function(event) {
  alert(event.toString() + ' has been fired on document!');
});
```

A second approach to adding event listeners involves the use of <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers">`GlobalEventHandler`</a>, which uses object property syntax to add the event handler as a property on the node.  The code below is functionally equivalent to the code above:

```javascript
document.onclick = function(event) {
  alert(event.toString() + ' has been fired on document!');
};
```

## Capturing and Bubbling
Capturing and bubbling refers to the pattern according to which events are propagated in the DOM tree.  When some action occurs that triggers an event, the event is fired on every parent element of `eventTarget` until it fires on `eventTarget` (**capturing**), after which the process is reversed, with the event firing from `eventTarget` all the way back to the global object (**bubbling**).

By default, event listeners trigger on events during their `target` and `bubbling` pharses.  However, we can use an optional third argument in `addEventListener`, `useCapture`, to tell the listener to fire during the `capture` phase.

## Preventing Propagation and Default Behaviors
Event propagation and defualt behavior (i.e., an anchor-type element node redirecting to the anchor's URL) can be prevented by the event method `stopPropagation` and `preventDefault`, each of which are typically called inside of an event handler.

The code below adds an event handler to each anchor element on the page, and prevents its default behavior:

```javascript
var anchors = document.querySelectorAll('a');
anchors = Array.prototype.slice.call(anchors);

anchors.forEach(function(anchor) {
  anchor.addEventListener('click', function(event) {
    event.preventDefault();
    alert("No dice.");
  });
})
```
## Event Delegation
In the example above, we had to gather every single anchor element on the page and register an event listener with each in order to achieve our desired behavior.  This process is cumbersome, and as pages grow in size (and the number of event listeners does as well), the 1:1 ratio of listener to node becomes a performance drain.  This problem can be addressed using **Event Delegation**, which exploits Capturing and Bubbling.

In event delegation, a single listener is added to a parent element of the nodes which we want to monitor, and fires on the desired event.  Logic internal to the handler then only implements the desired behavior if the original event target (`event.target`) is the desired type of element node.  This process is seen below in code the replicates the behavior of our anchor listeners above, but with a single event listener registered on document:

```javascript
document.addEventListener('click', function(event) {
  if (event.target.tagName === 'A') {
    event.preventDefault();
    alert("No dice.");
  } else {
    alert("Not an anchor!");
  }
});
```

This approach sacrifices simplicity in the event handler in exchange for reducing the number of event listeners on the page.

## The Event Loop in JS
See <a href="https://www.youtube.com/watch?v=8aGhZQkoFbQ">this</a> video.

### The Call Stack
JS is a single-threaded runtime, meaning that it can only process one piece of code at a time.  The call stack tracks where we are in the program, with each function call being pushed onto the stack, with the topmost popped off after it is executed to return.

### Blocking
A blocking behavior is an item in the call stack that may potentially take a long time to complete, like a network request.  These are often handled as asynch callbacks so that they don't "freeze" the browser while waiting for completion.

### Asynch Callbacks and the Call Stack
JS supplements the runtime with web APIs.  These provide us with async functions like `setTimeout`.

After an async call is made, it is pushed onto the **task queue**.  The job of the **event loop** is to continuously evaluate whether the call stack is empty.  If it is, then the event loop removes the first item from the task queue and pushes it to the call stack, where it is executed.

For example:

```javascript
console.log('1');
console.log('2');
setTimeout(function() {
  console.log('3');
}, 0);
console.log('4');
```

will output:

```javascript
1
2
4
3
```

because `setTimeout`, despite its delay time of `0`, is executed by a Web API and its return value pushed onto the task queue.  Only after it is empty, that is, after all of the synchronous calls have been executed, is the async call executed.

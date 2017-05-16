# Objects and Object Context

## The Global Object
The global object is created when the JS environment starts, and serves as the language's *implicit context*, that is, the context used when no *explicit* context is provided.  In practical terms, this means that an undeclared variable assigment effectively creates a property on the global object:

```javascript
foo = 1;
// equivalent to
window.foo = 1;
```

Similarly, when reference is made to a non-local variable, JS uses the global object as context:

```javascript
foo; // 1
// same as
window.foo; // 1
```

Although implicitly and explicitly global variables (the latter being those declared with the `var` keyword in lexically global space) are both properties of the global object, only implicitly global variables can be deleted:

```javascript
a = 5;
var b = 6;

delete a; // true
delete b; // false

a; // reference error
b; // 6
```

## Object Mutability
In contrast to primitive types, most JS objects are mutable, meaning that they can be modified in place.

Objects passed to functions can be modified by those functions, and those changes will be reflected everywhere else the Object is referenced.  This happens because modifying a primitive **necessarily entails reassignment**, and reassignment of an argument in function scope will break the reference to the original value.  Objects, on the other hand, can have their properties reassigned in function scope without the owner object being reassigned, and thus can be modified by functions.

# Scope vs. Context in Function Execution
A function's execution happens in two stages: in the first, all of the variables (inner function scope, parameters/arguments, and global) and functions in the scope are declared (this is accountable for the JS phenomenon of "hoisting") and the value of `this` determined, and in the second, the code is executed line by line, and values assigned to the variables as this process proceeds.  For more info go <a href="http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/">here.</a>

**Context** is what is referenced by the keyword `this` -- the object inside of which the keyword is referenced.  Context can be thought of as the object that "owns" the code that is currently being executed.

**Scope** can be either function or global (although ECMA6 has introduced block-scope as well with `let`) and refers to the areas of the code in which a given identifier (i.e., variable name) is available for reference.

NB: Some resources refer the combination of context and scope as **function execution context**, but in these notes context will refer specifically to the object referenced by `this`.

# What `this` references
In JavaScript, `this` is **the current execution context of the function**.  Context is defined depending on the **type of invocation**: function, method, constructor, or indirect.

## Function Invocation
In a function invocation (when an expression evaluating to a `Function` is followed by parens) `this` refers to the global object, or, in strict mode, `undefined`:

```javascript
(function() {
  console.log(this);
})(); // Window {...}
```

## Method Invocation
In a method invocation (when a function stored as a property in an object is invoked using the property accessor) `this` refers to the object that owns the method:

```javascript
var obj = {
  func: function() {
    console.log(this);
  }
};

obj.func(); // Object {func: function}
```

## Indirect Invocation
In indirect invocation (when a function is invoked using `call` or `apply`), `this` refers to the object passed in as the context argument.
```javascript
var a = "I'm a global property!"

function func() {
  console.log(this.a);
}

var obj = {
  a: "I'm obj's property!"
};

func();
func.call(obj);
```

## Bound Functions
When a context is bound to a function with `bind`, then that function will **always** refer to the argument as context:

```javascript
function func() {
  console.log(this.a);
}

obj = {
  a: "Hello"
}

var boundFunc = func.bind(obj);

var a = "Goodbye";

boundFunc();
```

# Bind, Apply, Call
The `Function` methods `bind`, `apply`, and `call` are used to define a Function's context.  `apply` and `call` define the context **upon execution**, while `bind` defines the context **permanently**.

## `call`
`call` allows us to invoke a function with explicit context, and can also optionally supply arguments to the function as comma separated elements:

```javascript
function simpleFunc() {
  console.log(this.a);
}

var obj = {
  a: "Hello"
};

simpleFunc.call(obj); // Hello

function complexFunc(arg) {
  console.log(this.a + ', ' + arg + '!');
}

complexFunc.call(obj, "world"); // Hello, world!
```
## `apply`
`apply` is identical to `call` save that the optional function arguments are provided as a single array argument:

```javascript
var obj = {
  a: "Hello"
};

var arguments = ['my', 'friend'];

function complexFunc(arg1, arg2) {
  console.log(this.a + ', ' + arg1 + ' ' + arg2 + '!');
}

complexFunc.apply(obj, arguments);
```

## Bind
`bind` is used to permanently tie a function to a context.  Unlike `call` and `apply`, it doesn't invoke the function, but rather returns a new function with the desired context:

```javascript
var greeting = "Hello from global scope!";

function func() {
  console.log(this.greeting);
}

var obj = {
  greeting: "Hello from obj!"
};

var boundFunc = func.bind(obj);

boundFunc(); // Hello from obj!
```
NB: Once set with `bind`, context cannot be changed, even if the bound function is invoked with `call` or `apply`, or added to a different object as a property.

# Closures
When a function is created, it is said to "close over" its current scope.  This means that all identifiers available to the function at creation will be available to it **wherever it may be executed in code**.  This is illustrated by the following `counter` function:

```javascript
function makeCounter() {
  var index = 0;
  return function counter() {
    index += 1;
    console.log(index);
  };
}

var c = makeCounter();

c(); // 1
c(); // 2
c(); // 3
c(); // 4
console.log(index) // ReferenceError
```

Even though `c` is executed in global scope (where `index` isn't visible, as demonstrated by the `ReferenceError` on the last line), it retains access to `index` through its closure, and is thus able to reference it.

This phenomenon can be used to create effectively private data; `index` isn't accessible outside of the function factory (`makeCounter`) that made it, but is still in use by the `counter` function.

# The DOM
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

QUESTION: Where does async call execution take place?

# HTML Templating with Handlebars
<a href="http://handlebarsjs.com/">Handlebars</a> is a semantic templating library that allows for the efficient creation of new HTML.  Handlebars templates are typically stored in scripts in the original markup.  There are three steps between template and final HTML:

1. Handlebars compiles a template into a function.
2. The function is executed with a JSON object argument, known as context.
3. The function returns the HTML after replacing the template variables with corresponding context properties.

## Simple Example
Given the following `type="text/x-handlebars-template" script:

```javascript
<script id="template" type="text/x-handlebars-template">
  <p>My name is {{name}}.</p>
</script>
```

We can execute the three-step process listed above:

```javascript
var template = document.getElementById('template');

var context = {
  name: "Peter"
};

var templateFunction = Handlebars.compile(template.innerHTML);

var newHTML = templateFunction(context);
```

and can then insert the `newHTML` wherever we desire.

### Handlebars Syntax

#### Expressions
Expressions are denoted by double curly braces `{{...}}` and hold a variable that will be replaced by any correspondingly-named property in the context object.

#### Escaping HTML
In Handlebars HTML is escaped by default, that is, HTML code inserted into the template is treated as simple text and rendered on the page.  However, if we don't want to escape HTML and instead want it parsed by the browser, we can use triple curly braces `{{{...}}}`:

```javascript
{{<p>name</p>}} // <p>Groot</p>
{{{<p>name</p>}}} // Groot
```

#### Blocks, which contain Handlebars' logic helpers, are opened with `#` and closed with `/`:

```javascript
{{#if test}}
  <p>The test is true!</p>
{{else}}
  <p>The test is false!</p>
{{/if}}
```

#### Each
The `each` helper method iterates over an array of objects, and uses each object as context for the values inside of the helper.  Thus, this context object:

```javascript
var context = {
  tesGames: [{ game: "Arena" },
             { game: "Daggerfall" },
             { game: "Morrowind" },
             { game: "Oblivion" },
             { game: "Skyrim" }]
};
```

provides the `tesGames` array of objects to the template snippet below:

```javascript
<ol>
{{#each tesGames}}
  <li>{{game}}</li>
{{/each}}
</ol>
```

that fills in an ordered list with each `game` property's value.

#### Partial Templates
Partial templates are those that can be referenced inside of other templates.  They are registered as follows:

```javascript
Handlebars.registerPartial('partTwo', "<p>This is part two!</p>");
```

and then referenced inside of templates like this:

```javascript
<script id='template' type='text/x-handlebars-template'>
  <p>This is part one!</p>
  {{> partTwo}}
</script>
```

# Working with local storage
HTML 5 introduced two new properties on `Window`: `localStorage` and `sessionStorage`.  Each of these are JavaScript objects that hold property value pairs.  Ciritically, they allow for semi-permanent or permanent data-storage on the client side.

`sessionStorage` holds property/value pairs for the duration of the session, that is, until the tab or window is closed, while `localStorage` persists across sessions until explicitly removed.

These properties differ from the older form of client-side storage, cookies, in that the latter originate on the server-side and are used explicitly to facilitate stateful web applications.  In keeping with this, cookies are automatically sent to the server when the user is located on a given domain.  `localStorage` and `sessionStorage`, however, aren't tied to any particular application and originate on the client-side.  Thus they are present across all domains, and their data isn't accessed, modified, or sent to the server unless explicitly told to do so.

## Using localStorage
Although `localStorage` can be treated as a simple object and accessed and modified using property syntax, it is better to use the getter and setter methods below for security and readability reasons:

```javascript
localStorage.setItem("name", "Kylo Ren");
localStorage.getItem("name");
// => "Kylo Ren"
```

`localStorage` values can only be strings, and if a non-string value is set, `toString` will be called on the value.  This can produce undesirable results:

```javascript
localStorage.setItem("myObj", obj);
localStorage.getItem("myObj");
// => "[object Object]"
```

Fortunately, the built-in `JSON` object provides us with `stringify` and `parse`, which allow us to convert JSON-formatted JS objects into strings and back again:

```javascript
localStorage.setItem("myObj", JSON.stringify(obj));

var stringified = localStorage.getItem("myObj");
stringified;
//=> "{"a":1,"b":"a string"}"

JSON.parse(stringified);
// => Object {a: 1, b: "a string"}
```

# Constructor Functions and Object Prototypes

## Factory Functions
Factory Functions, also know as the Factory Object Creation Pattern, can be used to create multiple objects according to a particular pattern:

```javascript
function createDog(name, breed) {
  var dog = {};
  dog.name = name;
  dog.breed = breed;
  dog.description = function() {
    return this.name + ' is a ' + breed;
  };

  return dog;
}
```

Two important downsides of using factory functions are:

 - Every new object created from the factory function has the same methods, which can be redundant.
 - There is no way to tell whether a factory-made object was created using a factory or not.

## Constructor Functions
A constructor function is one that is **intended to be used with the `new` keyword**, and by convention is capitalized:

```javascript
function Ship(name, tonnage) {
  this.name = name;
  this.tonnage = tonnage;
  this.basicInfo = function() {
    return this.name + ' carries ' + this.tonnage + ' tons.';
  };
}

var container = new Ship("Colombo Express", 93750);
```

when invoked with the `new` keyword, the `this` keyword inside of the function is pointed to a new object, which is returned automatically after the constructor's code has been executed.  The use of `new` is critical - if it is ommitted, `this` will follow the normal rules for determing `this`, typically (if the constructor is invoked as a function) resulting in the addition of the desired new object properties to the global object.

The steps undertaken by a constructor function invoked with `new` are:

1. a new object is created,
2. `this` inside the function is pointed to this new object,
3. the code inside of the function is executed,
4. the object is returned.

This new object's prototype (see below) is an object with the constructor method set as its `constructor` property.  Every object created with a given constructor function **has the same prototype and `constructor` property**.

NB: *scope-safe* constructors will return the desired object even if called without the `new` keyword.  Most native JS constructors (e.g., `Array`) are scope-safe.

## Objects and Prototypes
Every object has a `__proto__` property that points to another object, referred to as the object's **prototype**.  `Object.prototype` is the default for all JS objects:

```javascript
var o = {};
o.__proto__ === Object.prototype;
// => true
```

The `Object.create(prototype)` method returns a new object whose prototype is the `prototype` argument.

```javascript
var bar = {};

var foo = Object.create(bar);

foo.__proto__ === bar;
// => true
```

Although `__.proto__` can be used to check the prototype property on objects, it is better to use the methods `Object.getPrototypeOf(obj)` and `object.isPrototypeOf(obj)` for these purposes:

```javascript
var bar = {};

var foo = Object.create(bar);

// foo.__proto__ === bar;

Object.getPrototypeOf(foo) === bar;
// => true

bar.isPrototypeOf(foo);
// => true
```

##  Prototypal Inheritance and Behavior Delegation
Although JS doesn't have classes in the way they exist in classical languages like Ruby, Java or C++, it can nevertheless share state and behavior across different objects.  By establishing prototype chains, which imply a hierarchical relationship, we can simulate class-based object creation:

```javascript
var Game = {
  title: '',
  system: '',
  description: function() {
    console.log(this.title + ' is played on the' + this.system);
  }
};

var kingdomCome = Object.create(Game);

kingdomCome.title = "Kingdom Come: Deliverance";
kingdomCome.system = "PC";
kingdomCome.description();
```

In the example above, the `Game` object stands in for a classical class, while the `kingdomCome` object stands in for an instance of class Game.  The connection between the two comes from `Object.create`, which sets Game as `kingdomCome`'s **prototype**.  By setting the desired properties on `kingdomCome` directly, we simulate state particular to an instance, while `kingdomCome`'s access via prototype to `description` simulates inherited behavior.

### Own vs. Inherited Properties
In an environment featuring properties shared via prototype, we can't be sure whether an object has access to a property by owning it (i.e., by having it explicitly declared on itself) or through its prototype.  JS provides us with two methods, `object.hasOwnProperty` and `Object.getOwnPropertyNames` to resolve this confusion.  Continuing our example above:

```javascript
kingdomCome.hasOwnProperty('title'); // true
kingdomCome.hasOwnProperty('description'); // false
Object.getOwnPropertyNames(kingdomCome); // ["title", "system"]
```

The first method call returns `true`, since we explicitly declare `title` on `kingdomCome`, while the second returns `false` since `description` is accessed through the prototype.  `getOwnPropertyNames`, meanwhile, returns an array containing string representations of every owned property name.

## Constructors and Prototypes
Every function in JS has a `prototype` property that holds an object with a single property, `constructor`, which in turn points back to the function.

```javascript
function Game() {
  this.title = '';
  this.system = '';
  this.description = function() {
    console.log(this.title + ' is played on the' + this.system);
  };
}

Game.prototype.constructor === Game; // true
```

When this function is invoked as a constructor, (i.e., with the `new` keyword) the object that is returned has its own prototype set to the function's `prototype` property:

```javascript
var g = new Game;

Game.prototype.isPrototypeOf(g); // true
```

This object (`Game.prototype`) is often referred to as the function's "prototype object" despite the fact that it is not the *actual* prototype of the function:

```javascript
Game.__proto__ === Game.prototype; // false
```

### The Prototype Pattern of Object Creation
This refers to defining behaviors on a constructor function's `prototype` object, which will then be shared by all objects created by the constructor:

```
function Dog() {};
Dog.prototype.bark = function() {
  console.log(this.name + ' says bark!');
}

var rex = new Dog;
rex.name = "Rex";

rex.bark(); // Rex says bark!
```

This pattern exploits the fact that inside of the constructor's prototype object (`Dog.prototype`), `this` refers to the object calling the method.  Thus, any object created by the constructor will access methods declared on this prototype object, but in these methods `this` will point to the object itself.

## Pseudo-classical and OLOO patterns
These two patterns are best practices for object creation in JS, which concerns how to share or not share behavior and state across multiple objects. Read more about them and other patterns <a href="https://john-dugan.com/object-oriented-javascript-pattern-comparison/">here.</a>

### Pseudo-Classical
In the pseudo-classical pattern, arguments are passed into the constructor function to define the new object's state, but shared behavior is added to the constructor's prototype object, so that it will be shared among all objects created by the constructor:

```javascript
function Game(title, system) {
  this.title = title;
  this.system = system;
}

Game.prototype.description = function() {
  console.log(this.title + ' is played on the ' + this.system);
};

var morrowind = new Game("Morrowind", "PC");
morrowind.description();
```

In this approach we use the constructor's prototype object to share behavior because, unlike state, behavior *doesn't vary from object to object* and as a result it would be wasteful to have copies of shared methods on each object individually.

### Object Linking to Other Objects (OLOO)
OLOO dispenses with the class-based approach to object creation, and instead relies on `Object.create` and a single template object, capitalized by convention.  An optional `init` function sets non-default state immediately after initialization:

```javascript
var Game = {
  title: '',
  system: '',
  description: function() {
    console.log(this.title + ' is played on the ' + this.system);
  },
  init: function(title, system) {
    this.title = title;
    this.system = system;
    return this;
  }
}

var morrowind = Object.create(Game).init("Morrowind", "PC");
```
Since this pattern doesn't use a constructor function, `instanceof` cannot be used to test for an inheritance.  However, `Object.isPrototypeOf` can be used, since `Object.create` sets the template object as the new objects prototype:

```javascript
Game.isPrototypeOf(morrowind);
```

## More methods on Object

### Object.defineProperties
This method allows us to explicitly define the values on an object, and is notable for allowing us to also define those properties writeability:

```javascript
var obj = {}
Object.defineProperties(obj, {
  a: {
    value: "Some val",
    writeable: false
  }
});

obj.a; // "Some val"
obj.a = "Another val";
obj.a; // "Some val"
```

### Object.freeze
This method prevents the argument object from having properties added, removed, or modified.  It also prevents the properties enumerability, writability or configurability from being altered.

Frozen maintains property references to values, and as such object values **can** be changed.  Frozen object can't be unfrozen.

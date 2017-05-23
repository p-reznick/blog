# Working with local storage
These notes draw on <a target="_blank" href="https://launchschool.com/">Launch School's</a> course materials and <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">MDN's documentation</a>.

HTML 5 introduced two new properties on `Window`: `localStorage` and `sessionStorage`, each of which provides an interface for interacting with a <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Storage">`Storage` object</a> behind the scenes.  This storage object allows for semi-permanent or permanent data storage on the client side, but is only accessible through the `localStorage` and `sessionStorage` properties.

`sessionStorage` holds property/value pairs for the duration of the session, that is, until the tab or window is closed, while `localStorage` persists across sessions until explicitly removed.

The storage made possible by these properties differs from the older form of client-side storage, cookies, in that the latter originate on the server-side and are used explicitly to simulate stateful web applications in exchanges between the client and the server.  In keeping with this, cookies are automatically sent to the server when the user is located on a given domain.  `localStorage` and `sessionStorage`, however, originate on the client-side, and their data isn't accessed, modified, or sent to the server unless they are explicitly told to do so.  In other words, `localStorage` and `sessionStorage` allow for the creation of truly stateful web applications on the client side, while cookies are used to simulate state across network requests.  In addition, `localStorage` can hold up to 5mb of data, while cookies are limited to about 4kb.

## Using localStorage
Although `localStorage` can be treated syntactically as a simple object and accessed and modified using property syntax, it's better to use the getter (`getItem(key)`) and setter `(setItem(key, value))` methods below for security and readability reasons:

```javascript
localStorage.setItem("name", "Kylo Ren");
localStorage.getItem("name");
// => "Kylo Ren"
```

`localStorage` values can only be strings, and if a non-string value is set, `toString` will be called on the value.  This can produce undesirable results:

```javascript
var obj = {
  a: 1,
  b: 2
};

localStorage.setItem('myObj', obj);
localStorage.getItem('myObj');
// => "[object Object]"
```

Fortunately, the built-in `JSON` object provides us with `stringify` and `parse`, which allow us to convert JSON-formatted JS objects into strings and back again:

```javascript
localStorage.setItem("myObj", JSON.stringify(obj));

var stringified = localStorage.getItem("myObj");
stringified;
//=> "{"a":1,"b":"a string"}"

JSON.parse(stringified);
// =>

localStorage.setItem("myObj", JSON.stringify(obj));

var stringified = localStorage.getItem("myObj");
stringified;
//=> {"a":1,"b":2}

JSON.parse(stringified);
// => Object {a: 1, b: "a string"}
```
NB: using this approach to store objects in `localStorage` will destroy the object's prototype chain, i.e., the object's prototype will be reset to the default `Object.prototype`, denying the object access to properties it may have shared through the prototype before being stored.

## Deleting Data in localStorage
Two methods can be used to delete values held in `localStorage`:
 - `removeItem(key)`: removes the value referenced by the `key` property.
 -  `clear`: removes all values on the given domain.

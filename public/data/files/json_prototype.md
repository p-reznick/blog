# JavaScript Inheritance and Client-side Storage
HTML5 introduced <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">two new forms of client-side storage</a> -- `window.localStorage` and `window.sessionStorage` -- which now join cookies as means of persistently or semi-persistently maintaining <a target="_blank" href="https://en.wikipedia.org/wiki/State_(computer_science)">state</a> in web applications.  While cookies are focused on allowing an application's server-side to communicate with the client-side statefully, client-storage, in contrast, provides the application with a means of persisting data without recourse to the server, entirely inside of the client. In more practical terms, `localStorage` and `sessionStorage` allow JavaScript scripts to set and get data that will last longer than the script's lifecycle.

Although these properties dramatically simplify the process of creating stateful application on the client side, they are only capable of storing date in String format, automatically coercing other data types into string format before assignment.  Although this limitation can be overcome using `JSON` utility methods, it has implications for behavior sharing patterns that make use of JavaScript's object-prototype model.

<!-- brief description of client-side storage w outline of using JSON.parse/stringify to store objects on client-side -->
## Using JSON methods to Store Objects Locally
Under normal circumstances, storing a JavaScript Object with `localStorage` utility methods doesn't do quite what we want:

```javascript
var obj = {
  a: 1,
  b: 'some string'
};

localStorage.setItem('myObj', obj);
localStorage.getItem('myObj'); // [object Object]
```

This happens because `setItem` automatically calls `toString` on every value it's told to store.  While this isn't a huge problem for primitive data types, it renders returned objects almost unusable.  Fortunately, JavaScript's <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON">`JSON` object</a> provides us with a workaround: the `JSON` methods `stringify` and `parse`.

The `stringify` method can serialize a JavaScript object (<a target="_blank" href="http://json.org/example.html">formatted like a JSON object</a>) and return a string representation of it which can then be safely stored with `setItem`:

```javascript
var obj = {
  a: 1,
  b: 'some string'
};

var stringified = JSON.stringify(obj);
stringified; // "{"a":1,"b":"some string"}"
localStorage.setItem('myObj', stringified);
```

After this, `parse` can be used to convert this string representation back into a JavaScript object:

```javascript
var localStr = localStorage.getItem('myObj');
var revivedObj = JSON.parse(localStr);
revivedObj;
```

the revived object, however, is a **deep copy** of the original.  This means that the two objects have identical data, but no data in common, i.e., they share no references to the same space in memory, as demonstrated below:

```javascript
var inner = {
  b: "I'm in the inner object!"
};

var obj = {
  a: inner,
};

var stringified = JSON.stringify(obj);
localStorage.setItem('myObj', stringified);

var localStr = localStorage.getItem('myObj');
var revivedObj = JSON.parse(localStr);

obj.a === obj.b; // false
```
This phenomenon extends to the revived object's prototype as well.

<!-- brief description of JS 'inheritance' through prototype, and its value for sharing behavior. -->
## Implications for Behavior Sharing
Unlike many other languages, JavaScript does not feature classical inheritance, although this form of inheritance can built, but rather shares properties using Object's prototype, which is essentially a property that references another object from which it can "share" behaviors and properties if they're not already defined on the original.

This phenomenon is critical to many Object creation patterns in JavaScript, but is disrupted by the use of `stringify` and `parse` to store objects in `localStorage`, as shown below:

```javascript
var Proto = {
  a: 'Some val',
};

var obj = Object.create(Proto); // Set Proto as obj's prototype

localStorage.setItem('myObj', JSON.stringify(obj));
var revivedObj = JSON.parse(localStorage.getItem('myObj'));

Proto.isPrototypeOf(obj); // true
Proto.isPrototypeOf(revivedObj); // false

obj.a; // 'Some val'
revivedObj.a; // undefined
```

## Using JSON.parse's revive parameter to Reset Prototype

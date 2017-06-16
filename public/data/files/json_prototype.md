# JavaScript Inheritance and Client-side Storage
HTML5 introduced <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">two new forms of client-side storage</a> -- `window.localStorage` and `window.sessionStorage` -- which now join cookies as means of persistently or semi-persistently maintaining <a target="_blank" href="https://en.wikipedia.org/wiki/State_(computer_science)">state</a> in web applications.  While cookies are focused on allowing an application's server-side to communicate with the client-side statefully, client-storage, in contrast, provides the application with a means of persisting data without recourse to the server, entirely inside of the client. In more practical terms, `localStorage` and `sessionStorage` allow JavaScript scripts to <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem">set</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem" target="_blank">get</a> data that will last longer than the script's lifecycle.  Read more about working with `localStorage` <a href="http://www.preznick.com/markdown/localstorage" target="_blank">here</a>.

Although these properties dramatically simplify the process of creating stateful applications on the client side, they are only capable of storing date in string format, automatically coercing other data types into string format before assignment.  Although this limitation can be overcome using `JSON` utility methods, it has implications for behavior sharing patterns that make use of JavaScript's object-prototype model.

## Using JSON Methods to Store Objects Locally
Under normal circumstances, storing a JavaScript Object with `localStorage` utility methods doesn't do quite what we want:

```javascript
var obj = {
  a: 1,
  b: 'some string'
};

localStorage.setItem('myObj', obj);
localStorage.getItem('myObj'); // [object Object] i.e., a string
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

revivedObj.a;
// Object {b: "I'm in the inner object!"}
// BUT
revivedObj.a === inner;
// false
```
This phenomenon extends to the revived object's prototype as well.

<!-- brief description of JS 'inheritance' through prototype, and its value for sharing behavior. -->
## Implications for Behavior Sharing
Unlike many other languages, JavaScript does not feature classical inheritance, although this form of inheritance can built, but rather shares properties using an object's prototype, which is essentially a property that references another object from which it can "share" behaviors and properties if they're not already defined on the original.  Read more about object-prototype sharing <a href="http://www.preznick.com/markdown/oo_js" target="_blank">here</a>.

This phenomenon is critical to many Object creation patterns in JavaScript, but is disrupted by the use of `stringify` and `parse` to store objects in `localStorage`, as shown below:

```javascript
var proto = {
  a: 'Some val',
};

var obj = Object.create(proto); // Set proto as obj's prototype

localStorage.setItem('myObj', JSON.stringify(obj));
var revivedObj = JSON.parse(localStorage.getItem('myObj'));

proto.isPrototypeOf(obj); // true
proto.isPrototypeOf(revivedObj); // false

obj.a; // 'Some val'
revivedObj.a; // undefined
```

This is a serious problem for any application seeking to store JavaScript objects that share behavior via prototype in `localStorage`.  Indeed, it would be a crippling problem, if not for the workaround below.

## Using parse's reviver to Reset Prototype
`JSON.parse` has an optional `reviver` functional argument:

```
JSON.parse(str[, reviver])
```

that can be used to *transform* the object being revived.

The reviver function takes two arguments, a key (property name) and value, and iterates over each enumerable property/value pair in the object being revived, finally passing `reviver` an empty string (`''`) property name and the revived object itself as value.

Using `Object.create`, `Object.assign`, and some simple logic, we can re-insert the revived object into our prototype chain:

```javascript
var proto = {
  d: 'a proto value'
};

var obj = {
  a: 1,
  b: 2,
  c: 'A string'
};

localStorage.setItem('myObj', JSON.stringify(obj));

var localStr = localStorage.getItem('myObj');

var revived = JSON.parse(localStr, function(p, v) {
  if (p === '') {
    var newObj = Object.create(proto)
    v = Object.assign(newObj, v);
  }
  return v;
});

proto.isPrototypeOf(revived); // true
revived.d; // 'a proto value'
```

In the example above, we check on each iteration of `revive` whether or not `p` (the property name argument) is an empty string.  If it is (signaling that `v`, the value, is the revived object), then we use `Object.create` to generate a new object with `proto` as its prototype.  Then, we use `Object.assign` to pass all of `v`s enumerable property/value pairs to `newObj`, which we return.  Thus, with this approach, we can bypass the problems posed by `parse`'s deep copying, and preserve object-prototype based property sharing among objects being revived from local storage with `parse`.

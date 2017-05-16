

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

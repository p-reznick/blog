# Objects, Context and Closures
These notes draw upon <a target="_blank" href="https://launchschool.com/">Launch School's</a> course materials, <a target="_blank" href="https://developer.mozilla.org/en-US/">MDN's</a> documentation and <a target="_blank" href="https://rainsoft.io/gentle-explanation-of-this-in-javascript/">this</a> great article on the `this` keyword.

# Objects

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

# Object Context and the this Keyword
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

## Bind, Apply, Call
The `Function` methods `bind`, `apply`, and `call` are used to define a Function's context.  `apply` and `call` define the context **upon execution**, while `bind` defines the context **permanently**.

### call
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
### apply
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

### bind
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

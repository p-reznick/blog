

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

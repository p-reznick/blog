#JavaScript Cheat Sheet
I created these notes for myself in preparation for Launch School's JavaScript exam, and share them here in the hopes that they may prove useful to my fellow students. I based these notes off of Launch School's course materials and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">MDN's JavaScript documentation</a>.

# Primitive Values
In JavaScript, there are **six** primitive data types:

- boolean
- string
- number
- null
- undefined
- symbol (New in ECMAScript 6)

and one compound type:
- object

The most important practical distinction between primitives and non-primitives is **mutability**.  Primitives are **immutable**, which means that they cannot be altered, while objects are **mutable**; they can be changed and retain their identity.  Primitives are also defined by the fact that they are not objects and have no methods.

Data type can be determined using the `typeof` operator.

When methods are called on primtive data types, they make use of the `Object.prototype` construction, which briefly transforms the primitive into its compound counterpart, executes the method, and then converts back into the primitive.  The primitives `boolean`, `string`, `number` and `symbol` all have object counterparts, which can be created explicitly using the following syntax, with the literal as argument:

```javascript
var myStr = new String('Hello, world!');
```

If we desire to change a primitive value, we **must use reassignment.**

# Types
JS is a **dynamically-typed language**; this means that a variable can hold a reference to any data type and be reassigned to any other data type over the course of the program.  This happens because JS performs checking at *run time* rather than *compile time.*

## Explicit Primitive Type Conversions/Coercions
Changing a primitive of one type into another type in JS requires a conversion (or coercion) operation.  Since primitives are immutable, this means performing a method call on a primitive and returning a different-type primitive.

### Strings to Numbers

String to number coercions can be performed with the following methods:

```javascript
Number('5'); // 5

parseInt('5.5', 10); // 5
parseFloat('5.5', 10); // 5.5
```

`parseInt` always returns whole numbers, while `parseFloat` returns floating point numbers.  The second argument is the radix, which determines the base for the return value.

### Numbers to Strings

```javascript
String(123); // '123'
String(123.5); // '123.5'
```

### Booleans to Strings

```javascript
String(true); // 'true'
```

### Primitive to Boolean

```javascript
Boolean(0); // false
Boolean('hi there'); // true

!!(0); // false
!!('hi there'); // true
```

NB: The following five values are 'falsy':

 - 0
 - ''
 - undefined
 - null
 - NaN

This means that they will resolve to `false` when evaluated in the conditional portion of a control statement.

## Implicit Type Conversions

### + operator
The unary `+` operator attempts to convert values into numbers, while the binary operator performs String concatenation or arithmetical addition.
 - If either operand is a String, the other operand will be converted into a string
 - If either operand is a number, and the other **is not** a string, then the non-number operand will be converted to a number.

### Strict equality operator
While the non-strict equality operator attempts coercions, the strict (`===`) equals operator does not.

NB: Wherever possible avoid implicit variable coercion.

# Strings
In JS, strings have no size limit and can be defined with either single or double quotation marks, with no functional difference between the two.  They can hold any character in the UTF-16 charset, and use an escape sequence `\ + $formattingChar` to handle formatting characters as well as quotation marks.

Characters can be accessed in strings using the `String.prototype.charAt()` method.  Square brackets perform the same operation:

```javascript
var str = 'hello';
str.charAt(1) === str[1]; // true
```

A string's length can be returned using the `.length` property.

## Built-in string Methods

### indexOf
`String.prototype.indexOf(string)` returns a number corresponding to the first occurance of the character or substring argument in the receiver.  Returns `-1` if no match.

### lastIndexOf
`String.prototype.lastIndexOf(string)` returns a number corresponding to the last occurance of the character or substring argument in the receiver.  Returns `-1` if no match.

### replace
`String.prototype.replace(string/pattern, replacement)` performs a subsitution operation, replacing by default the first occurance of a match with the replacement string.

The match can be made global by supplying a pattern with the `g` flag, while the replacement can be a functional expression.  In this case, every code match will be passed to the function and replaced by the corresponding return value:

```javascript
'hey this is peter'.replace(/\s[a-z]/g, function(char) {
  return char.toUpperCase();
});
// 'Hey This Is Peter'
```

### split
`String.prototype.split(substring/pattern)` returns an array of substrings separated by the substring or pattern supplied to the method.

NB: The argument itself will be excluded from the returned array.

### substr
`String.prototype.substr(start[, width])` returns a substring starting at `start` and, by default, extending to the end of the string.  If an optional `width` value is provided, then the method returns a substring starting at `start` and extending to `start + width`, non-inclusive, or the end of the string, if less than `start + width`. 

### substring
`String.prototype.substring(start[, end])` returns a substring starting at index `start` and ending at index `end` or the end of the string, if `end` isn't provided.  If `start` is less than `end`, `substring` will swap the values.

NB: `substring` treats negative or `NaN` arguments as `0`.

### slice
`String.prototype.slice(start[, end])` functions like `substring`, except:
 - it does not switch values is `start` is less than `end` (returning an empty string instead)
 - it can handle negative arguments.

### toUpperCase and toLowerCase
`String.prototype.toUpperCase()` and `String.prototype.toLowerCase()` return a copy of the receiver string with all letter chars converted to upper or lower case, respectively.  Other chars (digits, whitespace, non-alphanumerics) are unchanged.

# Flow Control

## Conditional Statements

### if...else if...else Statement
`if` statements in JS have three parts: an *expression* that evaluates to a boolean value, a conditional *statement* that incorporates the expression, and a code block that executes if the boolean expression evaluates to `true`:

```javascript
if (score > 70) {
  console.log('Congratulations, you passed!');
}
```

in this case:
 - expression: `score > 70`
 - statement: `if (score > 70)`
 - code block: `{ console.log('Congratulations, you passed!')`

an `if` statement can be followed by an optional `else` statement, which results in the execution of an additional code block in the event that the first boolean expression evaluates to `false`:

```javascript
if (score > 70) {
  console.log('Congratulations, you passed!');
} else {
  console.log('Study more!');
}
```

an `if` can be appended to an else clause, rendering the else clause's execution contional to an expression:

```javascript
if (score > 70) {
  console.log('Congratulations, you passed!');
} else if (score > 90) {
  console.log('Excellent!');
} else {
  console.log('Study more!');
}
```

### Switch Statement
A `switch` statement compares an expression to a set of cases, executing the code associated with the matching case:

```javascript
var opt = 1;

switch(opt) {
  case 1:
    // code
    break;
  case 2:
    // code
    break;
  case 3:
    // code
    break;
  default:
    //code
}
```

In the example above, only the code under `case 1` will execute.

NB: without `break` at the end of the case, each subsequent case and default will execute.

## Loops

### The For Loop
The for loop combines the three elements of any loop in a single statement: initial expression, condition, increment expression.  Standard form is as follows:

```javascript
for (var i = 0; i < 10; i += 1) {
  console.log(i);
}
```

### While Loop
The `while` loop first evaluates the condition incorporated into the `while` statement, and executes the code block if it is `true`.  It repeats this process until the expression evaluates to `false`:

```javascript
var i = 0;

while (i < 100) {
  console.log(i);
  i += 1;
}
```

### do...while loop
Similar to a `while` loop, `do...while` evaluates the expression *after* the block of code has executed, meaning that every `do...while` loop will be executed at least once:

```javascript
var counter = 0;
var limit = 0;

do {
  console.log(counter);
  counter += 1;
} while (counter < limit);
```

# Variable Scope and Hoisting

## Variable Scope
A variable's scope is that portion of the program that can reference the variable by name, the part of the program where the variable is 'visible'.

In JavaScript, *global scope* is the highest level of visibility.  Global-scoped variables are accessible throughout the program.  *Function scope*, is local scope, and is defined by the function definition.  Function-scoped variables are only visible inside of the function and in nested scopes.

Global-scoped variables can be created by omitting the keyword `var` during variable declaration, or by declaring the variable in lexically global space in the program.

NB: Lexical scoping refers to a system in which a variable's scope is determined by its location in the source code.

Function-scoped variables can be created by declaring the variable with the keyword `var` inside of a function, or by means of function parameters.  Even if an argument isn't passed to the function, the parameter is still effectively declared.

## Hoisting

### Hoisting Variable Declarations
JS scans for variable declarations in a given scope before executing the code.  For this reason, a variable *declared* anywhere in scope is equivalent to a variable declared at the top of the scope, behavior that is called **hoisting**.  Variable **assignments are not hosted** however.  Thus, the code below outputs `undefined`, rather than `Hello, world!`, because the declaration of `a` is hoisted above the logging operation, but not the assignment.

```javascript
console.log(a);

var a = 'Hello, world!';
```

### Hoisting Function Declarations
Hoisting also applies to function declarations and statements.  Note, however, that function declarations are hoisted **above** variable declarations.

Thus, the code below outputs `Goodbye, world!`, because the function declaration, though located below the variable declaration in the source code, is hoisted it above it, meaning that the value assigned to the *variable* `a` is what is output by the logging operation. 

```javascript
var a = 'Goodbye, world!';

function a() {
  console.log('Hello, world!');
}

console.log(a); // Goodbye, world!
```

# Function Declarations, Expressions and Scope

## Declarations

A *function* in JS is a piece of code that is stored in one place and accessible from elsewhere in the program.  Like variables, functions must be declared before they can be used.  Such declarations must include:
 - the `function` keyword
 - the name of the function
 - an optional list of comma-separated parameters
 - a block of statements (the function body)

```javascript
function myFunction(par1, par2) {
  // function body
}
```
NB: unless the function includes a `return` statement, it will return undefined.

## Parameters vs. Arguments
 - parameter: the variables supplied to a function, defined in the function definition
 - argument: the values passed into the function at call time

## Function Scope
In JS, every function creates a new scope.  *Function scope* is the part of the program that is contained within a function definition.  Function-scoped variables are accessible within the function and in all lower scopes, but not in higher scopes.

## Closures
In JS, "A <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures">closure</a> is the combination of a function and the lexical environment (or simply "environment") within which that function was declared."  Environment here means any local variables that were in scope when the closure was created.

In practice, closures allow functions to reference outer-scope local variables even when called from a different scope, as in the example below:

```javascript
function outer() {
  var name = 'Peter';

  function callName() {
    console.log(name);
  }

  return callName;
}

var fun = outer();
fun(); // outputs: Peter
console.log(name); // throws reference error
```

Even though `callName()` is referenced (via the variable `fun`) from a scope in which `name` is not declared (as demonstrated by the logging operation on the last line), it still outputs `Peter` because its closure retains the reference to all local variables in scope at the time of its creation.

## Function Declarations/Statements vs Function Expressions
A function declaration defines a variable whose type is function (variable declaration and assignment are combined) **without explicit variable assignment**, while a function expression defines a function as part of a larger syntax, typically that of variable assignment.

```javascript
// function declaration:
function foo() {
  // function body
}

//function expression
function bar() {
  
}
```

NB: a function expression **can** include a function declaration:
```javascript
var a = function bar() {
  return 1;
}
```
However: in the case of the above example, the function name `bar` isn't visible outside of it's own scope.  If we want to reference or call it, we need to use `a`.

# Object Properties and Mutation
JS uses objects to organize code and data.  Objects can be created with the literal syntax:

```javascript
var obj = {
  prop1: 'hello',
  prop2: 'world'
};
```

or with the `new Object()` or `Object.create()` constructors.

Objects contain data (state) and behavior, which are defined using properties and methods, respectively.

## Properties
Property names can be any valid string, and a property value can be any valid expression including functions and objects.

Property values can be accessed using *dot notation*:

```javascript
obj.prop1;
```

or *bracket notation*:

```javascript
obj[prop1];
```

NB: when declaring a new property using bracket notation, string literal syntax must be used (if the argument is not a number).  Otherwise, the argument will be interpreted as a variable name, leading to potentially undesirable outcomes.

## Mutability of Values and Objects
In JS, primitives are immutable, while objects are mutable, that is, they can be altered without losing their identities.  This is possible because objects contain inner data; this is what is altered.

# Arrays
Arrays are the basic collection type in JS, and can be created using either the array literal syntax or the constructor:

```javascript
var arr = new Array(1, 2, 3)

// equivalent to

var arr2 = [1, 2, 3];
```

Bracket notation can be used to access and add values to an array based on index.

NB: Any unassigned index will return `undefined`.

The length property of an array is procedurally generated; it is equal to the highest integer index value + 1 and **does not depend on the number of property values held by the array**.  It can also be set manually:

```javascript
var arr = [];
arr.length; // 0
arr[5] = 0;
arr.length; // 6
arr.length = 100;
arr.length; // 100
```

Since arrays are objects, **any data type** can be used as a property.  However, when retrieving property names that are not numbers (integer or fractional) it is necessary to use the string literal syntax; otherwise, the property name will be interpreted as a variable name, with unpredictable results.

In order to ascertain whether an object is an array use: `Array.isArray(object)` which returns a boolean value.

## Array Operations: pop, push, shift, unshift

### pop
`Array.prototype.pop()` removes the last element from the array and returns that element, changing the length of the array.

```javascript
var arr = [1, 2, 3];
arr.pop(); // 3

arr; // [1, 2]
```

### push
`Array.prototype.push()` adds an element to the end of the array and returns the new length of the array.

```javascript
var arr = [1, 2, 3];
arr.push(4); // 4

arr; // [1, 2, 3, 4]
```

### shift
`Array.prototype.shift()` removes the element at index `0` and *shifts* all subsequent elements down by one, returning the value of the removed element.

```javascript
var arr = [1, 2, 3, 4];
arr.unshift(); // 1

arr; // [2, 3, 4]
```

### unshift
`Array.prototype.unshift()` adds one element at index `0`, and then *unshifts* the subsequent elements up by one, returning the length of the array.

```javascript
var arr = [1, 2, 3];
arr.shift(4);
```

## Array operations: slice, splice, concat, join

### slice
`Array.prototype.slice(start[, end])` returns a *shallow copy* of the array starting at `start`, inclusive, and continuing through the last index of the array.  If optional `end` value is provided, the copy stops at index `end`, non-inclusive.

### splice
`Array.prototype.splice(start[, deleteCount[, item1[, item2 etc...]]])` changes the content of the array by removing existing elements and possibly inserting new elements.

The function removes a `deleteCount`-width slice of the array, and inserts any new elements after start.  If no `deleteCount` is provided, then all elements after `start` are removed.

The function returns an array containing the deleted elements.

### concat
`Array.prototype.concat(arr)` returns a new array consisting of the elements of the receiver array followed by the elements of the argument array.  Neither array is altered.

### join
`Array.prototype.join([separator])` iterates over the receiver array, coercing each element to a string and then joining the strings with a default `','` or the optional `separator` argument.

# Assignments and Comparison

## Assignment
The assignment operator `=` sets the left operand equal to the value of the right operand.  Compound assignment operators (like `+=`) combine arithmetic operators with assignment.

NB: declaring and assigning a variable on one line is called *initialization assignment*.

## Comparison
There are two sets of comparison operators: non-strict and strict.  The latter (`===` and `!==`) never performs implicit conversions, and for this reason is generally preferred.  Equality comparisons of objects only return true if both operands refer to the same object.  Under all other circumstances they return false, **even if the objects have the same property names and values**.

# Pure Functions and Side Effects
A *pure function* is one which doesn't alter the values of outer-scope or global variables.  Side effects refer to changes made to outer-scope or global variables from within a function.

Outer-scope variables referenced or reassigned inside of a function will have these changes reflected outside of the function.  If the variables are passed into the function as arguments, however, a new, same-named variable is effectively created inside of the function.  This new variable will be locally scoped, and in shadowing the outer scope variable, will prevent it from experiencing side effects.

NB: If a primitive is passed as an argument, any changes made to the argument will be confined to the function scope.  However, if an object is passed as an argument, the changes will be reflected in the outer scope.

# List Processing Abstractions
List processing abstractions are called on collections, and allow us to *abstract* (i.e., render declaractive some otherwise imperative) particular processes that can be called on lists:

|Abstraction|Use|Returns|Array Method|
|---|---|---|---|
|Iteration|Perform an operation on each element in an array|nothing|`forEach`|
|Filtering/Selection|Select a subset of elements|new array|`filter`|
|Transformation|Compute a new value from each element|new array|`map`|
|Ordering|Rearrange elements by sorting|reference to original array|`sort`|
|Reducing/Folding|Iteratively compute a result based on all element values|single value|`reduce`,`reduceRight`|
|Interrogation|Determine whether an array's elements meet a condition|single value|`every`, `some`|

Each of these methods takes a function as an argument, which is often referred to as a *callback* function.  The function is passed a set of optional arguments by abstraction, and may return a value that will be used by the abstraction in its next iteration over the list.

## Iteration with forEach
Iterate over an array with `forEach`, which is invoked once for each element in the array and supplies three arguments to the callback function:
 - value of current element
 - current index
 - aray being processed

```javascript
['Peter', 'Paul', 'Mary'].forEach(function(name, index, array) {
  console.log(name, index, array[index]);
}

// logs

// Peter 0 Peter
// Paul 1 Paul
// Mary 2 Mary
```

## Filter/Select with filter
Filter the contents of an array with `filter`, which returns a new array that is a subset of the receiver array composed of those elements for which `filter` returns true. `filter` supplies the following values to its callback:
 - value of current element
 - current index
 - array being processed

```javascript
// return all odd-indexed elements

['a', 'b', 'c', 'd', 'e'].filter(function(element, index, array) {
  return index % 2 !== 0;
})

// returns ['b', 'd']
```

## Transformation with map
Transform an array with `map`, which returns a new array based on the return values of each iteration over the old array.  Map passed three arguments to the callback function:
 - value of current element
 - current index
 - array being processed

```javascript
var count = [1, 2, 3, 4];

var doubled = count.map(function(number) {
  return number * 2;
});

doubled; // [2, 4, 6, 8]
```
## Reducing with reduce
Reduce or fold an array to a single value with `reduce`, which takes a callback function and an optional second argument that serves as initial value.  `reduce` supplies four arguments to the callback:
 - return value of the previous call
 - value of current element
 - current index
 - array being processed

If no initial value is provided as a second argument, then `reduce` effectively skips the first iteration, using the first value of the receiver array as initial value.  Compare the outputs of the two calls below:

```javascript
function add(previousValue, element, array) {
  console.log(previousValue, element);
  return previousValue + element;
}

var count = [1, 2, 3, 4, 5];

count.reduce(add);

// 1 2
// 3 3
// 6 4
// 10 5
// 15

count.reduce(add, 0);

// 0 1
// 1 2
// 3 3
// 6 4
// 10 5
// 15
```

In the first call, without an initial value, the first element of the receiver (`1`) is used, with the second element (`2`) as current value, while in the second call, the initial value argument (`0`) is used, and the first element of the receiver (`1`) is current element.

Reduce returns the value returned by the final callback invocation.

### Interrogation with every and some
Interrogation allows us to determine how many of the Array's elements satisfy some conditon.  `every` tells us whether *every* element in the array satisfies the condition, while `some` tells us whether *at least one* of the elements does.

`every` returns true if the return value of every invocation of the callback is truthy, while `some` returns true if at least invocation has a truthy return value.

Both of these methods pass three values to the callback:
 - value of current element
 - current index
 - array being processed

### Sort with sort
Perform an **in-place** sort (i.e., mutate the receiver array) with `sort`.  The sorting rules are established in the callback function, which takes two arguments and returns a positive number value, negative number value, or zero, depending on their relationship:
 - a > b: positive
 - a < b: negative
 - a == b: 0

```javascript
function compareLengths(s1, s2) {
  length1 = s1.length;
  length2 = s2.length;

  if(length1 < length2) {
    return -1;
  } else if (length1 > length2) {
    return 1;
  } else {
    return 0;
  }
}

var strings = ['a', 'abcde', 'abc', 'ab', 'a', 'abcdefg'];
strings.sort(compareScores);            // ["a", "a", "ab", "abc", "abcde", "abcdefg"]
strings;           // ["a", "a", "ab", "abc", "abcde", "abcdefg"]
```
The callback function takes two arguments, the elements to be compared, and should return a number value.
# Side affects and Mutability in Ruby and JavaScript



```javascript
var sum = 0;

function addNum(total, newVal) {
  total += newVal;
}

addNum(sum, 5);

console.log(sum); // Expected Outcome: 5, Actual Outcome: 0

function add(newVal) {
  sum += newVal
}

add(5);

console.log(sum); // Expected Outcome: 5, Actual Outcome: 5

var nums = [1, 2, 3];

function addElem(arr, newElem) {
    arr.push(newElem);
}

addElem(nums, 4);

console.log(nums); // [1, 2, 3, 4]
```

Two issues at play:

- Object mutability
- Pass by value/copy vs pass by reference

Definitions:

pass by value: language makes shallow copies of method argument, which is then passed to the method body.  The original variable **cannot** be modified by the method body.

pass by reference: language makes method argument a *reference* to the original variable, meaning that the latter **can** be modified 

immutable: object state cannot be altered without changing its identity

mutable: object state can be altered without changing its identity

## In Ruby:

### Mutable vs Non-Mutable Objects

In Ruby, immutable objects are *effectively* pass by value, meaning that any immutable (what are Ruby immutables? numbers, boolean values, what else?) passed as an argument **cannot be modified by the method body.**

Mutable objects, however, are effectively pass by reference, and **can be modified by the method body.**

### Mutating vs Non-Mutating Methods

Methods can be mutating and non-mutating.  A mutating method **modifies one of its arguments** (this can even be the receiver, which is technically an argument), while non-mutating methods do not mutate any of their arguments.

NB: assignment `=` and assignment operators (`=*`, `=+` etc) never mutate an object, but rather bind the left operand to the object referenced by the right operand.  The receiver isn't mutated; the variable name is assigned to a new object (although this object may in fact be the same as the caller), as below:

```ruby
a = 'hey'
a.object_id
a = a.upcase!
a.object_id
```

NB: the caller is the object from which a method call is made, while the receiver is the object *on* which the call is made.  Thus a method return value is 'returned to the caller', that is, made available in the scope from which the method call was made.

### Evaluation strategy when passing objects

Pass by Reference Value
In Ruby, variables are references to objects.  Assignment merely changes the objects to which the variables point.  This changing of objects to which variables point can only be performed in local scope; thus, in Ruby, all arguments are passed by reference, but assignment can only be performed locally.  Thus, immutable objects are *effectively* pass by value, since any reassignment definitionally cannot take place outside of the present scope, while mutable objects retain their mutability across the block boundary.

Mental Model:
Ruby is pass by reference except for assignment, assignment operations, and immutable objects.


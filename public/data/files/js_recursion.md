# Infinite Recursion and Variable Scope in JavaScript

A JavaScript <a href="http://www.quirksmode.org/dom/intro.html#walk"> walk the DOM</a> function traverses all nodes in the DOM tree subordinate to the given node, performing some operation on each node.  One way to create such a function is through recursion, with an implementation that looks something like this:

```javascript
function walk(node, callback) {
  // perform operation on node
  callback(node);

  // visit each of the child nodes
  for (i = 0; i < node.childNodes.length; i++) {
    // call walk for each child node
    walk(node.childNodes[i], callback);
  }
  // exit function when for loop is complete
}
```

For an HTML page with the given element hierarchy:

```
HTML
  HEAD
    TITLE
  BODY
    DIV
      P1
      P2
      P3
```

walking the DOM with this recursive implementation (starting with the root element in the document) should visit the nodes in the following order.

```
HTML
HEAD
TITLE
BODY
DIV
P1
P2
P3
```

However, the function above (which I, as an exercise, copied (erroneously) from memory from lesson materials), visits the nodes in the following order, falling into an infinite loop after reaching `TITLE`.

```
HTML
HEAD
TITLE
TITLE
TITLE
TITLE
... etc.
```

It turns out that my version ommitted a single, crucial keyword: `var`.  This seemingly trivial omission produces such a negative outcome because of the nature of recursive functions and JavaScript's variable scoping rules.

## Recursion

Recursive functions need some condition that, when satisfied, allows for exiting the function.  In the implementation above, the completion of the for loop is this condition, and as such is essential function to work; if JavaScript can't exit the function, then the recursion will never stop, creating an infinite loop of internal recursive function calls.

This seems to be what is happening in Version A, but why?

## JavaScript Variable Scoping

In JavaScript, any variable that isn't explicitly *declared* (initialized with the `var` keyword or as a function parameter) is assigned to the <a href="https://developer.mozilla.org/en-US/docs/Glossary/Global_scope">global scope</a>, that is, the set of variables, objects and functions visible from anywhere within the program.  By omitting the `var` keyword when initializing `i` in the for loop:

```javascript
(for ([var] i = 0; i < node.childNodes.length; i++)
```

`i` was added to the global scope, rather than the local (function) scope.  However, in order for the function to work properly, `i` must be scoped locally so that the function can iterate over each child node, and must hold a separate value in each function. As written, `i` is reassigned to `0` *every time the function is called for a node with children*, and since each instance of `i` refers to the same global value, this resets the for loops globally - at every level of the recursion.

## Negative Outcome

In practical terms, that means that the function will recursively traverse the DOM until it encounters a childless node, at which point it will become trapped, moving up and down between the childless node and its parent because `i` isn't incrementing, preventing the for loop from iterating over the next child or permanently exiting and move up a level in the recursion.

This is exactly what happens with out example above -- `walk` starts with `HTML`, calls itself for the child `HEAD` and then again for `HEAD`'s child `TITLE`, which has no children.  In `TITLE`, the function initializes `i` and assigns it to `0` then exits the function because the `while` condition has already been met (since `node.childNodes.length` is 0).  However, moving back up a level to `HEAD`, `i` hasn't incremented (because it was 'reset' to `0`), and so the function is called again on `TITLE` (the zeroth child), a cycle that continues infinitely.

Under normal (non-recursive) circumstances, having a global-scoped index on a for loop wouldn't be the end of the world.  Nevertheless, as this example shows, imprecise variable scoping can lead to subtle but serious unexpected behavior.
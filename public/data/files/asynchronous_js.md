Asynchronous vs synchronous in JS => combining the two by using function scopes

Phrase as question:

Why doesn't initial loop solution work?

Answer is that synchronous code (loops) finishes executing before asynchronous code is executed, meaning it references the final variable value.

Solution: exploit the fact that JS scopes local vars at function, and **either** create a function that calls itself recursively, isolating the loop index, or create a new function and call **that** asynchronously.

LS Solution:

```javascript
function makeLogger(number) {
  return function() {
    console.log(number);
  }
}

function delayLog() {
  for (var i = 1; i <= 10; i++) {
    var logger = makeLogger(i);
    setTimeout(logger, i * 1000);
  }
}
```

Recursive Solution:
...
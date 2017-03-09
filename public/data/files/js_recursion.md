# 

This doesn't work:
```javascript
function walk(node, callback) {
  callback(node);

  for (i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

walk(document.body, function(node) {
  console.log(node.nodeName);
});
```

this does:
```javascript
function walk(node, callback) {
  callback(node);

  for (var i = 0; i < node.childNodes.length; i++) {
    walk(node.childNodes[i], callback);
  }
}

walk(document.body, function(node) {
  console.log(node.nodeName);
});
```

why?
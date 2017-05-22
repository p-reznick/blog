# JavaScript Inheritance and Client-side Storage
HTML5 introduced <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">two new forms of client-side storage</a> -- `window.localStorage` and `window.sessionStorage` -- which now join cookies as means of persistently or semi-persistently maintaining <a href="https://en.wikipedia.org/wiki/State_(computer_science)">state</a> in web applications.  While cookies are focused on allowing an application's server-side to communicate with the client-side statefully, client-storage, in contrast, provides the application with a means of persisting data without recourse to the server, entirely inside of the client. In more practical terms, `localStorage` and `sessionStorage` allow JavaScript scripts to set and get data that will last longer than the script's lifecycle.

Although these properties dramatically simplify the process of creating stateful application on the client side, they are only capable of storing date in String format, and automatically coerce other data types into string before storing them.  Although this limitation can be overcome, it has implications

<!-- brief description of client-side storage w outline of using JSON.parse/stringify to store objects on client-side -->

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

brief description of JS 'inheritance' through prototype, and its value for sharing behavior.

example illustrating how JSON.parse/JSON.stringify breaks prototype chain.

conclusions?

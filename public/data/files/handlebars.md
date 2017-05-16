# HTML Templating with Handlebars
These notes draw upon <a href="https://launchschool.com/">Launch School's</a> course materials and <a href="http://handlebarsjs.com/">Handlebars'</a> official documentation.

<a href="http://handlebarsjs.com/">Handlebars</a> is a semantic templating library that allows for the efficient creation of new HTML.  Handlebars templates are typically stored in scripts in the original markup.  There are three steps between template and final HTML:

1. Handlebars compiles a template into a function.
2. The function is executed with a JSON object argument, known as context.
3. The function returns the HTML after replacing the template variables with corresponding context properties.

Handlebars can be installed directly on your machine or in a specific HTML document using a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.8/handlebars.min.js"></script>
```

## Simple Example
Given the following `type="text/x-handlebars-template"` script:

```javascript
<script id="template" type="text/x-handlebars-template">
  <p>My name is {{name}}.</p>
</script>
```

We can execute the three-step process listed above:

```javascript
var template = document.getElementById('template');

var context = {
  name: "Peter"
};

var templateFunction = Handlebars.compile(template.innerHTML);

var newHTML = templateFunction(context);
```

and can then insert the `newHTML` wherever we desire.

### Handlebars Syntax

#### Expressions
Expressions are denoted by double curly braces `{{...}}` and hold a variable that will be replaced by any correspondingly-named property in the context object.

#### Escaping HTML
In Handlebars HTML is escaped by default, that is, HTML code inserted into the template is treated as simple text and rendered on the page.  However, if we don't want to escape HTML and instead want it parsed by the browser, we can use triple curly braces `{{{...}}}`:

```javascript
{{<p>name</p>}} // <p>Groot</p>
{{{<p>name</p>}}} // Groot
```

#### Blocks, which contain Handlebars' logic helpers, are opened with `#` and closed with `/`:

```javascript
{{#if test}}
  <p>The test is true!</p>
{{else}}
  <p>The test is false!</p>
{{/if}}
```

#### Each
The `each` helper method iterates over an array of objects, and uses each object as context for the values inside of the helper.  Thus, this context object:

```javascript
var context = {
  tesGames: [{ game: "Arena" },
             { game: "Daggerfall" },
             { game: "Morrowind" },
             { game: "Oblivion" },
             { game: "Skyrim" }]
};
```

provides the `tesGames` array of objects to the template snippet below:

```javascript
<ol>
{{#each tesGames}}
  <li>{{game}}</li>
{{/each}}
</ol>
```

that fills in an ordered list with each `game` property's value.

#### Partial Templates
Partial templates are those that can be referenced inside of other templates.  They are registered as follows:

```javascript
Handlebars.registerPartial('partTwo', "<p>This is part two!</p>");
```

and then referenced inside of templates like this:

```javascript
<script id='template' type='text/x-handlebars-template'>
  <p>This is part one!</p>
  {{> partTwo}}
</script>
```

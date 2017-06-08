# Useful CDNs

CDNs (<a href="https://en.wikipedia.org/wiki/Content_delivery_network">Content Delivery Networks</a>) can be used to load JavaScript packages over the internet with a high degree of reliability.  Loading packages in this manner is often considered a best practice, because it cannot be assumed that a user will have any given library downloaded on his or her machine.

The link to the CDN's package is set as the value for a `script` element's `src` attribute.  The script element itself is placed at the bottom of the HTML document's `head` element, with the `scripts` ordered by dependance.  The resulting set of script tags usually looks something like this:

```html
<head>
  <!-- title, meta information etc... -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <!-- path to local scripts etc... -->
</head>
```

Packages are often made available in *uncompressed* and *minified* forms, for development and production, respectively.  The difference between these two is that the standard form retains whitespace and non-essential characters, which make it easier for humans to understand, while the minified version removes these, making the file smaller and quicker to download.  Since they are quicker to download and less likely to be subject to scrutiny by a person, it's best to use minified CDN packages for production applications.

Listed below are CDN URLs to some of the most common JS packages, with the minified version is second.

## jQuery
<p class="cdn" id="jquery">https://code.jquery.com/jquery-3.2.1.js</p><a href="#" id="copy_jquery" class="copy_link">Copy</a><br>
<p class="cdn" id="jquery_min">https://code.jquery.com/jquery-3.2.1.min.js</p><a href="#" id="copy_jquery_min" class="copy_link">Copy</a>

## Underscore
<p class="cdn" id="underscore">https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js</p><a href="#" id="copy_underscore" class="copy_link">Copy</a><br>
<p class="cdn" id="underscore_min">https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js</p><a href="#" id="copy_underscore_min" class="copy_link">Copy</a>

## Handlebars
<p class="cdn" id="handlebars">https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.js</p><a href="#" id="copy_handlebars" class="copy_link">Copy</a><br>

<p class="cdn" id="handlebars_min">https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.8/handlebars.min.js</p><a href="#" id="copy_handlebars_min" class="copy_link">Copy</a>

## Backbone
<p class="cdn" id="backbone">https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js</p><a href="#" id="copy_backbone" class="copy_link">Copy</a><br>

<p class="cdn" id="backbone_min">https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js</p><a href="#" id="copy_backbone_min" class="copy_link">Copy</a>

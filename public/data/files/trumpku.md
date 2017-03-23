# Trumpku

<img src="../data/images/fb_image.PNG" />

<a href="http://www.trumpku.net/" target="_blank">Trump(hai)ku</a> generates a five-seven-five haiku using phrases selected semi-randomly from transcripts of Trump's inaugural address and speeches on the campaign trail.

The bulk of the text data was taken from Ryan McDermott's <a target="_blank" href="https://github.com/ryanmcdermott/trump-speeches">1mb Archive of Donald Trump Speeches</a>.

The application uses <a target="_blank" href="http://www.sinatrarb.com/">Sinatra</a>, a small, flexible, Ruby web framework ideal for quick development.  The back end is written in Ruby.  There are several different phrase-syllable patterns used to generate the haikus; after the program has randomly selected a pattern, it then scans a collection of clause-like phrases generated from the speeches for text that has a matching syllable count, using the <a href="https://github.com/vshulman/RubyRhymes" target="_blank">RubyRhymes gem</a>.  These phrases are then combined and displayed for the user.

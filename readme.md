# Email Builder
Boilerplate for Sass-y email building and automated CSS inlining.

## Requirements
- nodejs
- gulp
- Yeoman

## Setup
1. Install the generator using npm:  `npm install -g https://github.com/UCF/generator-ucf-email-boilerplate`
2. `cd` to the directory you want to run the generator in, then run `yo ucf-email-boilerplate`.  Follow the prompts to customize your installation.


## Development
1. `gulp watch` to automatically run scss compilation and html inlining as you work.
2. Edit files in `src/`.  Don't add inline css or attributes to your email markup; by default, table and image elements are automatically assigned relevant email-friendly attributes such as "align" and "valign" depending on assigned styles ([see Juice defaults](https://github.com/Automattic/juice/blob/8e16f5b1027964e9cc117520c42bfd3fbd9d78f8/client.js#L18-L27)).  `gulp-watch` will do its thing when you save an .html or .scss file.  Inlined, Litmus-ready files will be saved to `dist/`.
3. Test your email in Litmus.  Rinse and repeat Step 2 until your email looks acceptable in all desired clients.

### gulp-config.json Options:

Option | Type | Description
------ | ---- | -----------
sync | boolean | Whether or not BrowserSync should be used.
syncIndex | string | The index file to point BrowserSync to; this should be an html file in `dist/`.
juice | object | Options to pass to [Juice](https://github.com/Automattic/juice#options).
htmlmin | object | Options to pass to [HTMLMinifier](https://github.com/kangax/html-minifier#options-quick-reference).

NOTE: the htmlmin.maxLineLength option will NOT break a single line of text if it is too long--you are still responsible for ensuring text contents don't exceed 1000 characters.

### Using The Inliner Tools
By default, styles in `<link>` and `<style>` tags are inlined into the html template when `gulp default` or `gulp html-inline` are run, and the original `<link>` or `<style>` tags are removed (unless they contain media queries; in which case, only the media queries will remain.)

You can use the following data attributes to modify how styles are parsed by the inliner tools:

#### `data-embed`
Add to a `<link>` tag to download the stylesheet's contents, but embed them in the document head in `<style>` tags and do not inline.  Useful for including things like client-specific overrides without muddying up your html template.

#### `data-inline-ignore`
Add to a `<link>` tag to prevent inlining entirely (the output html file will still contain the `<link>` tag).


## Wishlist/TODOs
- Litmus and SES integration for testing
- HTML entity/special character processing (ASCII)
- S3 integration?

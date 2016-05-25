# Email Builder
Boilerplate for Sass-y email building and automated CSS inlining.

## Requirements
- nodejs
- gulp

## Setup
1. Clone repo into your local development environment
2. `cp gulp-config.template.json gulp-config.json`; edit new config file as necessary
3. `npm install` from root directory of the repo
4. Run an initial build of included files: `gulp default`

### gulp-config.json Options:

Option | Type | Description
------ | ---- | -----------
sync | boolean | Whether or not BrowserSync should be used.
syncIndex | string | The index file to point BrowserSync to; this should be an html file in `dist/`.
juice | object | Options to pass to [Juice](https://github.com/Automattic/juice#options).


## Development
1. `gulp watch` to automatically run scss compilation and html inlining as you work.
2. Edit files in `src/`.  Don't add inline css or attributes to your email markup; by default, table and image elements are automatically assigned relevant email-friendly attributes such as "align" and "valign" depending on assigned styles ([see Juice defaults](https://github.com/Automattic/juice/blob/8e16f5b1027964e9cc117520c42bfd3fbd9d78f8/client.js#L18-L27)).  `gulp-watch` will do its thing when you save an .html or .scss file.  Inlined, Litmus-ready files will be saved to `dist/`.
3. Test your email in Litmus.  Rinse and repeat Step 2 until your email looks acceptable in all desired clients.

## Wishlist/TODOs
- Wrap this code in a Yeoman generator
- Litmus and SES integration
- S3 integration?

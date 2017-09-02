# courvoisier

### Development environment setup
For compilation of JS and SCSS files we used [CodeKit App](https://incident57.com/codekit/). Main JS file is `/source/scripts/main.js`, main SCSS files are `/source/styles/main.scss`, please point them in the application, and set the output directory respectively to `/deploy/assets/scripts/` and `/deploy/assets/styles` folders.

### Development snapshot
*	for styling, project is using [SASS](http://sass-lang.com/) with [Jeet](http://jeet.gs/) mixins, [autoprefixer](https://incident57.com/codekit/help.html#autoprefixer) needs to be set to: `> 1%, last 2 versions, Firefox ESR, Opera 12.1, ie >= 9, Android >= 4.4, Safari >= 6, iOS >= 8`,
*	for front end code JavaScript is being used along with [jQuery](https://jquery.com/),
*	all icons are crated using SVG font via [IcoMoon.io](https://icomoon.io/app). Current set can be extended by importing `/setup/icomoon.io.json` file and adding needed assets. Then after replacing generated font files in `/assets/fonts/`. Code in `_fonts.scss` also needs to be updated accordingly to point new assets.

### Deployment
*	in local environment page runs using PHP on Apache server at `local.courvoisier.com` (please set your local environemnt accordingly). Delivery contains only static files in deploy folder.

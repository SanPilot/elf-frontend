<p align="center">
  <img height="300" width="300" alt="Elf" src="meta/icons/elf-logo.min.svg" style="margin-bottom: 20px">
</p>
# Elf
### or, Epic Lab Form
Frontend interface for Elf.

*by Hussain Khalil*

## Description
This repository contains the frontend for Elf.

It requires a corresponding backend to function properly.

Elf is a web-based application for submitting, viewing and proccessing lab requests.

You can find a project abstract at `meta/Lab Request Application - Project Abstract.pdf`.

## Dependencies
This package requires:

* npm (from Node.js)
  * Gulp
      * gulp-util
      * gulp-real-favicon
* Bower
  * JQuery
  * material-design-lite
  * material-design-themes
  * polymer
    * webcomponentsjs

If you have `npm` installed, you can install all `npm` dependencies with the command:

    sudo npm install

If you have `bower` installed, you can install all `bower` dependencies with the command:

    bower install

## Source code
The project source is located in `src`.
All files are written vanilla HTML, CSS, JavaScript or are images (or fonts).

* `assets` - Contains images, stylesheets and fonts
  * `fonts` - Contains fonts
  * `images` - Contains images
  * `stylesheets` - Contains CSS stylesheets
* `components` - Contains Bower packages
  * `jquery` - The JQuery library
  * `material-design-lite` - Google's Material Design Lite library
  * `material-design-themes` - Themes for Material Design Lite
  * `polymer` - The Polymer Project library
  * `webcomponentsjs` - Polymer dependency; contains polyfill for web component functionality
* `pages` - Contains source code for webpages
  * `dashboard` - Source for dashboard page
  * `sign-in` - Source for sign-in page
* `scripts` - Contains JavaScript files

## Building
The project can be used straight from the `src` directory, but it is recommended to build it for production uses.

This repository uses `gulpjs` for build automation, but does not currently have a build process.

For now, run it through the `src` directory.

## Further Reading
* Project Icons - `meta/icons`
* Project Abstract - `meta/Lab Request Application - Project Abstract.pdf`
* Stack Diagram - `meta/Lab Request Stack Diagram.pdf`
* Site Mockups - `meta/Site Mockups.pdf`

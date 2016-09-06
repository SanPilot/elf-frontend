<p align="center">
<img height="300" width="300" alt="Elf" src="https://git.sanpilot.co/SanPilot/elf-meta/raw/master/icons/elflogo2.png" style="margin-bottom: 20px">
</p>
# Elf
### or, Epic Lab Form
Frontend interface for Elf.

*by Hussain Khalil*

## Description
This repository contains the frontend for Elf.

It requires a corresponding backend to function properly.

Elf is a web-based application for submitting, viewing and processing lab requests.

You can find a project abstract at `meta/Lab Request Application - Project Abstract.pdf`.

## Dependencies
This package requires:

* `npm (from Node.js)`
* `Bower`
* `Apache webserver (or another server)`

If you have `npm` installed, you can install all `npm` dependencies with the command:

sudo npm install

If you have `bower` installed, you can install all `bower` dependencies with the command:

bower install

## Usage
Files in this repository are meant to be served through a web server.

`Apache` is recommended, since configuration files are in `Apache` format, but any server should do.

If `gulp` is installed, you should build the repository (see "Building"), and serve content from the `dist` directory.

Otherwise, serve from the `src` directory.

## Source Code
The project source is located in `src`.
All files are written vanilla HTML, CSS, JavaScript or are images (or fonts).

* `assets` - Contains images, stylesheets and fonts
  * `fonts` - Contains fonts
  * `images` - Contains images
  * `stylesheets` - Contains CSS stylesheets
* `components` - Contains Bower packages
* `pages` - Contains source code for webpages
  * `dashboard` - Source for dashboard page
  * `sign-in` - Source for sign-in page
* `scripts` - Contains JavaScript files

## Building
Build this repository using the following command:

    gulp

The build process will output the new files to the `dist` directory. Point your web server there.

The project can be used straight from the `src` directory, but it is recommended to build it for production uses.

This repository uses `gulpjs` for build automation. Build tasks can be found in the `gulpfile.js` file.

## Apache Configuration
* It is recommended to enable the following (non-required) Apache modules:
  * `mod_header`
  * `mod_deflate`
  * `mod_expires`
* `mod_rewrite` is required for Polymer elements to function correctly

  You can enable them with the following command (Mac/Linux only):

        sudo a2enmod header deflate expires rewrite

* Apache will return a 403 Forbidden error code if you do not include a `AllowOverride All` directive in the configuration file (not .htaccess) file:

        <Directory />
            AllowOverride All
        </Directory>

  If you don't have access to the configuration file, comment out the whole section labelled "Generic options" in the file `src/.htaccess`

## Further Reading
* Project Icons - `meta/icons`
* Project Abstract - `meta/Lab Request Application - Project Abstract.pdf`
* Stack Diagram - `meta/Lab Request Stack Diagram.pdf`
* Site Mockups - `meta/Site Mockups.pdf`

*Last updated 14.02.2016*

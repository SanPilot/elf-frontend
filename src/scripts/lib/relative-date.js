/*
Human friendly relative dates
Adapted from https://www.npmjs.com/package/relative-date
*/

var relativeDate = (function(undefined){

  var SECOND = 1000,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
  WEEK = 7 * DAY,
  YEAR = DAY * 365,
  MONTH = YEAR / 12;

  var formats = [
    [ 0.7 * MINUTE, 'just now', 'now' ],
    [ 1.5 * MINUTE, 'a minute ago', 'in a minute' ],
    [ 60 * MINUTE, '$ minutes ago', 'in $ minutes', MINUTE ],
    [ 1.5 * HOUR, 'an hour ago', 'in an hour' ],
    [ DAY, '$ hours ago', 'in $ hours', HOUR ],
    [ 2 * DAY, 'yesterday', 'tomorrow' ],
    [ 7 * DAY, '$ days ago', 'in $ days', DAY ],
    [ 1.5 * WEEK, 'a week ago', 'in a week'],
    [ MONTH, '$ weeks ago', 'in $ weeks', WEEK ],
    [ 1.5 * MONTH, 'a month ago', 'in a month' ],
    [ YEAR, '$ months ago', 'in $ months', MONTH ],
    [ 1.5 * YEAR, 'a year ago', 'in a year' ],
    [ Number.MAX_VALUE, '$ years ago', 'in $ years', YEAR ]
  ];

  // Process future dates
  var oldFormats = formats.slice(0), newFormat;
  for(var i = 1; i < oldFormats.length; i++) {
    newFormat = [oldFormats[i][0] * -1, oldFormats[i][2]];
    oldFormats[i][3] && newFormat.push(oldFormats[i][3]);
    formats.unshift(newFormat);

    // Splice out the future format
    formats[i * 2].splice(2, 1)
    .filter(function(value) {
      return value !== undefined
    });
  }

  function relativeDate(input,reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );

    var delta = reference - input,
    format, i, len;

    for(i = -1, len=formats.length; ++i < len; ){
      format = formats[i];
      if(delta < format[0]){
        return format[2] == undefined ? format[1] : format[1].replace(new RegExp("\\$", 'g'), Math.round(Math.abs(delta/format[2])));
      }
    };
  }

  return relativeDate;

})();

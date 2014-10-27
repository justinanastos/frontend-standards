# Justin Anastos's JavaScript Style Guide

Use the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as a base for rules. This document demonstrates all overrides.

When commenting on a pull requests that something deviates from the rules set forth in this document or in the Airbnb style guide, it is helpful to provide a link.

## Table of Contents
1. [Todo](#todo)
1. [Documentation and Comments](#documentation-and-comments)
1. [Rules](#rules)
  1. [Indentation](#indentation)
  1. [Comparing to undefined](#comparing-to-undefined)
  1. [Blocks](#blocks)
  1. [Variable Declaration](#variable-declaration)
  1. [Cache jQuery Node Lists](#cache-jquery-node-lists)
  1. [Chaining](#chaining)
1. [Linting / Code Sniffing](#linting--code-sniffing)
1. [Require.js Guidelines](#requirejs-guidelines)
1. [Marionette / Backbone Guidelines](#marionette--backbone-guidelines)
  1. [Regions](#regions)


## Todo
* Add jshint/jscs docs.
* Explain requirejs.
* Explain Grunt.
* Add our Marionette conventions

## Documentation and Comments
Comment anything that is not immediately obvious what is happening. Any comments are more valuable than no comments, and no comments are better than out of date comments. Keep them up to date.

All comments should be written in GitHub Flavored Markdown.

* [Markdown Basics](https://help.github.com/articles/markdown-basics)
* [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/)

Generate annotated source code with [grunt-docco](https://github.com/DavidSouther/grunt-docco).

Examples of others using annotated source code:

* [Underscore.js](http://underscorejs.org/docs/underscore.html) - [source](https://github.com/jashkenas/underscore/blob/master/underscore.js)
* [Backbone.js](http://backbonejs.org/docs/backbone.html) - [source](https://github.com/jashkenas/backbone/blob/master/backbone.js)
* [Marionette.js](http://marionettejs.com/annotated-src/backbone.marionette) - [source](https://github.com/marionettejs/backbone.marionette/blob/master/lib/backbone.marionette.js)

## Rules

### Indentation

4-space indent.

Tabs: **Nope.**

Use http://editorconfig.org/ to help get your editor into the proper settings.

### Comparing to undefined
* Never compare to `undefined`.

```javascript
// bad
if (something === undefined) {
  ...
}

// good
if (typeof something === 'undefined') {
  ...
}

// better
if (_.isUndefined(something)) {
  ...
}
```

### Blocks
Put closing bracket and `else`/`else if` on the same line.

```javascript
// bad
if (something === 1) {
  ...
}
else if (something === 2) {
  ...
}
else {
  ...
}

// good
if (something === 1) {
  ...
} else if (something === 2) {
  ...
} else {
  ...
}
```

Use proper indentation for if blocks with multiple conditions.

```javascript
// bad
if (this.viewModel.get('playing') && !this._heroVideo.paused() && event.scrollDirection.toLowerCase() === 'forward') {
    ...
}

// good
if (
    this.viewModel.get('playing') &&
    !this._heroVideo.paused() &&
    event.scrollDirection.toLowerCase() === 'forward'
) {
    ...
}
```

### Variable Declaration

First part of scope should be declaration of all vars in the scope, one per line, in alphabetical order. Only assign variables in their declaration if there is no derivation required, including references to other variables.

```javascript
// bad
var bar,
    baz = bar, // Do not derive values in declarations.
    foo = {};

// good
var bar;
var baz;
var foo = {}; // Assign only when possible (value doesn’t need to be derived).

param = param || {}; // If this is a function and you have default parameters.
baz = doSomethingWithThing(param);
```

Alphabetization should follow ASCII ordering, symbols come before uppercase, and uppercase comes before lowercase. In SublimeText, there is a shortcut to alphabetize a list of selected lines: `fn F5`.

```javascript
var $el;
var MY_CONST = 'my const name';
var MY_SECOND_COST = 'my second const name';
var aVariable;
```

### Cache jQuery node lists

Always cache jQuery ‘node lists’:

```javascript
var $el = $(this);
var $myEl = $('.my-selector');
```

### Chaining
When chaining function calls, indent all calls and add a semicolon `;` on it's own line after the chained sequence. Notice the whitespace.

```javascript
// bad
$('body').append('div').append('div');

// bad
var $(body) = $('body');
$('body')
.append('div')
.append('div');

// good
$('body')
  .append('div')
  .append('div')
;
```

## Linting / Code Sniffing
Lint all your code with [JSHint](http://www.jshint.com/docs/), and validate it with [JavaScript Code Sniffer (jscs)](https://github.com/mdevils/node-jscs).

SublimeLinter3 has plugins for both jshint and jscs that will use the project and user specific configuration files.

Projects should be configured with a pre-commit hook that prevents commits with code that does not pass jshint and jscs.

### Exceptions
Some things are not yet checked by jshint or jscs. Make sure to pay attention to these as we don't have a way to automatically check them yet:
* Chaining rules.
* No derivations in var declarations.

## Require.js Guidelines

## Marionette / Backbone Guidelines
<http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps>

### Regions
In Marionette, regions are searched for by using `.find()` on the parent `$el`. To ensure we find the correct region when we have deeply nested components, we should be as specific as possible when defining these regions. For example:

```handlebars
<div class="someRegion"></div>
```

```javascript
UA5.View = Marionette.Layout.extend({
    regions: {
        someRegion: '> .someRegion'
    }
};
```

# submissions

[![dependency status][3]][4]

[![browser support][5]][6]

stream of submission events for form controls

## Example

```js
var submissions = require("submissions")
var html = require("unpack-html")
var fold = require("reducers/fold")

var template = require("./template.html")
var elements = html(template)

document.body.appendChild(elements.root)

// get a reducible representation of all submission events
var stream = submissions(elements)

// the chunk is the state of the form controls in elements
fold(stream, function (chunk) {
    console.log("got submission chunk", chunk)
})
```

Submission events are hitting ENTER on inputs and clicking buttons.

When a submission event occurs it gives you the [form-data][7]
    state of the elements at that time.

## Installation

`npm install submissions`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Colingo/submissions.png
  [2]: http://travis-ci.org/Colingo/submissions
  [3]: http://david-dm.org/Colingo/submissions/status.png
  [4]: http://david-dm.org/Colingo/submissions
  [5]: http://ci.testling.com/Colingo/submissions.png
  [6]: http://ci.testling.com/Colingo/submissions
  [7]: http://github.com/Colingo/form-data-set

var submissions = require("../index")
var html = require("unpack-html")
var document = require("global/document")
var console = require("console")
var fold = require("reducers/fold")

var template = require("./template")
var elements = html(template)

document.body.appendChild(elements.root)

var stream = submissions(elements)

fold(stream, function (chunk) {
    console.log("got submission chunk", chunk)
})

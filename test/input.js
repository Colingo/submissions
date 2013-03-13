var test = require("tape")
var into = require("reducers/into")
var h = require("hyperscript")
var eve = require("eve")
var document = require("global/document")

var submissions = require("../index")

test("submissions can handle input's properly", function (assert) {
    var elements = {
        input: h("input", { type: "text" })
    }

    document.body.appendChild(elements.input)

    var submits = submissions(elements)
    var list = []
    into(submits, list)

    eve.emit(elements.input, "keypress", { keyCode: 13 })

    assert.deepEqual(list, [])

    elements.input.value = "some text"

    eve.emit(elements.input, "keypress", { keyCode: 13 })

    assert.deepEqual(list, [{
        input: "some text"
    }])

    eve.emit(elements.input, "keypress", { keyCode: 13, shiftKey: true })

    assert.equal(list.length, 1)

    document.body.removeChild(elements.input)

    assert.end()
})

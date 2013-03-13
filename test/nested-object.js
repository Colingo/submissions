var test = require("tape")
var into = require("reducers/into")
var h = require("hyperscript")
var eve = require("eve")
var document = require("global/document")

var submissions = require("../index")

test("submissions can handle nested objects", function (assert) {
    var elements = {
        foo: {
            bar: h("input")
            , baz: h("input")
        }
        , button: h("button")
        , root: h("div")
    }

    document.body.appendChild(elements.root)
    elements.root.appendChild(elements.button)
    elements.root.appendChild(elements.foo.bar)
    elements.root.appendChild(elements.foo.baz)

    var submits = submissions(elements)
    var list = []
    into(submits, list)

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        foo: {
            bar: ""
            , baz: ""
        }
    }])

    elements.foo.bar.value = "bar"
    elements.foo.baz.value = "baz"

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        foo: {
            bar: ""
            , baz: ""
        }
    }, {
        foo: {
            bar: "bar"
            , baz: "baz"
        }
    }])

    document.body.removeChild(elements.root)

    assert.end()
})

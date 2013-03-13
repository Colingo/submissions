var test = require("tape")
var into = require("reducers/into")
var h = require("hyperscript")
var eve = require("eve")
var document = require("global/document")

var submissions = require("../index")

test("submissions can handle select's properly", function (assert) {
    var elements = {
        select: h("select", [
            h("option", { value: "foo" })
            , h("option", { value: "bar" })
            , h("option", { value: "baz" })
        ])
        , button: h("button")
        , root: h("div")
    }

    document.body.appendChild(elements.root)
    elements.root.appendChild(elements.select)
    elements.root.appendChild(elements.button)

    var submits = submissions(elements)

    var list = []
    into(submits, list)

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{ select: "foo" }])

    elements.select.selectedIndex = 1

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{ select: "foo" }, { select: "bar" }])

    document.body.removeChild(elements.root)

    assert.end()
})

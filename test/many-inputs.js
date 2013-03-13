var test = require("tape")
var into = require("reducers/into")
var h = require("hyperscript")
var eve = require("eve")
var document = require("global/document")

var submissions = require("../index")

test("many inputs", function (assert) {
    var elements = {
        input: h("input")
        , textarea: h("textarea")
        , checkbox: h("input", { type: "checkbox" })
        , button: h("button")
        , root: h("div")
    }

    document.body.appendChild(elements.root)
    elements.root.appendChild(elements.input)
    elements.root.appendChild(elements.textarea)
    elements.root.appendChild(elements.checkbox)
    elements.root.appendChild(elements.button)

    var submits = submissions(elements)
    var list = []
    into(submits, list)

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        input: ""
        , checkbox: false
        , textarea: ""
    }])

    elements.input.value = "input"
    elements.textarea.value = "textarea"
    elements.checkbox.checked = true

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        input: ""
        , checkbox: false
        , textarea: ""
    }, {
        input: "input"
        , checkbox: true
        , textarea: "textarea"
    }])

    document.body.removeChild(elements.root)

    assert.end()
})

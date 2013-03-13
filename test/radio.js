var test = require("tape")
var into = require("reducers/into")
var h = require("hyperscript")
var eve = require("eve")
var document = require("global/document")

var submissions = require("../index")

test("radio test", function (assert) {
    var elements = {
        foo: {
            foo: radio("foo", "foo", true)
            , bar: radio("foo", "bar")
            , baz: radio("foo", "baz")
        }
        , bar: [
            radio("bar", "foo")
            , radio("bar", "bar")
            , radio("bar", "baz")
        ]
        , button: h("button")
        , root: h("div")
    }

    elements.root.appendChild(elements.button)
    elements.root.appendChild(elements.foo.foo)
    elements.root.appendChild(elements.foo.bar)
    elements.root.appendChild(elements.foo.baz)
    elements.root.appendChild(elements.bar[0])
    elements.root.appendChild(elements.bar[1])
    elements.root.appendChild(elements.bar[2])
    document.body.appendChild(elements.root)

    var submits = submissions(elements)
    var list = []
    into(submits, list)

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        foo: "foo"
        , bar: null
    }])

    elements.bar[1].checked = true
    elements.foo.baz.checked = true

    eve.emit(elements.button, "click", { bubbles: true })

    assert.deepEqual(list, [{
        foo: "foo"
        , bar: null
    }, {
        foo: "baz"
        , bar: "bar"
    }])

    document.body.removeChild(elements.root)

    assert.end()
})

function radio(name, value, checked) {
    return h("input", {
        type: "radio"
        , name: name
        , value: value
        , checked: checked || false
    })
}

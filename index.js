var FormData = require("form-data-set")
var commonAncestor = require("common-ancestor")
var event = require("dom-reduce/event")
var filter = require("reducers/filter")
var merge = require("reducers/merge")
var map = require("reducers/map")
var expand = require("reducers/expand")
var into = require("reducers/into")

var ENTER = 13

module.exports = submissions

function submissions(elements) {
    var elems = into(flattenElements(elements))
    var ancestor = commonAncestor.apply(null, elems)

    if (ancestor === null) {
        return
    }

    return map(merge([
        validClicks(ancestor, elems)
        , validPresses(ancestor, elems)
    ]), getFormData)

    function getFormData(ev) {
        ev.preventDefault()
        return FormData(elements)
    }
}

function validClicks(ancestor, elems) {
    var clicks = event(ancestor, "click")

    return filter(clicks, function (ev) {
        var target = ev.target

        return elems.indexOf(target) > -1 &&
            target.tagName === "BUTTON"
    })
}

function validPresses(ancestor, elems) {
    var keypresses = event(ancestor, "keypress")

    return filter(keypresses, function (ev) {
        var target = ev.target

        var validEvent = elems.indexOf(target) > -1
        validEvent = validEvent && (
            target.type === "text" || target.tagName === "TEXTAREA"
        )
        validEvent = validEvent && (
            ev.which === ENTER && !ev.shiftKey
        )
        validEvent = validEvent && target.value.trim() !== ""

        return validEvent
    })
}

function flattenElements(elements) {
    var keys = Object.keys(elements)

    return expand(keys, function (key) {
        var elem = elements[key]
        if (elem.nodeType && elem.tagName) {
            return elem
        } else {
            return flattenElements(elem)
        }
    })
}

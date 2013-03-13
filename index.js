var FormData = require("form-data-set")
var commonAncestor = require("common-ancestor")

var event = require("dom-reduce/event")
var filter = require("reducers/filter")
var merge = require("reducers/merge")
var map = require("reducers/map")
var expand = require("reducers/expand")
var into = require("reducers/into")
var fold = require("reducers/fold")

var ENTER = 13

module.exports = submissions

function submissions(elements, listener) {
    var elems = into(flattenElements(elements))
    var ancestor = commonAncestor.apply(null, elems)

    if (ancestor === null) {
        return
    }

    var validEvents = merge([
        validClicks(ancestor, elems)
        , validPresses(ancestor, elems)
    ])

    var formData = map(validEvents, getFormData)

    var r = filter(formData, isNonEmpty)

    if (listener) {
        fold(r, listener)
    }

    return r

    function getFormData(ev) {
        ev.preventDefault()
        return FormData(elements)
    }
}

function isNonEmpty(hash) {
    return Object.keys(hash).some(function (key) {
        var value = hash[key]

        if (typeof value === "string" && value.length === 0) {
            return false
        } else if (value === undefined || value === null) {
            return false
        } else {
            return true
        }
    })
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
            ev.keyCode === ENTER && !ev.shiftKey
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

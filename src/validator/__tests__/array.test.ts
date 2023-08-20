import test from "ava"
import { validateWithArray } from "../array.js"
import { createArgument } from "../../argument/index.js"
import { createOption } from "../../option/index.js"
import { ValidationError } from "../../error/index.js"

const arg = createArgument("<fake>", "Fake arg")
const opt = createOption("--file <file>", "File")

const isError = { instanceOf: ValidationError }

test("should validate a valid string", (t) => {
  t.is(validateWithArray(["foo", "bar"], "bar", arg), "bar", "arg")
  t.is(validateWithArray(["foo", "bar"], "bar", opt), "bar", "opt")
})

test("should throw for an invalid string", (t) => {
  t.throws(() => validateWithArray(["foo", "bar"], "invalid", arg), isError, "arg")
  t.throws(() => validateWithArray(["foo", "bar"], "invalid", opt), isError, "opt")
})

test("should validate a valid string[]", (t) => {
  t.deepEqual(
    validateWithArray(["foo", "bar", "hey"], ["bar", "hey"], arg),
    ["bar", "hey"],
    "arg",
  )
  t.deepEqual(
    validateWithArray(["foo", "bar", "hey"], ["bar", "hey"], opt),
    ["bar", "hey"],
    "opt",
  )
})

test("should throw for an invalid string[]", (t) => {
  t.throws(
    () => validateWithArray(["foo", "bar", "hey"], ["bar", "bad"], arg),
    isError,
    "arg",
  )
  t.throws(
    () => validateWithArray(["foo", "bar", "hey"], ["bar", "bad"], opt),
    isError,
    "opt",
  )
})

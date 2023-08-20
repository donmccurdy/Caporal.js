import test from "ava"
import { validateWithRegExp } from "../regexp.js"
import { createArgument } from "../../argument/index.js"
import { createOption } from "../../option/index.js"
import { ValidationError } from "../../error/index.js"

const arg = createArgument("<fake>", "Fake arg")
const opt = createOption("--file <file>", "File")

const isError = { instanceOf: ValidationError }

test("should validate a valid string", (t) => {
  t.is(validateWithRegExp(/^ex/, "example", arg), "example", "arg")
  t.is(validateWithRegExp(/^ex/, "example", opt), "example", "opt")
})

test("should throw for an invalid string", (t) => {
  t.throws(() => validateWithRegExp(/^ex/, "invalid", arg), isError, "arg")
  t.throws(() => validateWithRegExp(/^ex/, "invalid", opt), isError, "opt")
})

test("should validate a valid string[]", (t) => {
  t.deepEqual(
    validateWithRegExp(/^ex/, ["example", "executor"], arg),
    ["example", "executor"],
    "arg",
  )
  t.deepEqual(
    validateWithRegExp(/^ex/, ["example", "executor"], opt),
    ["example", "executor"],
    "opt",
  )
})

test("should throw for an invalid string[]", (t) => {
  t.throws(() => validateWithRegExp(/^ex/, ["example", "invalid"], arg), isError, "arg")
  t.throws(() => validateWithRegExp(/^ex/, ["example", "invalid"], opt), isError, "opt")
})

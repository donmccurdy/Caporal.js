import test from "ava"
import { getSuggestions, boldDiffString } from "../suggest.js"
import c from "chalk"

test("getSuggestions() should return proper suggestions", (t) => {
  const suggestions = getSuggestions("foo", ["foa", "foab", "foabc", "afoo", "bfoap"])
  t.deepEqual(suggestions, ["foa", "afoo", "foab"])
})
test("boldDiffString() should make the diff bold at the end of the word", (t) => {
  t.is(boldDiffString("foo", "foob"), "foo" + c.bold.greenBright("b"))
})
test("boldDiffString() should make the diff bold at the beginning of the word", (t) => {
  t.is(boldDiffString("foo", "doo"), c.bold.greenBright("d") + "oo")
})

test("boldDiffString() should make the diff bold at the middle of the word", (t) => {
  t.is(boldDiffString("foo", "fao"), "f" + c.bold.greenBright("a") + "o")
})

test("boldDiffString() should make the diff bold anywhere in the word", (t) => {
  t.is(
    boldDiffString("minimum", "maximum"),
    "m" + c.bold.greenBright("a") + c.bold.greenBright("x") + "imum",
  )
})

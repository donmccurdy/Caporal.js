import test from "ava"
import { levenshtein } from "../levenshtein.js"

const FIXTURES: [string, string, number][] = [
  ["hello", "bye", 5],
  ["some", "sometimes", 5],
  ["john", "jane", 3],
  ["exemple", "example", 1],
  ["", "", 0],
  ["not-empty", "", 9],
  ["", "not-empty", 9],
]

test("levenshtein", (t) => {
  for (const [a, b, expected] of FIXTURES) {
    t.is(levenshtein(a, b), expected, `.levenshtein('${a}', '${b}')`)
  }
})

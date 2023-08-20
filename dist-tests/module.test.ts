import test from "ava"
import { program, Program } from "@donmccurdy/caporal"

test("exports", (t) => {
  t.true(program instanceof Program, "exports.program")
})

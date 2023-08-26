import test from "ava"
import { getDefaultValueHint } from "../utils.js"
import { createArgument } from "../../argument/index.js"
import { CaporalValidator } from "../../validator/caporal.js"

test("getDefaultValueHint() should return the correct value hint", (t) => {
  const arg = createArgument("<arg>", "My arg", {
    validator: CaporalValidator.BOOLEAN,
    default: true,
  })
  t.is(getDefaultValueHint(arg), "default: true")
})

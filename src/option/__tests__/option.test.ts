import test from "ava"
import { createOption } from "../index.js"
import { OptionSynopsisSyntaxError } from "../../error/index.js"
import { Option } from "../../types.js"

test("createOption() should create a basic short option", (t) => {
  const opt = createOption("-f <file>", "My simple option")
  t.deepEqual(trimOption(opt), {
    allNames: ["f"],
    allNotations: ["-f"],
    shortName: "f",
    shortNotation: "-f",
    description: "My simple option",
    choices: [],
    name: "f",
    valueType: 1,
    boolean: false,
    valueRequired: true,
    required: false,
    synopsis: "-f <file>",
    variadic: false,
    visible: true,
    kind: "option",
    notation: "-f",
  })
})

test("createOption() should create a basic long option", (t) => {
  const opt = createOption("--file <file>", "My simple option")
  t.deepEqual(trimOption(opt), {
    allNames: ["file"],
    allNotations: ["--file"],
    longName: "file",
    longNotation: "--file",
    description: "My simple option",
    choices: [],
    name: "file",
    valueType: 1,
    boolean: false,
    valueRequired: true,
    required: false,
    synopsis: "--file <file>",
    variadic: false,
    visible: true,
    kind: "option",
    notation: "--file",
  })
})

test("createOption() should create a short option without value", (t) => {
  const opt = createOption("-f", "My simple option")
  t.deepEqual(trimOption(opt), {
    allNames: ["f"],
    allNotations: ["-f"],
    shortName: "f",
    shortNotation: "-f",
    description: "My simple option",
    choices: [],
    name: "f",
    boolean: true,
    valueRequired: false,
    valueType: 2,
    default: false,
    required: false,
    synopsis: "-f",
    variadic: false,
    visible: true,
    kind: "option",
    notation: "-f",
  })
})

test("createOption() should create a short option with optional value", (t) => {
  const opt = createOption("-p [mean]", "My simple option")
  t.deepEqual(trimOption(opt), {
    allNames: ["p"],
    allNotations: ["-p"],
    shortName: "p",
    shortNotation: "-p",
    description: "My simple option",
    choices: [],
    name: "p",
    boolean: false,
    valueRequired: false,
    valueType: 0,
    required: false,
    synopsis: "-p [mean]",
    variadic: false,
    visible: true,
    kind: "option",
    notation: "-p",
  })
})

test("createOption() should set choices if validator is an array", (t) => {
  const opt = createOption("-p [mean]", "My simple option", {
    validator: ["card", "cash"],
  })
  t.deepEqual(trimOption(opt), {
    allNames: ["p"],
    allNotations: ["-p"],
    shortName: "p",
    shortNotation: "-p",
    description: "My simple option",
    choices: ["card", "cash"],
    name: "p",
    boolean: false,
    typeHint: 'one of "card","cash"',
    valueRequired: false,
    validator: ["card", "cash"],
    valueType: 0,
    required: false,
    synopsis: "-p [mean]",
    variadic: false,
    visible: true,
    kind: "option",
    notation: "-p",
  })
})

test("createOption() should throw on invalid options", (t) => {
  for (const [a] of [["bad synopsis"], ["another"], ["---fooo"]]) {
    t.throws(() => createOption(a, "My simple option"), {
      instanceOf: OptionSynopsisSyntaxError,
    })
  }
})

function trimOption(obj: Option): Record<string, unknown> {
  const result = obj as unknown as Record<string, unknown>
  for (let key in result) {
    if (result[key] === undefined) {
      delete result[key]
    }
  }
  return result
}

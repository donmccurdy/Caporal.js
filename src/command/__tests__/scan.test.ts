import test from "ava"
import { scanCommands } from "../scan.js"
import { Program } from "../../program/index.js"
import path from "path"
import { Command } from "../index.js"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// TODO(test): Support scan w/o require()?
test.skip("scanCommands() should scan commands", async (t) => {
  const prog = new Program()
  const commands = await scanCommands(prog, path.join(__dirname, "../__fixtures__/"))
  commands.forEach((cmd) => {
    t.true(cmd instanceof Command)
  })
})

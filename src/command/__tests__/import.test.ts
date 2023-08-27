import test from "ava"
import { importCommand } from "../import.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// TODO(test): Support scan w/o require()?
test.skip("importCommand() should import a command from a file", async (t) => {
  const creator = await importCommand(
    path.resolve(__dirname, "../__fixtures__/example-cmd.ts"),
  )
  t.truthy(creator)
})

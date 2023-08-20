import test from "ava"
import { readdir } from "../fs.js"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

test("should resolve to a file list on success", async (t) => {
  const files = await readdir(__dirname)
  t.deepEqual(
    files.sort(),
    ["fs.test.ts", "levenshtein.spec.ts", "suggest.spec.ts"],
    "resolves file list",
  )
})

test("should reject if directory does note exist", async (t) => {
  await t.throwsAsync(
    async () => await readdir("/does/not/exist"),
    undefined,
    "throws on invalid directory",
  )
})

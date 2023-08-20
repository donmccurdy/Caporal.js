/**
 * @packageDocumentation
 * @internal
 */
import path from "path"
import zipObject from "lodash/zipObject.js"
import map from "lodash/map.js"
import { readdir } from "../utils/fs.js"
import { importCommand } from "./import.js"
import { createCommand } from "./index.js"
import type { Command } from "./index.js"
import type { Program } from "../program/index.js"

export async function scanCommands(
  program: Program,
  dirPath: string,
): Promise<Command[]> {
  const files = await readdir(dirPath)
  const imp = await Promise.all(files.map((f) => importCommand(path.join(dirPath, f))))
  const data = zipObject(files, imp)
  return map(data, (cmdBuilder, filename) => {
    const { dir, name } = path.parse(filename)
    const cmd = dir ? [...dir.split("/"), name].join(" ") : name
    const options = {
      createCommand: createCommand.bind(null, program, cmd),
      program,
    }
    return cmdBuilder(options)
  })
}

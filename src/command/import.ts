/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */
/**
 * @packageDocumentation
 * @internal
 */
import { CommandCreator } from "../types"
import path from "path"

export async function importCommand(file: string): Promise<CommandCreator> {
  const { dir, name } = path.parse(file)
  const filename = path.join(dir, name)
  const mod = require(filename)
  return mod.default ?? mod
}

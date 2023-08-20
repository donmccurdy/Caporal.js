/**
 * @packageDocumentation
 * @internal
 */

import type { Argument } from "../types.js"
import type { Command } from "../command/index.js"

export function findArgument(cmd: Command, name: string): Argument | undefined {
  return cmd.args.find((a) => a.name === name)
}

/**
 * @packageDocumentation
 * @internal
 */

import type { Command } from "../command/index.js"
import type { Option } from "../types.js"

/**
 * Find an option from its name for a given command
 *
 * @param cmd Command object
 * @param name Option name, short or long, camel-cased
 */
export function findOption(cmd: Command, name: string): Option | undefined {
  return cmd.options.find((o) => o.allNames.find((opt) => opt === name))
}

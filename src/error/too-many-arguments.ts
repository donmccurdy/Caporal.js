/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import { ArgumentsRange } from "../types.js"
import { Command } from "../command/index.js"
import { format } from "util"
import c from "chalk"

export class TooManyArgumentsError extends BaseError {
  constructor(cmd: Command, range: ArgumentsRange, argsCount: number) {
    const expArgsStr =
      range.min === range.max
        ? `exactly ${range.min}.`
        : `between ${range.min} and ${range.max}.`

    const cmdName = cmd.isProgramCommand() ? "" : `for command ${c.bold(cmd.name)}`
    const message = format(
      `Too many argument(s) %s. Got %s, expected %s`,
      cmdName,
      c.bold.redBright(argsCount),
      c.bold.greenBright(expArgsStr),
    )
    super(message, { command: cmd })
  }
}

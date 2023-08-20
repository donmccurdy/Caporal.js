/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import { Command } from "../command/index.js"
import { Argument } from "../types.js"
import chalk from "chalk"

export class MissingArgumentError extends BaseError {
  constructor(argument: Argument, command: Command) {
    const msg = `Missing required argument ${chalk.bold(argument.name)}.`
    super(msg, { argument, command })
  }
}

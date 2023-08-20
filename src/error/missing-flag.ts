/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import { Command } from "../command/index.js"
import { Option } from "../types.js"
import chalk from "chalk"

export class MissingFlagError extends BaseError {
  constructor(flag: Option, command: Command) {
    const msg = `Missing required flag ${chalk.bold(flag.allNotations.join(" | "))}.`
    super(msg, { flag, command })
  }
}

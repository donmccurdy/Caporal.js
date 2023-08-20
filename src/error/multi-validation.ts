/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import chalk from "chalk"
import { colorize } from "../utils/colorize.js"
import type { Command } from "../command/index.js"

export class ValidationSummaryError extends BaseError {
  constructor(cmd: Command, errors: BaseError[]) {
    const plural = errors.length > 1 ? "s" : ""
    const msg =
      `The following error${plural} occured:\n` +
      errors.map((e) => "- " + e.message.replace(/\n/g, "\n  ")).join("\n") +
      "\n\n" +
      chalk.dim("Synopsis: ") +
      colorize(cmd.synopsis)
    super(msg, { errors })
  }
}

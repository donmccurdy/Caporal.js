/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import { getSuggestions, boldDiffString } from "../utils/suggest.js"
import chalk from "chalk"
import type { Program } from "../program/index.js"
import flatMap from "lodash/flatMap.js"
import filter from "lodash/filter.js"
import wrap from "wrap-ansi"

/**
 * @todo Rewrite
 */
export class UnknownOrUnspecifiedCommandError extends BaseError {
  constructor(program: Program, command?: string) {
    const possibilities = filter(
      flatMap(program.getCommands(), (c) => [c.name, ...c.getAliases()]),
    )
    let msg = ""
    if (command) {
      msg = `Unknown command ${chalk.bold(command)}.`
      const suggestions = getSuggestions(command, possibilities)
      if (suggestions.length) {
        msg +=
          " Did you mean " +
          suggestions.map((s) => boldDiffString(command, s)).join(" or maybe ") +
          " ?"
      }
    } else {
      msg =
        "Unspecified command. Available commands are:\n" +
        wrap(possibilities.map((p) => chalk.whiteBright(p)).join(", "), 60) +
        "." +
        `\n\nFor more help, type ${chalk.whiteBright(program.getBin() + " --help")}`
    }

    super(msg, { command })
  }
}

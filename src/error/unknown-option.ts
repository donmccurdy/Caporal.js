/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import type { Option } from "../types.js"
import { getDashedOpt } from "../option/utils.js"
import { getGlobalOptions } from "../option/index.js"
import { getSuggestions, boldDiffString } from "../utils/suggest.js"
import c from "chalk"
import type { Command } from "../command/index.js"
import filter from "lodash/fp/filter.js"
import map from "lodash/fp/map.js"

/**
 * @todo Rewrite
 */
export class UnknownOptionError extends BaseError {
  constructor(flag: string, command: Command) {
    const longFlags = filter((f: Option) => f.name.length > 1),
      getFlagNames = map((f: Option) => f.name),
      possibilities = getFlagNames([
        ...longFlags(command.options),
        ...getGlobalOptions().keys(),
      ]),
      suggestions = getSuggestions(flag, possibilities)

    let msg = `Unknown option ${c.bold.redBright(getDashedOpt(flag))}. `
    if (suggestions.length) {
      msg +=
        "Did you mean " +
        suggestions
          .map((s) => boldDiffString(getDashedOpt(flag), getDashedOpt(s)))
          .join(" or maybe ") +
        " ?"
    }
    super(msg, { flag, command })
  }
}

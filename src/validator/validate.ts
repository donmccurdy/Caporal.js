/**
 * @packageDocumentation
 * @internal
 */

import type {
  Validator,
  Promisable,
  ParsedOption,
  ParsedArgument,
  Argument,
  Option,
} from "../types.js"

import { validateWithRegExp } from "./regexp.js"
import { validateWithArray } from "./array.js"
import { validateWithFunction } from "./function.js"
import { validateWithCaporal } from "./caporal.js"
import { isCaporalValidator } from "./utils.js"

export function validate(
  value: ParsedOption | ParsedArgument,
  validator: Validator,
  context: Argument | Option,
): Promisable<ParsedOption | ParsedArgument> {
  if (typeof validator === "function") {
    return validateWithFunction(validator, value, context)
  } else if (validator instanceof RegExp) {
    return validateWithRegExp(validator, value, context)
  } else if (Array.isArray(validator)) {
    return validateWithArray(validator, value, context)
  }
  // Caporal flag validator
  else if (isCaporalValidator(validator)) {
    return validateWithCaporal(validator, value, context)
  }
  return value
}

/**
 * @packageDocumentation
 * @internal
 */

import { BaseError } from "./base.js"
import { Validator } from "../types.js"
export class InvalidValidatorError extends BaseError {
  constructor(validator: Validator) {
    super("Caporal setup error: Invalid flag validator setup.", { validator })
  }
}

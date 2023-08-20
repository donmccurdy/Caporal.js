/**
 * @packageDocumentation
 * @internal
 */

import type { Command } from "../command/index.js"
import map from "lodash/map.js"
import zipObject from "lodash/zipObject.js"
import invert from "lodash/invert.js"
import pickBy from "lodash/pickBy.js"

export function getOptsMapping(cmd: Command): Record<string, string> {
  const names = map(cmd.options, "name")
  const aliases = map(cmd.options, (o) => o.shortName || o.longName)
  const result = zipObject(names, aliases)
  return pickBy({ ...result, ...invert(result) }) as Record<string, string>
}

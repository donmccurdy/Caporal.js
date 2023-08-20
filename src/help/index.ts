/**
 * @packageDocumentation
 * @module caporal/help
 */
import { Command } from "../command/index.js"
import { Program } from "../program/index.js"
import replace from "lodash/replace.js"
import chalk from "chalk"
import { buildTable } from "./utils.js"
import { colorize } from "../utils/colorize.js"
import * as allTemplates from "./templates/index.js"
import { getGlobalOptions } from "../option/index.js"
import { CustomizedHelpMap, CustomizedHelpOpts, TemplateContext, Template } from "./types.js"

const templates = new Map(Object.entries(allTemplates))
const customHelpMap: CustomizedHelpMap = new Map()

/**
 * Customize the help
 *
 * @param obj
 * @param text
 * @param options
 * @internal
 */
export function customizeHelp(
  obj: Command | Program,
  text: string,
  options: Partial<CustomizedHelpOpts>,
): void {
  const opts: CustomizedHelpOpts = {
    sectionName: "",
    colorize: true,
    ...options,
  }
  const data = customHelpMap.get(obj) || []
  data.push({ text, options: opts })
  customHelpMap.set(obj, data)
}

/**
 * Register a new help template
 *
 * @param name Template name
 * @param template Template function
 *
 */
export function registerTemplate(
  name: string,
  template: Template,
): Map<string, Template> {
  return templates.set(name, template)
}

/**
 * Helper to be used to call templates from within templates
 *
 * @param name Template name
 * @param ctx Execution context
 * @internal
 */
export async function tpl(name: string, ctx: TemplateContext): Promise<string> {
  const template = templates.get(name)
  if (!template) {
    throw Error(`Caporal setup error: Unknown help template '${name}'`)
  }
  return template(ctx)
}

/**
 * @internal
 * @param program
 * @param command
 */
export function getContext(program: Program, command?: Command): TemplateContext {
  const spaces = " ".repeat(2)
  const ctx: TemplateContext = {
    prog: program,
    cmd: command,
    chalk: chalk,
    colorize: colorize,
    customHelp: customHelpMap,
    tpl,
    globalOptions: getGlobalOptions(),
    table: buildTable,
    spaces,
    indent(str: string, sp = spaces) {
      return sp + replace(str.trim(), /(\r\n|\r|\n)/g, "\n" + sp)
    },
    eol: "\n",
    eol2: "\n\n",
    eol3: "\n\n\n",
  }
  return ctx
}

/**
 * Return the help text
 *
 * @param program Program instance
 * @param command Command instance, if any
 * @internal
 */
export async function getHelp(program: Program, command?: Command): Promise<string> {
  const ctx = getContext(program, command)
  return [await tpl("header", ctx), await tpl("usage", ctx)].join("")
}

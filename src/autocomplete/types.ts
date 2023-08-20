/**
 * @packageDocumentation
 * @module caporal/types
 */
import type { Argument, Option, Promisable, ParserResult } from "../types.js"
import type tabtab from "tabtab"
import type { Command } from "../command/index.js"
import type { Program } from "../program/index.js"

export interface CompletionItem {
  name: string
  description: string
}

export interface Completer {
  (ctx: CompletionContext): Promisable<(string | CompletionItem)[]>
}

export interface CompletionContext {
  program: Program
  currentCmd?: Command
  compEnv: tabtab.TabtabEnv
  parserResult: ParserResult
  lastPartIsOpt: boolean
  lastPartIsKnownOpt: boolean
  currentOpt?: Option
}

export type Completions = Map<Argument | Option, Completer>

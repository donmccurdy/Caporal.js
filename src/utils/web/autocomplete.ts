/**
 * Autocomplete mock for caporal-web
 *
 * @packageDocumentation
 * @internal
 */
import type { Program } from "../../program/index.js"
import type { Argument, Option } from "../../types.js"
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function registerCompletion(argOrOpt: Argument | Option, completer: Function) {}

export async function installCompletion(program: Program): Promise<void> {}

export async function uninstallCompletion(program: Program): Promise<void> {}

/**
 * @packageDocumentation
 * @internal
 */
///<amd-module name="@caporal/core"/>
/// <reference lib="dom" />
export * from "./index.js"
import { program, chalk } from "./index.js"

require("expose-loader?process!./utils/web/process")

// specific error handling for web
window.addEventListener("unhandledrejection", function (err: PromiseRejectionEvent) {
  program.emit("error", err.reason)
})

// override chalk level for web
chalk.level = 3

program
  .version("1.0.0")
  .name("Caporal Playground")
  .description("Dynamicaly generated playground program")
  .bin("play")

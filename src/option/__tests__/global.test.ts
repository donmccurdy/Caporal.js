/* eslint-disable no-console */
import test from "ava"
import sinon from "sinon"
import { Program } from "../../program/index.js"
import { logger } from "../../logger/index.js"
import { Action } from "../../types.js"
import { disableGlobalOption, findGlobalOption, resetGlobalOptions } from "../index.js"

const consoleLogSpy = sinon.stub(console, "log")
const loggerInfoSpy = sinon.stub(logger, "info")

// Winston does not use console.*.
const logStdoutSpy = sinon.stub(
  (console as any)._stdout as { write: typeof console.log },
  "write",
)

test.beforeEach(() => {
  consoleLogSpy.resetHistory()
  loggerInfoSpy.resetHistory()
  logStdoutSpy.resetHistory()

  logger.level = "info"
  logger.colorsEnabled = true
  resetGlobalOptions()
})

test.afterEach(() => {
  logger.colorsEnabled = true
})

function createProgram() {
  return new Program().name("test-prog").bin("test-prog").version("xyz")
}

test.serial("-V should show program version and exit", async (t) => {
  const prog = createProgram()
  await prog.run(["-V"])
  t.true(consoleLogSpy.calledWithExactly("xyz"))
})

test.serial("--version should show program version and exit", async (t) => {
  const prog = createProgram()
  await prog.run(["--version"])
  t.true(consoleLogSpy.calledWithExactly("xyz"))
})

test.serial("--no-color should disable colors in output", async (t) => {
  const prog = createProgram()
  const action: Action = function ({ logger }) {
    logger.info("Hey!")
  }
  prog.argument("[first-arg]", "First argument").action(action)
  await prog.run(["--no-color", "foo"])
  t.true(loggerInfoSpy.calledWithExactly("Hey!" as any))
})

test.serial("--color false should disable colors in output", async (t) => {
  const prog = createProgram()
  const action: Action = function ({ logger }) {
    logger.info("Joe!")
  }
  prog.argument("[first-arg]", "First argument").action(action)
  await prog.run(["--color", "false", "foo"])
  console.debug(loggerInfoSpy.lastCall.args[0])
  t.true(loggerInfoSpy.calledWithExactly("Joe!" as any))
})

test.serial("-v should enable verbosity", async (t) => {
  const prog = createProgram()
  const action: Action = function ({ logger }) {
    logger.info("my-info")
    logger.debug("my-debug")
  }
  prog.argument("[first-arg]", "First argument").action(action)

  await prog.run(["foo"])
  t.regex(loggerInfoSpy.lastCall.args[0] as unknown as string, /my-info/)

  await prog.run(["foo", "-v"])
  t.regex(logStdoutSpy.lastCall.args[0], /my-debug/)
})

test.serial("--verbose should enable verbosity", async (t) => {
  const prog = createProgram()
  const action: Action = function ({ logger }) {
    logger.info("my-info")
    logger.debug("my-debug")
  }
  prog.argument("[first-arg]", "First argument").action(action)

  await prog.run(["foo"])
  t.regex(loggerInfoSpy.lastCall.args[0] as unknown as string, /my-info/)

  await prog.run(["foo", "--verbose"])
  t.regex(logStdoutSpy.lastCall.args[0], /my-debug/)
})

test.serial(
  "--quiet should make the program only output warnings and errors",
  async (t) => {
    const prog = createProgram()
    const action: Action = function ({ logger }) {
      logger.info("my-info")
      logger.debug("my-debug")
      logger.warn("my-warn")
      logger.error("my-error")
    }
    prog.argument("[first-arg]", "First argument").action(action)

    await prog.run(["foo", "--quiet"])
    t.is(logStdoutSpy.callCount, 2)
    t.regex(logStdoutSpy.getCall(0).args[0], /my-warn/)
    t.regex(logStdoutSpy.getCall(1).args[0], /my-error/)
  },
)

test.serial("--silent should output nothing", async (t) => {
  const prog = createProgram()
  const action: Action = function ({ logger }) {
    logger.info("my-info")
    logger.debug("my-debug")
    logger.warn("my-warn")
    logger.error("my-error")
  }
  prog.argument("[first-arg]", "First argument").action(action)

  await prog.run(["foo", "--silent"])
  t.is(logStdoutSpy.callCount, 0)
})

test.serial(
  "disableGlobalOption() should disable a global option by name or notation",
  async (t) => {
    // by notation
    t.truthy(findGlobalOption("version"))
    t.true(disableGlobalOption("-V"))
    t.is(findGlobalOption("version"), undefined)

    // by name
    t.truthy(findGlobalOption("help"))
    t.true(disableGlobalOption("help"))
    t.is(findGlobalOption("help"), undefined)
  },
)

test.serial(
  "disableGlobalOption() should return false for an unknown global option",
  async (t) => {
    // by notation
    t.false(disableGlobalOption("--unknown"))

    // by name
    t.false(disableGlobalOption("unknown"))
  },
)

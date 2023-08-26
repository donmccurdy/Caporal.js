// jest.mock("../../error/fatal")
// jest.useFakeTimers()

import test from "ava"
import sinon from "sinon"
import { Program } from "../index.js"
import {
  fatalError,
  UnknownOrUnspecifiedCommandError,
  ValidationSummaryError,
  NoActionError,
} from "../../error/index.js"
import { Logger } from "../../types.js"
import { logger } from "../../logger/index.js"
import { resetGlobalOptions } from "../../option/index.js"

import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Silence MaxListenersExceededWarning.
process.setMaxListeners(100)

// const fataErrorMock = fatalError as unknown as jest.Mock

const consoleLogSpy = sinon.stub(console, "log")
const loggerWarnSpy = sinon.stub(logger, "warn")

test.beforeEach(() => {
  // fataErrorMock.mockClear()
  consoleLogSpy.resetHistory()
  loggerWarnSpy.resetHistory()
  resetGlobalOptions()
})

const createProgram = () => {
  return new Program().name("test-prog").bin("test-prog")
}

test(".version() should set the version", (t) => {
  const prog = createProgram()
  prog.version("beta-2")
  t.is(prog.getVersion(), "beta-2")
})

test(".description() should set the description", (t) => {
  const prog = createProgram()
  prog.description("fake-desc")
  t.is(prog.getDescription(), "fake-desc")
})

test(".hasCommands() should return false by default", async (t) => {
  const prog = createProgram()
  t.is(await prog.hasCommands(), false)
})

test(".getSynopsis should return the correct synopsis if program has commands", async (t) => {
  const prog = createProgram()
  prog.command("my-command", "my command").action(() => "ok")
  t.regex(await prog.getSynopsis(), /<command>/)
})

test(".synospis should return the correct synopsis if program does not have commands", async (t) => {
  const prog = createProgram()
  prog.action(() => "ok")
  t.notRegex(await prog.getSynopsis(), /<command>/)
})

test(".parse(undefined) should work", async (t) => {
  const prog = createProgram()
  prog.argument("[first-arg]", "First argument").action(() => "ok")
  t.is(await prog.run([]), "ok")
})

test("should be able to create a 'program-command' just by calling .argument()", async (t) => {
  const prog = createProgram()
  prog.argument("<first-arg>", "First argument").action(() => "ok")
  t.is(await prog.run(["first-arg"]), "ok")
})

test("should be able to create a 'program-command' just by calling .option()", async (t) => {
  const prog = createProgram()
  prog.option("--foo", "Foo option").action(() => "ok")
  t.is(await prog.run(["--foo"]), "ok")
})

test(".globalOption() should create a global option without associated action", async (t) => {
  const prog = createProgram()
  prog.option("--my-global <var>", "my global var", { global: true })
  prog.argument("<first-arg>", "First argument").action(() => "ok")
  t.is(await prog.run(["first-arg", "--my-global", "secret"]), "ok")
})

test.serial(
  ".globalOption() should create a global option with associated action",
  async (t) => {
    const prog = createProgram()

    const actionFn = sinon.fake()
    prog.option("--my-global <var>", "my global var", {
      global: true,
      action: actionFn,
    })
    prog.argument("<first-arg>", "First argument").action(() => "ok")

    t.is(await prog.run(["first-arg", "--my-global", "secret"]), "ok")
    t.true(actionFn.calledOnce)
  },
)

test.serial("disableGlobalOption() should disable a global option", async (t) => {
  const prog = createProgram()

  const actionFn = sinon.fake()
  prog.option("--my-global <var>", "my global var", {
    global: true,
    action: actionFn,
  })
  prog.argument("<first-arg>", "First argument").action(() => "ok")
  prog.strict(false)
  prog.disableGlobalOption("myGlobal")

  // second call should call console.warn
  prog.disableGlobalOption("myGlobal")

  t.is(await prog.run(["first-arg", "--my-global", "secret"]), "ok")
  t.true(actionFn.notCalled)
  t.true(loggerWarnSpy.calledOnce)
})

test(".discover() should set discovery path if it exists", (t) => {
  const prog = createProgram()
  prog.discover(".")
  t.is(prog.discoveryPath, ".")
})

test(".discover() should throw if  provided path does not exist", (t) => {
  t.throws(() => createProgram().discover("/unknown/path"))
})

test(".discover() should throw if provided path is not a directory", (t) => {
  t.throws(() => createProgram().discover(__filename))
})

// TODO(test): Unsure why this is failing.
// test("should be able to call discovered commands", async (t) => {
//   const prog = createProgram()
//   prog.discover(__dirname + "/../../command/__fixtures__")
//   console.log({ path: __dirname + "/../../command/__fixtures__" })
//   t.is(await prog.run(["example-cmd"]), "hey")
// })

test.serial("should be able to call .argument() multiple times", async (t) => {
  const action = sinon.stub().returns("ok")
  const prog = createProgram()
  prog.argument("<first-arg>", "First argument").action(action)
  prog.argument("<second-arg>", "Second argument").action(action)
  t.is(await prog.run(["first-arg", "sec-arg"]), "ok")
  t.is(action.callCount, 1)
})

test(".run() should work without arguments", async (t) => {
  const prog = createProgram()
  prog.strict(false)
  prog.action(() => "ok")
  t.is(await prog.run(), "ok")
})

test(".run() should throw an Error when no action is defined for the program-command", async (t) => {
  const prog = createProgram()
  prog.option("-t, --type <pizza-type>", "Pizza type")
  await t.throwsAsync(() => prog.run([]), { instanceOf: NoActionError })
})

test("should be able to create a 'program-command' just by calling .action()", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.action(action)
  t.is(await prog.run([]), "ok")
  t.true(action.calledOnce)
})

test(".exec() should work as expected", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.argument("<first-arg>", "First argument").action(action)
  t.is(await prog.exec(["1"]), "ok")
  t.deepEqual(action.args[0][0].args, { firstArg: "1" })
})

test(".cast(true) should enable auto casting", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.argument("<first-arg>", "First argument").action(action)
  prog.cast(true)
  t.is(await prog.run(["1"]), "ok")
  t.deepEqual(action.args[0][0].args, { firstArg: 1 })
})

test(".cast(false) should disable auto casting", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.argument("<first-arg>", "First argument").action(action)
  prog.cast(false)
  t.is(await prog.run(["1"]), "ok")
  t.deepEqual(action.args[0][0].args, { firstArg: "1" })
})

test("program should create help command and accept executing 'program help'", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  t.is(await prog.run(["help"]), -1)
  t.is(await prog.run(["help", "test"]), -1)
  t.true(action.notCalled)

  // TODO(test) expect(fataErrorMock).not.toHaveBeenCalled()
})

test("program should create help command and accept executing 'program help command-name'", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  t.is(await prog.run(["help", "unknown"]), -1)
  t.true(action.notCalled)
  // TODO(test) expect(fataErrorMock).not.toHaveBeenCalled()
})

test("program should create help command and accept executing 'program help unknown-command'", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  t.is(await prog.run(["help", "unknown"]), -1)
  t.true(action.notCalled)
  // TODO(test) expect(fataErrorMock).not.toHaveBeenCalled()
})

test("'program help' should work for a program without any command", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.bin("test").argument("<first-arg>", "First argument").action(action)
  t.is(await prog.run(["help"]), -1)
  t.true(action.notCalled)
  // TODO(test) expect(fataErrorMock).not.toHaveBeenCalled()
})

test("'program' should throw for a program without any command but a required arg", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog.bin("test").argument("<first-arg>", "First argument").action(action)
  await t.throwsAsync(() => prog.run([]), { instanceOf: ValidationSummaryError })
  t.true(action.notCalled)
})

test("program should fail when trying to run an unknown command", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  await t.throwsAsync(() => prog.run(["unknown-cmd"]), {
    instanceOf: UnknownOrUnspecifiedCommandError,
  })
})

test("program should fail when trying to run an unknown command and suggest some commands", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  await t.throwsAsync(() => prog.run(["unknown-cmd"]), {
    instanceOf: UnknownOrUnspecifiedCommandError,
  })
})

test("program should fail when trying to run without a specified command", async (t) => {
  const prog = createProgram()
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  await t.throwsAsync(() => prog.run([]), {
    instanceOf: UnknownOrUnspecifiedCommandError,
  })
})

test.serial(".setLogLevelEnvVar() should set the log level ENV var", async (t) => {
  const prog = createProgram()
  process.env.MY_ENV_VAR = "warn"
  prog.configure({ logLevelEnvVar: "MY_ENV_VAR" })
  const action = sinon.stub().returns("ok")
  prog
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(action)
  t.is(prog.getLogLevelOverride(), "warn")
  await prog.run(["test", "my-arg"])
  t.is(logger.level, "warn")
})

test(".logger() should override the default logger", async (t) => {
  const prog = createProgram()
  const logger = { log: sinon.fake() }
  prog
    .logger(logger as unknown as Logger)
    .command("test", "test command")
    .argument("<first-arg>", "First argument")
    .action(({ logger }) => {
      logger.log("foo" as any)
      return true
    })
  t.is(await prog.run(["test", "my-arg"]), true)
  t.true(logger.log.calledWith("foo"))
})

import test from "ava"
import { Program } from "../../program/index.js"
import { findCommand } from "../find.js"

test("findCommand()", async (t) => {
  const prog = new Program()
  prog.discover(".")
  const knownCmd = prog.command("my-command", "my command")

  t.is(await findCommand(prog, ["my-command"]), knownCmd, "should find a known command")

  // TODO(test): Test command discovery.
  // const discoverableCmd = createCommand(prog, "discoverable", "my command")
  // const commandCreator = sinon.stub().returns(discoverableCmd)
  // const importCommandMock = importCommand as jest.MockedFunction<typeof importCommand>
  // importCommandMock.mockResolvedValue(commandCreator)
  // t.is(await findCommand(prog, ["git init"]), discoverableCmd, "should find a discoverable command")
})

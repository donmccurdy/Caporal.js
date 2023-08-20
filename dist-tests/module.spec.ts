import test from "ava"
import prog, { program, Program } from "@donmccurdy/caporal"

test('exports', (t) => {
  t.true(prog instanceof Program, 'default export');
  t.true(program instanceof Program, 'exports.program');
});

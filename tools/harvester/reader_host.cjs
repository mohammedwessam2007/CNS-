// Loads Reader OS 2.0 headlessly (the same way tests/reader_os_test.js does) so the Node harvester can use its pure compile().
const fs = require("fs"), path = require("path"), vm = require("vm");
module.exports = function loadReader() {
  const src = fs.readFileSync(path.join(__dirname, "../../source/public/reader-v1.js"), "utf8");
  const sandbox = { console, TextEncoder, TextDecoder, Blob, URL, crypto: globalThis.crypto, document: { addEventListener() {}, querySelector() { return null; } }, navigator: { storage: {} }, location: { protocol: "https:" }, setTimeout, clearTimeout };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "reader-v1.js" });
  const R = sandbox.RENAISSANCE_READER;
  if (!R || R.version !== "2.0") throw new Error("Reader OS 2.0 did not load");
  return R;
};

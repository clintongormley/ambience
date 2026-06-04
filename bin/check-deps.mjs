// Build preflight — runs as `prebuild` before `npm run build`.
//
// A broken or self-referential `node_modules` symlink makes esbuild unresolvable,
// and through the npm wrapper the build then exits 0 with no output — a silent
// no-op that produces a stale bundle. This catches that state loudly (and removes
// a dangling link so `npm ci` can repair it). Uses only Node built-ins, since it
// must run when node_modules is absent or broken.
import { existsSync, lstatSync, readlinkSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve relative to this file, not cwd — npm may run scripts from elsewhere.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nm = join(root, "node_modules");

function fail(msg) {
  console.error(`\n✗ build preflight: ${msg}\n`);
  process.exit(1);
}

function lstatSafe(p) {
  try {
    return lstatSync(p);
  } catch {
    return null;
  }
}

const st = lstatSafe(nm);
if (st?.isSymbolicLink() && !existsSync(nm)) {
  // Dangling symlink (includes the self-referential `node_modules -> node_modules`
  // loop). Remove it so a subsequent `npm ci` recreates a real directory.
  const target = readlinkSync(nm);
  unlinkSync(nm);
  fail(`removed broken node_modules symlink (→ ${target}). Run \`npm ci\` then rebuild.`);
}

if (!existsSync(join(nm, "esbuild", "package.json"))) {
  fail("esbuild is not installed. Run `npm ci` then rebuild.");
}

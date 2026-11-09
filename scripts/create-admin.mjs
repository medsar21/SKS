import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { spawn } from "node:child_process";

if (!process.stdin.isTTY) {
  console.error(
    "Terminal interactif requis. Pour une automatisation, utilisez admin:bootstrap avec du JSON sur stdin.",
  );
  process.exitCode = 1;
} else {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, done) {
      if (!muted) process.stdout.write(chunk, encoding);
      done();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  try {
    const name = await rl.question("Nom de l’administrateur : ");
    const email = await rl.question("Email : ");
    process.stdout.write(
      "Mot de passe (16 caractères minimum, saisie masquée) : ",
    );
    muted = true;
    const password = await rl.question("");
    muted = false;
    process.stdout.write("\nConfirmation : ");
    muted = true;
    const confirmation = await rl.question("");
    muted = false;
    process.stdout.write("\n");
    rl.close();
    if (password !== confirmation)
      throw new Error("Les mots de passe diffèrent. Aucun compte créé.");
    const child = spawn(
      process.execPath,
      [
        "--conditions=react-server",
        "--import",
        "tsx",
        "src/server/cli/bootstrap-admin.ts",
      ],
      { stdio: ["pipe", "inherit", "inherit"], env: process.env },
    );
    child.stdin.end(JSON.stringify({ name, email, password }));
    child.on("exit", (code) => {
      process.exitCode = code ?? 1;
    });
  } catch (error) {
    rl.close();
    console.error(error.message);
    process.exitCode = 1;
  }
}

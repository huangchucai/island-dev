import cac from "cac";
import { createDevServer } from "./dev";
import { build } from "./build";
import { resolve } from "path";

const cli = cac("island").version("0.0.1").help();
cli
  .command("dev [root]", "Start development server")
  .action(async (root = "") => {
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
  });

cli.command("build [root]", "build in production").action(async (root = "") => {
  root = resolve(root);
  await build(root);
});

cli.parse();

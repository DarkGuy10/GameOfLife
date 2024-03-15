import { GameOfLife } from "./lib/GameOfLife.ts";
import { tryParseInt } from "./lib/utils.ts";
import { parseArgs } from "https://deno.land/std@0.219.0/cli/parse_args.ts";

if (import.meta.main) {
  const { rows, cols, delay } = parseArgs(Deno.args, {
    string: ["rows", "cols", "delay"],
  });
  const gameOfLife = new GameOfLife(
    tryParseInt(rows),
    tryParseInt(cols),
    tryParseInt(delay),
  );
  await gameOfLife.listen();
  await gameOfLife.simulate();
}

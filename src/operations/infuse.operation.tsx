import { environment } from "@raycast/api";
import { spawnSync } from "child_process";
import { basename, dirname, extname, join, resolve } from "path";

export default async function infuse(inputPath: string) {
  const fileDir = dirname(inputPath);
  const fileName = basename(inputPath, extname(inputPath));
  const outputPath = join(fileDir, `${fileName}_hdr${extname(inputPath)}`);

  const result = spawnSync("sips", [
    "--setProperty",
    "profile",
    resolve(environment.assetsPath, "2020_profile.icc"),
    "--out",
    outputPath,
    inputPath,
  ]);

  if (result.error || result.status !== 0) {
    throw new Error(`Infusing image failed: ${result.stderr.toString()}`);
  }
}

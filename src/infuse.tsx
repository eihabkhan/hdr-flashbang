import { getSelectedFinderItems, showToast, Toast, environment } from "@raycast/api";
import { resolve, dirname, basename, extname, join } from "path";
import { spawnSync } from "child_process";

const supportedFormats = ["JPEG", "JPG", "PNG", "GIF"];

export default async function command() {
  try {
    const selectedItems = await getSelectedFinderItems();

    if (selectedItems.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No file selected",
        message: "Please select an image file in Finder",
      });

      return;
    }

    await showToast({
      style: Toast.Style.Animated,
      title: `Infusing ${selectedItems.length === 1 ? "image" : "images"}...`,
    });

    for (const item of selectedItems) {
      const inputPath = item.path;
      const ext = extname(inputPath).toUpperCase().substring(1);

      if (!supportedFormats.includes(ext)) {
        await showToast({
          style: Toast.Style.Failure,
          title: `Only ${supportedFormats.join(", ")} files are supported`,
        });

        return;
      }

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

      await showToast({
        style: Toast.Style.Success,
        title: "HDR infusion complete",
      });
    }
  } catch (error: unknown) {
    console.error(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Processing Failed",
      message: (error as Error).toString().substring(0, 100),
    });
  }
}

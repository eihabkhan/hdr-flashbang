import { getSelectedFinderItems, showToast, Toast } from "@raycast/api";
import { extname } from "path";
import infuse from "./operations/infuse.operation";

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

      await infuse(inputPath);

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

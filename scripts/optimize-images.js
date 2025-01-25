import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const optimizeImage = async (inputPath) => {
  const outputPath = inputPath.replace(".png", ".webp");

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .resize(800, 800, {
        fit: "cover",
        withoutEnlargement: true,
      })
      .toFile(outputPath);

    console.log(
      `Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`
    );
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

const main = async () => {
  const portraitsDir = "./public/images/portraits";
  const images = [
    path.join(portraitsDir, "portrait_nir.png"),
    path.join(portraitsDir, "portrait_nir_lora.png"),
  ];

  for (const image of images) {
    await optimizeImage(image);
  }
};

main().catch(console.error);

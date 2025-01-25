import sharp from "sharp";

// Optimize main portrait
sharp("public/images/portraits/portrait_nir.png")
  .resize(400, 400)
  .webp({ quality: 85 })
  .toFile("public/images/portraits/portrait_nir.webp")
  .then(() => console.log("Main portrait optimized"))
  .catch(console.error);

// Optimize hover portrait
sharp("public/images/portraits/portrait_nir_lora.png")
  .resize(400, 400)
  .webp({ quality: 75 })
  .toFile("public/images/portraits/portrait_nir_lora.webp")
  .then(() => console.log("Hover portrait optimized"))
  .catch(console.error);

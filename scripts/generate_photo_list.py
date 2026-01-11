import os
import json
from pathlib import Path

def generate_photo_list():
    # Get absolute paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    photos_dir = project_root / "public" / "images" / "photography"
    output_file = project_root / "src" / "content" / "photography.ts"
    
    # Get all jpg files in the directory
    photos = []
    for i, filename in enumerate(sorted(os.listdir(photos_dir)), 1):
        if filename.endswith('.jpg') and not filename.startswith('.'):
            photos.append({
                "id": str(i),
                "url": f"/images/photography/{filename}",
                "title": "© Nir Zabari"
            })

    # Generate TypeScript code
    ts_code = """export interface Photo {
  id: string;
  url: string;
  title: string;
}

// Seeded random number generator
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const basePhotos: Photo[] = %s as const;

export const getPhotos = (seed: number = 42) => shuffleArray(basePhotos, seed);
""" % json.dumps(photos, indent=2)

    # Write to the TypeScript file
    with open(output_file, "w") as f:
        f.write(ts_code)

if __name__ == "__main__":
    generate_photo_list() 
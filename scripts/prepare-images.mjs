import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const brainDir = 'C:\\Users\\MY\\.gemini\\antigravity-ide\\brain\\90c7668a-d4b7-4ecc-aeda-a05e0f48df64';
const publicUploads = path.resolve(process.cwd(), 'public/uploads');
const storageUploads = path.resolve(process.cwd(), 'storage/uploads');

if (!fs.existsSync(publicUploads)) fs.mkdirSync(publicUploads, { recursive: true });
if (!fs.existsSync(storageUploads)) fs.mkdirSync(storageUploads, { recursive: true });

const volvoImg = path.join(brainDir, 'volvo_sleeper_bus_1792013892416.jpg');
const tataImg = path.join(brainDir, 'tata_passenger_bus_1792013911791.jpg');
const eicherImg = path.join(brainDir, 'eicher_school_bus_1792013931578.jpg');

async function processAllImages() {
  console.log('[Images] Processing generated bus images into public/uploads...');

  const sources = [
    { base: volvoImg, tint: null },                                     // Bus 1: Volvo Sleeper
    { base: tataImg, tint: { r: 180, g: 30, b: 30 } },                 // Bus 2: Red Intercity
    { base: volvoImg, tint: { r: 30, g: 80, b: 180 } },                // Bus 3: Blue Luxury Coach
    { base: tataImg, tint: { r: 50, g: 50, b: 60 } },                  // Bus 4: Graphite Grey Coach
    { base: eicherImg, tint: null },                                    // Bus 5: Yellow School Bus
    { base: eicherImg, tint: { r: 240, g: 240, b: 240 } },             // Bus 6: White Staff/Mini Bus
  ];

  const categories = ['front', 'rear', 'side-left', 'side-right', 'interior', 'dashboard', 'engine', 'tyres'];

  for (let bIdx = 0; bIdx < sources.length; bIdx++) {
    const busNum = bIdx + 1;
    const { base } = sources[bIdx];

    if (!fs.existsSync(base)) {
      console.warn(`Source image ${base} not found!`);
      continue;
    }

    const metadata = await sharp(base).metadata();
    const width = metadata.width || 1280;
    const height = metadata.height || 720;

    for (const cat of categories) {
      const filename = `demo-bus-${busNum}-${cat}.jpg`;
      const pubDest = path.join(publicUploads, filename);
      const storeDest = path.join(storageUploads, filename);

      let pipeline = sharp(base);

      if (cat === 'front') {
        // Standard front-3/4 beauty shot
        pipeline = pipeline.resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'side-left') {
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.1),
          top: Math.floor(height * 0.1),
          width: Math.floor(width * 0.8),
          height: Math.floor(height * 0.8),
        }).resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'side-right') {
        pipeline = pipeline.flop().resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'rear') {
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.05),
          top: Math.floor(height * 0.2),
          width: Math.floor(width * 0.5),
          height: Math.floor(height * 0.7),
        }).resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'dashboard') {
        // Driver cabin / dashboard zoom
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.6),
          top: Math.floor(height * 0.3),
          width: Math.floor(width * 0.35),
          height: Math.floor(height * 0.5),
        }).resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'interior') {
        // Passenger saloon zoom
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.3),
          top: Math.floor(height * 0.25),
          width: Math.floor(width * 0.45),
          height: Math.floor(height * 0.5),
        }).resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'engine') {
        // Rear engine bay / mechanical close up
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.1),
          top: Math.floor(height * 0.5),
          width: Math.floor(width * 0.35),
          height: Math.floor(height * 0.45),
        }).resize(1280, 720, { fit: 'cover' });
      } else if (cat === 'tyres') {
        // Wheel and radial tyre close up
        pipeline = pipeline.extract({
          left: Math.floor(width * 0.15),
          top: Math.floor(height * 0.55),
          width: Math.floor(width * 0.3),
          height: Math.floor(height * 0.4),
        }).resize(1280, 720, { fit: 'cover' });
      }

      const buffer = await pipeline.jpeg({ quality: 85 }).toBuffer();
      fs.writeFileSync(pubDest, buffer);
      fs.writeFileSync(storeDest, buffer);
    }
    console.log(`[Images] Generated complete 8-photo set for demo-bus-${busNum}`);
  }

  console.log('[Images] All 48 bus vehicle images generated and populated in public/uploads and storage/uploads.');
}

processAllImages().catch(console.error);

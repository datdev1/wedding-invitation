/**
 * Resize gallery images for web deployment
 * Run: node resize-images.js
 * Requires: npm install sharp
 */
const fs = require('fs');
const path = require('path');

async function resize() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('❌ Cần cài sharp: npm install sharp');
    console.log('Hoặc bạn có thể resize ảnh thủ công bằng bất kỳ công cụ nào.');
    console.log('Kích thước đề xuất: 1200x1800px, quality 80%');
    process.exit(1);
  }

  const galleryDir = path.join(__dirname, 'assets', 'images', 'gallery');
  const origDir = path.join(__dirname, 'original_images');

  // Read original high-res images
  const origFiles = fs.readdirSync(origDir).filter(f => f.endsWith('.jpg')).sort();

  console.log(`📸 Tìm thấy ${origFiles.length} ảnh gốc trong thư mục images/`);
  console.log('🔄 Đang resize...\n');

  for (let i = 0; i < origFiles.length; i++) {
    const srcPath = path.join(origDir, origFiles[i]);
    const destName = String(i + 1).padStart(2, '0') + '.jpg';
    const destPath = path.join(galleryDir, destName);

    const origSize = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize(1200, 1800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toFile(destPath);

    const newSize = fs.statSync(destPath).size;
    const ratio = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`  ✅ ${origFiles[i]} → ${destName} (${(origSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB, -${ratio}%)`);
  }

  console.log('\n🎉 Hoàn tất! Ảnh đã được resize và lưu vào assets/images/gallery/');
}

resize().catch(console.error);

const pdf2img = require('pdf-img-convert');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const pdfPath = path.join(__dirname, 'public/MEDOXINITY LOGO.pdf');
    const outputPath = path.join(__dirname, 'public/placeholder-logo.png');

    console.log('Starting conversion of PDF to PNG...');
    console.log('PDF Path:', pdfPath);

    // Convert the first page with a high scale width (e.g. 1600px for print clarity)
    const outputImages = await pdf2img.convert(pdfPath, { width: 1600 });
    
    if (outputImages && outputImages.length > 0) {
      fs.writeFileSync(outputPath, outputImages[0]);
      console.log('Success! Converted PDF to high-res PNG at:', outputPath);
    } else {
      console.error('Error: No pages found in the PDF file.');
    }
  } catch (err) {
    console.error('Failed to convert PDF:', err);
  }
})();

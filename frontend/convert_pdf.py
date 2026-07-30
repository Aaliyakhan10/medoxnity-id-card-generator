import fitz  # PyMuPDF
import os

pdf_path = r"c:\Users\safak\project\medoxnity-id-card-generator\frontend\public\MEDOXINITY LOGO.pdf"
output_path = r"c:\Users\safak\project\medoxnity-id-card-generator\frontend\public\placeholder-logo.png"

try:
    print("Opening PDF:", pdf_path)
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    
    # 4x zoom for high-res print quality
    zoom = 4
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    
    print("Writing PNG to:", output_path)
    pix.save(output_path)
    print("Success!")
except Exception as e:
    print("Failed to convert PDF:", e)

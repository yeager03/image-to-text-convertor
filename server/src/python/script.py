import sys
import os
import pytesseract
import cv2

from pdfminer.high_level import extract_text

pytesseract.pytesseract.tesseract_cmd = r'.\\libs\\tesseract\\tesseract.exe'

tempDir = os.path.abspath(__file__).split("\\")
tempDir.pop()
directory = "\\".join(tempDir)

os.chdir(directory)

filePath = sys.argv[1]
isFileExist = os.path.exists(filePath)

if(isFileExist):
   sys.stdout.reconfigure(encoding="utf-8")

   if(sys.argv[3] == "image"):
      img = cv2.imread(filePath)
      img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

      config = r'--oem 3 --psm 6'
      lang = sys.argv[2]

      print(pytesseract.image_to_string(img, config=config, lang=lang))
   else:
      print(extract_text(filePath))

   sys.exit()
else:
   sys.exit(1)


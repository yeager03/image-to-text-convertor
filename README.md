# image-to-text-convertor
Image or pdf to text convertor(NODE JS + PYTHON)

Чтобы запустить проект, вы должны склонировать его к себе, затем установить все зависимости для папки server и client.
Для запуска tesseract, скачайте его с офф. сайта и установите его на компьютер. Откройте директорию в которой установился tesseract, скопируйте содержимое этой папки. Откройте папку с проектом server/src/python, тут создайте папку libs/tesseract, и в папку tesseract вставьте всё что скопировали ранее. 
Для установки нужных языков, откройте офф. сайт tesseract, выберите нужные языки и скачайте их. Скачанные файлы поместите в папку server/src/python/libs/tesseract/tessdata. Затем откройте файл роутинга, который находится в server/src/router/index.js и вставьте код языков в массив allowedLanguageCodes.
Всё теперь можно пользоваться проектом.
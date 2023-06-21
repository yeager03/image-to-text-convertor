// multer
const multer = require("multer");

// path
const path = require("path");

// fs
const fs = require("fs");

// generator string
const randomstring = require("randomstring");

const validationRegExps = {
	image: /image\/(png|jpg|jpeg)/gm,
	file: /application\/(pdf)/gm,
};

const upload = () => {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			const dirName = path.join(path.resolve(), `src/python/temp`);

			if (!fs.existsSync(dirName)) {
				fs.mkdir(dirName, (err) => {
					if (err) throw new Error(err.message);
					cb(null, dirName);
				});
			} else {
				cb(null, dirName);
			}
		},
		filename: (req, file, cb) => {
			const ext = file.mimetype.split("/")[1];
			cb(null, `${randomstring.generate().toLowerCase()}.${ext}`);
		},
	});

	return multer({
		storage,
		limits: { fileSize: 5000000 },
		fileFilter(req, file, cb) {
			const fileType = file.mimetype.split("/")[0];

			switch (fileType) {
				case "image":
					if (!file.mimetype.match(validationRegExps.image)) {
						return cb(new Error("Пожалуйста, загрузите действительный файл с изображением!"));
					}
					cb(null, true);
					break;
				case "application":
					if (!file.mimetype.match(validationRegExps.file)) {
						return cb(new Error("Пожалуйста, загрузите действительный файл с pdf!"));
					}
					cb(null, true);
					break;
			}
		},
	});
};

module.exports = upload;

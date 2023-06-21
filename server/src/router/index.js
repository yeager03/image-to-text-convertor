// spawn for python script
const { spawn } = require("child_process");

// path
const path = require("path");

// fs
const fs = require("fs");

// router
const { Router } = require("express");

// multer
const upload = require("../core/multer");

const router = Router();

const allowedLanguageCodes = ["rus", "kaz", "eng", "tur", "chi_sim", "jpn", "kor", "fra", "deu", "ita", "spa"];

router.post("/upload", upload().single("file"), async (req, res) => {
	const fileType = req.file.mimetype.split("/")[0];
	const fileName = req.file.filename;
	const filePath = req.file.path;
	const language = req.body.language;

	if (!allowedLanguageCodes.includes(language)) {
		return res.status(400).send("Выберите существующий язык!");
	}

	const pythonFile = path.join(path.resolve(), "src/python/script.py");
	const pythonScript = spawn("python", [pythonFile, `temp\\${fileName}`, language, fileType]);

	let result = "";

	pythonScript.stdout.on("data", (data) => {
		result = data.toString().trim();
	});

	pythonScript.stderr.on("data", (error) => {
		console.error(`stderr: ${error}`);
	});

	pythonScript.on("close", (code) => {
		fs.unlink(filePath, (err) => {
			if (err) throw err;
		});

		if (code === 0) {
			return res.status(200).send(result);
		} else {
			return res.status(500).send("Не возможно прочитать файл...");
		}
	});
});

module.exports = router;

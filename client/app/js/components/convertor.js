const allowedLanguageCodes = [
	"rus",
	"kaz",
	"eng",
	"tur",
	"chi_sim",
	"jpn",
	"kor",
	"fra",
	"deu",
	"ita",
	"spa",
];

const data = new Map();

const eventHandlers = () => {
	const wrapper = document.querySelector(".convertor-wrapper");
	/* select */
	const selectHeader = document.querySelector(".select__header");
	const selectItems = document.querySelectorAll(".select__item");
	/* buttons */
	const submitButton = document.querySelector(".convertor-wrapper__button");
	const selectFileButton = document.querySelector(".convertor-wrapper__file");
	/* inputs */
	const fileInput = document.querySelector(".file__input");

	if (!selectHeader || !selectItems || !selectFileButton || !fileInput) {
		return;
	}

	const wrapperContentCopy = wrapper.innerHTML;

	selectHeader.addEventListener("click", function () {
		this.parentElement.classList.toggle("select_active");
	});

	selectItems.forEach((option) => {
		option.addEventListener("click", function () {
			const value = option.dataset.value;

			this.closest(".select").querySelector(".select__current").innerHTML =
				option.innerHTML;
			this.closest(".select").classList.remove("select_active");

			if (value !== "default" && allowedLanguageCodes.includes(value)) {
				this.closest(".select").querySelector(".select__input").value =
					option.dataset.value;
				data.set("language", option.dataset.value);
			}
		});
	});

	selectFileButton.addEventListener("click", () => fileInput.click());

	fileInput.addEventListener("click", (e) => (e.target.value = ""));

	fileInput.addEventListener("change", (e) => {
		const tempFile = e.target.files[0];

		if (
			tempFile.type.match(/image\/(png|jpg|jpeg)/gm) ||
			tempFile.type.match(/application\/(pdf)/gm)
		) {
			if (tempFile.size <= 5000000) {
				data.set("file", tempFile);
				e.target.setAttribute("loaded", true);

				const image = selectFileButton.querySelector("img");
				const title = selectFileButton.querySelector("h3");
				const desc = selectFileButton.querySelector("span");

				image.src = "images/dist/uploaded.png";

				title.style.fontSize = "16px";
				title.textContent = `Файл с именем: ${tempFile.name} успешно загружен`;

				desc.textContent = "Теперь выберите язык";
			} else {
				return Swal.fire({
					title: "Ошибка",
					text: "Максимальный размер изображения 5 мегабайт!",
					icon: "error",
					confirmButtonText: "Хорошо",
				});
			}
		} else {
			return Swal.fire({
				title: "Ошибка",
				text: "Выбранный вами файл, не является изображением!",
				icon: "error",
				confirmButtonText: "Хорошо",
			});
		}
	});

	window.addEventListener("click", (e) => {
		if (!e.target.className.includes("select")) {
			const parentElement = selectHeader.parentElement;

			if (parentElement.classList.contains("select_active")) {
				parentElement.classList.remove("select_active");
			}
		}
	});

	const clearInputs = () =>
		wrapper.querySelectorAll("input").forEach((input) => (input.value = ""));

	const renderResultText = (text) => {
		return `
         <div class="convertor-result">
				<p class="convertor-result__text">${text}</p>

				<div class="convertor-result__actions">
					<button class="convertor-result__button copy-button">
						<i class="fa-regular fa-copy"></i>
						Скопировать текст
					</button>
					<button class="convertor-result__button again-button">
						<i class="fa-solid fa-rotate-right"></i>
						Попробовать еще
					</button>
				</div>
			</div>
      `;
	};

	const copyContent = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	const postData = async (url, body = {}) => {
		submitButton.innerHTML = `<img src="images/dist/spinner.svg" alt="spinner icon img" />`;

		try {
			const response = await fetch(url, {
				method: "POST",
				body: body,
			});

			const text = await response.text();

			if (response.status !== 200) {
				throw text;
			}

			wrapper.innerHTML = renderResultText(text);
			data.clear();

			const copyButton = wrapper.querySelector(".copy-button");
			const againButton = wrapper.querySelector(".again-button");

			copyButton.addEventListener("click", () => {
				copyContent(text);
				Swal.fire({
					icon: "success",
					title: "Текст успешно скопирован",
					showConfirmButton: false,
					timer: 1500,
				});
			});
			againButton.addEventListener("click", () => {
				wrapper.innerHTML = wrapperContentCopy;
				eventHandlers();
				observer();
			});
		} catch (error) {
			return Swal.fire({
				title: "Ошибка",
				text: error,
				icon: "error",
				confirmButtonText: "Хорошо",
			});
		} finally {
			clearInputs();
			submitButton.innerHTML = "Загрузить";
		}
	};

	submitButton.addEventListener("click", () => {
		if (!data.has("file")) {
			return Swal.fire({
				title: "Ошибка",
				text: "Вы не выбрали файл!",
				icon: "error",
				confirmButtonText: "Хорошо",
			});
		}

		if (
			!data.has("language") ||
			data.get("language") === "default" ||
			!allowedLanguageCodes.includes(data.get("language"))
		) {
			return Swal.fire({
				title: "Ошибка",
				text: "Вы не выбрали язык!",
				icon: "error",
				confirmButtonText: "Хорошо",
			});
		}

		const formData = new FormData();
		formData.append("language", data.get("language"));
		formData.append("file", data.get("file"));

		postData(`${process.env.SERVER_URL}/upload`, formData);
	});
};

const observer = () => {
	const button = document.querySelector(".convertor-wrapper__button");

	const wrapper = document.querySelector(".convertor-wrapper");
	const fileInput = document.querySelector(".file__input");
	const langInput = document.querySelector(".select__input");

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(() => {
			if (data.has("file") && data.has("language")) {
				button.disabled = false;
				button.classList.remove("disabled");
			}
		});
	});

	[fileInput, langInput, wrapper].forEach((target) => {
		observer.observe(target, {
			attributes: true,
			childList: true,
			characterData: true,
		});
	});
};

export default function convertor() {
	eventHandlers();
	observer();
}

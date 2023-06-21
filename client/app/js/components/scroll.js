export default function smoothScroll(header, links) {
	const button = header.querySelector(".header-burger");
	const nav = header.querySelector(".header-list");

	const height = +getComputedStyle(header).height.slice(0, -2); // высота хедера

	if (window.location.hash !== "") {
		scrollToId(window.location.hash);
	}

	header.addEventListener("click", function (e) {
		if (e.target.tagName === "A") {
			e.preventDefault();

			let link = e.target;

			scrollToId(link.hash);

			if (nav.classList.contains("header-list_active")) {
				nav.classList.remove("header-list_active");
				button.innerHTML = "<i class='fa-solid fa-bars'></i>";
				header.removeAttribute("style");
				document.body.removeAttribute("style");
			}
		}
	});

	window.addEventListener("scroll", function (e) {
		let pos = Math.floor(window.pageYOffset);

		for (let i = links.length - 1; i >= 0; i--) {
			let link = links[i];

			let section = document.querySelector(link.hash);

			if (pos >= elemOffsetTop(section) - 250) {
				header
					.querySelector(".header-list__link_active")
					.classList.remove("header-list__link_active");
				link.classList.add("header-list__link_active");
				break;
			}
		}
	});

	function scrollToId(id) {
		const target = document.querySelector(id);

		if (target !== null) {
			let pos = elemOffsetTop(target) - (height + 20);

			scrollToPos(pos);
		}
	}

	function elemOffsetTop(node) {
		let coords = node.getBoundingClientRect();
		return +(coords.top + window.pageYOffset);
	}

	function scrollToPos(pos) {
		window.scrollTo({
			top: pos,
			behavior: "smooth",
		});
	}

	button.addEventListener("click", (e) => {
		if (nav.classList.contains("header-list_active")) {
			nav.classList.remove("header-list_active");
			button.innerHTML = "<i class='fa-solid fa-bars'></i>";
			header.removeAttribute("style");
			document.body.removeAttribute("style");
		} else {
			nav.classList.add("header-list_active");
			button.innerHTML = "<i class='fa-solid fa-xmark'></i>";
			header.style.zIndex = 1;
			document.body.style.overflow = "hidden";
		}
	});
}

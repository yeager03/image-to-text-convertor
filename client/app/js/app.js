// components
import smoothScroll from "./components/scroll.js";
import fixedHeader from "./components/header.js";
import convertor from "./components/convertor.js";

if (history.scrollRestoration) {
	history.scrollRestoration = "manual";
} else {
	window.onbeforeunload = function () {
		window.scrollTo(0, 0);
	};
}

document.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector(".header");
	const links = document.querySelectorAll(".header-list__link");

	smoothScroll(header, links);
	fixedHeader(header);
	convertor();
});

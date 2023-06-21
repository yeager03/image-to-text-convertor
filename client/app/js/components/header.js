export default function fixedHeader(selector) {
	const height = selector.offsetTop;

	window.addEventListener("scroll", (e) => {
		if (window.pageYOffset > height) {
			selector.classList.add("header_fixed");
		} else {
			if (selector.appAnimated) {
				return;
			}

			selector.appAnimated = true;

			let animate = selector.animate(
				[
					{
						backgroundColor: "transparent",
					},
				],
				{ duration: 250 }
			);

			animate.addEventListener("finish", function () {
				selector.classList.remove("header_fixed");
				selector.appAnimated = false;
			});
		}
	});
}

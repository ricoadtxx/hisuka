const buttonNavbar = document.querySelector(".filter");

const contentNavbar = document.querySelector(".navbar-content");

buttonNavbar.addEventListener("click", function () {
	buttonNavbar.classList.toggle("active");
	contentNavbar.classList.toggle("active");
});



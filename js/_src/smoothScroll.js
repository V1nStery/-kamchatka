document.querySelectorAll(".anchor").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.getAttribute("href").includes("https")) return;
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    const popupMenu = document.querySelector(".popup-menu");
    const burger = document.querySelector(".burger");
    if (popupMenu || burger) {
      popupMenu?.classList.remove("active");
      burger?.classList.remove("active");
    }

    if (targetElement) {
      const body = document.querySelector("body");
      body.classList.remove("no-scroll");

      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

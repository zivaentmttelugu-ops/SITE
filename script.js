const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");

document.querySelector(".hero")?.classList.add("is-visible");

const updateProgress = () => {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${pageHeight > 0 ? window.scrollY / pageHeight : 0})`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
    });
});

const workRail = document.querySelector("#work-rail");
const workCards = [...document.querySelectorAll(".work-card")];
const posterDialog = document.querySelector(".poster-dialog");
const dialogImage = posterDialog?.querySelector(".dialog-media img");
const dialogTitle = posterDialog?.querySelector("#poster-dialog-title");
const dialogMeta = posterDialog?.querySelector(".dialog-meta");
const closeDialog = () => {
    if (!posterDialog?.open) return;
    posterDialog.close();
    dialogImage.removeAttribute("src");
    dialogImage.alt = "";
    dialogTitle.textContent = "";
    dialogMeta.textContent = "";
    document.activeElement?.blur();
    document.body.style.overflow = "";
};

const showPoster = (card) => {
    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const meta = card.querySelector("p");
    if (!image || !title || !posterDialog) return;
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogTitle.textContent = title.textContent;
    dialogMeta.textContent = meta?.textContent || "";
    posterDialog.showModal();
    document.body.style.overflow = "hidden";
};

const bindPosterCard = (card) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();
        showPoster(card);
    });
};

workCards.forEach(bindPosterCard);

if (workRail && workCards.length > 1) {
    workCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        bindPosterCard(clone);
        workRail.append(clone);
    });
}

posterDialog?.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
posterDialog?.addEventListener("click", (event) => {
    if (event.target === posterDialog) closeDialog();
});
posterDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
});
posterDialog?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
    }
});
posterDialog?.addEventListener("close", () => {
    dialogImage.removeAttribute("src");
    dialogImage.alt = "";
    dialogTitle.textContent = "";
    dialogMeta.textContent = "";
    document.body.style.overflow = "";
});
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && posterDialog?.open) closeDialog();
}, true);

let railFrame;
let railPaused = false;
const startRail = () => {
    if (!workRail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.cancelAnimationFrame(railFrame);
    const move = () => {
        if (!railPaused) {
            const loopPoint = workRail.scrollWidth / 2;
            workRail.scrollLeft += 0.45;
            if (workRail.scrollLeft >= loopPoint) workRail.scrollLeft -= loopPoint;
        }
        railFrame = window.requestAnimationFrame(move);
    };
    railFrame = window.requestAnimationFrame(move);
};
workRail?.addEventListener("mouseenter", () => { railPaused = true; });
workRail?.addEventListener("mouseleave", () => { railPaused = false; });
workRail?.addEventListener("focusin", () => { railPaused = true; });
workRail?.addEventListener("focusout", () => { railPaused = false; });
startRail();

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

// BibTeX toggle + copy
document.querySelectorAll("[data-bib]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const box = document.getElementById(btn.dataset.bib);
        box.hidden = !box.hidden;
    });
});

document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(btn.parentElement.querySelector("pre").textContent);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
});

// Hover/focus linking between the research pillars and the architecture diagram
const arch = document.querySelector(".arch");
const pillars = document.querySelectorAll(".pillars li[data-part]");
function highlight(part) {
    if (part) arch.dataset.hl = part; else delete arch.dataset.hl;
    pillars.forEach((li) => li.classList.toggle("is-hl", li.dataset.part === part));
}
pillars.forEach((li) => {
    li.addEventListener("mouseenter", () => highlight(li.dataset.part));
    li.addEventListener("mouseleave", () => highlight(null));
    li.addEventListener("focus", () => highlight(li.dataset.part));
    li.addEventListener("blur", () => highlight(null));
});
arch.addEventListener("pointerover", (e) => {
    const g = e.target.closest("[data-part]");
    highlight(g ? g.dataset.part : null);
});
arch.addEventListener("pointerleave", () => highlight(null));

// News: hand of cards; click opens the enlarged card, Esc / backdrop / x closes it
const modal = document.getElementById("news-modal");
const modalBody = modal.querySelector(".nmodal-body");
const modalClose = modal.querySelector(".nmodal-close");
let lastFocus = null;
function openNews(card) {
    const clone = document.getElementById(card.dataset.detail).cloneNode(true);
    clone.removeAttribute("id");
    clone.querySelectorAll("details").forEach((d) => (d.open = true));
    modalBody.replaceChildren(clone);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lastFocus = card;
    modalClose.focus();
}
function closeNews() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalBody.replaceChildren();
    if (lastFocus) lastFocus.focus();
}
document.querySelectorAll(".ncard").forEach((card) => {
    card.addEventListener("click", () => openNews(card));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openNews(card); }
    });
});
modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".nmodal-close")) closeNews();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeNews();
});

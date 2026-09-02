/* ============================================================
   JCE EMMANUEL
   MAIN.JS — JAVASCRIPT GLOBAL
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       01 — HEADER AU SCROLL
    ======================================================== */

    const header = document.querySelector(".site-header");

    function handleHeaderScroll() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", handleHeaderScroll);

    handleHeaderScroll();


    /* ========================================================
       02 — MENU MOBILE
    ======================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.classList.toggle(
                "open",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        /* Fermer le menu après avoir cliqué
           sur un lien */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuToggle.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        /* Fermer le menu si on clique
           en dehors */

        document.addEventListener("click", event => {

            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                mainNav.classList.remove("open");

                menuToggle.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /* ========================================================
       03 — PAGE ACTIVE DANS LE MENU
    ======================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const navigationLinks =
        document.querySelectorAll(".main-nav a");

    navigationLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const linkPage =
            href.split("/")
                .pop()
                .split("#")[0]
                .toLowerCase();

        if (
            linkPage === currentPage ||
            (
                currentPage === "" &&
                linkPage === "index.html"
            )
        ) {

            link.classList.add("active");

        }

    });


    /* ========================================================
       04 — ANNÉE AUTOMATIQUE
    ======================================================== */

    const currentYear =
        new Date().getFullYear();

    document
        .querySelectorAll("[data-year]")
        .forEach(element => {

            element.textContent =
                currentYear;

        });


    /* ========================================================
       05 — ANIMATIONS AU SCROLL
    ======================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target
                                .classList
                                .add("visible");

                            revealObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* ========================================================
       06 — LIENS ANCRES
    ======================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link
                        .getAttribute("href")
                        .substring(1);

                if (!targetId) return;

                const target =
                    document.getElementById(
                        targetId
                    );

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const position =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight -
                    15;

                window.scrollTo({
                    top: position,
                    behavior: "smooth"
                });

            });

        });


    /* ========================================================
       07 — BOUTON RETOUR EN HAUT
    ======================================================== */

    let backTop =
        document.querySelector(".back-to-top");

    if (!backTop) {

        backTop =
            document.createElement("button");

        backTop.className =
            "back-to-top";

        backTop.setAttribute(
            "aria-label",
            "Retour en haut"
        );

        backTop.innerHTML = "↑";

        document.body.appendChild(backTop);

    }


    function updateBackTop() {

        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }

    window.addEventListener(
        "scroll",
        updateBackTop
    );

    updateBackTop();


    backTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });


    /* ========================================================
       08 — BOUTONS LIVE
    ======================================================== */

    const liveButtons =
        document.querySelectorAll(
            "[data-live-button]"
        );

    liveButtons.forEach(button => {

        button.addEventListener("click", () => {

            const url =
                button.dataset.liveButton;

            if (
                url &&
                url !== "#" &&
                url.trim() !== ""
            ) {

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            } else {

                showNotification(
                    "La diffusion en direct sera bientôt disponible."
                );

            }

        });

    });


    /* ========================================================
       09 — BOUTONS YOUTUBE
    ======================================================== */

    const youtubeButtons =
        document.querySelectorAll(
            "[data-youtube]"
        );

    youtubeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const url =
                button.dataset.youtube;

            if (
                url &&
                url !== "#"
            ) {

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            } else {

                showNotification(
                    "La chaîne YouTube sera bientôt connectée."
                );

            }

        });

    });


    /* ========================================================
       10 — COPIE DU CONTACT
    ======================================================== */

    const copyButtons =
        document.querySelectorAll(
            "[data-copy]"
        );

    copyButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const text =
                button.dataset.copy;

            if (!text) return;

            try {

                await navigator.clipboard.writeText(
                    text
                );

                showNotification(
                    "Copié dans le presse-papiers."
                );

            } catch (error) {

                console.error(
                    "Erreur de copie :",
                    error
                );

            }

        });

    });


    /* ========================================================
       11 — NOTIFICATION GLOBALE
    ======================================================== */

    window.showNotification =
        function(message, type = "info") {

            let notification =
                document.querySelector(
                    ".site-notification"
                );

            if (!notification) {

                notification =
                    document.createElement(
                        "div"
                    );

                notification.className =
                    "site-notification";

                document.body.appendChild(
                    notification
                );

            }

            notification.textContent =
                message;

            notification.dataset.type =
                type;

            notification.classList.add(
                "show"
            );

            clearTimeout(
                notification.hideTimer
            );

            notification.hideTimer =
                setTimeout(() => {

                    notification.classList.remove(
                        "show"
                    );

                }, 3500);

        };


    /* ========================================================
       12 — DATE / HEURE
    ======================================================== */

    const clockElements =
        document.querySelectorAll(
            "[data-live-clock]"
        );

    function updateClock() {

        const now =
            new Date();

        const time =
            now.toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

        clockElements.forEach(element => {

            element.textContent =
                time;

        });

    }

    if (clockElements.length) {

        updateClock();

        setInterval(
            updateClock,
            1000
        );

    }


    /* ========================================================
       13 — DATE AUTOMATIQUE
    ======================================================== */

    const dateElements =
        document.querySelectorAll(
            "[data-current-date]"
        );

    function updateDate() {

        const now =
            new Date();

        const date =
            now.toLocaleDateString(
                "fr-FR",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        dateElements.forEach(element => {

            element.textContent =
                date;

        });

    }

    if (dateElements.length) {

        updateDate();

    }


    /* ========================================================
       14 — FORMULAIRES : EMPÊCHER LE RECHARGEMENT
       POUR LES FORMULAIRES NON CONNECTÉS
    ======================================================== */

    const demoForms =
        document.querySelectorAll(
            "[data-demo-form]"
        );

    demoForms.forEach(form => {

        form.addEventListener("submit", event => {

            event.preventDefault();

            showNotification(
                "Votre demande a bien été enregistrée."
            );

            form.reset();

        });

    });


    /* ========================================================
       15 — BOUTONS DE TÉMOIGNAGE / ACTION
    ======================================================== */

    document
        .querySelectorAll("[data-action]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const action =
                    button.dataset.action;

                switch (action) {

                    case "prayer":

                        showNotification(
                            "Votre demande de prière peut être envoyée depuis la page Contact."
                        );

                        break;


                    case "donation":

                        showNotification(
                            "La section des dons sera activée prochainement."
                        );

                        break;


                    case "contact":

                        window.location.href =
                            "contact.html";

                        break;


                    default:

                        console.log(
                            "Action :",
                            action
                        );

                }

            });

        });


    /* ========================================================
       16 — IMAGE LAZY LOADING
    ======================================================== */

    document
        .querySelectorAll("img")
        .forEach(image => {

            if (
                !image.hasAttribute(
                    "loading"
                )
            ) {

                image.setAttribute(
                    "loading",
                    "lazy"
                );

            }

        });


    /* ========================================================
       17 — PROTECTION DES LIENS EXTERNES
    ======================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(link => {

            const rel =
                link.getAttribute("rel") || "";

            if (
                !rel.includes("noopener")
            ) {

                link.setAttribute(
                    "rel",
                    `${rel} noopener noreferrer`
                        .trim()
                );

            }

        });


    /* ========================================================
       18 — FIN DU CHARGEMENT
    ======================================================== */

    document.body.classList.add(
        "page-ready"
    );


    console.log(
        "JCE Emmanuel — site chargé correctement."
    );

});
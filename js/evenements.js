/* ============================================================
   JCE EMMANUEL
   MODULE : ÉVÉNEMENTS
   Fichier : js/evenements.js

   Fonctionnalités :
   - Affichage dynamique des événements
   - Recherche
   - Filtrage par catégorie
   - Événement à venir
   - Compte à rebours
   - Détails d'un événement
   - Inscription
   - Événements passés
   - localStorage
   - Préparation Firebase
============================================================ */


document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const STORAGE_EVENTS = "jceEvenements";
    const STORAGE_REGISTRATIONS = "jceInscriptions";


    /* ========================================================
       ÉVÉNEMENTS PAR DÉFAUT
    ======================================================== */

    const defaultEvents = [

        {
            id: 1,

            title: "Culte de la jeunesse",

            category: "culte",

            date: "2026-09-06",

            time: "08:30",

            endTime: "12:30",

            location: "Goma, RDC",

            description:
                "Un grand moment de communion, de louange, de prière et d'enseignement avec la jeunesse.",

            image:
                "assets/images/events/culte.jpg",

            organizer:
                "JCE Emmanuel",

            capacity: 300,

            featured: true,

            online: false,

            status: "upcoming"

        },


        {
            id: 2,

            title: "Conférence jeunesse 2026",

            category: "conference",

            date: "2026-09-19",

            time: "14:00",

            endTime: "17:00",

            location: "Goma, RDC",

            description:
                "Une conférence destinée à équiper et encourager les jeunes dans leur foi, leurs études et leur engagement.",

            image:
                "assets/images/events/conference.jpg",

            organizer:
                "JCE Emmanuel",

            capacity: 500,

            featured: true,

            online: false,

            status: "upcoming"

        },


        {
            id: 3,

            title: "Débat : Jeunesse et avenir",

            category: "jeunesse",

            date: "2026-09-26",

            time: "15:00",

            endTime: "17:00",

            location: "En ligne",

            description:
                "Un débat ouvert autour des défis, responsabilités et opportunités de la jeunesse.",

            image:
                "assets/images/events/debat.jpg",

            organizer:
                "JCE Live",

            capacity: 200,

            featured: false,

            online: true,

            status: "upcoming"

        },


        {
            id: 4,

            title: "Grande nuit de prière",

            category: "priere",

            date: "2026-10-02",

            time: "21:00",

            endTime: "05:00",

            location: "Goma, RDC",

            description:
                "Une nuit consacrée à la prière, l'intercession et la recherche de la présence de Dieu.",

            image:
                "assets/images/events/priere.jpg",

            organizer:
                "JCE Emmanuel",

            capacity: 800,

            featured: true,

            online: false,

            status: "upcoming"

        },


        {
            id: 5,

            title: "Formation leadership",

            category: "formation",

            date: "2026-10-10",

            time: "09:00",

            endTime: "16:00",

            location: "Centre JCE Emmanuel",

            description:
                "Une journée de formation consacrée au leadership, au service et au développement personnel.",

            image:
                "assets/images/events/formation.jpg",

            organizer:
                "JCE Emmanuel",

            capacity: 150,

            featured: false,

            online: false,

            status: "upcoming"

        },


        {
            id: 6,

            title: "JCE Live — Discussion libre",

            category: "live",

            date: "2026-10-17",

            time: "19:00",

            endTime: "21:00",

            location: "En ligne",

            description:
                "Une discussion libre en direct avec les jeunes autour de la foi, de la vie et de la société.",

            image:
                "assets/images/events/live.jpg",

            organizer:
                "JCE Live",

            capacity: 1000,

            featured: false,

            online: true,

            status: "upcoming"

        }

    ];


    /* ========================================================
       CHARGER LES ÉVÉNEMENTS
    ======================================================== */

    function getEvents() {

        const saved =
            localStorage.getItem(STORAGE_EVENTS);

        if (!saved) {

            localStorage.setItem(
                STORAGE_EVENTS,
                JSON.stringify(defaultEvents)
            );

            return defaultEvents;
        }


        try {

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {

                return defaultEvents;
            }

            return parsed;

        } catch (error) {

            console.error(
                "Erreur lors du chargement des événements :",
                error
            );

            return defaultEvents;
        }
    }


    let events = getEvents();


    /* ========================================================
       ELEMENTS HTML
    ======================================================== */

    const eventsGrid =
        document.getElementById("eventsGrid");

    const pastEventsGrid =
        document.getElementById("pastEventsGrid");

    const eventsEmpty =
        document.getElementById("eventsEmpty");

    const eventSearch =
        document.getElementById("eventSearch");

    const filterButtons =
        document.querySelectorAll(".event-filter");


    /* ========================================================
       CATÉGORIES
    ======================================================== */

    const categoryNames = {

        all: "Tous",

        culte: "Culte",

        conference: "Conférence",

        jeunesse: "Jeunesse",

        priere: "Prière",

        formation: "Formation",

        live: "JCE Live"

    };


    /* ========================================================
       FORMATAGE DATE
    ======================================================== */

    function formatDate(dateString) {

        const date =
            new Date(`${dateString}T12:00:00`);

        if (Number.isNaN(date.getTime())) {

            return dateString;
        }


        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    }


    /* ========================================================
       FORMAT DATE COURTE
    ======================================================== */

    function getDay(dateString) {

        const date =
            new Date(`${dateString}T12:00:00`);

        return String(
            date.getDate()
        ).padStart(2, "0");
    }


    function getMonth(dateString) {

        const date =
            new Date(`${dateString}T12:00:00`);

        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                month: "short"
            }
        )
        .format(date)
        .replace(".", "")
        .toUpperCase();
    }


    /* ========================================================
       ÉCHAPPEMENT HTML
    ======================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    /* ========================================================
       DATE COMPLÈTE DE L'ÉVÉNEMENT
    ======================================================== */

    function getEventDateTime(event) {

        return new Date(
            `${event.date}T${event.time || "00:00"}:00`
        );

    }


    /* ========================================================
       ÉVÉNEMENTS À VENIR
    ======================================================== */

    function getUpcomingEvents() {

        const now = new Date();

        return events
            .filter(event => {

                return (
                    getEventDateTime(event) >= now &&
                    event.status !== "cancelled"
                );

            })
            .sort(
                (a, b) =>
                    getEventDateTime(a) -
                    getEventDateTime(b)
            );

    }


    /* ========================================================
       ÉVÉNEMENTS PASSÉS
    ======================================================== */

    function getPastEvents() {

        const now = new Date();

        return events
            .filter(event => {

                return (
                    getEventDateTime(event) < now ||
                    event.status === "past"
                );

            })
            .sort(
                (a, b) =>
                    getEventDateTime(b) -
                    getEventDateTime(a)
            );

    }


    /* ========================================================
       CARTE ÉVÉNEMENT
    ======================================================== */

    function createEventCard(event) {

        const category =
            categoryNames[event.category] ||
            event.category;


        const onlineBadge =
            event.online
                ? `
                    <span class="event-online-badge">
                        <i class="fa-solid fa-circle"></i>
                        En ligne
                    </span>
                  `
                : "";


        const image =
            event.image ||
            "assets/images/events/default.jpg";


        return `

            <article
                class="event-card"
                data-event-id="${event.id}"
            >

                <div class="event-card-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(event.title)}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >


                    <div class="event-date-badge">

                        <strong>
                            ${getDay(event.date)}
                        </strong>

                        <span>
                            ${getMonth(event.date)}
                        </span>

                    </div>


                    ${onlineBadge}

                </div>


                <div class="event-card-body">

                    <span class="event-category">

                        <i class="fa-solid fa-tag"></i>

                        ${escapeHTML(category)}

                    </span>


                    <h3>
                        ${escapeHTML(event.title)}
                    </h3>


                    <p>
                        ${escapeHTML(event.description)}
                    </p>


                    <div class="event-card-meta">

                        <span>

                            <i class="fa-regular fa-clock"></i>

                            ${escapeHTML(event.time)}

                        </span>


                        <span>

                            <i class="fa-solid fa-location-dot"></i>

                            ${escapeHTML(event.location)}

                        </span>

                    </div>


                    <button
                        class="btn btn-outline event-details-btn"
                        data-event-id="${event.id}"
                    >

                        Voir les détails

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            </article>

        `;
    }


    /* ========================================================
       AFFICHER LES ÉVÉNEMENTS
    ======================================================== */

    function renderEvents(
        category = "all",
        searchTerm = ""
    ) {

        if (!eventsGrid) {
            return;
        }


        const normalizedSearch =
            searchTerm
                .trim()
                .toLowerCase();


        let filtered =
            getUpcomingEvents();


        if (category !== "all") {

            filtered =
                filtered.filter(
                    event =>
                        event.category === category
                );

        }


        if (normalizedSearch) {

            filtered =
                filtered.filter(event => {

                    const content = [

                        event.title,

                        event.description,

                        event.location,

                        event.category,

                        event.organizer

                    ]
                        .join(" ")
                        .toLowerCase();


                    return content.includes(
                        normalizedSearch
                    );

                });

        }


        if (filtered.length === 0) {

            eventsGrid.innerHTML = "";

            if (eventsEmpty) {

                eventsEmpty.hidden = false;

            }

            return;
        }


        if (eventsEmpty) {

            eventsEmpty.hidden = true;

        }


        eventsGrid.innerHTML =
            filtered
                .map(createEventCard)
                .join("");


        attachEventButtons();

    }


    /* ========================================================
       AFFICHER ÉVÉNEMENTS PASSÉS
    ======================================================== */

    function renderPastEvents() {

        if (!pastEventsGrid) {
            return;
        }


        const past =
            getPastEvents();


        if (past.length === 0) {

            pastEventsGrid.innerHTML = `

                <div class="events-empty">

                    <div class="events-empty-icon">

                        <i class="fa-regular fa-calendar"></i>

                    </div>

                    <h3>
                        Aucun événement passé
                    </h3>

                </div>

            `;

            return;
        }


        const limited =
            past.slice(0, 6);


        pastEventsGrid.innerHTML =
            limited.map(event => {

                return `

                    <article class="past-event-card">

                        <div class="past-event-date">

                            <strong>
                                ${getDay(event.date)}
                            </strong>

                            <span>
                                ${getMonth(event.date)}
                            </span>

                        </div>


                        <div class="past-event-content">

                            <span>
                                ${
                                    escapeHTML(
                                        categoryNames[
                                            event.category
                                        ] ||
                                        event.category
                                    )
                                }
                            </span>


                            <h3>
                                ${escapeHTML(event.title)}
                            </h3>


                            <p>
                                ${escapeHTML(
                                    event.location
                                )}
                            </p>


                            <button
                                class="past-event-btn"
                                data-event-id="${event.id}"
                            >

                                Voir

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>

                        </div>

                    </article>

                `;

            })
            .join("");


        pastEventsGrid
            .querySelectorAll(".past-event-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.eventId
                            );

                        openEventModal(id);

                    }
                );

            });

    }


    /* ========================================================
       BOUTONS DES ÉVÉNEMENTS
    ======================================================== */

    function attachEventButtons() {

        document
            .querySelectorAll(".event-details-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.eventId
                            );

                        openEventModal(id);

                    }
                );

            });

    }


    /* ========================================================
       MODAL
    ======================================================== */

    const eventModal =
        document.getElementById("eventModal");

    const eventModalContent =
        document.getElementById(
            "eventModalContent"
        );

    const eventModalClose =
        document.getElementById(
            "eventModalClose"
        );

    const eventModalOverlay =
        document.getElementById(
            "eventModalOverlay"
        );


    function openModal() {

        if (!eventModal) {
            return;
        }


        eventModal.classList.add("active");

        eventModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        if (!eventModal) {
            return;
        }


        eventModal.classList.remove("active");

        eventModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";


        if (eventModalContent) {

            eventModalContent.innerHTML =
                "";

        }

    }


    if (eventModalClose) {

        eventModalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (eventModalOverlay) {

        eventModalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                eventModal &&
                eventModal.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );


    /* ========================================================
       OUVRIR DÉTAIL ÉVÉNEMENT
    ======================================================== */

    function openEventModal(id) {

        const event =
            events.find(
                item =>
                    Number(item.id) === Number(id)
            );


        if (!event || !eventModalContent) {
            return;
        }


        const registrations =
            getRegistrations();


        const alreadyRegistered =
            registrations.some(
                registration =>
                    Number(
                        registration.eventId
                    ) === Number(event.id)
            );


        eventModalContent.innerHTML = `

            <div class="event-modal-header">

                <span class="event-category">

                    ${escapeHTML(
                        categoryNames[
                            event.category
                        ] ||
                        event.category
                    )}

                </span>


                <h2>
                    ${escapeHTML(event.title)}
                </h2>

            </div>


            <div class="event-modal-info">

                <div>

                    <i class="fa-regular fa-calendar"></i>

                    <strong>
                        Date
                    </strong>

                    <span>
                        ${escapeHTML(
                            formatDate(event.date)
                        )}
                    </span>

                </div>


                <div>

                    <i class="fa-regular fa-clock"></i>

                    <strong>
                        Heure
                    </strong>

                    <span>
                        ${escapeHTML(
                            event.time
                        )}
                    </span>

                </div>


                <div>

                    <i class="fa-solid fa-location-dot"></i>

                    <strong>
                        Lieu
                    </strong>

                    <span>
                        ${escapeHTML(
                            event.location
                        )}
                    </span>

                </div>


                <div>

                    <i class="fa-solid fa-users"></i>

                    <strong>
                        Capacité
                    </strong>

                    <span>
                        ${escapeHTML(
                            String(
                                event.capacity
                            )
                        )}
                        participants
                    </span>

                </div>

            </div>


            <div class="event-modal-description">

                <h3>
                    À propos de cet événement
                </h3>

                <p>
                    ${escapeHTML(
                        event.description
                    )}
                </p>

            </div>


            <div class="event-modal-organizer">

                <i class="fa-solid fa-user-group"></i>

                Organisé par :

                <strong>
                    ${escapeHTML(
                        event.organizer
                    )}
                </strong>

            </div>


            <div
                class="event-registration-area"
                id="eventRegistrationArea"
            >

                ${
                    alreadyRegistered
                    ?

                    `

                        <div class="registration-success">

                            <i class="fa-solid fa-circle-check"></i>

                            <strong>
                                Vous êtes déjà inscrit
                            </strong>

                            <p>
                                Votre inscription a été
                                enregistrée pour cet événement.
                            </p>

                        </div>

                    `

                    :

                    `

                        <h3>
                            Participer à cet événement
                        </h3>


                        <form
                            id="eventRegistrationForm"
                        >

                            <div class="form-row">

                                <div class="form-group">

                                    <label for="registrationName">
                                        Nom complet
                                    </label>

                                    <input
                                        type="text"
                                        id="registrationName"
                                        required
                                        placeholder="Votre nom complet"
                                    >

                                </div>


                                <div class="form-group">

                                    <label for="registrationPhone">
                                        Téléphone
                                    </label>

                                    <input
                                        type="tel"
                                        id="registrationPhone"
                                        required
                                        placeholder="+243..."
                                    >

                                </div>

                            </div>


                            <div class="form-group">

                                <label for="registrationEmail">
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    id="registrationEmail"
                                    placeholder="Votre adresse e-mail"
                                >

                            </div>


                            <button
                                type="submit"
                                class="btn btn-blue"
                            >

                                <i class="fa-solid fa-user-plus"></i>

                                Confirmer mon inscription

                            </button>

                        </form>

                    `
                }

            </div>

        `;


        openModal();


        const registrationForm =
            document.getElementById(
                "eventRegistrationForm"
            );


        if (registrationForm) {

            registrationForm.addEventListener(
                "submit",
                eventSubmit => {

                    eventSubmit.preventDefault();


                    const name =
                        document
                            .getElementById(
                                "registrationName"
                            )
                            .value
                            .trim();


                    const phone =
                        document
                            .getElementById(
                                "registrationPhone"
                            )
                            .value
                            .trim();


                    const email =
                        document
                            .getElementById(
                                "registrationEmail"
                            )
                            .value
                            .trim();


                    if (!name || !phone) {
                        return;
                    }


                    registerForEvent(
                        event.id,
                        name,
                        phone,
                        email
                    );


                    openEventModal(
                        event.id
                    );

                }
            );

        }

    }


    /* ========================================================
       INSCRIPTIONS
    ======================================================== */

    function getRegistrations() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE_REGISTRATIONS
                )
            ) || [];

        } catch {

            return [];

        }

    }


    function registerForEvent(
        eventId,
        name,
        phone,
        email
    ) {

        const registrations =
            getRegistrations();


        const exists =
            registrations.some(
                registration =>
                    Number(
                        registration.eventId
                    ) === Number(eventId) &&
                    registration.phone === phone
            );


        if (exists) {

            return;

        }


        registrations.push({

            id: Date.now(),

            eventId: Number(eventId),

            name: name,

            phone: phone,

            email: email,

            createdAt:
                new Date().toISOString(),

            status:
                "confirmed"

        });


        localStorage.setItem(
            STORAGE_REGISTRATIONS,
            JSON.stringify(
                registrations
            )
        );

    }


    /* ========================================================
       PROCHAIN ÉVÉNEMENT
    ======================================================== */

    let nextEvent = null;


    function updateNextEvent() {

        const upcoming =
            getUpcomingEvents();


        nextEvent =
            upcoming.length > 0
                ? upcoming[0]
                : null;


        if (!nextEvent) {
            return;
        }


        const title =
            document.getElementById(
                "nextEventTitle"
            );


        const description =
            document.getElementById(
                "nextEventDescription"
            );


        const date =
            document.getElementById(
                "nextEventDate"
            );


        const time =
            document.getElementById(
                "nextEventTime"
            );


        const location =
            document.getElementById(
                "nextEventLocation"
            );


        if (title) {

            title.textContent =
                nextEvent.title;

        }


        if (description) {

            description.textContent =
                nextEvent.description;

        }


        if (date) {

            date.textContent =
                formatDate(
                    nextEvent.date
                );

        }


        if (time) {

            time.textContent =
                nextEvent.time;

        }


        if (location) {

            location.textContent =
                nextEvent.location;

        }


        const button =
            document.getElementById(
                "nextEventButton"
            );


        if (button) {

            button.onclick = () => {

                openEventModal(
                    nextEvent.id
                );

            };

        }


        updateCountdown();

    }


    /* ========================================================
       COMPTE À REBOURS
    ======================================================== */

    function updateCountdown() {

        if (!nextEvent) {
            return;
        }


        const target =
            getEventDateTime(
                nextEvent
            );


        const now =
            new Date();


        let difference =
            target.getTime() -
            now.getTime();


        const daysElement =
            document.getElementById(
                "countDays"
            );


        const hoursElement =
            document.getElementById(
                "countHours"
            );


        const minutesElement =
            document.getElementById(
                "countMinutes"
            );


        const secondsElement =
            document.getElementById(
                "countSeconds"
            );


        const statusElement =
            document.getElementById(
                "countdownStatus"
            );


        if (difference <= 0) {

            if (daysElement)
                daysElement.textContent = "00";

            if (hoursElement)
                hoursElement.textContent = "00";

            if (minutesElement)
                minutesElement.textContent = "00";

            if (secondsElement)
                secondsElement.textContent = "00";


            if (statusElement) {

                statusElement.innerHTML = `

                    <i class="fa-solid fa-circle"></i>

                    L'événement est en cours ou terminé

                `;

            }

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        difference %= 
            1000 * 60 * 60 * 24;


        const hours =
            Math.floor(
                difference /
                (1000 * 60 * 60)
            );


        difference %=
            1000 * 60 * 60;


        const minutes =
            Math.floor(
                difference /
                (1000 * 60)
            );


        difference %=
            1000 * 60;


        const seconds =
            Math.floor(
                difference /
                1000
            );


        if (daysElement) {

            daysElement.textContent =
                String(days).padStart(
                    2,
                    "0"
                );

        }


        if (hoursElement) {

            hoursElement.textContent =
                String(hours).padStart(
                    2,
                    "0"
                );

        }


        if (minutesElement) {

            minutesElement.textContent =
                String(minutes).padStart(
                    2,
                    "0"
                );

        }


        if (secondsElement) {

            secondsElement.textContent =
                String(seconds).padStart(
                    2,
                    "0"
                );

        }


        if (statusElement) {

            statusElement.innerHTML = `

                <i class="fa-solid fa-circle"></i>

                Événement programmé

            `;

        }

    }


    /* ========================================================
       RECHERCHE
    ======================================================== */

    if (eventSearch) {

        eventSearch.addEventListener(
            "input",
            () => {

                const activeFilter =
                    document
                        .querySelector(
                            ".event-filter.active"
                        );


                const category =
                    activeFilter
                        ? activeFilter.dataset.category
                        : "all";


                renderEvents(
                    category,
                    eventSearch.value
                );

            }
        );

    }


    /* ========================================================
       FILTRES
    ======================================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category;


                renderEvents(
                    category,
                    eventSearch
                        ? eventSearch.value
                        : ""
                );

            }
        );

    });


    /* ========================================================
       INITIALISATION
    ======================================================== */

    renderEvents();

    renderPastEvents();

    updateNextEvent();


    /* ========================================================
       COMPTEUR CHAQUE SECONDE
    ======================================================== */

    setInterval(
        updateCountdown,
        1000
    );


    /* ========================================================
       API JAVASCRIPT PUBLIQUE
       Utile plus tard pour le panneau admin
    ======================================================== */

    window.JCEEvents = {

        getAll: function () {

            return getEvents();

        },


        getUpcoming: function () {

            return getUpcomingEvents();

        },


        getPast: function () {

            return getPastEvents();

        },


        getRegistrations: function () {

            return getRegistrations();

        },


        add: function (newEvent) {

            if (!newEvent) {
                return false;
            }


            events.push({

                id:
                    Date.now(),

                status:
                    "upcoming",

                ...newEvent

            });


            localStorage.setItem(
                STORAGE_EVENTS,
                JSON.stringify(events)
            );


            renderEvents();

            renderPastEvents();

            updateNextEvent();


            return true;

        },


        delete: function (id) {

            events =
                events.filter(
                    event =>
                        Number(event.id) !==
                        Number(id)
                );


            localStorage.setItem(
                STORAGE_EVENTS,
                JSON.stringify(events)
            );


            renderEvents();

            renderPastEvents();

            updateNextEvent();

        },


        reset: function () {

            localStorage.removeItem(
                STORAGE_EVENTS
            );


            events =
                getEvents();


            renderEvents();

            renderPastEvents();

            updateNextEvent();

        }

    };


    /* ========================================================
       LOG
    ======================================================== */

    console.log(
        "JCE Emmanuel — module Événements chargé."
    );

});
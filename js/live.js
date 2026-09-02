/* ============================================================
   JCE EMMANUEL
   MODULE : JCE LIVE
   Fichier : js/live.js
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       STOCKAGE
    ======================================================== */

    const LIVE_STORAGE = "jceLiveData";
    const CHAT_STORAGE = "jceLiveChat";


    /* ========================================================
       DONNÉES PAR DÉFAUT
    ======================================================== */

    const defaultLiveData = {

        currentLive: {
            active: false,
            type: "youtube",
            title: "JCE Live",
            description: "Aucune diffusion en direct actuellement.",
            url: "",
            platform: "",
            viewers: 0
        },

        meetings: [
            {
                id: 1,
                title: "Réunion JCE en ligne",
                date: "2026-09-05",
                time: "19:00",
                platform: "Google Meet",
                url: "",
                status: "scheduled"
            }
        ],

        debates: [
            {
                id: 1,
                title: "Jeunesse et avenir",
                date: "2026-09-12",
                time: "19:00",
                description:
                    "Un débat ouvert sur les défis et les opportunités de la jeunesse.",
                status: "scheduled"
            }
        ],

        videos: [
            {
                id: 1,
                title: "Enseignement — Marcher dans la foi",
                category: "Enseignement",
                description:
                    "Un enseignement destiné à fortifier la foi des jeunes.",
                youtubeUrl: "",
                thumbnail:
                    "assets/images/live/enseignement-1.jpg"
            },

            {
                id: 2,
                title: "Temps de prière JCE",
                category: "Prière",
                description:
                    "Un moment de prière et d'intercession.",
                youtubeUrl: "",
                thumbnail:
                    "assets/images/live/priere.jpg"
            }
        ]

    };


    /* ========================================================
       CHARGEMENT
    ======================================================== */

    function loadLiveData() {

        const saved =
            localStorage.getItem(LIVE_STORAGE);

        if (!saved) {

            localStorage.setItem(
                LIVE_STORAGE,
                JSON.stringify(defaultLiveData)
            );

            return defaultLiveData;
        }

        try {

            const data = JSON.parse(saved);

            return {
                ...defaultLiveData,
                ...data
            };

        } catch (error) {

            console.error(
                "Erreur de chargement JCE Live :",
                error
            );

            return defaultLiveData;
        }
    }


    let liveData = loadLiveData();


    function saveLiveData() {

        localStorage.setItem(
            LIVE_STORAGE,
            JSON.stringify(liveData)
        );
    }


    /* ========================================================
       OUTILS
    ======================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


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
       DIFFUSION EN DIRECT
    ======================================================== */

    function renderCurrentLive() {

        const live =
            liveData.currentLive;


        const container =
            document.getElementById(
                "currentLive"
            );


        const status =
            document.getElementById(
                "liveStatus"
            );


        if (!container) {
            return;
        }


        if (!live.active) {

            container.innerHTML = `

                <div class="live-offline">

                    <div class="live-status-icon">

                        <i class="fa-solid fa-video-slash"></i>

                    </div>

                    <span class="live-status-label">
                        HORS LIGNE
                    </span>

                    <h3>
                        JCE Live
                    </h3>

                    <p>
                        Aucune diffusion en direct actuellement.
                        Consultez notre programme pour connaître
                        les prochaines diffusions.
                    </p>

                </div>

            `;


            if (status) {

                status.textContent =
                    "Hors ligne";

                status.classList.remove(
                    "is-live"
                );

            }

            return;
        }


        container.innerHTML = `

            <div class="live-active">

                <div class="live-player">

                    ${
                        live.url
                        ?

                        `<iframe
                            src="${escapeHTML(live.url)}"
                            title="${escapeHTML(live.title)}"
                            allowfullscreen>
                        </iframe>`

                        :

                        `
                        <div class="live-player-placeholder">

                            <i class="fa-solid fa-play"></i>

                            <span>
                                Diffusion en direct
                            </span>

                        </div>
                        `
                    }

                    <span class="live-now-badge">

                        <i class="fa-solid fa-circle"></i>

                        EN DIRECT

                    </span>

                </div>


                <div class="live-information">

                    <span class="live-platform">
                        ${escapeHTML(live.platform)}
                    </span>

                    <h2>
                        ${escapeHTML(live.title)}
                    </h2>

                    <p>
                        ${escapeHTML(live.description)}
                    </p>


                    <div class="live-viewers">

                        <i class="fa-solid fa-eye"></i>

                        ${Number(live.viewers) || 0}
                        spectateurs

                    </div>

                </div>

            </div>

        `;


        if (status) {

            status.textContent =
                "EN DIRECT";

            status.classList.add(
                "is-live"
            );

        }

    }


    /* ========================================================
       RÉUNIONS GOOGLE MEET
    ======================================================== */

    function renderMeetings() {

        const container =
            document.getElementById(
                "meetingsList"
            );


        if (!container) {
            return;
        }


        const meetings =
            Array.isArray(liveData.meetings)
                ? liveData.meetings
                : [];


        if (!meetings.length) {

            container.innerHTML = `

                <div class="live-empty">

                    <i class="fa-solid fa-video"></i>

                    <p>
                        Aucune réunion programmée.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            meetings
                .map(meeting => {

                    return `

                        <article
                            class="live-meeting-card"
                        >

                            <div class="meeting-icon">

                                <i class="fa-solid fa-video"></i>

                            </div>


                            <div class="meeting-content">

                                <span class="live-label">
                                    GOOGLE MEET
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        meeting.title
                                    )}
                                </h3>

                                <div class="meeting-meta">

                                    <span>

                                        <i class="fa-regular fa-calendar"></i>

                                        ${escapeHTML(
                                            formatDate(
                                                meeting.date
                                            )
                                        )}

                                    </span>


                                    <span>

                                        <i class="fa-regular fa-clock"></i>

                                        ${escapeHTML(
                                            meeting.time
                                        )}

                                    </span>

                                </div>


                                ${
                                    meeting.url

                                    ?

                                    `
                                    <a
                                        href="${escapeHTML(
                                            meeting.url
                                        )}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-blue"
                                    >

                                        <i class="fa-solid fa-video"></i>

                                        Rejoindre la réunion

                                    </a>
                                    `

                                    :

                                    `
                                    <button
                                        class="btn btn-disabled"
                                        disabled
                                    >

                                        Lien bientôt disponible

                                    </button>
                                    `
                                }

                            </div>

                        </article>

                    `;

                })
                .join("");

    }


    /* ========================================================
       DÉBATS EN LIGNE
    ======================================================== */

    function renderDebates() {

        const container =
            document.getElementById(
                "debatesList"
            );


        if (!container) {
            return;
        }


        const debates =
            Array.isArray(liveData.debates)
                ? liveData.debates
                : [];


        if (!debates.length) {

            container.innerHTML = `

                <div class="live-empty">

                    <i class="fa-solid fa-comments"></i>

                    <p>
                        Aucun débat programmé.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            debates
                .map(debate => {

                    return `

                        <article
                            class="live-debate-card"
                        >

                            <div class="debate-icon">

                                <i class="fa-solid fa-comments"></i>

                            </div>


                            <div class="debate-content">

                                <span class="live-label">
                                    DÉBAT EN LIGNE
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        debate.title
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        debate.description
                                    )}
                                </p>


                                <div class="debate-meta">

                                    <span>

                                        <i class="fa-regular fa-calendar"></i>

                                        ${escapeHTML(
                                            formatDate(
                                                debate.date
                                            )
                                        )}

                                    </span>


                                    <span>

                                        <i class="fa-regular fa-clock"></i>

                                        ${escapeHTML(
                                            debate.time
                                        )}

                                    </span>

                                </div>

                            </div>

                        </article>

                    `;

                })
                .join("");

    }


    /* ========================================================
       VIDÉOS / ENSEIGNEMENTS
    ======================================================== */

    function renderVideos() {

        const container =
            document.getElementById(
                "liveVideos"
            );


        if (!container) {
            return;
        }


        const videos =
            Array.isArray(liveData.videos)
                ? liveData.videos
                : [];


        if (!videos.length) {

            container.innerHTML = `

                <div class="live-empty">

                    <i class="fa-solid fa-film"></i>

                    <p>
                        Aucune vidéo disponible.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            videos
                .map(video => {

                    return `

                        <article
                            class="live-video-card"
                        >

                            <div class="live-video-thumbnail">

                                ${
                                    video.thumbnail

                                    ?

                                    `
                                    <img
                                        src="${escapeHTML(
                                            video.thumbnail
                                        )}"
                                        alt="${escapeHTML(
                                            video.title
                                        )}"
                                        loading="lazy"
                                    >
                                    `

                                    :

                                    `
                                    <div class="video-placeholder">

                                        <i class="fa-solid fa-play"></i>

                                    </div>
                                    `
                                }


                                <span class="video-play">

                                    <i class="fa-solid fa-play"></i>

                                </span>

                            </div>


                            <div class="live-video-content">

                                <span class="live-label">

                                    ${escapeHTML(
                                        video.category
                                    )}

                                </span>


                                <h3>

                                    ${escapeHTML(
                                        video.title
                                    )}

                                </h3>


                                <p>

                                    ${escapeHTML(
                                        video.description
                                    )}

                                </p>


                                ${
                                    video.youtubeUrl

                                    ?

                                    `
                                    <a
                                        href="${escapeHTML(
                                            video.youtubeUrl
                                        )}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="video-link"
                                    >

                                        Regarder

                                        <i class="fa-solid fa-arrow-right"></i>

                                    </a>
                                    `

                                    :

                                    `
                                    <span class="video-coming">
                                        Vidéo bientôt disponible
                                    </span>
                                    `
                                }

                            </div>

                        </article>

                    `;

                })
                .join("");

    }


    /* ========================================================
       CHAT
    ======================================================== */

    function getChatMessages() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    CHAT_STORAGE
                )
            ) || [];

        } catch {

            return [];

        }

    }


    function saveChatMessages(messages) {

        localStorage.setItem(
            CHAT_STORAGE,
            JSON.stringify(messages)
        );

    }


    function renderChat() {

        const container =
            document.getElementById(
                "chatMessages"
            );


        if (!container) {
            return;
        }


        const messages =
            getChatMessages();


        if (!messages.length) {

            container.innerHTML = `

                <div class="chat-empty">

                    <i class="fa-regular fa-comments"></i>

                    <p>
                        Soyez le premier à participer
                        à la discussion.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            messages
                .slice(-50)
                .map(message => {

                    return `

                        <div class="chat-message">

                            <div class="chat-avatar">

                                ${escapeHTML(
                                    (
                                        message.name ||
                                        "U"
                                    )
                                    .charAt(0)
                                    .toUpperCase()
                                )}

                            </div>


                            <div class="chat-message-body">

                                <div class="chat-message-header">

                                    <strong>
                                        ${escapeHTML(
                                            message.name
                                        )}
                                    </strong>

                                    <small>
                                        ${escapeHTML(
                                            message.time
                                        )}
                                    </small>

                                </div>


                                <p>
                                    ${escapeHTML(
                                        message.text
                                    )}
                                </p>

                            </div>

                        </div>

                    `;

                })
                .join("");


        container.scrollTop =
            container.scrollHeight;

    }


    /* ========================================================
       ENVOI MESSAGE CHAT
    ======================================================== */

    const chatForm =
        document.getElementById(
            "chatForm"
        );


    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "chatName"
                    );


                const messageInput =
                    document.getElementById(
                        "chatMessage"
                    );


                if (!messageInput) {
                    return;
                }


                const text =
                    messageInput.value.trim();


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "Visiteur";


                if (!text) {
                    return;
                }


                const messages =
                    getChatMessages();


                messages.push({

                    id: Date.now(),

                    name:
                        name || "Visiteur",

                    text:

                        text.substring(
                            0,
                            500
                        ),

                    time:
                        new Date()
                            .toLocaleTimeString(
                                "fr-FR",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )

                });


                saveChatMessages(
                    messages
                );


                messageInput.value =
                    "";


                renderChat();

            }
        );

    }


    /* ========================================================
       PARTAGE
    ======================================================== */

    function setupShareButtons() {

        document
            .querySelectorAll(
                "[data-share-live]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const url =
                            window.location.href;


                        if (
                            navigator.share
                        ) {

                            try {

                                await navigator.share({

                                    title:
                                        "JCE Emmanuel — Live",

                                    text:
                                        "Rejoignez JCE Live",

                                    url:
                                        url

                                });

                            } catch {

                                // Annulation volontaire

                            }

                            return;
                        }


                        try {

                            await navigator.clipboard.writeText(
                                url
                            );


                            button.classList.add(
                                "copied"
                            );


                            const original =
                                button.innerHTML;


                            button.innerHTML = `

                                <i class="fa-solid fa-check"></i>

                                Lien copié

                            `;


                            setTimeout(() => {

                                button.innerHTML =
                                    original;

                                button.classList.remove(
                                    "copied"
                                );

                            }, 2000);

                        } catch (error) {

                            console.error(
                                "Impossible de copier le lien.",
                                error
                            );

                        }

                    }
                );

            });

    }


    /* ========================================================
       ACTIVER UNE DIFFUSION
       Pour le futur panneau admin
    ======================================================== */

    function startLive(options = {}) {

        liveData.currentLive = {

            active: true,

            type:
                options.type ||
                "youtube",

            title:
                options.title ||
                "JCE Live",

            description:
                options.description ||
                "Bienvenue dans la diffusion JCE Live.",

            url:
                options.url ||
                "",

            platform:
                options.platform ||
                "YouTube",

            viewers:
                Number(
                    options.viewers
                ) || 0

        };


        saveLiveData();

        renderCurrentLive();

    }


    /* ========================================================
       ARRÊTER UNE DIFFUSION
    ======================================================== */

    function stopLive() {

        liveData.currentLive.active =
            false;

        liveData.currentLive.viewers =
            0;

        saveLiveData();

        renderCurrentLive();

    }


    /* ========================================================
       AJOUTER UNE RÉUNION
    ======================================================== */

    function addMeeting(meeting) {

        if (!meeting) {
            return false;
        }


        if (!Array.isArray(liveData.meetings)) {

            liveData.meetings = [];

        }


        liveData.meetings.push({

            id: Date.now(),

            title:
                meeting.title ||
                "Réunion JCE",

            date:
                meeting.date,

            time:
                meeting.time,

            platform:
                meeting.platform ||
                "Google Meet",

            url:
                meeting.url ||
                "",

            status:
                "scheduled"

        });


        saveLiveData();

        renderMeetings();

        return true;

    }


    /* ========================================================
       AJOUTER UN DÉBAT
    ======================================================== */

    function addDebate(debate) {

        if (!debate) {
            return false;
        }


        if (!Array.isArray(liveData.debates)) {

            liveData.debates = [];

        }


        liveData.debates.push({

            id: Date.now(),

            title:
                debate.title ||
                "Nouveau débat",

            date:
                debate.date,

            time:
                debate.time,

            description:
                debate.description ||
                "",

            status:
                "scheduled"

        });


        saveLiveData();

        renderDebates();

        return true;

    }


    /* ========================================================
       AJOUTER UNE VIDÉO
    ======================================================== */

    function addVideo(video) {

        if (!video) {
            return false;
        }


        if (!Array.isArray(liveData.videos)) {

            liveData.videos = [];

        }


        liveData.videos.push({

            id: Date.now(),

            title:
                video.title ||
                "Nouvelle vidéo",

            category:
                video.category ||
                "Enseignement",

            description:
                video.description ||
                "",

            youtubeUrl:
                video.youtubeUrl ||
                "",

            thumbnail:
                video.thumbnail ||
                ""

        });


        saveLiveData();

        renderVideos();

        return true;

    }


    /* ========================================================
       INITIALISATION
    ======================================================== */

    renderCurrentLive();

    renderMeetings();

    renderDebates();

    renderVideos();

    renderChat();

    setupShareButtons();


    /* ========================================================
       API PUBLIQUE
       Utilisable plus tard par l'administration/Firebase
    ======================================================== */

    window.JCELive = {

        getData() {

            return liveData;

        },


        getChat() {

            return getChatMessages();

        },


        startLive,

        stopLive,

        addMeeting,

        addDebate,

        addVideo,


        refresh() {

            liveData =
                loadLiveData();

            renderCurrentLive();

            renderMeetings();

            renderDebates();

            renderVideos();

            renderChat();

        },


        clearChat() {

            localStorage.removeItem(
                CHAT_STORAGE
            );

            renderChat();

        }

    };


    console.log(
        "JCE Emmanuel — JCE Live chargé."
    );

});
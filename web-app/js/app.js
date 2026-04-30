/* ================================================================
   app.js — Steuerung der Webplattform
   ================================================================ */

(function () {
    'use strict';

    const STUDENTS = [
        'Anna', 'Ben', 'Clara', 'David',
        'Emma', 'Felix', 'Greta', 'Hannes',
        'Ida', 'Jonas', 'Klara', 'Leo'
    ];
    const PASSWORD = 'python';
    const STORAGE_KEY = 'pythonkurs.progress';
    const SESSION_KEY = 'pythonkurs.session';

    const screens = {
        login:  document.getElementById('login-screen'),
        map:    document.getElementById('map-screen'),
        level:  document.getElementById('level-screen'),
        finish: document.getElementById('finish-screen')
    };

    const state = {
        currentUser: null,
        progress: {},
        currentLevelId: null,
        currentTaskIdx: 0,
        play: null,
        selectedProfile: null
    };

    // -----------------------------------------------------------
    //  STORAGE
    // -----------------------------------------------------------
    function loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function saveProgress() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch (e) {}
    }

    function loadSession() {
        try { return localStorage.getItem(SESSION_KEY) || null; } catch (e) { return null; }
    }
    function saveSession(name) {
        try {
            if (name) localStorage.setItem(SESSION_KEY, name);
            else localStorage.removeItem(SESSION_KEY);
        } catch (e) {}
    }

    function getUserProgress() {
        if (!state.currentUser) return { completed: [], code: {} };
        if (!state.progress[state.currentUser]) {
            state.progress[state.currentUser] = { completed: [], code: {} };
        }
        return state.progress[state.currentUser];
    }

    function isLevelUnlocked(levelId) {
        if (levelId === 1) return true;
        const userProg = getUserProgress();
        return userProg.completed.includes(levelId - 1);
    }

    function isLevelCompleted(levelId) {
        return getUserProgress().completed.includes(levelId);
    }

    // -----------------------------------------------------------
    //  ROUTING
    // -----------------------------------------------------------
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }

    // -----------------------------------------------------------
    //  LOGIN
    // -----------------------------------------------------------
    function renderProfileTiles() {
        const grid = document.getElementById('profile-grid');
        grid.innerHTML = '';
        STUDENTS.forEach(name => {
            const tile = document.createElement('button');
            tile.className = 'profile-tile';
            tile.dataset.name = name;
            tile.innerHTML = `
                <div class="profile-avatar">${name.slice(0, 1).toUpperCase()}</div>
                <div class="profile-name">${name}</div>
            `;
            tile.addEventListener('click', () => selectProfile(name));
            grid.appendChild(tile);
        });
    }

    function selectProfile(name) {
        state.selectedProfile = name;
        document.querySelectorAll('.profile-tile').forEach(el => {
            el.classList.toggle('active', el.dataset.name === name);
        });
        document.getElementById('password-row').classList.remove('hidden');
        document.getElementById('login-error').classList.add('hidden');
        const input = document.getElementById('password-input');
        input.value = '';
        input.focus();
    }

    function attemptLogin() {
        const pw = document.getElementById('password-input').value;
        if (pw === PASSWORD && state.selectedProfile) {
            state.currentUser = state.selectedProfile;
            saveSession(state.currentUser);
            enterApp();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    }

    function logout() {
        state.currentUser = null;
        state.selectedProfile = null;
        saveSession(null);
        document.getElementById('password-row').classList.add('hidden');
        document.querySelectorAll('.profile-tile').forEach(el => el.classList.remove('active'));
        showScreen('login');
    }

    function enterApp() {
        document.getElementById('user-display').textContent = state.currentUser;
        renderLevelMap();
        showScreen('map');
    }

    // -----------------------------------------------------------
    //  LEVEL-MAP
    // -----------------------------------------------------------
    function renderLevelMap() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        const userProg = getUserProgress();

        LEVELS.forEach(lvl => {
            const unlocked = isLevelUnlocked(lvl.id);
            const completed = isLevelCompleted(lvl.id);
            const card = document.createElement('div');
            card.className = 'level-card' + (unlocked ? '' : ' locked') + (completed ? ' completed' : '');

            const statusIcon = completed
                ? `<svg class="level-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                : (unlocked
                    ? `<svg class="level-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>`
                    : `<svg class="level-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`);

            card.innerHTML = `
                <div class="level-card-header">
                    <span class="level-num">Level ${lvl.id}</span>
                    ${statusIcon}
                </div>
                <h3>${lvl.title}</h3>
                <p>${lvl.shortDescription}</p>
                <div class="level-card-footer">
                    <span>${completed ? 'Geschafft' : (unlocked ? 'Bereit' : 'Gesperrt')}</span>
                    <div class="stars-row">
                        ${[1,2,3].map(i =>
                            `<svg class="${completed ? 'earned' : ''}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9"/></svg>`
                        ).join('')}
                    </div>
                </div>
            `;
            if (unlocked) {
                card.addEventListener('click', () => openLevel(lvl.id));
            }
            grid.appendChild(card);
        });

        const total = LEVELS.length;
        const done = userProg.completed.length;
        document.getElementById('progress-summary').textContent =
            `${done} / ${total} Level abgeschlossen`;

        renderBadges();

        if (done === total) {
            document.getElementById('finish-summary').textContent =
                `${state.currentUser}, du hast alle ${total} Level gemeistert!`;
        }
    }

    function renderBadges() {
        const row = document.getElementById('badge-row');
        row.innerHTML = '';
        const userProg = getUserProgress();
        LEVELS.forEach(lvl => {
            const earned = userProg.completed.includes(lvl.id);
            const badge = document.createElement('div');
            badge.className = 'badge' + (earned ? ' earned' : '');
            badge.innerHTML = `
                <svg viewBox="0 0 24 24" fill="${earned ? '#f5b821' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9"/>
                </svg>
                <span>${lvl.title}</span>
            `;
            row.appendChild(badge);
        });
    }

    // -----------------------------------------------------------
    //  LEVEL-OPEN
    // -----------------------------------------------------------
    function openLevel(levelId) {
        const lvl = LEVELS.find(l => l.id === levelId);
        if (!lvl) return;
        state.currentLevelId = levelId;
        state.currentTaskIdx = 0;

        document.getElementById('level-tag').textContent = `Level ${lvl.id}`;
        document.getElementById('level-title').textContent = lvl.title;

        renderConceptList(lvl.concepts || []);
        renderKeyHints(lvl.keyHints || []);
        renderCurrentTask();

        showScreen('level');
    }

    function renderConceptList(concepts) {
        const ul = document.getElementById('concept-list');
        ul.innerHTML = '';
        concepts.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            ul.appendChild(li);
        });
    }

    function renderKeyHints(hints) {
        const row = document.getElementById('key-hints');
        row.innerHTML = '';
        hints.forEach(h => {
            const div = document.createElement('div');
            div.className = 'key-hint';
            const keysHtml = h.keys.map(k => `<kbd>${k}</kbd>`).join(' ');
            div.innerHTML = `${keysHtml}<span>${h.label}</span>`;
            row.appendChild(div);
        });
    }

    function renderCurrentTask() {
        const lvl = LEVELS.find(l => l.id === state.currentLevelId);
        const task = lvl.tasks[state.currentTaskIdx];

        document.getElementById('step-title').textContent = task.title;
        document.getElementById('step-description').innerHTML = task.description;
        document.getElementById('task-counter').textContent =
            `Aufgabe ${state.currentTaskIdx + 1} / ${lvl.tasks.length}`;

        const progressPct = ((state.currentTaskIdx) / lvl.tasks.length) * 100;
        document.getElementById('level-progress-fill').style.width = progressPct + '%';

        const hintEl = document.getElementById('step-hint');
        hintEl.classList.add('hidden');
        hintEl.textContent = task.hint || '';
        document.getElementById('show-hint').textContent = 'Tipp anzeigen';

        // Editor-Inhalt aus gespeichertem Code oder Initial-Code
        const userProg = getUserProgress();
        const codeKey = `${lvl.id}.${state.currentTaskIdx}`;
        const editor = document.getElementById('code-editor');
        const savedCode = userProg.code[codeKey];
        editor.value = (savedCode != null) ? savedCode : task.initialCode;

        // Ghost-Layer
        const ghostLayer = document.getElementById('ghost-layer');
        const wrapper = editor.parentElement;
        if (task.mode === 'type') {
            wrapper.classList.add('typing-mode');
            renderGhost(task.targetCode, editor.value);
        } else {
            wrapper.classList.remove('typing-mode');
            ghostLayer.innerHTML = '';
        }

        renderLineNumbers(editor.value);
        document.getElementById('canvas-status').textContent = 'Drücke „Ausführen"';
        document.getElementById('canvas-status').className = 'canvas-status';
        document.getElementById('editor-status').textContent = 'Bereit';
        document.getElementById('editor-status').className = 'editor-statusbar';
        document.getElementById('canvas-overlay').classList.add('hidden');
        clearCanvas();
    }

    function renderGhost(target, typed) {
        const ghost = document.getElementById('ghost-layer');
        let html = '';
        for (let i = 0; i < target.length; i++) {
            const tch = target[i];
            const sch = typed[i];
            const escaped = tch === '<' ? '&lt;' : tch === '>' ? '&gt;' : tch === '&' ? '&amp;' : tch;
            if (sch == null) {
                html += `<span>${escaped}</span>`;
            } else if (sch === tch) {
                html += `<span class="typed-correct">${escaped}</span>`;
            } else {
                const swrap = sch === '<' ? '&lt;' : sch === '>' ? '&gt;' : sch === '&' ? '&amp;' : sch;
                html += `<span class="typed-wrong">${swrap}</span>`;
            }
        }
        // Falls Schueler ueber das Ende hinaus tippt, hinten anhaengen
        if (typed.length > target.length) {
            for (let i = target.length; i < typed.length; i++) {
                const ch = typed[i];
                const swrap = ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch;
                html += `<span class="typed-wrong">${swrap}</span>`;
            }
        }
        ghost.innerHTML = html;
    }

    function renderLineNumbers(code) {
        const lines = code.split('\n').length;
        const ln = document.getElementById('line-numbers');
        let html = '';
        for (let i = 1; i <= Math.max(lines, 1); i++) html += i + '\n';
        ln.textContent = html;
    }

    function clearCanvas() {
        if (state.play) {
            state.play._destroy();
            state.play = null;
        }
        const canvas = document.getElementById('play-canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fbfcfe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // -----------------------------------------------------------
    //  CODE-AUSFUEHRUNG
    // -----------------------------------------------------------
    async function runCode() {
        const editor = document.getElementById('code-editor');
        const code = editor.value;

        // Aktuellen Code speichern
        const userProg = getUserProgress();
        const codeKey = `${state.currentLevelId}.${state.currentTaskIdx}`;
        userProg.code[codeKey] = code;
        saveProgress();

        clearCanvas();

        const canvas = document.getElementById('play-canvas');
        const play = PlayLib.createPlay(canvas);
        state.play = play;

        const statusEl = document.getElementById('editor-status');
        const canvasStatusEl = document.getElementById('canvas-status');

        let runError = null;
        play._setErrorHandler(err => {
            runError = err;
            statusEl.className = 'editor-statusbar error';
            statusEl.textContent = 'Laufzeit-Fehler: ' + (err.message || err);
            canvasStatusEl.className = 'canvas-status error';
            canvasStatusEl.textContent = 'Fehler im Code';
        });

        try {
            const jsCode = PyTranspiler.transpile(code);
            const builtins = PyTranspiler.builtins;
            const builtinNames = Object.keys(builtins);
            const builtinValues = builtinNames.map(n => builtins[n]);
            const wrapped = `
                "use strict";
                return (async function userMain() {
                    ${jsCode}
                    if (typeof play !== 'undefined' && play.start_program) {
                        await play.start_program();
                    }
                })();
            `;
            const fn = new Function('play', 'randint', ...builtinNames, wrapped);
            await fn(play, PlayLib.randint, ...builtinValues);
            statusEl.className = 'editor-statusbar';
            statusEl.textContent = 'Code läuft';
            canvasStatusEl.className = 'canvas-status running';
            canvasStatusEl.textContent = 'Programm läuft';
        } catch (err) {
            runError = err;
            statusEl.className = 'editor-statusbar error';
            statusEl.textContent = 'Fehler: ' + (err.message || err);
            canvasStatusEl.className = 'canvas-status error';
            canvasStatusEl.textContent = 'Fehler im Code';
            console.error(err);
        }

        // Validation kurz nach Start, damit das Programm rendern konnte
        setTimeout(() => validateCurrent(code, runError), 250);
    }

    function validateCurrent(studentCode, runError) {
        const lvl = LEVELS.find(l => l.id === state.currentLevelId);
        const task = lvl.tasks[state.currentTaskIdx];
        const ctx = {
            studentCode,
            state: state.play ? state.play._state : { sprites: [] },
            error: runError
        };
        let result;
        try { result = task.validate(ctx); }
        catch (e) { result = { ok: false, message: 'Validierung fehlgeschlagen: ' + e.message }; }

        const statusEl = document.getElementById('editor-status');
        const canvasStatusEl = document.getElementById('canvas-status');

        if (result.ok) {
            statusEl.className = 'editor-statusbar success';
            statusEl.textContent = 'Geschafft! ' + (result.message || '');
            canvasStatusEl.className = 'canvas-status success';
            canvasStatusEl.textContent = 'Aufgabe gelöst';
            showOverlay(result.message || 'Super gemacht!', () => proceedAfterTask());
        } else if (!runError) {
            statusEl.className = 'editor-statusbar';
            statusEl.textContent = result.message || 'Noch nicht ganz...';
        }
    }

    function proceedAfterTask() {
        const lvl = LEVELS.find(l => l.id === state.currentLevelId);
        document.getElementById('canvas-overlay').classList.add('hidden');

        if (state.currentTaskIdx + 1 < lvl.tasks.length) {
            state.currentTaskIdx += 1;
            renderCurrentTask();
            return;
        }

        // Level abgeschlossen
        const userProg = getUserProgress();
        if (!userProg.completed.includes(lvl.id)) {
            userProg.completed.push(lvl.id);
            saveProgress();
        }

        const all = userProg.completed.length === LEVELS.length;
        if (all) {
            document.getElementById('finish-summary').textContent =
                `${state.currentUser}, du hast alle ${LEVELS.length} Level gemeistert!`;
            showScreen('finish');
        } else {
            renderLevelMap();
            showScreen('map');
        }
    }

    function showOverlay(message, action) {
        const overlay = document.getElementById('canvas-overlay');
        document.getElementById('overlay-title').textContent = 'Geschafft!';
        document.getElementById('overlay-message').textContent = message;
        const btn = document.getElementById('overlay-action');
        btn.textContent = (() => {
            const lvl = LEVELS.find(l => l.id === state.currentLevelId);
            if (!lvl) return 'Weiter';
            if (state.currentTaskIdx + 1 < lvl.tasks.length) return 'Nächste Aufgabe';
            const userProg = getUserProgress();
            const isLast = lvl.id === LEVELS.length;
            const allDoneAfter = userProg.completed.includes(lvl.id) || isLast;
            return isLast && (userProg.completed.length + 1 === LEVELS.length) ? 'Abschluss' : 'Levelkarte';
        })();
        btn.onclick = action;
        overlay.classList.remove('hidden');
    }

    // -----------------------------------------------------------
    //  EDITOR-EVENTS
    // -----------------------------------------------------------
    function bindEditor() {
        const editor = document.getElementById('code-editor');

        editor.addEventListener('input', () => {
            const lvl = LEVELS.find(l => l.id === state.currentLevelId);
            if (!lvl) return;
            const task = lvl.tasks[state.currentTaskIdx];
            if (task.mode === 'type') {
                renderGhost(task.targetCode, editor.value);
            }
            renderLineNumbers(editor.value);
            // Live-Speichern
            const userProg = getUserProgress();
            userProg.code[`${lvl.id}.${state.currentTaskIdx}`] = editor.value;
            saveProgress();
        });

        // TAB = 4 Leerzeichen
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.slice(0, start) + '    ' + editor.value.slice(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
                editor.dispatchEvent(new Event('input'));
            }
            // Ctrl+Enter = run
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            }
        });

        // Scroll-Synchronisation: Zeilennummern + Ghost
        editor.addEventListener('scroll', () => {
            document.getElementById('line-numbers').scrollTop = editor.scrollTop;
            document.getElementById('ghost-layer').scrollTop = editor.scrollTop;
            document.getElementById('ghost-layer').scrollLeft = editor.scrollLeft;
        });
    }

    // -----------------------------------------------------------
    //  INIT
    // -----------------------------------------------------------
    function bindUI() {
        document.getElementById('login-button').addEventListener('click', attemptLogin);
        document.getElementById('password-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });

        document.getElementById('logout-button').addEventListener('click', logout);
        document.getElementById('reset-progress').addEventListener('click', () => {
            if (!confirm(`${state.currentUser}, willst du wirklich deinen Fortschritt zurücksetzen?`)) return;
            state.progress[state.currentUser] = { completed: [], code: {} };
            saveProgress();
            renderLevelMap();
        });

        document.getElementById('back-to-map').addEventListener('click', () => {
            clearCanvas();
            renderLevelMap();
            showScreen('map');
        });

        document.getElementById('run-code').addEventListener('click', runCode);
        document.getElementById('reset-code').addEventListener('click', () => {
            const lvl = LEVELS.find(l => l.id === state.currentLevelId);
            const task = lvl.tasks[state.currentTaskIdx];
            const editor = document.getElementById('code-editor');
            editor.value = task.initialCode;
            editor.dispatchEvent(new Event('input'));
            clearCanvas();
        });

        document.getElementById('show-hint').addEventListener('click', () => {
            const hint = document.getElementById('step-hint');
            const btn = document.getElementById('show-hint');
            if (hint.classList.contains('hidden')) {
                hint.classList.remove('hidden');
                btn.textContent = 'Tipp ausblenden';
            } else {
                hint.classList.add('hidden');
                btn.textContent = 'Tipp anzeigen';
            }
        });

        document.getElementById('finish-back').addEventListener('click', () => {
            renderLevelMap();
            showScreen('map');
        });

        bindEditor();
    }

    function init() {
        state.progress = loadProgress();
        renderProfileTiles();
        bindUI();

        const session = loadSession();
        if (session && STUDENTS.includes(session)) {
            state.currentUser = session;
            enterApp();
        } else {
            showScreen('login');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();

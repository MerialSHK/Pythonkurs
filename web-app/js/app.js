/* ================================================================
   app.js — Steuerung der Webplattform
   ================================================================ */

(function () {
    'use strict';

    const STUDENTS = [
        'Bergmann Patrick',
        'Hollensteiner Katrin',
        'Klingesberger Constantin',
        'Kraml Marcel',
        'Petschenig Xaver',
        'Resch Matteo',
        'Schwarzl Konstantin',
        'Temmel Mark',
        'Wagner Alana'
    ];
    const PASSWORD = 'python';
    const STORAGE_KEY = 'pythonkurs.progress';
    const SESSION_KEY = 'pythonkurs.session';
    const WORLD_KEY = 'pythonkurs.world';
    const SOLUTION_UNLOCK_MS = 15 * 60 * 1000; // 15 Minuten

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
        selectedProfile: null,
        currentWorld: 1,
        currentHintIdx: 0,
        solutionTimerInterval: null
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
        if (!state.currentUser) return { completed: [], code: {}, taskStartTimes: {} };
        if (!state.progress[state.currentUser]) {
            state.progress[state.currentUser] = { completed: [], code: {}, taskStartTimes: {} };
        }
        const p = state.progress[state.currentUser];
        if (!p.taskStartTimes) p.taskStartTimes = {};
        if (!p.code) p.code = {};
        if (!p.completed) p.completed = [];
        return p;
    }

    function loadWorld() {
        try {
            const v = parseInt(localStorage.getItem(WORLD_KEY), 10);
            return (v === 1 || v === 2) ? v : 1;
        } catch (e) { return 1; }
    }
    function saveWorld(w) {
        try { localStorage.setItem(WORLD_KEY, String(w)); } catch (e) {}
    }

    function isLevelUnlocked() {
        return true;
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
            const initials = name.split(/\s+/).map(p => p[0] || '').join('').slice(0, 2).toUpperCase();
            tile.innerHTML = `
                <div class="profile-avatar">${initials}</div>
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

        // Tabs aktualisieren
        document.querySelectorAll('.world-tab').forEach(tab => {
            tab.classList.toggle('active', parseInt(tab.dataset.world, 10) === state.currentWorld);
        });

        const visibleLevels = LEVELS.filter(l => (l.world || 1) === state.currentWorld);

        visibleLevels.forEach(lvl => {
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

        const totalInWorld = visibleLevels.length;
        const doneInWorld = visibleLevels.filter(l => userProg.completed.includes(l.id)).length;
        document.getElementById('progress-summary').textContent =
            `${doneInWorld} / ${totalInWorld} Level in der ${state.currentWorld}. Einheit abgeschlossen`;

        renderBadges();

        if (userProg.completed.length === LEVELS.length) {
            document.getElementById('finish-summary').textContent =
                `${state.currentUser}, du hast alle ${LEVELS.length} Level gemeistert!`;
        }
    }

    function renderBadges() {
        const row = document.getElementById('badge-row');
        row.innerHTML = '';
        const userProg = getUserProgress();
        const visibleLevels = LEVELS.filter(l => (l.world || 1) === state.currentWorld);
        visibleLevels.forEach(lvl => {
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

        // Hint-Anzeige zuruecksetzen
        const hintEl = document.getElementById('step-hint');
        const progEl = document.getElementById('progressive-hints-container');
        hintEl.classList.add('hidden');
        progEl.classList.add('hidden');
        progEl.innerHTML = '';
        hintEl.textContent = task.hint || '';
        document.getElementById('show-hint').textContent = 'Tipp anzeigen';
        state.currentHintIdx = 0;

        setupSolutionTimer(task);

        // Editor-Inhalt aus gespeichertem Code oder Initial-Code
        const userProg = getUserProgress();
        const codeKey = `${lvl.id}.${state.currentTaskIdx}`;
        const editor = document.getElementById('code-editor');
        const savedCode = userProg.code[codeKey];
        editor.value = (savedCode != null) ? savedCode : task.initialCode;

        // Ghost-Layer
        const ghostLayer = document.getElementById('ghost-layer');
        const wrapper = editor.parentElement;
        const targetCard = document.getElementById('target-card');
        const targetPre = document.getElementById('target-code');
        if (task.mode === 'type') {
            wrapper.classList.add('typing-mode');
            renderGhost(task.targetCode, editor.value);
            targetPre.textContent = task.targetCode;
            targetCard.classList.remove('hidden');
        } else {
            wrapper.classList.remove('typing-mode');
            ghostLayer.innerHTML = '';
            targetCard.classList.add('hidden');
        }

        // Lösungs-Karte (immer erst versteckt; Solution-Code in pre vorbereitet)
        const solutionCard = document.getElementById('solution-card');
        const solutionPre = document.getElementById('solution-code');
        const showSolutionBtn = document.getElementById('show-solution');
        if (solutionCard && solutionPre && showSolutionBtn) {
            solutionCard.classList.add('hidden');
            showSolutionBtn.textContent = 'Lösung anzeigen';
            const solCode = task.solution || (task.mode === 'type' ? task.targetCode : null);
            if (solCode) {
                solutionPre.textContent = solCode;
                showSolutionBtn.classList.remove('hidden');
            } else {
                solutionPre.textContent = '';
                showSolutionBtn.classList.add('hidden');
            }
        }

        renderLineNumbers(editor.value);
        requestAnimationFrame(updateHorizontalScroll);
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

    function updateHorizontalScroll() {
        const editor = document.getElementById('code-editor');
        const ghost = document.getElementById('ghost-layer');
        const slider = document.getElementById('editor-hscroll-slider');
        const wrap = document.getElementById('editor-hscroll');
        if (!editor || !slider || !wrap) return;

        const editorMax = Math.max(0, editor.scrollWidth - editor.clientWidth);
        const ghostMax = Math.max(0, ghost.scrollWidth - ghost.clientWidth);
        const max = Math.max(editorMax, ghostMax);

        if (max > 2) {
            wrap.classList.remove('hidden');
            slider.max = String(max);
            slider.value = String(Math.min(editor.scrollLeft, max));
        } else {
            wrap.classList.add('hidden');
            slider.max = '0';
            slider.value = '0';
        }
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
        const stopBtn = document.getElementById('stop-code');
        if (stopBtn) stopBtn.disabled = true;
    }

    function stopGame() {
        clearCanvas();
        const canvasStatusEl = document.getElementById('canvas-status');
        canvasStatusEl.className = 'canvas-status';
        canvasStatusEl.textContent = 'Angehalten';
        const statusEl = document.getElementById('editor-status');
        statusEl.className = 'editor-statusbar';
        statusEl.textContent = 'Spiel gestoppt';
        document.getElementById('canvas-overlay').classList.add('hidden');
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

        // Pruefung auf nicht ausgefuellte Luecken
        if (code.includes('___')) {
            const statusEl = document.getElementById('editor-status');
            const canvasStatusEl = document.getElementById('canvas-status');
            statusEl.className = 'editor-statusbar error';
            statusEl.textContent = 'Du musst noch die Lücken (___) ausfüllen — schau dir den Tipp dazu an!';
            canvasStatusEl.className = 'canvas-status error';
            canvasStatusEl.textContent = 'Lücken offen';
            return;
        }

        clearCanvas();

        const canvas = document.getElementById('play-canvas');
        const play = PlayLib.createPlay(canvas);
        state.play = play;
        const stopBtn = document.getElementById('stop-code');
        if (stopBtn) stopBtn.disabled = false;

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
            updateHorizontalScroll();
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
            const slider = document.getElementById('editor-hscroll-slider');
            if (slider) slider.value = String(editor.scrollLeft);
        });

        // Horizontaler Slider steuert Editor + Ghost gemeinsam
        const slider = document.getElementById('editor-hscroll-slider');
        if (slider) {
            const onSlide = () => {
                const v = parseInt(slider.value, 10) || 0;
                editor.scrollLeft = v;
                const ghost = document.getElementById('ghost-layer');
                ghost.scrollLeft = v;
            };
            slider.addEventListener('input', onSlide);
            slider.addEventListener('change', onSlide);
        }

        // Bei Fenstergroessenaenderung Slider neu bemessen
        window.addEventListener('resize', () => {
            requestAnimationFrame(updateHorizontalScroll);
        });
    }

    // -----------------------------------------------------------
    //  PROGRESSIVE HINTS & SOLUTION-TIMER
    // -----------------------------------------------------------
    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatHintCode(code) {
        // Ersetze ___ durch markierte Lücke
        return escapeHtml(code).replace(/___/g, '<span class="code-blank">___</span>');
    }

    function getTaskKey(lvlId, taskIdx) {
        return `${lvlId}.${taskIdx}`;
    }

    function ensureTaskStartTime(lvlId, taskIdx) {
        const userProg = getUserProgress();
        const key = getTaskKey(lvlId, taskIdx);
        if (!userProg.taskStartTimes[key]) {
            userProg.taskStartTimes[key] = Date.now();
            saveProgress();
        }
        return userProg.taskStartTimes[key];
    }

    function isSolutionUnlocked(task, lvlId, taskIdx) {
        // Bei alten Aufgaben (kein progressiveHints) immer entsperrt
        if (!task.progressiveHints) return true;
        const userProg = getUserProgress();
        const start = userProg.taskStartTimes[getTaskKey(lvlId, taskIdx)];
        if (!start) return false;
        return (Date.now() - start) >= SOLUTION_UNLOCK_MS;
    }

    function formatCountdown(ms) {
        if (ms < 0) ms = 0;
        const total = Math.ceil(ms / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function clearSolutionTimer() {
        if (state.solutionTimerInterval) {
            clearInterval(state.solutionTimerInterval);
            state.solutionTimerInterval = null;
        }
    }

    function setupSolutionTimer(task) {
        clearSolutionTimer();
        const lockEl = document.getElementById('solution-lock');
        const cdEl = document.getElementById('solution-countdown');
        const btn = document.getElementById('show-solution');

        if (!task.progressiveHints) {
            // Altes System — Lock unsichtbar, Button frei
            lockEl.classList.add('hidden');
            btn.classList.remove('locked');
            btn.disabled = false;
            return;
        }

        // Neues System: Timer starten
        ensureTaskStartTime(state.currentLevelId, state.currentTaskIdx);

        function update() {
            const userProg = getUserProgress();
            const start = userProg.taskStartTimes[getTaskKey(state.currentLevelId, state.currentTaskIdx)];
            const elapsed = Date.now() - start;
            const remaining = SOLUTION_UNLOCK_MS - elapsed;
            if (remaining <= 0) {
                lockEl.classList.add('hidden');
                btn.classList.remove('locked');
                btn.disabled = false;
                clearSolutionTimer();
            } else {
                lockEl.classList.remove('hidden');
                cdEl.textContent = formatCountdown(remaining);
                btn.classList.add('locked');
                btn.disabled = false; // Klick zeigt Hinweis statt Lösung
            }
        }
        update();
        state.solutionTimerInterval = setInterval(update, 1000);
    }

    function renderProgressiveHint(idx, hint) {
        const container = document.getElementById('progressive-hints-container');
        const card = document.createElement('div');
        card.className = 'progressive-hint';
        const codeHtml = formatHintCode(hint.codeTemplate || '');
        card.innerHTML = `
            <div class="progressive-hint-header">
                <span class="progressive-hint-title">Tipp ${idx + 1}: ${escapeHtml(hint.title || '')}</span>
            </div>
            ${hint.explanation ? `<p class="progressive-hint-explanation">${escapeHtml(hint.explanation)}</p>` : ''}
            <pre>${codeHtml}</pre>
            ${hint.blankHint ? `<div class="progressive-hint-blank-tip"><strong>↳</strong><span>${escapeHtml(hint.blankHint)}</span></div>` : ''}
            <div class="progressive-hint-actions">
                <button class="ghost-btn small insert-hint-btn">In Editor einfügen</button>
            </div>
        `;
        container.appendChild(card);
        const btn = card.querySelector('.insert-hint-btn');
        btn.addEventListener('click', () => {
            const editor = document.getElementById('code-editor');
            const cur = editor.value.trimEnd();
            const sep = cur.length === 0 ? '' : '\n\n';
            editor.value = cur + sep + hint.codeTemplate;
            editor.dispatchEvent(new Event('input'));
            btn.textContent = 'Eingefügt ✓';
            setTimeout(() => { btn.textContent = 'In Editor einfügen'; }, 1500);
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
            state.progress[state.currentUser] = { completed: [], code: {}, taskStartTimes: {} };
            saveProgress();
            renderLevelMap();
        });

        document.querySelectorAll('.world-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const w = parseInt(tab.dataset.world, 10);
                if (w !== state.currentWorld) {
                    state.currentWorld = w;
                    saveWorld(w);
                    renderLevelMap();
                }
            });
        });

        document.getElementById('back-to-map').addEventListener('click', () => {
            clearCanvas();
            clearSolutionTimer();
            renderLevelMap();
            showScreen('map');
        });

        document.getElementById('run-code').addEventListener('click', runCode);
        document.getElementById('stop-code').addEventListener('click', stopGame);
        document.getElementById('reset-code').addEventListener('click', () => {
            const lvl = LEVELS.find(l => l.id === state.currentLevelId);
            const task = lvl.tasks[state.currentTaskIdx];
            const editor = document.getElementById('code-editor');
            editor.value = task.initialCode;
            editor.dispatchEvent(new Event('input'));
            clearCanvas();
        });

        document.getElementById('show-hint').addEventListener('click', () => {
            const lvl = LEVELS.find(l => l.id === state.currentLevelId);
            if (!lvl) return;
            const task = lvl.tasks[state.currentTaskIdx];
            const btn = document.getElementById('show-hint');

            if (task.progressiveHints && task.progressiveHints.length > 0) {
                // Progressives System: Klick zeigt naechsten Tipp
                const container = document.getElementById('progressive-hints-container');
                if (state.currentHintIdx >= task.progressiveHints.length) {
                    // Schon alle gezeigt → toggle versteckt/sichtbar
                    if (container.classList.contains('hidden')) {
                        container.classList.remove('hidden');
                        btn.textContent = 'Tipps ausblenden';
                    } else {
                        container.classList.add('hidden');
                        btn.textContent = 'Tipps anzeigen';
                    }
                    return;
                }
                container.classList.remove('hidden');
                renderProgressiveHint(state.currentHintIdx, task.progressiveHints[state.currentHintIdx]);
                state.currentHintIdx += 1;
                if (state.currentHintIdx < task.progressiveHints.length) {
                    btn.textContent = `Nächster Tipp (${state.currentHintIdx}/${task.progressiveHints.length})`;
                } else {
                    btn.textContent = 'Tipps ausblenden';
                }
                return;
            }

            // Altes System
            const hint = document.getElementById('step-hint');
            if (hint.classList.contains('hidden')) {
                hint.classList.remove('hidden');
                btn.textContent = 'Tipp ausblenden';
            } else {
                hint.classList.add('hidden');
                btn.textContent = 'Tipp anzeigen';
            }
        });

        const showSolutionBtn = document.getElementById('show-solution');
        if (showSolutionBtn) {
            showSolutionBtn.addEventListener('click', () => {
                const lvl = LEVELS.find(l => l.id === state.currentLevelId);
                if (!lvl) return;
                const task = lvl.tasks[state.currentTaskIdx];
                if (!isSolutionUnlocked(task, state.currentLevelId, state.currentTaskIdx)) {
                    const userProg = getUserProgress();
                    const start = userProg.taskStartTimes[getTaskKey(state.currentLevelId, state.currentTaskIdx)] || Date.now();
                    const remaining = SOLUTION_UNLOCK_MS - (Date.now() - start);
                    alert(`Die Lösung ist erst in ${formatCountdown(remaining)} verfügbar. Probier es solange mit den Tipps! Klicke „Tipp anzeigen" — jeder Tipp zeigt einen Code-Schnipsel mit einer kleinen Lücke, die du ausfüllen musst.`);
                    return;
                }
                const card = document.getElementById('solution-card');
                if (card.classList.contains('hidden')) {
                    card.classList.remove('hidden');
                    showSolutionBtn.textContent = 'Lösung ausblenden';
                } else {
                    card.classList.add('hidden');
                    showSolutionBtn.textContent = 'Lösung anzeigen';
                }
            });
        }

        const copySolutionBtn = document.getElementById('copy-solution');
        if (copySolutionBtn) {
            copySolutionBtn.addEventListener('click', () => {
                const sol = document.getElementById('solution-code').textContent;
                if (!sol) return;
                const editor = document.getElementById('code-editor');
                editor.value = sol;
                editor.dispatchEvent(new Event('input'));
                copySolutionBtn.textContent = 'Eingefügt ✓';
                setTimeout(() => { copySolutionBtn.textContent = 'In Editor einfügen'; }, 1800);
            });
        }

        document.getElementById('finish-back').addEventListener('click', () => {
            renderLevelMap();
            showScreen('map');
        });

        bindEditor();
    }

    function init() {
        state.progress = loadProgress();
        state.currentWorld = loadWorld();
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

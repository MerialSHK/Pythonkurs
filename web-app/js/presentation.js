/* ================================================================
   presentation.js — Logik für den Präsentationsmodus
   ----------------------------------------------------------------
   - Baut die Übersicht aus PRESENTERS (Kinder + Reserve)
   - Führt durch 5 Schritte: Titel → Demo → Figuren → Code → Abschluss
   - Die Live-Demo nutzt dieselbe Engine wie der Kurs
     (playlib.js + transpiler.js) und führt den fertigen Lösungs-Code
     aus levels.js aus.
   ================================================================ */

(function () {
    'use strict';

    const PRESENTERS = window.PRESENTERS || [];
    const LEVELS = window.LEVELS || [];

    const state = {
        current: null,   // aktueller Presenter
        step: 0,         // aktueller Schritt (0..4)
        play: null       // laufende Demo-Instanz
    };

    const STEP_COUNT = 5;
    const STEP_NAMES = ['Titel', 'Spiel zeigen', 'Die Figuren', 'Der Code', 'Abschluss'];

    // -----------------------------------------------------------
    //  Hilfen
    // -----------------------------------------------------------
    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function solutionFor(level) {
        const lvl = LEVELS.find(l => l.id === level);
        if (!lvl || !lvl.tasks || !lvl.tasks[0]) return '';
        return lvl.tasks[0].solution || '';
    }

    function conceptsFor(level) {
        const lvl = LEVELS.find(l => l.id === level);
        return (lvl && lvl.concepts) ? lvl.concepts : [];
    }

    // „Das kannst du sagen"-Box
    function sayBox(text) {
        const box = el('div', 'pres-say');
        const label = el('span', 'pres-say-label', '💬 Das kannst du sagen:');
        const p = el('p', 'pres-say-text', text);
        box.appendChild(label);
        box.appendChild(p);
        return box;
    }

    // -----------------------------------------------------------
    //  Demo-Ausführung (gleiche Mechanik wie app.js runCode)
    // -----------------------------------------------------------
    function startDemo(canvas, code) {
        stopDemo();
        const play = window.PlayLib.createPlay(canvas);
        state.play = play;
        play._setErrorHandler(err => console.error('Demo-Fehler:', err));
        try {
            const tr = window.PyTranspiler.transpile(code);
            const builtins = window.PyTranspiler.builtins;
            const names = Object.keys(builtins);
            const values = names.map(n => builtins[n]);
            const wrapped =
                '"use strict";\n' +
                'return (async function userMain() {\n' +
                tr.js + '\n' +
                'if (typeof play !== \'undefined\' && play.start_program) { await play.start_program(); }\n' +
                '})();';
            const fn = new Function('play', 'randint', ...names, wrapped);
            Promise.resolve(fn(play, window.PlayLib.randint, ...values)).catch(e => console.error(e));
        } catch (e) {
            console.error(e);
        }
    }

    function stopDemo() {
        if (state.play) {
            try { state.play._destroy(); } catch (e) { /* ignore */ }
            state.play = null;
        }
    }

    // -----------------------------------------------------------
    //  Übersicht aufbauen
    // -----------------------------------------------------------
    function buildOverview() {
        const kidsGrid = document.getElementById('kids-grid');
        const reserveGrid = document.getElementById('reserve-grid');
        kidsGrid.innerHTML = '';
        reserveGrid.innerHTML = '';

        PRESENTERS.forEach((p, idx) => {
            const card = el('button', 'pres-card');
            card.style.setProperty('--accent', p.accent || '#4f6df5');
            card.addEventListener('click', () => openPresentation(idx));

            const emoji = el('span', 'pres-card-emoji', p.emoji);
            const body = el('div', 'pres-card-body');
            const game = el('h3', 'pres-card-game', p.game);
            body.appendChild(game);
            if (!p.reserve) {
                body.appendChild(el('p', 'pres-card-kid', p.kid));
            }
            body.appendChild(el('p', 'pres-card-tagline', p.tagline));

            const go = el('span', 'pres-card-go', 'Präsentieren →');

            card.appendChild(emoji);
            card.appendChild(body);
            card.appendChild(go);

            (p.reserve ? reserveGrid : kidsGrid).appendChild(card);
        });
    }

    // -----------------------------------------------------------
    //  Präsentation öffnen / schließen
    // -----------------------------------------------------------
    function openPresentation(idx) {
        state.current = PRESENTERS[idx];
        state.step = 0;

        document.getElementById('pres-emoji').textContent = state.current.emoji;
        document.getElementById('pres-game').textContent = state.current.game;
        document.getElementById('pres-kid').textContent = state.current.reserve ? 'Reserve-Spiel' : state.current.kid;
        document.documentElement.style.setProperty('--pres-accent', state.current.accent || '#4f6df5');

        buildDots();
        showScreen('pres-screen');
        renderStep();
    }

    function exitPresentation() {
        stopDemo();
        state.current = null;
        showScreen('overview-screen');
    }

    function showScreen(id) {
        document.querySelectorAll('.pres-screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    function buildDots() {
        const dots = document.getElementById('pres-dots');
        dots.innerHTML = '';
        for (let i = 0; i < STEP_COUNT; i++) {
            const dot = el('button', 'pres-dot');
            dot.title = STEP_NAMES[i];
            dot.addEventListener('click', () => { goToStep(i); });
            dots.appendChild(dot);
        }
    }

    // -----------------------------------------------------------
    //  Navigation
    // -----------------------------------------------------------
    function goToStep(n) {
        if (n < 0 || n >= STEP_COUNT) return;
        stopDemo();
        state.step = n;
        renderStep();
    }

    function nextStep() { goToStep(state.step + 1); }
    function prevStep() { goToStep(state.step - 1); }

    function updateChrome() {
        document.querySelectorAll('.pres-dot').forEach((d, i) => {
            d.classList.toggle('active', i === state.step);
            d.classList.toggle('done', i < state.step);
        });
        document.getElementById('pres-step-label').textContent =
            `Schritt ${state.step + 1} von ${STEP_COUNT} · ${STEP_NAMES[state.step]}`;
        document.getElementById('pres-prev').disabled = state.step === 0;

        const next = document.getElementById('pres-next');
        next.textContent = state.step === STEP_COUNT - 1 ? 'Fertig — Übersicht ✓' : 'Weiter →';
    }

    // -----------------------------------------------------------
    //  Schritte rendern
    // -----------------------------------------------------------
    function renderStep() {
        const stage = document.getElementById('pres-stage');
        stage.innerHTML = '';
        stage.scrollTop = 0;
        const p = state.current;

        switch (state.step) {
            case 0: stage.appendChild(renderTitle(p)); break;
            case 1: stage.appendChild(renderDemo(p)); break;
            case 2: stage.appendChild(renderSprites(p)); break;
            case 3: stage.appendChild(renderCode(p)); break;
            case 4: stage.appendChild(renderFinish(p)); break;
        }
        updateChrome();
    }

    // Schritt 1 — Titel
    function renderTitle(p) {
        const wrap = el('div', 'pres-panel pres-title-panel');
        wrap.appendChild(el('div', 'pres-title-emoji', p.emoji));
        wrap.appendChild(el('h1', 'pres-title-game', p.game));
        if (!p.reserve) wrap.appendChild(el('p', 'pres-title-kid', 'präsentiert von ' + p.kid));
        wrap.appendChild(el('p', 'pres-title-tagline', p.tagline));

        const about = el('div', 'pres-about');
        (p.about || []).forEach(t => about.appendChild(el('p', null, t)));
        wrap.appendChild(about);

        const how = el('div', 'pres-howto-card');
        how.appendChild(el('h4', null, 'So wird gespielt'));
        const ul = el('ul', 'pres-howto-list');
        (p.howToPlay || []).forEach(h => {
            const li = el('li');
            li.appendChild(el('span', 'pres-key', h.key));
            li.appendChild(el('span', 'pres-key-text', h.text));
            ul.appendChild(li);
        });
        how.appendChild(ul);
        wrap.appendChild(how);

        wrap.appendChild(sayBox('Hallo! Ich heiße ' + (p.reserve ? '…' : p.kid.split(' ')[0]) +
            ' und ich zeige euch mein Spiel „' + p.game + '". ' + (p.about && p.about[0] ? p.about[0] : '')));
        return wrap;
    }

    // Schritt 2 — Demo
    function renderDemo(p) {
        const wrap = el('div', 'pres-panel pres-demo-panel');

        const left = el('div', 'pres-demo-left');
        const stageBox = el('div', 'pres-canvas-box');
        const canvas = document.createElement('canvas');
        canvas.id = 'pres-canvas';
        canvas.width = 520;
        canvas.height = 420;
        stageBox.appendChild(canvas);
        left.appendChild(stageBox);

        const restart = el('button', 'primary-btn small', '↻ Neu starten');
        restart.addEventListener('click', () => startDemo(canvas, solutionFor(p.level)));
        left.appendChild(restart);

        const right = el('div', 'pres-demo-right');
        right.appendChild(el('h3', null, 'Mein Spiel läuft!'));
        const how = el('ul', 'pres-howto-list');
        (p.howToPlay || []).forEach(h => {
            const li = el('li');
            li.appendChild(el('span', 'pres-key', h.key));
            li.appendChild(el('span', 'pres-key-text', h.text));
            how.appendChild(li);
        });
        right.appendChild(how);
        right.appendChild(el('p', 'pres-demo-hint', 'Tipp: Klick mit der Maus ins Spielfeld und probier es aus. Mit „↻ Neu starten" beginnt das Spiel von vorne.'));
        right.appendChild(sayBox(p.sayDemo));

        wrap.appendChild(left);
        wrap.appendChild(right);

        // Demo automatisch starten (kurz warten, bis das Canvas im DOM ist).
        // Schutz: nur starten, wenn wir noch im Demo-Schritt sind und das
        // Canvas tatsächlich im Dokument hängt (verhindert verwaiste Demos).
        setTimeout(() => {
            if (state.step === 1 && document.body.contains(canvas)) {
                startDemo(canvas, solutionFor(p.level));
            }
        }, 60);
        return wrap;
    }

    // Schritt 3 — Figuren / Sprites
    function renderSprites(p) {
        const wrap = el('div', 'pres-panel');
        wrap.appendChild(el('h2', 'pres-panel-title', 'Welche Figuren gibt es?'));
        wrap.appendChild(el('p', 'pres-panel-lead', 'Jede Figur im Spiel heißt in Python ein „Sprite". Das sind die Bausteine meines Spiels:'));

        const list = el('div', 'pres-sprite-list');
        (p.sprites || []).forEach(s => {
            const card = el('div', 'pres-sprite-card');
            card.appendChild(el('span', 'pres-sprite-icon', s.icon));
            const body = el('div', 'pres-sprite-body');
            body.appendChild(el('code', 'pres-sprite-name', s.name));
            body.appendChild(el('p', 'pres-sprite-role', s.role));
            card.appendChild(body);
            list.appendChild(card);
        });
        wrap.appendChild(list);
        wrap.appendChild(sayBox(p.saySprites));
        return wrap;
    }

    // Schritt 4 — Code
    function renderCode(p) {
        const wrap = el('div', 'pres-panel');
        wrap.appendChild(el('h2', 'pres-panel-title', 'Wie sieht der Code aus?'));
        wrap.appendChild(el('p', 'pres-panel-lead', 'Ich zeige euch die wichtigsten Stellen meines Programms — und was sie machen.'));

        (p.code || []).forEach((seg, i) => {
            const block = el('div', 'pres-code-block');
            const head = el('div', 'pres-code-head');
            head.appendChild(el('span', 'pres-code-num', String(i + 1)));
            head.appendChild(el('h4', null, seg.title));
            block.appendChild(head);

            const pre = el('pre', 'pres-code');
            pre.textContent = seg.snippet;
            block.appendChild(pre);

            block.appendChild(el('p', 'pres-code-explain', seg.explain));
            if (seg.say) block.appendChild(sayBox(seg.say));
            wrap.appendChild(block);
        });
        return wrap;
    }

    // Schritt 5 — Abschluss
    function renderFinish(p) {
        const wrap = el('div', 'pres-panel pres-finish-panel');
        wrap.appendChild(el('div', 'pres-finish-emoji', '🎉'));
        wrap.appendChild(el('h2', 'pres-panel-title', 'Was war am schwierigsten?'));

        const hard = el('div', 'pres-hard-card');
        hard.appendChild(el('p', null, p.hardest));
        wrap.appendChild(hard);

        const concepts = conceptsFor(p.level);
        if (concepts.length) {
            wrap.appendChild(el('h3', 'pres-concepts-title', 'Das habe ich dabei gelernt'));
            const ul = el('ul', 'pres-concepts');
            concepts.forEach(c => ul.appendChild(el('li', null, c)));
            wrap.appendChild(ul);
        }

        wrap.appendChild(sayBox('Das war mein Spiel „' + p.game + '". Danke fürs Zuschauen! Habt ihr noch Fragen?'));

        const done = el('button', 'primary-btn', 'Zurück zur Übersicht');
        done.addEventListener('click', exitPresentation);
        wrap.appendChild(done);
        return wrap;
    }

    // -----------------------------------------------------------
    //  Events
    // -----------------------------------------------------------
    function init() {
        buildOverview();

        document.getElementById('pres-exit').addEventListener('click', exitPresentation);
        document.getElementById('pres-prev').addEventListener('click', prevStep);
        document.getElementById('pres-next').addEventListener('click', () => {
            if (state.step === STEP_COUNT - 1) exitPresentation();
            else nextStep();
        });

        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('pres-screen').classList.contains('active')) return;
            // Pfeiltasten nicht abfangen, wenn gerade eine Demo läuft (sie steuern das Spiel)
            const demoRunning = state.step === 1 && state.play;
            if (e.key === 'Escape') { exitPresentation(); }
            else if (!demoRunning && (e.key === 'ArrowRight')) { nextStep(); }
            else if (!demoRunning && (e.key === 'ArrowLeft')) { prevStep(); }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

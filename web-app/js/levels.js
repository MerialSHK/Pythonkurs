/* ================================================================
   levels.js — Definition aller Level
   ================================================================ */

(function (global) {
    'use strict';

    // Helper-Funktionen fuer Validatoren
    function findSprite(state, predicate) {
        return state.sprites.find(s => !s._destroyed && predicate(s));
    }

    function spritesByType(state, kind) {
        return state.sprites.filter(s => !s._destroyed && s.constructor.name === kind);
    }

    function normalize(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    // Validator-Helper: prueft, ob der Code-Text bestimmte Patterns enthaelt
    function codeContains(code, pattern) {
        if (typeof pattern === 'string') return code.includes(pattern);
        return pattern.test(code);
    }

    // -----------------------------------------------------------
    //  LEVEL DEFINITIONS
    // -----------------------------------------------------------
    const LEVELS = [
        // =========================================================
        // LEVEL 1 — TIPP-MODUS
        // =========================================================
        {
            id: 1,
            world: 1,
            title: 'Hallo Welt',
            shortDescription: 'Tippe deinen ersten Python-Code ab und lerne, wie ein Text auf den Bildschirm kommt.',
            concepts: [
                'play.new_text(...) erstellt Text',
                'Variablen speichern dein Sprite',
                'x und y bestimmen die Position'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Tipp den Code Zeichen für Zeichen ab',
                    description: `
                        <p>Hinter dem Editor siehst du den Code in <em>hellgrau</em>. Tippe ihn <strong>genau so</strong> ab.</p>
                        <p>Der Code erstellt einen Text auf dem Bildschirm. Wenn du fertig bist, drücke <code>Enter</code> oder klicke <code>Ausführen</code>.</p>
                        <p><strong>Tipp:</strong> Achte auf Anführungszeichen <code>'</code>, Kommas <code>,</code> und Klammern <code>(</code> <code>)</code>.</p>
                    `,
                    hint: `So gehst du Schritt für Schritt vor:
1) Klick zuerst in den Editor (mittlere Spalte).
2) Tippe genau das ab, was in der Karte „Code zum Abtippen" steht.
3) Achte auf jedes Zeichen: ' ' (Anführungszeichen), , (Kommas), ( ) (Klammern), = (Gleichheitszeichen).
4) Zwischen den beiden Zeilen ist eine LEERE Zeile (zweimal Enter).
5) Wenn unten der Text grün wird → Enter drücken oder „Ausführen" klicken.`,
                    mode: 'type',
                    initialCode: '',
                    targetCode: `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')\n\nuntertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`,
                    solution: `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')

untertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`,
                    validate: ({ studentCode, state, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        const target = `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')\n\nuntertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`;
                        if (normalize(studentCode) !== normalize(target)) {
                            return { ok: false, message: 'Tippe den Code genau so ab wie er hinten gezeigt wird.' };
                        }
                        if (state.sprites.length < 2) {
                            return { ok: false, message: 'Es sollten zwei Texte zu sehen sein.' };
                        }
                        return { ok: true, message: 'Perfekt! Du hast deinen ersten Code geschrieben.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 2 — DREI SPRITES
        // =========================================================
        {
            id: 2,
            world: 1,
            title: 'Eigene Welt erschaffen',
            shortDescription: 'Du lernst die drei Bausteine: Text, Kreis und Box.',
            concepts: [
                'play.new_circle(...) erstellt einen Kreis',
                'play.new_box(...) erstellt eine Box',
                'Du kannst Farben mit color="..." aendern'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Erstelle einen Spieler, einen Kreis und eine Box',
                    description: `
                        <p>Du siehst im Editor schon einen <strong>Titel</strong>. Darunter sollst du jetzt drei neue Sprites hinzufügen.</p>
                        <p><strong>Beispiel</strong> für einen Spieler-Text:</p>
                        <pre>spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')</pre>
                        <p>Schreibe genau diese Zeile darunter. Ergänze danach noch <strong>einen Kreis</strong> (links auf <code>x=-180</code>) und <strong>eine Box</strong> (rechts auf <code>x=180</code>).</p>
                        <p>Beispiele:</p>
                        <pre>kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
box = play.new_box(color='red', x=180, y=0, width=80, height=80)</pre>
                    `,
                    hint: `So baust du es Stück für Stück:
1) Schreibe unter den Titel: spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
2) Eine Zeile drunter: kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
3) Wieder eine Zeile drunter: box = play.new_box(color='red', x=180, y=0, width=80, height=80)`,
                    progressiveHints: [
                        {
                            title: 'Spieler-Text erstellen',
                            codeTemplate: `spieler = play.new_text(words='___', x=0, y=0, font_size=60, color='black')`,
                            blankHint: 'Was soll der Spieler anzeigen? Z.B. ein Smiley wie O_O',
                            explanation: 'Der Spieler ist ein Text-Sprite. Trag ein paar Zeichen ein — Smileys gehen auch.'
                        },
                        {
                            title: 'Kreis links erstellen',
                            codeTemplate: `kreis = play.new_circle(color='___', x=-180, y=0, radius=40)`,
                            blankHint: 'Eine Farbe deiner Wahl — z.B. blue, red oder green.',
                            explanation: 'Der Kreis steht links (x=-180). Setze seine Farbe ein.'
                        },
                        {
                            title: 'Box rechts erstellen',
                            codeTemplate: `box = play.new_box(color='red', x=180, y=0, width=___, height=80)`,
                            blankHint: 'Wie breit soll die Box sein? Z.B. 80 Pixel.',
                            explanation: 'Die Box steht rechts. Trag eine Breite ein — 80 passt gut.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`titel = play.new_text(words='Mein Spielfeld', x=0, y=180, font_size=28, color='blue')

# Schreibe deinen Code hier:
`,
                    solution:
`titel = play.new_text(words='Mein Spielfeld', x=0, y=180, font_size=28, color='blue')

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
box = play.new_box(color='red', x=180, y=0, width=80, height=80)
`,
                    validate: ({ studentCode, state, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!codeContains(studentCode, /spieler\s*=\s*play\.new_text\s*\(/)) {
                            return { ok: false, message: 'Es fehlt ein Sprite namens spieler. Tipp: spieler = play.new_text(...)' };
                        }
                        if (!codeContains(studentCode, /kreis\s*=\s*play\.new_circle\s*\(/)) {
                            return { ok: false, message: 'Es fehlt ein Kreis namens kreis. Tipp: kreis = play.new_circle(...)' };
                        }
                        if (!codeContains(studentCode, /box\s*=\s*play\.new_box\s*\(/)) {
                            return { ok: false, message: 'Es fehlt eine Box namens box. Tipp: box = play.new_box(...)' };
                        }
                        const texts = spritesByType(state, 'TextSprite');
                        const circles = spritesByType(state, 'CircleSprite');
                        const boxes = spritesByType(state, 'BoxSprite');
                        if (texts.length < 2) return { ok: false, message: 'Der Spieler-Text wird nicht angezeigt. Hat er Worte (z.B. words=\'O_O\')?' };
                        if (circles.length < 1) return { ok: false, message: 'Der Kreis ist nicht zu sehen.' };
                        if (boxes.length < 1) return { ok: false, message: 'Die Box ist nicht zu sehen.' };
                        return { ok: true, message: 'Stark! Du hast eine ganze Spielwelt aus drei Bausteinen gebaut.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 3 — BEWEGUNG
        // =========================================================
        {
            id: 3,
            world: 1,
            title: 'Bewegung programmieren',
            shortDescription: 'Mache deinen Spieler mit den Pfeiltasten beweglich.',
            concepts: [
                '@play.repeat_forever wiederholt Code immer wieder',
                'play.key_is_pressed("up") prueft eine Taste',
                'spieler.x += 5 bewegt nach rechts'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Hoch' },
                { keys: ['↓'], label: 'Runter' },
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [
                {
                    title: 'Schreibe vier if-Bedingungen für die Pfeiltasten',
                    description: `
                        <p>Im Editor steht schon ein <code>spieler</code>-Sprite und ein leerer <code>repeat_forever</code>-Block.</p>
                        <p><strong>Beispiel</strong> für die Pfeiltaste <code>nach oben</code>:</p>
                        <pre>if play.key_is_pressed('up'):
    spieler.y += 5</pre>
                        <p>Schreibe ähnliche <code>if</code>-Blöcke für <code>'down'</code>, <code>'left'</code> und <code>'right'</code>. Achte darauf:</p>
                        <ul>
                            <li><code>down</code> bedeutet <code>spieler.y -= 5</code></li>
                            <li><code>left</code> bedeutet <code>spieler.x -= 5</code></li>
                            <li><code>right</code> bedeutet <code>spieler.x += 5</code></li>
                        </ul>
                        <p>Klicke nach dem Ausführen ins Spielfeld und drücke die Pfeiltasten.</p>
                    `,
                    hint: `Schreibe noch DREI weitere if-Blöcke unter den ersten — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Pfeiltaste runter (down)',
                            codeTemplate: `    if play.key_is_pressed('___'):
        spieler.y -= 5`,
                            blankHint: 'Pfeiltaste nach unten heisst: down',
                            explanation: 'Block in den repeat_forever (4 Leerzeichen vor if, 8 vor der Bewegung). Trag den Tastennamen ein.'
                        },
                        {
                            title: 'Pfeiltaste links (left)',
                            codeTemplate: `    if play.key_is_pressed('left'):
        spieler.x -= ___`,
                            blankHint: 'Wie viele Pixel pro Schritt? Z.B. 5.',
                            explanation: 'Bei links wird x kleiner. Trag die Schrittweite ein.'
                        },
                        {
                            title: 'Pfeiltaste rechts (right)',
                            codeTemplate: `    if play.key_is_pressed('right'):
        spieler.x += ___`,
                            blankHint: 'Gleiche Schrittweite wie bei links — z.B. 5.',
                            explanation: 'Bei rechts wird x groesser. Selbe Schrittweite einsetzen.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
info = play.new_text(words='Bewege mich mit den Pfeiltasten', x=0, y=180, font_size=18, color='gray')

@play.repeat_forever
def spielschleife():
    if play.key_is_pressed('up'):
        spieler.y += 5
    # Schreibe hier deine drei weiteren if-Blöcke:

`,
                    solution:
`spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
info = play.new_text(words='Bewege mich mit den Pfeiltasten', x=0, y=180, font_size=18, color='gray')

@play.repeat_forever
def spielschleife():
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5
`,
                    validate: ({ studentCode }) => {
                        const checks = [
                            { re: /if\s+play\.key_is_pressed\(\s*['"]up['"]\s*\)\s*:/, msg: 'Die Taste up fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]down['"]\s*\)\s*:/, msg: 'Die Taste down fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]left['"]\s*\)\s*:/, msg: 'Die Taste left fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]right['"]\s*\)\s*:/, msg: 'Die Taste right fehlt.' },
                            { re: /spieler\.y\s*\+=/, msg: 'spieler.y += ... fehlt (für hoch).' },
                            { re: /spieler\.y\s*-=/, msg: 'spieler.y -= ... fehlt (für runter).' },
                            { re: /spieler\.x\s*-=/, msg: 'spieler.x -= ... fehlt (für links).' },
                            { re: /spieler\.x\s*\+=/, msg: 'spieler.x += ... fehlt (für rechts).' }
                        ];
                        for (const { re, msg } of checks) {
                            if (!re.test(studentCode)) return { ok: false, message: msg };
                        }
                        return { ok: true, message: 'Bewegung läuft! Klicke ins Spielfeld und probiere die Pfeiltasten aus.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 4 — PUNKTE & GRENZEN
        // =========================================================
        {
            id: 4,
            world: 1,
            title: 'Punkte sammeln',
            shortDescription: 'Wenn dein Spieler die Spielfeldgrenze erreicht, gibt es einen Punkt.',
            concepts: [
                'Variablen wie score speichern Zahlen',
                'abs(x) liefert den positiven Wert',
                'Mehrfache if-Bedingungen kombinieren'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Hoch' },
                { keys: ['↓'], label: 'Runter' },
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [
                {
                    title: 'Wenn der Spieler den Rand erreicht: zurücksetzen + Punkt',
                    description: `
                        <p>Das Spielfeld ist 520 breit und 420 hoch — die Hälften liegen also bei <code>x=±260</code> und <code>y=±210</code>.</p>
                        <p>Im Code steht schon eine <code>score</code>-Variable und eine Punkt-Anzeige. Vervollständige den <code>repeat_forever</code>-Block:</p>
                        <p><strong>Beispiel-Bedingung:</strong></p>
                        <pre>if spieler.x > 240 or spieler.x < -240:
    spieler.x = 0
    spieler.y = 0
    score += 1
    punkte.words = 'Punkte: ' + str(score)</pre>
                        <p>Schreibe einen <strong>zweiten</strong> Block, der dasselbe macht, wenn <code>spieler.y</code> zu gross oder zu klein wird.</p>
                    `,
                    hint: `Kopiere die Struktur vom x-Block, ändere x auf y — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'if-Block fuer den oberen/unteren Rand',
                            codeTemplate: `    if spieler.y > 200 or spieler.y < ___:`,
                            blankHint: 'Untere Grenze ist das Spiegel-Bild von 200 — also: -200',
                            explanation: 'Wenn der Spieler oben oder unten anstoesst, soll der Block ausloesen. Trag die untere Grenze ein.'
                        },
                        {
                            title: 'Spieler zuruecksetzen',
                            codeTemplate: `        spieler.x = 0
        spieler.y = ___`,
                            blankHint: 'Mitte des Spielfelds — also: 0',
                            explanation: 'Der Spieler springt auf die Mitte zurueck. Trag den y-Wert der Mitte ein.'
                        },
                        {
                            title: 'Punkt zaehlen + Anzeige',
                            codeTemplate: `        score += ___
        punkte.words = 'Punkte: ' + str(score)`,
                            blankHint: 'Pro Wand-Treffer ein Punkt — also: 1',
                            explanation: 'Score erhoehen und die Anzeige aktualisieren.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.x > 240 or spieler.x < -240:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    # Schreibe hier deinen zweiten if-Block für y:

`,
                    solution:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.x > 240 or spieler.x < -240:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if spieler.y > 200 or spieler.y < -200:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)
`,
                    validate: ({ studentCode }) => {
                        if (!/spieler\.y\s*>\s*\d+\s*or\s*spieler\.y\s*<\s*-?\d+/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt eine Bedingung für spieler.y > ... or spieler.y < ...' };
                        }
                        const yBlockMatches = studentCode.match(/if\s+spieler\.y[\s\S]*?punkte\.words\s*=/g);
                        if (!yBlockMatches || yBlockMatches.length < 1) {
                            return { ok: false, message: 'Im y-Block fehlt der punkte.words = ... Update.' };
                        }
                        if ((studentCode.match(/score\s*\+=\s*1/g) || []).length < 2) {
                            return { ok: false, message: 'In beiden Blöcken muss score += 1 stehen.' };
                        }
                        return { ok: true, message: 'Toll! Bewege den Spieler zum Rand und sammle Punkte.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 5 — MINI-SPIEL
        // =========================================================
        {
            id: 5,
            world: 1,
            title: 'Mini-Spiel: Sammle das Ziel',
            shortDescription: 'Berühre das Ziel mit deinem Spieler — du gewinnst Punkte und das Ziel springt an einen neuen Ort.',
            concepts: [
                'spieler.is_touching(ziel) testet Kollisionen',
                'random_number erzeugt Zufallszahlen',
                'Mehrere if-Bedingungen ergeben ein kleines Spiel'
            ],
            keyHints: [
                { keys: ['↑','↓','←','→'], label: 'Bewegen' }
            ],
            tasks: [
                {
                    title: 'Vervollständige das Spiel: Berühren = Punkt + Ziel teleportieren',
                    description: `
                        <p>Es gibt einen <code>spieler</code> und ein <code>ziel</code>. Wenn der Spieler das Ziel berührt, soll:</p>
                        <ul>
                            <li><code>score</code> um 5 erhöht werden</li>
                            <li>der Punktestand auf der Anzeige erneuert werden</li>
                            <li>das Ziel an einen Zufallspunkt versetzt werden</li>
                        </ul>
                        <p><strong>Beispiel</strong> für eine Zufallszahl:</p>
                        <pre>ziel.x = play.random_number(-200, 200)
ziel.y = play.random_number(-150, 150)</pre>
                        <p>Vervollständige unten den Block <code>if spieler.is_touching(ziel):</code>.</p>
                    `,
                    hint: `Vier Zeilen in den if-Block — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Punkte erhoehen + Anzeige',
                            codeTemplate: `        score += ___
        punkte.words = 'Punkte: ' + str(score)`,
                            blankHint: 'Pro Treffer 5 Punkte — trag also 5 ein.',
                            explanation: 'In den if-Block (8 Leerzeichen Einrueckung). Score steigt, Anzeige updated.'
                        },
                        {
                            title: 'Ziel an zufaelliges x',
                            codeTemplate: `        ziel.x = play.random_number(-___, 200)`,
                            blankHint: 'Symmetrisch zur 200 auf der anderen Seite — also: 200',
                            explanation: 'Das Ziel springt nach links/rechts auf einen Zufallspunkt zwischen -200 und 200.'
                        },
                        {
                            title: 'Ziel an zufaelliges y',
                            codeTemplate: `        ziel.y = play.random_number(___, 150)`,
                            blankHint: 'Untere Grenze ist das Negativ der oberen — also: -150',
                            explanation: 'Auch nach oben/unten zufaellig.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=50, color='black')
ziel = play.new_circle(color='green', x=180, y=120, radius=22, border_color='dark green', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.is_touching(ziel):
        # Schreibe hier deine drei Sachen:

`,
                    solution:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=50, color='black')
ziel = play.new_circle(color='green', x=180, y=120, radius=22, border_color='dark green', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.is_touching(ziel):
        score += 5
        punkte.words = 'Punkte: ' + str(score)
        ziel.x = play.random_number(-200, 200)
        ziel.y = play.random_number(-150, 150)
`,
                    validate: ({ studentCode }) => {
                        const cleaned = studentCode;
                        if (!/spieler\.is_touching\(\s*ziel\s*\)/.test(cleaned)) {
                            return { ok: false, message: 'Der Block if spieler.is_touching(ziel): muss da sein.' };
                        }
                        if (!/score\s*\+=\s*5/.test(cleaned)) {
                            return { ok: false, message: 'Es fehlt score += 5.' };
                        }
                        if (!/punkte\.words\s*=/.test(cleaned)) {
                            return { ok: false, message: 'Aktualisiere die Anzeige mit punkte.words = ...' };
                        }
                        if (!/ziel\.x\s*=\s*play\.random_number/.test(cleaned)) {
                            return { ok: false, message: 'Setze ziel.x mit play.random_number(...).' };
                        }
                        if (!/ziel\.y\s*=\s*play\.random_number/.test(cleaned)) {
                            return { ok: false, message: 'Setze ziel.y mit play.random_number(...).' };
                        }
                        return { ok: true, message: 'Gratulation! Du hast ein eigenes kleines Spiel gebaut.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 6 — STERNE FANGEN
        // =========================================================
        {
            id: 6,
            world: 1,
            title: 'Sterne fangen',
            shortDescription: 'Bewege den Korb und fange die fallenden Sterne — jeder Treffer gibt einen Punkt.',
            concepts: [
                'Eine Position laufend veraendern (stern.y -= 4)',
                'Wenn etwas den Rand verlaesst: zuruecksetzen',
                'is_touching fuer Berührungs-Bonus'
            ],
            keyHints: [
                { keys: ['←'], label: 'Korb links' },
                { keys: ['→'], label: 'Korb rechts' }
            ],
            tasks: [
                {
                    title: 'Schreibe den Treffer-Block',
                    description: `
                        <p>Der Korb bewegt sich schon mit den Pfeiltasten und der Stern fällt von oben.</p>
                        <p>Vervollständige unten den <code>if</code>-Block, der ausgeführt wird, wenn der <strong>Korb den Stern berührt</strong>:</p>
                        <ul>
                            <li><code>score</code> um 1 erhöhen</li>
                            <li><code>punkte.words</code> auf <code>'Punkte: ' + str(score)</code> setzen</li>
                            <li><code>stern.y</code> wieder auf 200 setzen</li>
                            <li><code>stern.x</code> mit <code>play.random_number(-220, 220)</code> setzen</li>
                        </ul>
                    `,
                    hint: `Vier Zeilen mit 8 Leerzeichen Einrueckung — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Punkt zaehlen + Anzeige',
                            codeTemplate: `        score += ___
        punkte.words = 'Punkte: ' + str(score)`,
                            blankHint: 'Pro gefangenem Stern ein Punkt — also: 1',
                            explanation: 'In den if korb.is_touching(stern)-Block (8 Leerzeichen Einrueckung).'
                        },
                        {
                            title: 'Stern wieder nach oben',
                            codeTemplate: `        stern.y = ___`,
                            blankHint: 'Ganz oben am Bildschirm — also: 200',
                            explanation: 'Damit der Stern wieder von oben faellt, y zuruecksetzen.'
                        },
                        {
                            title: 'Neue zufaellige x-Position',
                            codeTemplate: `        stern.x = play.random_number(___, 220)`,
                            blankHint: 'Linke Grenze: -220',
                            explanation: 'Damit der Stern nicht immer an der gleichen Stelle erscheint.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0

korb = play.new_box(color='brown', x=0, y=-180, width=90, height=18)
stern = play.new_circle(color='yellow', x=0, y=200, radius=15, border_color='orange', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('left'):
        korb.x -= 6
    if play.key_is_pressed('right'):
        korb.x += 6

    stern.y -= 4

    if stern.y < -220:
        stern.y = 200
        stern.x = play.random_number(-220, 220)

    if korb.is_touching(stern):
        # Schreibe hier deinen Treffer-Block:

`,
                    solution:
`score = 0

korb = play.new_box(color='brown', x=0, y=-180, width=90, height=18)
stern = play.new_circle(color='yellow', x=0, y=200, radius=15, border_color='orange', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('left'):
        korb.x -= 6
    if play.key_is_pressed('right'):
        korb.x += 6

    stern.y -= 4

    if stern.y < -220:
        stern.y = 200
        stern.x = play.random_number(-220, 220)

    if korb.is_touching(stern):
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        stern.y = 200
        stern.x = play.random_number(-220, 220)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/korb\.is_touching\(\s*stern\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Der Block if korb.is_touching(stern): muss da sein.' };
                        }
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words mit dem neuen Score.' };
                        }
                        if (!/stern\.y\s*=\s*200/.test(studentCode)) {
                            return { ok: false, message: 'Setze stern.y wieder auf 200.' };
                        }
                        if (!/stern\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze stern.x mit play.random_number(-220, 220).' };
                        }
                        return { ok: true, message: 'Super! Bewege den Korb mit den Pfeiltasten und sammle die Sterne.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 7 — MAULWURF HAUEN
        // =========================================================
        {
            id: 7,
            world: 1,
            title: 'Maulwurf hauen',
            shortDescription: 'Klick den Maulwurf, bevor er springt — jeder Treffer zaehlt!',
            concepts: [
                '@sprite.when_clicked reagiert auf Klicks',
                'global score erlaubt Aendern aus Funktion',
                'random_number fuer Zufallsposition'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Vervollständige die Klick-Funktion',
                    description: `
                        <p>Es gibt einen <strong>Maulwurf</strong>. Wenn du ihn anklickst, soll:</p>
                        <ul>
                            <li><code>score</code> um 1 steigen</li>
                            <li><code>punkte.words</code> aktualisiert werden</li>
                            <li>der Maulwurf an eine zufällige Position springen (<code>x</code> und <code>y</code>)</li>
                        </ul>
                        <p><strong>Bereich:</strong> <code>x</code> zwischen <code>-200</code> und <code>200</code>, <code>y</code> zwischen <code>-130</code> und <code>130</code>.</p>
                    `,
                    hint: `Vier Zeilen unter global score — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Score und Anzeige',
                            codeTemplate: `    score += ___
    punkte.words = 'Punkte: ' + str(score)`,
                            blankHint: 'Pro Treffer ein Punkt — also: 1',
                            explanation: '4 Leerzeichen Einrueckung (innerhalb der Funktion). Score steigt, Anzeige updated.'
                        },
                        {
                            title: 'Maulwurf-Sprung x',
                            codeTemplate: `    maulwurf.x = play.random_number(-___, 200)`,
                            blankHint: 'Linke Grenze ist das Negativ von 200 — also: 200',
                            explanation: 'Der Maulwurf springt zu einer Zufallsposition.'
                        },
                        {
                            title: 'Maulwurf-Sprung y',
                            codeTemplate: `    maulwurf.y = play.random_number(-130, ___)`,
                            blankHint: 'Obere Grenze passend zu -130 — also: 130',
                            explanation: 'Auch nach oben/unten zufaellig.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0

maulwurf = play.new_circle(color='brown', x=0, y=0, radius=32, border_color='black', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klick auf den Maulwurf!', x=0, y=-190, font_size=18, color='gray')

@maulwurf.when_clicked
def getroffen():
    global score
    # Schreibe hier:

`,
                    solution:
`score = 0

maulwurf = play.new_circle(color='brown', x=0, y=0, radius=32, border_color='black', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klick auf den Maulwurf!', x=0, y=-190, font_size=18, color='gray')

@maulwurf.when_clicked
def getroffen():
    global score
    score += 1
    punkte.words = 'Punkte: ' + str(score)
    maulwurf.x = play.random_number(-200, 200)
    maulwurf.y = play.random_number(-130, 130)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words.' };
                        }
                        if (!/maulwurf\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze maulwurf.x mit play.random_number(-200, 200).' };
                        }
                        if (!/maulwurf\.y\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze maulwurf.y mit play.random_number(-130, 130).' };
                        }
                        return { ok: true, message: 'Wahnsinn — klick den Maulwurf so oft du kannst!' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 8 — PONG
        // =========================================================
        {
            id: 8,
            world: 1,
            title: 'Pong',
            shortDescription: 'Halte den Schlaeger oben — der Ball prallt von Wand und Schlaeger ab.',
            concepts: [
                'Geschwindigkeits-Variablen ball_vx, ball_vy',
                'Vorzeichen umdrehen mit -ball_vy',
                'abs() fuer „immer positiv"'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Schlaeger hoch' },
                { keys: ['↓'], label: 'Schlaeger runter' }
            ],
            tasks: [
                {
                    title: 'Schreibe die Wand-Abprall-Bedingungen',
                    description: `
                        <p>Der Ball bewegt sich schon. Damit er <strong>oben und unten abprallt</strong>, fehlt noch der Code.</p>
                        <p>Schreibe zwei <code>if</code>-Blöcke:</p>
                        <pre>if ball.y > 200:
    ball_vy = -abs(ball_vy)
if ball.y < -200:
    ball_vy = abs(ball_vy)</pre>
                        <p>Damit zeigt <code>ball_vy</code> immer in die richtige Richtung — nach oben oder nach unten.</p>
                    `,
                    hint: `Zwei if-Bloecke fuer oben und unten — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Oberer Wand-Abprall',
                            codeTemplate: `    if ball.y > ___:
        ball_vy = -abs(ball_vy)`,
                            blankHint: 'Obere Grenze des Spielfelds — z.B. 200.',
                            explanation: '4 Leerzeichen vor if, 8 vor der Zuweisung. -abs(...) sorgt dafuer, dass die Geschwindigkeit nach unten zeigt.'
                        },
                        {
                            title: 'Unterer Wand-Abprall',
                            codeTemplate: `    if ball.y < -200:
        ball_vy = abs(___)`,
                            blankHint: 'Variable, die wir umdrehen — also: ball_vy',
                            explanation: 'abs() macht den Wert positiv, also nach oben.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`ball_vx = 5
ball_vy = 3
score = 0

ball = play.new_circle(color='red', x=0, y=0, radius=12)
schlaeger = play.new_box(color='blue', x=-230, y=0, width=14, height=90)
wand = play.new_box(color='light gray', x=240, y=0, width=8, height=420)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global ball_vx, ball_vy, score

    if play.key_is_pressed('up'):
        schlaeger.y += 7
    if play.key_is_pressed('down'):
        schlaeger.y -= 7

    ball.x += ball_vx
    ball.y += ball_vy

    # Wand oben/unten — schreibe hier deine zwei if-Bloecke:



    if ball.is_touching(schlaeger):
        ball_vx = abs(ball_vx)
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if ball.x > 230:
        ball_vx = -abs(ball_vx)

    if ball.x < -260:
        ball.x = 0
        ball.y = 0
        ball_vx = 5
        score = 0
        punkte.words = 'Punkte: 0'

`,
                    solution:
`ball_vx = 5
ball_vy = 3
score = 0

ball = play.new_circle(color='red', x=0, y=0, radius=12)
schlaeger = play.new_box(color='blue', x=-230, y=0, width=14, height=90)
wand = play.new_box(color='light gray', x=240, y=0, width=8, height=420)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global ball_vx, ball_vy, score

    if play.key_is_pressed('up'):
        schlaeger.y += 7
    if play.key_is_pressed('down'):
        schlaeger.y -= 7

    ball.x += ball_vx
    ball.y += ball_vy

    if ball.y > 200:
        ball_vy = -abs(ball_vy)
    if ball.y < -200:
        ball_vy = abs(ball_vy)

    if ball.is_touching(schlaeger):
        ball_vx = abs(ball_vx)
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if ball.x > 230:
        ball_vx = -abs(ball_vx)

    if ball.x < -260:
        ball.x = 0
        ball.y = 0
        ball_vx = 5
        score = 0
        punkte.words = 'Punkte: 0'
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/if\s+ball\.y\s*>\s*\d+\s*:/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt if ball.y > 200:' };
                        }
                        if (!/if\s+ball\.y\s*<\s*-\d+\s*:/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt if ball.y < -200:' };
                        }
                        if (!/ball_vy\s*=\s*-abs\(\s*ball_vy\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Im oberen Block muss ball_vy = -abs(ball_vy) stehen.' };
                        }
                        if (!/ball_vy\s*=\s*abs\(\s*ball_vy\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Im unteren Block muss ball_vy = abs(ball_vy) stehen.' };
                        }
                        return { ok: true, message: 'Pong laeuft! Halte den Ball mit dem Schlaeger im Spiel.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 9 — SNAKE
        // =========================================================
        {
            id: 9,
            world: 1,
            title: 'Schlange & Apfel',
            shortDescription: 'Steuere die Schlange durchs Spielfeld und sammle Aepfel — pro Treffer waechst sie um ein Glied.',
            concepts: [
                'String-Variable als „Richtung"',
                'Mehrere if-Bloecke fuer Bewegung',
                'is_touching + random_number fuer Apfel-Reset'
            ],
            keyHints: [
                { keys: ['↑','↓','←','→'], label: 'Richtung waehlen' }
            ],
            tasks: [
                {
                    title: 'Apfel essen: Punkte + neuer Apfel',
                    description: `
                        <p>Die Schlange bewegt sich schon — die Pfeiltasten wechseln die <code>richtung</code>.</p>
                        <p>Vervollständige den <code>if</code>-Block ganz unten: Wenn der Kopf den Apfel berührt, soll:</p>
                        <ul>
                            <li><code>score</code> um 1 steigen</li>
                            <li><code>punkte.words</code> aktualisiert werden</li>
                            <li><code>apfel.x</code> auf <code>play.random_number(-220, 220)</code></li>
                            <li><code>apfel.y</code> auf <code>play.random_number(-180, 180)</code></li>
                        </ul>
                    `,
                    hint: `Vier Zeilen in den Apfel-Block — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Punkt + Anzeige',
                            codeTemplate: `        score += ___
        punkte.words = 'Punkte: ' + str(score)`,
                            blankHint: 'Pro Apfel ein Punkt — also: 1',
                            explanation: 'In den if kopf.is_touching(apfel)-Block (8 Leerzeichen Einrueckung).'
                        },
                        {
                            title: 'Apfel an zufaelliges x',
                            codeTemplate: `        apfel.x = play.random_number(-220, ___)`,
                            blankHint: 'Symmetrisch zu -220 — also: 220',
                            explanation: 'Apfel springt zu einer neuen x-Position.'
                        },
                        {
                            title: 'Apfel an zufaelliges y',
                            codeTemplate: `        apfel.y = play.random_number(___, 180)`,
                            blankHint: 'Untere Grenze passend zu 180 — also: -180',
                            explanation: 'Auch zufaellig nach oben/unten.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0
richtung = 'right'
schritt = 0

kopf = play.new_circle(color='dark green', x=0, y=0, radius=12, border_color='black', border_width=2)
seg1 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg2 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg3 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg4 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg5 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg1.hide()
seg2.hide()
seg3.hide()
seg4.hide()
seg5.hide()

apfel = play.new_text(words='🍎', x=150, y=80, font_size=32)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score, richtung, schritt

    if play.key_is_pressed('up'):
        richtung = 'up'
    if play.key_is_pressed('down'):
        richtung = 'down'
    if play.key_is_pressed('left'):
        richtung = 'left'
    if play.key_is_pressed('right'):
        richtung = 'right'

    if richtung == 'up':
        kopf.y += 3
    if richtung == 'down':
        kopf.y -= 3
    if richtung == 'left':
        kopf.x -= 3
    if richtung == 'right':
        kopf.x += 3

    # Koerperteile folgen mit Verzoegerung
    schritt += 1
    if schritt % 6 == 0:
        seg5.x = seg4.x
        seg5.y = seg4.y
        seg4.x = seg3.x
        seg4.y = seg3.y
        seg3.x = seg2.x
        seg3.y = seg2.y
        seg2.x = seg1.x
        seg2.y = seg1.y
        seg1.x = kopf.x
        seg1.y = kopf.y

    # Pro gegessenen Apfel ein Koerperteil mehr
    if score >= 1:
        seg1.show()
    if score >= 2:
        seg2.show()
    if score >= 3:
        seg3.show()
    if score >= 4:
        seg4.show()
    if score >= 5:
        seg5.show()

    if kopf.is_touching(apfel):
        # Schreibe hier deinen Apfel-Block:

`,
                    solution:
`score = 0
richtung = 'right'
schritt = 0

kopf = play.new_circle(color='dark green', x=0, y=0, radius=12, border_color='black', border_width=2)
seg1 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg2 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg3 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg4 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg5 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg1.hide()
seg2.hide()
seg3.hide()
seg4.hide()
seg5.hide()

apfel = play.new_text(words='🍎', x=150, y=80, font_size=32)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score, richtung, schritt

    if play.key_is_pressed('up'):
        richtung = 'up'
    if play.key_is_pressed('down'):
        richtung = 'down'
    if play.key_is_pressed('left'):
        richtung = 'left'
    if play.key_is_pressed('right'):
        richtung = 'right'

    if richtung == 'up':
        kopf.y += 3
    if richtung == 'down':
        kopf.y -= 3
    if richtung == 'left':
        kopf.x -= 3
    if richtung == 'right':
        kopf.x += 3

    schritt += 1
    if schritt % 6 == 0:
        seg5.x = seg4.x
        seg5.y = seg4.y
        seg4.x = seg3.x
        seg4.y = seg3.y
        seg3.x = seg2.x
        seg3.y = seg2.y
        seg2.x = seg1.x
        seg2.y = seg1.y
        seg1.x = kopf.x
        seg1.y = kopf.y

    if score >= 1:
        seg1.show()
    if score >= 2:
        seg2.show()
    if score >= 3:
        seg3.show()
    if score >= 4:
        seg4.show()
    if score >= 5:
        seg5.show()

    if kopf.is_touching(apfel):
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        apfel.x = play.random_number(-220, 220)
        apfel.y = play.random_number(-180, 180)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/kopf\.is_touching\(\s*apfel\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Der Block if kopf.is_touching(apfel): fehlt.' };
                        }
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words.' };
                        }
                        if (!/apfel\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze apfel.x mit play.random_number(-220, 220).' };
                        }
                        if (!/apfel\.y\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze apfel.y mit play.random_number(-180, 180).' };
                        }
                        return { ok: true, message: 'Schlange jagt Apfel! Sammle so viele wie du kannst.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 10 — FARBEN-REAKTION
        // =========================================================
        {
            id: 10,
            world: 1,
            title: 'Farben-Reaktion',
            shortDescription: 'Klick die Box mit der angesagten Farbe — schnell sein lohnt sich!',
            concepts: [
                'Listen mit Strings',
                'Klick-Funktionen pro Sprite',
                'Vergleich mit ==',
                'Funktionen wiederverwenden'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Schreibe die Klick-Funktionen für gruen und blau',
                    description: `
                        <p>Es gibt drei farbige Boxen und einen Hinweis-Text. Beim Klick auf <code>rot</code> ist die Logik schon fertig.</p>
                        <p>Schreibe jetzt analoge Funktionen für <strong>gruen</strong> und <strong>blau</strong>:</p>
                        <pre>@gruen.when_clicked
def klick_gruen():
    global score
    if ziel_farbe == 'gruen':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()</pre>
                        <p>Und genau dasselbe für <code>blau</code> (mit <code>'blau'</code> im Vergleich).</p>
                    `,
                    hint: `Zwei neue Klick-Funktionen — siehe Tipps.`,
                    progressiveHints: [
                        {
                            title: 'Klick-Funktion fuer gruen',
                            codeTemplate: `@gruen.when_clicked
def klick_gruen():
    global score
    if ziel_farbe == '___':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()`,
                            blankHint: 'Vergleichswert ist die Farbe — also: gruen',
                            explanation: 'Diese Funktion prueft, ob aktuell gruen verlangt war. Trag den Vergleichs-String ein.'
                        },
                        {
                            title: 'Klick-Funktion fuer blau',
                            codeTemplate: `@blau.when_clicked
def klick_blau():
    global score
    if ziel_farbe == 'blau':
        score += ___
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()`,
                            blankHint: 'Pro richtigem Klick ein Punkt — also: 1',
                            explanation: 'Genau wie gruen, nur fuer blau. Score-Erhoehung einsetzen.'
                        }
                    ],
                    mode: 'fill',
                    initialCode:
`score = 0
ziel_farbe = 'rot'
farben = ['rot', 'gruen', 'blau']

punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klicke rot', x=0, y=140, font_size=26, color='black')

rot = play.new_box(color='red', x=-150, y=-30, width=80, height=80)
gruen = play.new_box(color='green', x=0, y=-30, width=80, height=80)
blau = play.new_box(color='blue', x=150, y=-30, width=80, height=80)

def naechste_runde():
    global ziel_farbe
    nr = play.random_number(0, 2)
    ziel_farbe = farben[nr]
    hinweis.words = 'Klicke ' + ziel_farbe

@rot.when_clicked
def klick_rot():
    global score
    if ziel_farbe == 'rot':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

# Schreibe hier deine Funktionen fuer gruen und blau:

`,
                    solution:
`score = 0
ziel_farbe = 'rot'
farben = ['rot', 'gruen', 'blau']

punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klicke rot', x=0, y=140, font_size=26, color='black')

rot = play.new_box(color='red', x=-150, y=-30, width=80, height=80)
gruen = play.new_box(color='green', x=0, y=-30, width=80, height=80)
blau = play.new_box(color='blue', x=150, y=-30, width=80, height=80)

def naechste_runde():
    global ziel_farbe
    nr = play.random_number(0, 2)
    ziel_farbe = farben[nr]
    hinweis.words = 'Klicke ' + ziel_farbe

@rot.when_clicked
def klick_rot():
    global score
    if ziel_farbe == 'rot':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

@gruen.when_clicked
def klick_gruen():
    global score
    if ziel_farbe == 'gruen':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

@blau.when_clicked
def klick_blau():
    global score
    if ziel_farbe == 'blau':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/@gruen\.when_clicked/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt @gruen.when_clicked.' };
                        }
                        if (!/@blau\.when_clicked/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt @blau.when_clicked.' };
                        }
                        if (!/ziel_farbe\s*==\s*['"]gruen['"]/.test(studentCode)) {
                            return { ok: false, message: 'Vergleich ziel_farbe == \'gruen\' fehlt.' };
                        }
                        if (!/ziel_farbe\s*==\s*['"]blau['"]/.test(studentCode)) {
                            return { ok: false, message: 'Vergleich ziel_farbe == \'blau\' fehlt.' };
                        }
                        const naechsteCount = (studentCode.match(/naechste_runde\(\)/g) || []).length;
                        if (naechsteCount < 3) {
                            return { ok: false, message: 'Beide neuen Funktionen muessen am Ende naechste_runde() aufrufen.' };
                        }
                        return { ok: true, message: 'Mega! Klick weiter so schnell wie moeglich die richtige Farbe.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 11 — WUERFEL-SIMULATOR (Welt 2)
        // =========================================================
        {
            id: 11,
            world: 2,
            title: 'Würfel-Simulator',
            shortDescription: 'Klick einen Würfel an und lass den Zufall entscheiden — randint() in Aktion.',
            concepts: [
                '@sprite.when_clicked reagiert auf Mausklick',
                'randint(1, 6) gibt eine Zufallszahl',
                'str(zahl) wandelt eine Zahl in Text fuer den Sprite'
            ],
            keyHints: [],
            tasks: [{
                title: 'Wuerfle 1 bis 6 mit einem Klick',
                description: `
                    <p>Ziel: Eine grosse Box wird zum Wuerfel. Wenn du sie anklickst, soll eine zufaellige Zahl von 1 bis 6 erscheinen.</p>
                    <p>Du brauchst:</p>
                    <ol>
                        <li>Eine Box als <code>wuerfel</code> in der Mitte</li>
                        <li>Einen Text <code>zahl_text</code> mit Startwert <code>'?'</code></li>
                        <li>Eine Klick-Funktion, die <code>randint(1, 6)</code> verwendet und den Text aktualisiert</li>
                    </ol>
                    <p>Klick „Tipp anzeigen" — der erste Tipp gibt dir den Code mit einer kleinen Luecke.</p>
                `,
                progressiveHints: [
                    {
                        title: 'So sehen Box und Text als Sprite aus',
                        codeTemplate: `# Beispiel fuer eine Box (groesse, Position, Rahmen):
beispiel = play.new_box(color='light blue', x=0, y=200, width=80, height=40, border_color='black', border_width=2)`,
                        blankHint: 'Bau jetzt selbst den Wuerfel: Variable wuerfel, Position (0,0), eine helle Farbe deiner Wahl, Groesse 140x140 mit schwarzem Rand. Dazu einen Text zahl_text in der Mitte mit einem Fragezeichen.',
                        explanation: 'Hier siehst du wie eine Box geht. Bau Wuerfel und Anzeige-Text damit selbst.'
                    },
                    {
                        title: 'So funktioniert ein Klick-Handler',
                        codeTemplate: `# Beispiel: Klick aendert eine Box-Farbe
@beispiel.when_clicked
def reagieren():
    beispiel.color = 'orange'`,
                        blankHint: 'Schreibe jetzt eine Funktion, die bei einem Klick auf wuerfel eine Zufallszahl mit randint(...) holt und sie mit str(...) in zahl_text.words schreibt.',
                        explanation: 'Klick-Handler folgen immer diesem Muster: @sprite.when_clicked + def funktion():. Was drin steht, entscheidest du.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Klick den Wuerfel an, um eine Zufallszahl zu wuerfeln.
info = play.new_text(words='Klick den Wuerfel!', x=0, y=-160, font_size=18, color='gray')

# Schreibe deinen Code hier:
`,
                solution:
`info = play.new_text(words='Klick den Wuerfel!', x=0, y=-160, font_size=18, color='gray')

wuerfel = play.new_box(color='white', x=0, y=0, width=140, height=140, border_color='black', border_width=3)
zahl_text = play.new_text(words='?', x=0, y=0, font_size=80, color='black')

@wuerfel.when_clicked
def wurf():
    zahl = randint(1, 6)
    zahl_text.words = str(zahl)
`,
                validate: ({ studentCode, state, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/wuerfel\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt eine Box namens wuerfel.' };
                    }
                    if (!/zahl_text\s*=\s*play\.new_text/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt ein Text-Sprite namens zahl_text.' };
                    }
                    if (!/@wuerfel\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @wuerfel.when_clicked vor der Wurf-Funktion.' };
                    }
                    if (!/randint\s*\(\s*1\s*,\s*6\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Wuerfle mit randint(1, 6).' };
                    }
                    if (!/zahl_text\.words\s*=\s*str\(/.test(studentCode)) {
                        return { ok: false, message: 'Setze zahl_text.words = str(zahl) damit die Zahl angezeigt wird.' };
                    }
                    return { ok: true, message: 'Stark! Klick den Wuerfel — bei jedem Klick eine neue Zahl.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 12 — AMPEL-SCHALTUNG (Welt 2)
        // =========================================================
        {
            id: 12,
            world: 2,
            title: 'Ampel-Schaltung',
            shortDescription: 'Klick einen Schalter — die Ampel wechselt durch Rot, Gelb und Gruen.',
            concepts: [
                'Globale Variable speichert die aktuelle Phase',
                'if/elif/else fuer mehrere Faelle',
                'transparency steuert Hell/Dunkel'
            ],
            keyHints: [],
            tasks: [{
                title: 'Programmiere eine Ampel mit drei Phasen',
                description: `
                    <p>Es gibt drei Lampen (rot, gelb, gruen) und einen Schalter. Pro Klick auf den Schalter geht es zur naechsten Phase: <strong>Rot → Gelb → Gruen → wieder Rot</strong>.</p>
                    <p>Du brauchst eine globale Zaehl-Variable <code>phase</code>. Bei jedem Klick erhoehst du sie und aktualisierst die Helligkeit der drei Lampen.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Beispiel: die rote Lampe',
                        codeTemplate: `# Erste Lampe als Muster:
rot = play.new_circle(color='red', x=0, y=120, radius=40)`,
                        blankHint: 'Bau nach dem gleichen Schema die gelbe Lampe (gelb, weiter unten bei y=30) und die gruene Lampe (noch weiter unten bei y=-60). Die Variablennamen muessen gelb und gruen heissen.',
                        explanation: 'Du siehst wie ein Kreis geht. Mach jetzt die anderen zwei Lampen analog — Position untereinander stapeln.'
                    },
                    {
                        title: 'Schalter und Zaehler-Variable',
                        codeTemplate: `# Globale Variable + Schalter-Box mit Beschriftung:
phase = 0
schalter = play.new_box(color='gray', x=0, y=-160, width=180, height=40)
schalter_txt = play.new_text(words='Schalter', x=0, y=-160, font_size=18, color='white')`,
                        blankHint: 'Schreib das so ab. Wichtig: phase startet bei 0 und merkt sich, welche Lampe gerade leuchtet.',
                        explanation: 'Schalter ist eine Box, dazu ein Text drueber. Die Variable phase ist global, weil sie spaeter in der Klick-Funktion geaendert wird.'
                    },
                    {
                        title: 'Hinweis zum Klick-Handler',
                        codeTemplate: `# So beginnt der Klick-Handler — vervollstaendige ihn selbst:
@schalter.when_clicked
def weiter():
    global phase
    phase = phase + 1
    # ... fehlt: phase zurueck auf 0 wenn > 2
    # ... fehlt: alle Lampen dunkel (transparency = 30)
    # ... fehlt: aktive Lampe hell (transparency = 100, mit if phase == 0/1/2)`,
                        blankHint: 'Vervollstaendige die Funktion: erst phase begrenzen (wenn > 2 dann zurueck zu 0), dann alle Lampen dunkel machen, dann je nach phase EINE Lampe wieder hell.',
                        explanation: 'Drei Schritte in der Funktion: 1) Begrenzung der phase, 2) alle Lampen dunkel, 3) eine Lampe hell mit drei if-Bloecken. transparency = 100 ist hell, transparency = 30 ist dunkel.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Programmiere eine Ampel mit drei Phasen.
titel = play.new_text(words='Ampel', x=0, y=185, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Ampel', x=0, y=185, font_size=22, color='black')

rot = play.new_circle(color='red', x=0, y=120, radius=40)
gelb = play.new_circle(color='yellow', x=0, y=30, radius=40)
gruen = play.new_circle(color='green', x=0, y=-60, radius=40)

phase = 0
schalter = play.new_box(color='gray', x=0, y=-160, width=180, height=40)
schalter_txt = play.new_text(words='Schalter', x=0, y=-160, font_size=18, color='white')

@schalter.when_clicked
def weiter():
    global phase
    phase = phase + 1
    if phase > 2:
        phase = 0
    rot.transparency = 30
    gelb.transparency = 30
    gruen.transparency = 30
    if phase == 0:
        rot.transparency = 100
    if phase == 1:
        gelb.transparency = 100
    if phase == 2:
        gruen.transparency = 100
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/rot\s*=\s*play\.new_circle.*['"]red['"]/s.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der rote Kreis (rot = play.new_circle(color=\'red\', ...)).' };
                    }
                    if (!/gelb\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der gelbe Kreis.' };
                    }
                    if (!/gruen\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der gruene Kreis.' };
                    }
                    if (!/@schalter\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @schalter.when_clicked.' };
                    }
                    if (!/global\s+phase/.test(studentCode)) {
                        return { ok: false, message: 'In der Klick-Funktion brauchst du global phase, sonst aendert sich die Variable nicht.' };
                    }
                    if (!/transparency\s*=\s*100/.test(studentCode)) {
                        return { ok: false, message: 'Setze die aktive Lampe auf transparency = 100.' };
                    }
                    return { ok: true, message: 'Klasse! Klick den Schalter — die Ampel schaltet weiter.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 13 — REAKTIONSTEST (Welt 2)
        // =========================================================
        {
            id: 13,
            world: 2,
            title: 'Reaktionstest',
            shortDescription: 'Wenn die Box gruen wird — schnell klicken! Wer hat die schnellsten Finger?',
            concepts: [
                'await play.timer(seconds=...) wartet eine bestimmte Zeit',
                'Globale Variable als Zustand (bereit / wartet)',
                'randint fuer zufaellige Wartezeiten'
            ],
            keyHints: [],
            tasks: [{
                title: 'Klicke die Box, sobald sie gruen wird',
                description: `
                    <p>Eine Box ist erst rot. Nach einer zufaelligen Wartezeit (1–3 Sekunden) wird sie gruen — dann schnell klicken!</p>
                    <p>Wir benutzen <code>await play.timer(seconds=...)</code> um zu warten und eine globale Variable <code>bereit</code> um zu speichern, ob ein Klick zaehlen darf.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Setup: globale Variable, Box und Status-Text',
                        codeTemplate: `# Du brauchst:
# 1) globale Variable bereit, die mit False startet
# 2) eine grosse rote Box namens box (200x200)
# 3) einen status-Text unterhalb, der "Warte..." anzeigt
bereit = False`,
                        blankHint: 'Schreib jetzt: die Box als play.new_box(...) mit color rot und Groesse 200x200, und einen status-Text mit play.new_text(...) bei y=-150.',
                        explanation: 'Drei Sachen brauchst du oben. Die Variable bereit ist gegeben — Box und Text musst du selbst hinzufuegen.'
                    },
                    {
                        title: 'Beispiel: warten und etwas aendern beim Programm-Start',
                        codeTemplate: `# Muster: warte zufaellig zwischen 1 und 3 Sekunden, dann mach was:
@play.when_program_starts
async def start():
    global bereit
    await play.timer(seconds=randint(1, 3))
    # ... was passiert nach dem Warten?`,
                        blankHint: 'Vervollstaendige die Funktion: Box-Farbe auf gruen, status.words auf "JETZT!", und bereit = True. Dann darf der Klick zaehlen.',
                        explanation: 'Du siehst wie await play.timer(...) funktioniert. Trag die Aktionen ein, die nach dem Warten passieren sollen.'
                    },
                    {
                        title: 'Hinweis zum Klick-Handler',
                        codeTemplate: `# Skelett — fuelle den Inhalt selbst:
@box.when_clicked
def klick():
    global bereit
    if bereit:
        # ... Erfolg: Box blau, status "Super!" oder aehnlich, bereit wieder False
        pass
    else:
        # ... Zu frueh: Box orange, status "Zu frueh!"
        pass`,
                        blankHint: 'Ersetze die beiden pass-Zeilen durch echten Code (drei Zuweisungen pro Zweig).',
                        explanation: 'if bereit ist gut → Erfolg-Logik einbauen. else (zu frueh geklickt) → andere Reaktion.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Reaktionstest. Die Box wird nach kurzer Wartezeit gruen — dann klicken!
titel = play.new_text(words='Reaktionstest', x=0, y=180, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Reaktionstest', x=0, y=180, font_size=22, color='black')

bereit = False
box = play.new_box(color='red', x=0, y=0, width=200, height=200)
status = play.new_text(words='Warte...', x=0, y=-150, font_size=20, color='gray')

@play.when_program_starts
async def start():
    global bereit
    await play.timer(seconds=randint(1, 3))
    box.color = 'green'
    status.words = 'JETZT!'
    bereit = True

@box.when_clicked
def klick():
    global bereit
    if bereit:
        status.words = 'Super!'
        box.color = 'blue'
        bereit = False
    else:
        status.words = 'Zu frueh!'
        box.color = 'orange'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/box\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt eine Box namens box.' };
                    }
                    if (!/bereit\s*=\s*False/.test(studentCode)) {
                        return { ok: false, message: 'Setze ganz oben: bereit = False' };
                    }
                    if (!/await\s+play\.timer/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst await play.timer(seconds=...) zum Warten.' };
                    }
                    if (!/box\.color\s*=\s*['"]green['"]/.test(studentCode)) {
                        return { ok: false, message: 'Nach dem Warten muss die Box gruen werden: box.color = \'green\'.' };
                    }
                    if (!/@box\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @box.when_clicked.' };
                    }
                    return { ok: true, message: 'Top! Probier es mehrmals — wie schnell bist du?' };
                }
            }]
        },

        // =========================================================
        // LEVEL 14 — MATHE-QUIZ (Welt 2)
        // =========================================================
        {
            id: 14,
            world: 2,
            title: 'Mathe-Quiz',
            shortDescription: 'Drei Antwort-Buttons — klick die richtige Loesung. Punkte fuer jeden Treffer!',
            concepts: [
                'Mehrere Klick-Funktionen, eine pro Button',
                'Globale Variable score zaehlt Treffer',
                'str() um Zahl in Text zu verwandeln'
            ],
            keyHints: [],
            tasks: [{
                title: 'Quiz-Spiel mit drei Antwort-Buttons',
                description: `
                    <p>Aufgabe: <strong>5 + 3 = ?</strong>. Drei Buttons (6, 7, 8) — nur einer ist richtig.</p>
                    <p>Bei richtigem Klick: <code>score += 1</code>. Bei falschem: <code>score -= 1</code>. Der Score wird oben angezeigt.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Setup: Score und Aufgaben-Text',
                        codeTemplate: `score = 0
score_anzeige = play.new_text(words='Punkte: 0', x=0, y=180, font_size=20, color='black')
aufgabe = play.new_text(words='5 + 3 = ?', x=0, y=80, font_size=36, color='black')`,
                        blankHint: 'Schreib das so ab. score muss global sein (oben definiert).',
                        explanation: 'Score-Variable und zwei Anzeige-Texte. Aufgabe ist fest 5+3.'
                    },
                    {
                        title: 'Beispiel: ein Antwort-Button (b6 mit Text 6)',
                        codeTemplate: `# Erster Button als Muster:
b6 = play.new_box(color='light blue', x=-120, y=-50, width=80, height=60)
t6 = play.new_text(words='6', x=-120, y=-50, font_size=30, color='black')`,
                        blankHint: 'Bau jetzt analog zwei weitere Buttons: b7 mit Text "7" bei x=0, und b8 mit Text "8" bei x=120. Variablennamen muessen exakt b7, t7, b8, t8 sein.',
                        explanation: 'Du siehst Box + Text als Button-Paar. Mach das gleiche fuer 7 und 8 — nur x-Position aendert sich.'
                    },
                    {
                        title: 'Beispiel: Klick-Funktion fuer FALSCHE Antwort (b6)',
                        codeTemplate: `@b6.when_clicked
def falsch1():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)`,
                        blankHint: 'Schreib jetzt analog: eine Funktion fuer b7 (auch falsch, score - 1) und eine fuer b8 (das ist die richtige! score + 1).',
                        explanation: '5+3 ist 8 — also b8 ist richtig. Mach drei Klick-Funktionen: zwei mit score - 1, eine (b8) mit score + 1.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Mathe-Quiz: drei Antworten, eine ist richtig.

# Dein Code:
`,
                solution:
`score = 0
score_anzeige = play.new_text(words='Punkte: 0', x=0, y=180, font_size=20, color='black')
aufgabe = play.new_text(words='5 + 3 = ?', x=0, y=80, font_size=36, color='black')

b6 = play.new_box(color='light blue', x=-120, y=-50, width=80, height=60)
t6 = play.new_text(words='6', x=-120, y=-50, font_size=30, color='black')
b7 = play.new_box(color='light blue', x=0, y=-50, width=80, height=60)
t7 = play.new_text(words='7', x=0, y=-50, font_size=30, color='black')
b8 = play.new_box(color='light blue', x=120, y=-50, width=80, height=60)
t8 = play.new_text(words='8', x=120, y=-50, font_size=30, color='black')

@b8.when_clicked
def richtig():
    global score
    score = score + 1
    score_anzeige.words = 'Punkte: ' + str(score)

@b6.when_clicked
def falsch1():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)

@b7.when_clicked
def falsch2():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/score\s*=\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Initialisiere score = 0 ganz oben.' };
                    }
                    if (!/b6\s*=/.test(studentCode) || !/b7\s*=/.test(studentCode) || !/b8\s*=/.test(studentCode)) {
                        return { ok: false, message: 'Erstelle drei Buttons: b6, b7 und b8.' };
                    }
                    if (!/@b8\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Die richtige Antwort (b8) braucht einen Klick-Handler.' };
                    }
                    if (!/score\s*=\s*score\s*\+\s*1/.test(studentCode)) {
                        return { ok: false, message: 'Bei richtiger Antwort: score = score + 1.' };
                    }
                    if (!/score\s*=\s*score\s*-\s*1/.test(studentCode)) {
                        return { ok: false, message: 'Bei falscher Antwort: score = score - 1.' };
                    }
                    return { ok: true, message: 'Quiz laeuft! Klick die 8 fuer einen Punkt.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 15 — KLAVIER (Welt 2)
        // =========================================================
        {
            id: 15,
            world: 2,
            title: 'Klavier mit Lampen',
            shortDescription: 'Acht Tasten in einer Schleife erstellen — bei Klick leuchtet eine Lampe auf.',
            concepts: [
                'for i in range(...) erstellt mehrere Sprites',
                'Liste tasten = [] mit append()',
                'Index in Klick-Funktion (Klavier-Taste)'
            ],
            keyHints: [],
            tasks: [{
                title: 'Erstelle 8 Tasten in einer Schleife',
                description: `
                    <p>Wir erstellen ein einfaches Klavier mit 8 Tasten. Statt jede Taste einzeln per Hand zu schreiben, nutzen wir eine <code>for</code>-Schleife.</p>
                    <p>Jede Taste wird in der Liste <code>tasten</code> gespeichert. Beim Klick leuchtet die geklickte Taste kurz farbig auf.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Beispiel: ein einzelner Sprite mit for-Schleife',
                        codeTemplate: `# Muster: 5 Kreise nebeneinander mit einer for-Schleife
kreise = []
for i in range(5):
    k = play.new_circle(color='red', x=-100 + i*50, y=180, radius=10)
    kreise.append(k)`,
                        blankHint: 'Bau jetzt eine analoge for-Schleife: Liste tasten = [], dann 8 weisse Boxen erzeugen (width=42, height=140) mit schwarzem Rand. Position berechnen: -175 + i*50.',
                        explanation: 'Du siehst wie man mit einer for-Schleife mehrere Sprites macht und in einer Liste sammelt. Mach das gleiche fuer 8 Klaviertasten.'
                    },
                    {
                        title: 'Beispiel: Klick-Erkennung auf einen einzelnen Sprite',
                        codeTemplate: `# Muster: Pruefe pro Frame ob die Maus auf einem Sprite klickt
@play.repeat_forever
async def schleife():
    if play.mouse.is_clicked and beispiel.is_touching(play.mouse):
        beispiel.color = 'orange'
        await play.timer(seconds=0.2)
        beispiel.color = 'white'`,
                        blankHint: 'Schreib es ab, aber mit einer for-Schleife: for t in tasten: pruefe jede Taste ob sie geklickt ist, leuchte sie kurz auf (z.B. yellow) und mach sie wieder weiss.',
                        explanation: 'Statt nur einen Sprite zu pruefen, gehst du in einer for-Schleife durch ALLE tasten — pruefe jede einzelne mit dem gleichen Muster.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Klavier mit 8 Tasten. Klick eine an!
titel = play.new_text(words='Mein Klavier', x=0, y=130, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Mein Klavier', x=0, y=130, font_size=22, color='black')

tasten = []

for i in range(8):
    taste_x = -175 + i * 50
    taste = play.new_box(color='white', x=taste_x, y=0, width=42, height=140, border_color='black', border_width=2)
    tasten.append(taste)

@play.repeat_forever
async def schleife():
    for t in tasten:
        if play.mouse.is_clicked and t.is_touching(play.mouse):
            t.color = 'yellow'
            await play.timer(seconds=0.2)
            t.color = 'white'
`,
                validate: ({ studentCode, state, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/tasten\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege oben eine leere Liste an: tasten = []' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*8\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst eine for-Schleife mit range(8) fuer 8 Tasten.' };
                    }
                    if (!/tasten\.append\s*\(/.test(studentCode)) {
                        return { ok: false, message: 'Haenge jede Taste mit tasten.append(taste) an die Liste.' };
                    }
                    const boxes = state.sprites.filter(s => s.constructor.name === 'BoxSprite');
                    if (boxes.length < 8) {
                        return { ok: false, message: 'Es sollten 8 Tasten zu sehen sein. Aktuell: ' + boxes.length };
                    }
                    return { ok: true, message: 'Bravo! Klick die Tasten — sie leuchten auf.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 16 — EGG CATCHER (Welt 2)
        // =========================================================
        {
            id: 16,
            world: 2,
            title: 'Egg Catcher',
            shortDescription: 'Bewege den Korb mit den Pfeiltasten und fange fallende Eier!',
            concepts: [
                'Listen mit dynamischen Sprites (append/remove)',
                'Frame-Counter fuer regelmaessige Ereignisse',
                'for-Schleife durch eine Liste'
            ],
            keyHints: [
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [{
                title: 'Korb bewegen und Eier fangen',
                description: `
                    <p>Der Korb laeuft mit Pfeiltasten links/rechts. Alle 60 Frames erscheint ein neues Ei oben am Bildschirm.</p>
                    <p>Eier werden in der Liste <code>eier</code> gespeichert. Sie fallen — wenn ein Ei den Korb beruehrt, kommt es aus der Liste raus und der Score steigt.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Setup: was du oben brauchst',
                        codeTemplate: `# Fuenf Sachen ganz oben:
# - score = 0
# - score_text mit "Eier: 0" als play.new_text(...)
# - korb als braune Box (y=-180, 100x20)
# - eier = []  (leere Liste)
# - frame = 0  (Zaehler fuer Spawns)`,
                        blankHint: 'Schreib diese 5 Zeilen selbst. score und frame sind einfache Zahlen, eier eine leere Liste, korb und score_text sind Sprites.',
                        explanation: 'Das Setup-Ziel ist klar — schreib die einzelnen Zeilen selbst. score und frame brauchst du spaeter als global in der Funktion.'
                    },
                    {
                        title: 'Beispiel: Korb mit Pfeil-LINKS-Taste bewegen',
                        codeTemplate: `# So beginnt deine Spielschleife:
@play.repeat_forever
def schleife():
    global frame, score
    frame = frame + 1
    if play.key_is_pressed('left'):
        korb.x = korb.x - 5`,
                        blankHint: 'Ergaenze: Pfeil-RECHTS analog (korb.x + 5). Und: alle 60 Frames ein neues Ei spawnen — pruefe mit if frame % 60 == 0:, mache play.new_circle bei zufaelligem x (randint(-240, 240)) ganz oben (y=200), und haeng es mit eier.append(ei) in die Liste.',
                        explanation: 'Du siehst das Muster fuer Tasten-Steuerung. Vervollstaendige rechts-Bewegung und Ei-Spawn analog.'
                    },
                    {
                        title: 'Hinweis: Eier fallen + Kollision pruefen',
                        codeTemplate: `# Am Ende der schleife()-Funktion (4 Leerzeichen Einrueckung):
    for ei in eier:
        # ... Ei nach unten bewegen (y wird kleiner)
        # ... wenn ei.is_touching(korb): aufraeumen + score zaehlen
        pass`,
                        blankHint: 'Schreib die zwei Aktionen: 1) ei.y = ei.y - 3 (Fall-Schritt), 2) Wenn der Korb das Ei beruehrt: ei.hide(), eier.remove(ei), score erhoehen, score_text.words updaten.',
                        explanation: 'Die for-Schleife geht jedes Frame durch alle Eier. Pro Ei: bewegen, dann pruefen ob es im Korb gelandet ist.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Egg Catcher: Korb bewegen, Eier fangen.

# Dein Code:
`,
                solution:
`score = 0
score_text = play.new_text(words='Eier: 0', x=200, y=185, font_size=18, color='black')
korb = play.new_box(color='brown', x=0, y=-180, width=100, height=20)
eier = []
frame = 0

@play.repeat_forever
def schleife():
    global frame, score
    frame = frame + 1
    if play.key_is_pressed('left'):
        korb.x = korb.x - 5
    if play.key_is_pressed('right'):
        korb.x = korb.x + 5
    if frame % 60 == 0:
        ei = play.new_circle(color='white', x=randint(-240, 240), y=200, radius=15, border_color='gray', border_width=2)
        eier.append(ei)
    for ei in eier:
        ei.y = ei.y - 3
        if ei.is_touching(korb):
            ei.hide()
            eier.remove(ei)
            score = score + 1
            score_text.words = 'Eier: ' + str(score)
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/korb\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der Korb (Box).' };
                    }
                    if (!/eier\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine leere Liste an: eier = []' };
                    }
                    if (!/play\.key_is_pressed\s*\(\s*['"]left['"]\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pfeiltaste links pruefst du mit play.key_is_pressed(\'left\').' };
                    }
                    if (!/eier\.append/.test(studentCode)) {
                        return { ok: false, message: 'Neue Eier mit eier.append(ei) zur Liste hinzufuegen.' };
                    }
                    if (!/eier\.remove/.test(studentCode)) {
                        return { ok: false, message: 'Bei Treffer: eier.remove(ei) entfernt das Ei.' };
                    }
                    if (!/is_touching\s*\(\s*korb\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe Kollision mit ei.is_touching(korb).' };
                    }
                    return { ok: true, message: 'Genial! Bewege den Korb mit den Pfeiltasten.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 17 — FROGGER-LITE (Welt 2)
        // =========================================================
        {
            id: 17,
            world: 2,
            title: 'Frosch ueberquert die Strasse',
            shortDescription: 'Hilf dem Frosch ueber drei Auto-Spuren — ohne ueberfahren zu werden!',
            concepts: [
                'Hindernisse in einer Liste',
                'Wrap-around: x zuruecksetzen wenn aus dem Bild',
                'Reset bei Kollision'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Vorwaerts' },
                { keys: ['↓'], label: 'Zurueck' }
            ],
            tasks: [{
                title: 'Springe als Frosch ueber drei Auto-Spuren',
                description: `
                    <p>Drei Autos rollen quer ueber den Bildschirm. Bewege den Frosch mit ↑ nach oben — bei Kollision geht's zurueck zum Start.</p>
                    <p>Wenn ein Auto rechts aus dem Bild laeuft, springt es links wieder rein (Wrap-around).</p>
                `,
                progressiveHints: [
                    {
                        title: 'Beispiel: Frosch und EIN Auto',
                        codeTemplate: `# Frosch unten in der Mitte:
frosch = play.new_circle(color='green', x=0, y=-180, radius=18)
# Erstes Auto als Muster (untere Spur):
auto1 = play.new_box(color='red', x=0, y=-80, width=70, height=30)`,
                        blankHint: 'Bau jetzt analog zwei weitere Autos: auto2 (blau, mittlere Spur y=0) und auto3 (orange, obere Spur y=80). Sammle alle drei in einer Liste autos = [auto1, auto2, auto3]. Und einen status-Text oben mit "Komm hoch!".',
                        explanation: 'Du siehst Frosch + ein Auto. Mach analog die anderen zwei Autos und stecke sie in eine Liste — plus den Status-Text oben.'
                    },
                    {
                        title: 'Hinweis: Spielschleife mit Pfeiltasten',
                        codeTemplate: `# Skelett — vervollstaendige selbst:
@play.repeat_forever
def schleife():
    # ... wenn Pfeil-OBEN: frosch.y groesser
    # ... wenn Pfeil-UNTEN: frosch.y kleiner
    # ... wenn frosch.y > 200: status auf "Geschafft!", frosch.y = -180
    pass`,
                        blankHint: 'Schreib drei if-Bloecke: play.key_is_pressed(\'up\') / \'down\' fuer Bewegung (frosch.y +/- 3), und einen Check ob er oben angekommen ist (Reset auf -180 + Status-Text).',
                        explanation: 'Drei einfache if-Bloecke fuer hoch, runter und das Erreichen des oberen Rands.'
                    },
                    {
                        title: 'Hinweis: Autos bewegen + Wrap + Kollision',
                        codeTemplate: `# Am Ende der schleife() in einer for-Schleife durch autos:
    for auto in autos:
        # ... Auto nach rechts bewegen (auto.x + 4)
        # ... wenn auto.x > 270: zurueck nach links bei x = -270 (Wrap)
        # ... wenn auto.is_touching(frosch): Frosch zurueck auf -180, Status "Aua!"
        pass`,
                        blankHint: 'Drei Aktionen pro Auto: 1) auto.x = auto.x + 4 (bewegen), 2) Wenn rechts raus → auto.x = -270 (Wrap-around), 3) Wenn Beruehrung mit Frosch → Frosch resetten + Status updaten.',
                        explanation: 'Die for-Schleife geht durch alle drei Autos und macht fuer jedes das gleiche Muster.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Frosch ueber die Strasse.

# Dein Code:
`,
                solution:
`frosch = play.new_circle(color='green', x=0, y=-180, radius=18)
auto1 = play.new_box(color='red', x=0, y=-80, width=70, height=30)
auto2 = play.new_box(color='blue', x=-100, y=0, width=70, height=30)
auto3 = play.new_box(color='orange', x=100, y=80, width=70, height=30)
autos = [auto1, auto2, auto3]
status = play.new_text(words='Komm hoch!', x=0, y=185, font_size=18, color='black')

@play.repeat_forever
def schleife():
    if play.key_is_pressed('up'):
        frosch.y = frosch.y + 3
    if play.key_is_pressed('down'):
        frosch.y = frosch.y - 3
    if frosch.y > 200:
        status.words = 'Geschafft!'
        frosch.y = -180
    for auto in autos:
        auto.x = auto.x + 4
        if auto.x > 270:
            auto.x = -270
        if auto.is_touching(frosch):
            frosch.y = -180
            status.words = 'Aua! Nochmal!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/frosch\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt frosch als Kreis.' };
                    }
                    if (!/autos\s*=\s*\[/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Liste autos = [auto1, auto2, auto3] an.' };
                    }
                    if (!/play\.key_is_pressed\s*\(\s*['"]up['"]\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe play.key_is_pressed(\'up\') um vorzugehen.' };
                    }
                    if (!/for\s+auto\s+in\s+autos/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst for auto in autos: um alle Autos zu bewegen.' };
                    }
                    if (!/is_touching\s*\(\s*frosch\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe auto.is_touching(frosch) fuer die Kollision.' };
                    }
                    return { ok: true, message: 'Hopp hopp! Versuch es bis ganz nach oben.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 18 — BLACKJACK (Welt 2)
        // =========================================================
        {
            id: 18,
            world: 2,
            title: 'Blackjack',
            shortDescription: 'Karten ziehen und nicht ueber 21 kommen — kannst du den Computer schlagen?',
            concepts: [
                'int(text.words) wandelt Text in Zahl',
                'Mehrere Klick-Handler fuer Buttons',
                'for-Schleife mit range fuer Computer-Zuege'
            ],
            keyHints: [],
            tasks: [{
                title: 'Programmiere Blackjack mit zwei Buttons',
                description: `
                    <p>Zwei Buttons: <strong>Karte ziehen</strong> und <strong>Computer fordern</strong>.</p>
                    <p>Pro Klick auf „Karte ziehen": Zufallszahl 1–11 wird zu deinem Score addiert. Bei mehr als 21 hast du verloren. „Computer fordern" laesst den Computer so oft ziehen, wie du gezogen hast.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Setup: drei globale Variablen + drei Texte',
                        codeTemplate: `# Drei Zaehler-Variablen:
dein_score = 0
comp_score = 0
zuege = 0`,
                        blankHint: 'Schreib jetzt selbst drei play.new_text(...): score_txt oben (zeigt "Du: 0  /  Comp: 0"), karte in der Mitte (gross, font_size=80, mit "?"), und status unten ("Klick einen Button").',
                        explanation: 'Setup hat zwei Teile: Variablen (gegeben) und drei Anzeige-Texte (musst du selbst schreiben).'
                    },
                    {
                        title: 'Beispiel: ein Button (Karte ziehen)',
                        codeTemplate: `# Erster Button als Muster (gruen, links unten):
b_zieh = play.new_box(color='green', x=-110, y=-110, width=180, height=50)
t_zieh = play.new_text(words='Karte ziehen', x=-110, y=-110, font_size=18, color='white')`,
                        blankHint: 'Bau analog den zweiten Button: b_comp (rot, x=110) mit Text t_comp ("Computer fordern", font_size=16). Box+Text Paar genau wie oben.',
                        explanation: 'Zwei Buttons brauchst du. Der erste ist gegeben, mach den zweiten analog auf der rechten Seite.'
                    },
                    {
                        title: 'Hinweis: Klick "Karte ziehen"',
                        codeTemplate: `# Skelett — vervollstaendige selbst:
@b_zieh.when_clicked
def ziehen():
    global dein_score, zuege
    # ... eine Karte ziehen mit randint(1, 11)
    # ... Karten-Text aktualisieren (karte.words = str(zahl))
    # ... dein_score erhoehen, zuege erhoehen
    # ... score_txt aktualisieren
    # ... wenn dein_score > 21: status auf "Du hast verloren!"
    pass`,
                        blankHint: 'Schreib die fuenf Aktionen aus: zahl mit randint(1, 11), karte.words = str(zahl), dein_score und zuege jeweils + 1 bzw. + zahl, score_txt mit String-Verknuepfung, dann der Bust-Check.',
                        explanation: 'Beim Klick: Karte ziehen, Score erhoehen, anzeigen, und pruefen ob der Spieler ueber 21 ist.'
                    },
                    {
                        title: 'Hinweis: Klick "Computer fordern"',
                        codeTemplate: `# Computer zieht so oft wie der Spieler — Skelett:
@b_comp.when_clicked
def computer_zug():
    global comp_score
    # ... in einer for-Schleife "zuege"-mal eine Zufallskarte ziehen
    # ... comp_score erhoehen
    # ... score_txt aktualisieren
    # ... Vergleich: wer gewinnt?
    pass`,
                        blankHint: 'Bau die for-Schleife: for i in range(zuege): zahl = randint(1, 11), comp_score erhoehen. Dann score_txt updaten und mit if/elif/else entscheiden: wenn comp_score > 21 oder kleiner als dein_score → gewonnen, sonst verloren.',
                        explanation: 'Schwerster Teil: Computer zieht in einer Schleife, dann Vergleich beider Scores.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Blackjack: Karten ziehen, nicht ueber 21!

# Dein Code:
`,
                solution:
`dein_score = 0
comp_score = 0
zuege = 0
score_txt = play.new_text(words='Du: 0  /  Comp: 0', x=0, y=180, font_size=22, color='black')
karte = play.new_text(words='?', x=0, y=20, font_size=80, color='blue')
status = play.new_text(words='Klick einen Button', x=0, y=-180, font_size=18, color='gray')

b_zieh = play.new_box(color='green', x=-110, y=-110, width=180, height=50)
t_zieh = play.new_text(words='Karte ziehen', x=-110, y=-110, font_size=18, color='white')
b_comp = play.new_box(color='red', x=110, y=-110, width=180, height=50)
t_comp = play.new_text(words='Computer fordern', x=110, y=-110, font_size=16, color='white')

@b_zieh.when_clicked
def ziehen():
    global dein_score, zuege
    zahl = randint(1, 11)
    karte.words = str(zahl)
    dein_score = dein_score + zahl
    zuege = zuege + 1
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if dein_score > 21:
        status.words = 'Du hast verloren! (ueber 21)'

@b_comp.when_clicked
def computer_zug():
    global comp_score
    for i in range(zuege):
        zahl = randint(1, 11)
        comp_score = comp_score + zahl
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if comp_score > 21 or comp_score < dein_score:
        status.words = 'Du hast gewonnen!'
    else:
        status.words = 'Computer gewinnt!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/dein_score\s*=\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Initialisiere dein_score = 0.' };
                    }
                    if (!/@b_zieh\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @b_zieh.when_clicked.' };
                    }
                    if (!/@b_comp\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @b_comp.when_clicked.' };
                    }
                    if (!/randint\s*\(\s*1\s*,\s*11\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Karten ziehen mit randint(1, 11).' };
                    }
                    if (!/dein_score\s*>\s*21/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe Bust mit if dein_score > 21:' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*zuege\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Computer zieht in einer for-Schleife mit range(zuege).' };
                    }
                    return { ok: true, message: 'Karten her! Spiel ein paar Runden.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 19 — ARKANOID (Welt 2)
        // =========================================================
        {
            id: 19,
            world: 2,
            title: 'Arkanoid',
            shortDescription: 'Klassischer Block-Brecher: Ball, Paddle und ein Block-Raster mit verschachtelten Schleifen.',
            concepts: [
                'Verschachtelte for-Schleifen fuer ein Block-Raster',
                'Liste blocks dynamisch durchlaufen',
                'Ball-Bewegung mit ball_vx und ball_vy'
            ],
            keyHints: [
                { keys: ['←'], label: 'Paddle links' },
                { keys: ['→'], label: 'Paddle rechts' }
            ],
            tasks: [{
                title: 'Zerstoere alle Bloecke',
                description: `
                    <p>Ein klassisches Arkanoid: Paddle unten, Ball faellt, oben zwei Reihen mit je 5 Bloecken. Trifft der Ball einen Block, fliegt der Block raus aus der Liste.</p>
                    <p>Verschachtelte Schleifen erstellen das Block-Raster, eine Liste haelt alle Bloecke.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Setup: Paddle, Ball, Geschwindigkeiten',
                        codeTemplate: `# Brauchst du oben:
# - paddle: blaue Box unten (y=-180, 120x18)
# - ball: roter Kreis in der Mitte (radius 12)
# - ball_vx und ball_vy: zwei Geschwindigkeits-Variablen (z.B. 4 und -4)
# - status: Text oben mit "Zerstoere alle Bloecke!"`,
                        blankHint: 'Schreib diese 5 Zeilen selbst. ball_vx steuert die horizontale Bewegung, ball_vy die vertikale (negativ = nach oben).',
                        explanation: 'Setup ohne Code-Beispiel — du kennst schon play.new_box / play.new_circle aus den letzten Levels.'
                    },
                    {
                        title: 'Beispiel: EINE for-Schleife fuer Bloecke in einer Reihe',
                        codeTemplate: `# Muster: 5 Bloecke nebeneinander in einer Reihe:
blocks = []
for spalte in range(5):
    bx = -200 + spalte * 100
    block = play.new_box(color='orange', x=bx, y=140, width=90, height=25, border_color='dark gray', border_width=1)
    blocks.append(block)`,
                        blankHint: 'Bau das jetzt zu einem RASTER um: nimm noch eine aeussere for-Schleife "for reihe in range(2):" drumherum. Berechne by = 140 - reihe * 35 (verschiedene y-Werte pro Reihe). So bekommst du 2 Reihen mit je 5 Bloecken.',
                        explanation: 'Du siehst, wie eine Reihe geht. Pack das in eine zweite for-Schleife rein → verschachtelt → Block-Raster.'
                    },
                    {
                        title: 'Hinweis: Spielschleife mit Ball und Paddle',
                        codeTemplate: `@play.repeat_forever
def schleife():
    global ball_vx, ball_vy
    # ... Paddle nach links/rechts mit Pfeiltasten (paddle.x +/- 6)
    # ... Ball bewegen: ball.x += ball_vx, ball.y += ball_vy
    # ... Wand-Abprall: wenn ball.x > 250 oder < -250: ball_vx umdrehen
    # ... wenn ball.y > 200: ball_vy umdrehen (nach unten)
    # ... wenn ball.is_touching(paddle): ball_vy = abs(ball_vy)  (nach oben)`,
                        blankHint: 'Schreibe die 5 Bloecke aus den Kommentaren. ball_vx = -1 * ball_vx dreht die x-Geschwindigkeit um. abs(...) macht garantiert positiv.',
                        explanation: 'Pong-Erfahrung aus Level 8! Hier mit zusaetzlicher x-Bewegung. Schreib es Schritt fuer Schritt nach den Kommentaren.'
                    },
                    {
                        title: 'Hinweis: Block-Treffer + Sieg/Niederlage',
                        codeTemplate: `# Am Ende der schleife() (4 Leerzeichen Einrueckung):
    for b in blocks:
        # ... wenn b.is_touching(ball): Block ausblenden, aus Liste raus, Ball abprallen
        pass
    # ... wenn ball.y < -210: status = "Verloren!"
    # ... wenn len(blocks) == 0: status = "GEWONNEN!"`,
                        blankHint: 'Im for-Block: b.hide(), blocks.remove(b), ball_vy = -1 * ball_vy. Danach zwei if-Bloecke fuer Niederlage (Ball faellt unten raus) und Sieg (Liste leer).',
                        explanation: 'Letzter Teil — Treffer-Logik und Spiel-Ende. Pruefe pro Frame ob alle Bloecke weg sind oder der Ball durchgefallen ist.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Arkanoid: Paddle, Ball, Bloecke.

# Dein Code:
`,
                solution:
`paddle = play.new_box(color='blue', x=0, y=-180, width=120, height=18)
ball = play.new_circle(color='red', x=0, y=0, radius=12)
ball_vx = 4
ball_vy = -4
status = play.new_text(words='Zerstoere alle Bloecke!', x=0, y=185, font_size=16, color='black')

blocks = []
for reihe in range(2):
    for spalte in range(5):
        bx = -200 + spalte * 100
        by = 140 - reihe * 35
        block = play.new_box(color='orange', x=bx, y=by, width=90, height=25, border_color='dark gray', border_width=1)
        blocks.append(block)

@play.repeat_forever
def schleife():
    global ball_vx, ball_vy
    if play.key_is_pressed('left'):
        paddle.x = paddle.x - 6
    if play.key_is_pressed('right'):
        paddle.x = paddle.x + 6
    ball.x = ball.x + ball_vx
    ball.y = ball.y + ball_vy
    if ball.x > 250 or ball.x < -250:
        ball_vx = -1 * ball_vx
    if ball.y > 200:
        ball_vy = -1 * ball_vy
    if ball.is_touching(paddle):
        ball_vy = abs(ball_vy)
    for b in blocks:
        if b.is_touching(ball):
            b.hide()
            blocks.remove(b)
            ball_vy = -1 * ball_vy
    if ball.y < -210:
        status.words = 'Verloren!'
    if len(blocks) == 0:
        status.words = 'GEWONNEN!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/paddle\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt das paddle (Box).' };
                    }
                    if (!/ball\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der ball (Kreis).' };
                    }
                    if (!/blocks\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege blocks = [] an.' };
                    }
                    if (!/for\s+\w+\s+in\s+range\s*\(\s*2\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Verwende eine for-Schleife mit range(2) fuer die Reihen.' };
                    }
                    if (!/blocks\.append/.test(studentCode)) {
                        return { ok: false, message: 'Haenge jeden Block mit blocks.append(block) an.' };
                    }
                    if (!/blocks\.remove/.test(studentCode)) {
                        return { ok: false, message: 'Bei Treffer: blocks.remove(b) entfernt den Block.' };
                    }
                    if (!/len\s*\(\s*blocks\s*\)\s*==\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe mit if len(blocks) == 0: ob alles zerstoert ist.' };
                    }
                    return { ok: true, message: 'Klassiker geschafft! Versuch alle Bloecke zu treffen.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 20 — MEMORY (Welt 2)
        // =========================================================
        {
            id: 20,
            world: 2,
            title: 'Memory-Spiel',
            shortDescription: 'Finde die Farbpaare — klick zwei Karten an, gleiche Farben bleiben offen.',
            concepts: [
                'Liste mit Index-Zugriff',
                'Globale Variablen fuer den Spielzustand',
                'await play.timer(seconds=...) zum kurzen Pausieren'
            ],
            keyHints: [],
            tasks: [{
                title: 'Memory mit drei Farbpaaren',
                description: `
                    <p>Sechs Karten verdecken drei Farbpaare. Klick eine Karte → ihre Farbe erscheint. Zweite Karte mit gleicher Farbe → bleiben sichtbar. Sonst → kurz warten und wieder verdecken.</p>
                    <p>Zwei globale Variablen merken sich die erste geklickte Karte und ihre Farbe.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Beispiel: 3 Karten mit for-Schleife',
                        codeTemplate: `# Muster fuer 3 graue Karten nebeneinander:
karten = []
farben = ['red', 'red', 'blue', 'blue', 'green', 'green']
for i in range(3):
    k = play.new_box(color='gray', x=-100 + i*80, y=0, width=70, height=100, border_color='black', border_width=2)
    karten.append(k)`,
                        blankHint: 'Bau das auf 6 Karten um: range(6) statt range(3), und Start-x bei -200 statt -100. Die Liste farben mit 6 Farb-Eintraegen ist schon gegeben — uebernimm sie genauso.',
                        explanation: 'Du siehst das Muster fuer 3 Karten. Skalierst du es auf 6, hast du das ganze Spielfeld.'
                    },
                    {
                        title: 'Zustands-Variablen + Status-Text',
                        codeTemplate: `# Diese drei Zeilen brauchst du noch oben:
erste_idx = -1
zweite_idx = -1
status = play.new_text(words='Finde alle Paare!', x=0, y=160, font_size=20, color='black')`,
                        blankHint: 'Schreib es so ab. -1 bedeutet "noch keine Karte aufgedeckt". Diese zwei Variablen merken sich Klicks zwischen den Frames.',
                        explanation: 'Die Indizes zeigen, welche Karten gerade offen sind. status zeigt die Botschaft an.'
                    },
                    {
                        title: 'Hinweis: Klick-Logik in der Spielschleife',
                        codeTemplate: `@play.repeat_forever
async def schleife():
    global erste_idx, zweite_idx
    for i in range(6):
        # Pruefe ob auf karten[i] geklickt wird UND ob sie noch grau (verdeckt) ist
        if play.mouse.is_clicked and karten[i].is_touching(play.mouse) and karten[i].color == 'gray':
            # ... karte aufdecken: karten[i].color = farben[i]
            # ... wenn erste_idx == -1: erste_idx = i  (erste Karte gemerkt)
            # ... sonst: zweite_idx = i, kurz warten, vergleichen, ggf. wieder grau machen
            pass`,
                        blankHint: 'Im if-Block: 1) karten[i].color = farben[i] (aufdecken). 2) Verzweigung mit if/else: erste_idx == -1 → erste_idx merken. else → zweite_idx merken, await play.timer(seconds=0.7), wenn farben verschieden beide wieder grau, dann beide Indizes zurueck auf -1.',
                        explanation: 'Schwierigster Teil: zwei verschiedene Verhalten je nach erstem oder zweitem Klick. Bei "ungleich" werden beide nach kurzer Wartezeit wieder grau.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Memory mit 3 Farbpaaren.

# Dein Code:
`,
                solution:
`karten = []
farben = ['red', 'red', 'blue', 'blue', 'green', 'green']

for i in range(6):
    karte = play.new_box(color='gray', x=-200 + i*80, y=0, width=70, height=100, border_color='black', border_width=2)
    karten.append(karte)

erste_idx = -1
zweite_idx = -1
status = play.new_text(words='Finde alle Paare!', x=0, y=160, font_size=20, color='black')

@play.repeat_forever
async def schleife():
    global erste_idx, zweite_idx
    for i in range(6):
        if play.mouse.is_clicked and karten[i].is_touching(play.mouse) and karten[i].color == 'gray':
            karten[i].color = farben[i]
            if erste_idx == -1:
                erste_idx = i
            else:
                zweite_idx = i
                await play.timer(seconds=0.7)
                if farben[erste_idx] != farben[zweite_idx]:
                    karten[erste_idx].color = 'gray'
                    karten[zweite_idx].color = 'gray'
                erste_idx = -1
                zweite_idx = -1
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/karten\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege karten = [] an.' };
                    }
                    if (!/farben\s*=\s*\[/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Liste farben an mit den Farbpaaren.' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*6\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Verwende for i in range(6) fuer 6 Karten.' };
                    }
                    if (!/erste_idx/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Variable erste_idx an, um die erste Karte zu merken.' };
                    }
                    if (!/await\s+play\.timer/.test(studentCode)) {
                        return { ok: false, message: 'Nach zwei Klicks brauchst du await play.timer(seconds=...) zum Warten.' };
                    }
                    if (!/karten\[\w+\]\.color/.test(studentCode)) {
                        return { ok: false, message: 'Greife mit karten[i].color auf einzelne Karten zu.' };
                    }
                    return { ok: true, message: 'Memory laeuft! Finde die Paare.' };
                }
            }]
        }
    ];

    global.LEVELS = LEVELS;
})(window);

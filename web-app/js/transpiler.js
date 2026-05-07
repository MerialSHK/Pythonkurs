/* ================================================================
   transpiler.js — Python-Subset zu JavaScript
   ----------------------------------------------------------------
   Versteht das Subset, das im Kurs gebraucht wird:
     - Variablen, Zuweisungen, Attribut-Zuweisung (+=, -=, *=, /=)
     - if / elif / else mit Indentation-Bloecken
     - while-Schleifen
     - Decorators @play.when_program_starts, @play.repeat_forever, @sprite.when_clicked
     - Funktionsdefinition (auch async def)
     - Funktionsaufrufe inkl. Keyword-Arguments key=value
     - Listen, Strings, Zahlen, Booleans
     - Operatoren: +, -, *, /, //, %, ==, !=, <, >, <=, >=, and, or, not
     - Kommentare mit #
     - import / from-Statements werden ignoriert
   ================================================================ */

(function (global) {
    'use strict';

    const KEYWORDS = new Set([
        'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is',
        'if', 'elif', 'else', 'while', 'for', 'def', 'return',
        'pass', 'break', 'continue', 'import', 'from', 'as', 'async', 'await',
        'global', 'nonlocal', 'try', 'except', 'finally', 'raise', 'with', 'lambda'
    ]);

    function transpile(source) {
        const lines = source.replace(/\r\n/g, '\n').split('\n');
        const out = [];
        const indentStack = [{ indent: -1, kind: 'root', globals: new Set() }];

        let pendingDecorators = [];

        function closeBlocksTo(indent) {
            while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1].indent) {
                const blk = indentStack.pop();
                if (blk.kind === 'block' || blk.kind === 'fn') {
                    out.push(' '.repeat(Math.max(0, blk.indent)) + '}');
                } else if (blk.kind === 'fn-decorated') {
                    out.push(' '.repeat(Math.max(0, blk.indent)) + '})');
                }
            }
        }

        function isDeclaredGlobal(name) {
            for (let k = indentStack.length - 1; k >= 0; k--) {
                const blk = indentStack[k];
                if ((blk.kind === 'fn' || blk.kind === 'fn-decorated') && blk.globals.has(name)) {
                    return true;
                }
            }
            return false;
        }

        for (let rawLine of lines) {
            const line = rawLine.replace(/\t/g, '    ');
            const stripped = line.replace(/\s+$/g, '');
            const indentMatch = stripped.match(/^(\s*)/);
            const indent = indentMatch[1].length;
            const content = stripped.trim();

            // leere Zeilen, Kommentare ohne Code -> einfach in Output kopieren (aber ohne Wirkung)
            if (content === '') { out.push(''); continue; }
            if (content.startsWith('#')) { out.push('// ' + content.slice(1)); continue; }

            // Kommentar am Zeilenende abschneiden (nur wenn # nicht in String)
            const codePart = stripCommentOutsideString(content);
            const code = codePart.trim();
            if (code === '') { out.push('// ' + content); continue; }

            // import / from -> ignorieren
            if (/^(import|from)\s/.test(code)) { out.push('// ' + line); continue; }

            closeBlocksTo(indent);

            // Decorators sammeln
            if (code.startsWith('@')) {
                pendingDecorators.push(code.slice(1).trim());
                out.push('// ' + line);
                continue;
            }

            // async def / def
            const defMatch = code.match(/^(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:$/);
            if (defMatch) {
                const fnName = defMatch[1];
                const args = defMatch[2].trim();
                const padding = ' '.repeat(indent);
                let header;
                if (pendingDecorators.length > 0) {
                    header = `${padding}${pendingDecorators[0]}(async function ${fnName}(${args}) {`;
                    pendingDecorators = [];
                    out.push(header);
                    indentStack.push({ indent, kind: 'fn-decorated', globals: new Set() });
                } else {
                    header = `${padding}async function ${fnName}(${args}) {`;
                    out.push(header);
                    indentStack.push({ indent, kind: 'fn', globals: new Set() });
                }
                continue;
            }

            // Decorator-Cleanup, falls etwas anderes folgt
            if (pendingDecorators.length > 0) {
                pendingDecorators = [];
            }

            // if / elif / else / while
            const ifMatch = code.match(/^if\s+(.+):$/);
            if (ifMatch) {
                out.push(`${' '.repeat(indent)}if (${transpileExpression(ifMatch[1])}) {`);
                indentStack.push({ indent, kind: 'block' });
                continue;
            }
            const elifMatch = code.match(/^elif\s+(.+):$/);
            if (elifMatch) {
                // schliesst vorigen if-Block
                const prev = indentStack[indentStack.length - 1];
                if (prev && prev.kind === 'block' && prev.indent === indent) {
                    out.push(`${' '.repeat(indent)}} else if (${transpileExpression(elifMatch[1])}) {`);
                } else {
                    out.push(`${' '.repeat(indent)}else if (${transpileExpression(elifMatch[1])}) {`);
                    indentStack.push({ indent, kind: 'block' });
                }
                continue;
            }
            if (/^else\s*:$/.test(code)) {
                const prev = indentStack[indentStack.length - 1];
                if (prev && prev.kind === 'block' && prev.indent === indent) {
                    out.push(`${' '.repeat(indent)}} else {`);
                } else {
                    out.push(`${' '.repeat(indent)}else {`);
                    indentStack.push({ indent, kind: 'block' });
                }
                continue;
            }
            const whileMatch = code.match(/^while\s+(.+):$/);
            if (whileMatch) {
                out.push(`${' '.repeat(indent)}while (${transpileExpression(whileMatch[1])}) {`);
                indentStack.push({ indent, kind: 'block' });
                continue;
            }
            // for x in iterable:  -> for (const x of Array.from(iterable || [])) {
            // Array.from-Kopie macht es sicher, falls die Liste in der Schleife
            // mit .remove() modifiziert wird.
            const forMatch = code.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);
            if (forMatch) {
                const varName = forMatch[1];
                const iter = transpileExpression(forMatch[2]);
                out.push(`${' '.repeat(indent)}for (const ${varName} of Array.from((${iter}) || [])) {`);
                indentStack.push({ indent, kind: 'block' });
                continue;
            }

            // return
            const retMatch = code.match(/^return(?:\s+(.+))?$/);
            if (retMatch) {
                out.push(`${' '.repeat(indent)}return ${transpileExpression(retMatch[1] || '')};`);
                continue;
            }

            // global / pass
            const globalMatch = code.match(/^global\s+(.+)$/);
            if (globalMatch) {
                const names = globalMatch[1].split(',').map(s => s.trim()).filter(Boolean);
                for (let k = indentStack.length - 1; k >= 0; k--) {
                    const blk = indentStack[k];
                    if (blk.kind === 'fn' || blk.kind === 'fn-decorated') {
                        for (const n of names) blk.globals.add(n);
                        break;
                    }
                }
                out.push(`${' '.repeat(indent)}/* global ${names.join(', ')} */`);
                continue;
            }
            if (/^pass$/.test(code)) { out.push(`${' '.repeat(indent)};`); continue; }
            if (/^break$/.test(code)) { out.push(`${' '.repeat(indent)}break;`); continue; }
            if (/^continue$/.test(code)) { out.push(`${' '.repeat(indent)}continue;`); continue; }

            // await x
            const awaitMatch = code.match(/^await\s+(.+)$/);
            if (awaitMatch) {
                out.push(`${' '.repeat(indent)}await ${transpileExpression(awaitMatch[1])};`);
                continue;
            }

            // augmented assignment: a.b += c   oder   a += c
            const augMatch = code.match(/^([\w\.\[\]]+)\s*(\+=|-=|\*=|\/=|%=)\s*(.+)$/);
            if (augMatch) {
                const target = augMatch[1];
                const op = augMatch[2];
                const value = transpileExpression(augMatch[3]);
                out.push(`${' '.repeat(indent)}${target} ${op} ${value};`);
                continue;
            }

            // assignment: a = expr  oder  a.b = expr
            const assignMatch = code.match(/^([\w\.\[\]]+)\s*=\s*(.+)$/);
            if (assignMatch && !looksLikeComparison(assignMatch[1] + ' = ' + assignMatch[2])) {
                const target = assignMatch[1];
                const value = transpileExpression(assignMatch[2]);
                if (target.includes('.') || target.includes('[')) {
                    out.push(`${' '.repeat(indent)}${target} = ${value};`);
                } else if (isDeclaredGlobal(target)) {
                    // global-deklarierte Variable: ohne `var` zuweisen, damit
                    // die Variable im aeusseren Scope geaendert wird
                    out.push(`${' '.repeat(indent)}${target} = ${value};`);
                } else {
                    // Variable: erste Zuweisung mit `var` (toleriert Mehrfach-Zuweisung)
                    out.push(`${' '.repeat(indent)}var ${target} = ${value};`);
                }
                continue;
            }

            // sonst: Ausdruck als Statement
            out.push(`${' '.repeat(indent)}${transpileExpression(code)};`);
        }

        // alle offenen Bloecke schliessen
        closeBlocksTo(-1);

        return out.join('\n');
    }

    function looksLikeComparison() { return false; }

    function stripCommentOutsideString(line) {
        let inS = false, q = null;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (inS) {
                if (c === '\\') { i++; continue; }
                if (c === q) inS = false;
            } else {
                if (c === '"' || c === "'") { inS = true; q = c; continue; }
                if (c === '#') return line.slice(0, i);
            }
        }
        return line;
    }

    // -------------------------------------------------------------
    // Expression-Transpilation
    // -------------------------------------------------------------
    function transpileExpression(expr) {
        if (!expr) return 'undefined';
        // Token-basierte Ersetzung ausserhalb von Strings
        return mapTokens(expr, (token, isString) => {
            if (isString) return token;
            // Keyword-args sind in Aufrufen erlaubt; werden unten behandelt
            return token;
        });
    }

    // Token-Walker: ersetzt Python-Keywords ausserhalb von Strings,
    // und transformiert Funktionsaufrufe mit Keyword-Argumenten.
    function mapTokens(src, _unused) {
        // 1. Strings und Kommentare schuetzen, indem wir sie durch Platzhalter ersetzen
        const stringSlots = [];
        const masked = src.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, (m) => {
            stringSlots.push(m);
            return `${stringSlots.length - 1}`;
        });

        // 2. Keyword-Args in Funktionsaufrufen: foo(words='hi', x=0)  -> foo({words:'hi', x:0})
        const callTransformed = transformKeywordCalls(masked);

        // 3. Operatoren / Literale ersetzen
        let result = callTransformed
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null')
            .replace(/\band\b/g, '&&')
            .replace(/\bor\b/g, '||')
            .replace(/\bnot\b/g, '!')
            .replace(/\/\//g, '/'); // Floor-Division -> Division (genuegt fuer den Kurs)

        // 4. Strings zurueckholen
        result = result.replace(/(\d+)/g, (_, idx) => stringSlots[Number(idx)]);
        return result;
    }

    function transformKeywordCalls(src) {
        // Naive aber ausreichende Funktionsaufruf-Transformation:
        // sucht "name(" und transformiert Top-Level-Argumente.
        let i = 0;
        let out = '';
        while (i < src.length) {
            const c = src[i];
            // Identifier-/Member-Sequenz, dann '('
            if (/[A-Za-z_]/.test(c)) {
                let j = i;
                while (j < src.length && /[A-Za-z0-9_\.]/.test(src[j])) j++;
                const ident = src.slice(i, j);
                if (src[j] === '(') {
                    // gesamten Argumentbereich finden (matched parens)
                    const argsStart = j + 1;
                    let depth = 1, k = argsStart;
                    while (k < src.length && depth > 0) {
                        if (src[k] === '(') depth++;
                        else if (src[k] === ')') depth--;
                        if (depth === 0) break;
                        k++;
                    }
                    const argsRaw = src.slice(argsStart, k);
                    const closing = k; // index of ')'
                    const transformedArgs = transformCallArgs(argsRaw);
                    out += ident + '(' + transformedArgs + ')';
                    i = closing + 1;
                    continue;
                } else {
                    out += ident;
                    i = j;
                    continue;
                }
            }
            out += c;
            i++;
        }
        return out;
    }

    function splitTopLevelArgs(s) {
        const args = [];
        let depth = 0, current = '';
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '(' || c === '[' || c === '{') depth++;
            else if (c === ')' || c === ']' || c === '}') depth--;
            if (c === ',' && depth === 0) {
                args.push(current);
                current = '';
            } else {
                current += c;
            }
        }
        if (current.trim() !== '') args.push(current);
        return args;
    }

    function transformCallArgs(argsRaw) {
        const args = splitTopLevelArgs(argsRaw);
        if (args.length === 0) return '';

        const positional = [];
        const keyword = [];
        for (const a of args) {
            const m = a.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
            if (m) {
                keyword.push({ key: m[1], value: m[2].trim() });
            } else {
                positional.push(a.trim());
            }
        }

        // rekursive Transformation der Argument-Ausdruecke
        const posMapped = positional.map(p => transformKeywordCalls(p));
        const kwMapped = keyword.map(({ key, value }) => `${key}: ${transformKeywordCalls(value)}`);

        if (kwMapped.length === 0) {
            return posMapped.join(', ');
        }
        if (posMapped.length === 0) {
            return `{ ${kwMapped.join(', ')} }`;
        }
        return `${posMapped.join(', ')}, { ${kwMapped.join(', ')} }`;
    }

    // Builtins, die im Schueler-Code verfuegbar sein sollen
    const builtins = {
        str: (x) => x == null ? '' : String(x),
        int: (x) => parseInt(x, 10),
        float: (x) => parseFloat(x),
        len: (x) => (x && x.length != null) ? x.length : 0,
        range: (a, b, c) => {
            const out = [];
            if (b == null) { for (let i = 0; i < a; i++) out.push(i); return out; }
            const step = c == null ? 1 : c;
            for (let i = a; (step > 0 ? i < b : i > b); i += step) out.push(i);
            return out;
        },
        abs: Math.abs,
        min: Math.min,
        max: Math.max,
        round: Math.round,
        print: (...args) => console.log(...args)
    };

    global.PyTranspiler = { transpile, builtins };
})(window);

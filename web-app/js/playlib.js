/* ================================================================
   playlib.js — Canvas-Implementation der `play` Library
   ----------------------------------------------------------------
   Bildet die Subset-API der Python `play` Bibliothek nach.
   Koordinaten: (0,0) ist Mitte, +y = oben (wie in play.py).
   ================================================================ */

(function (global) {
    'use strict';

    // Python-Listen Methoden auf Array.prototype: append() und remove() so wie in Python.
    if (!Array.prototype.append) {
        Array.prototype.append = function (x) { this.push(x); };
    }
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (x) {
            const idx = this.indexOf(x);
            if (idx >= 0) this.splice(idx, 1);
        };
    }

    const COLORS = {
        white: '#ffffff', black: '#1f2330', gray: '#7a8294', 'dark gray': '#5b6477',
        'light gray': '#c9d1de', red: '#e34b5e', orange: '#f08a3e', yellow: '#f5b821',
        green: '#1a9b6e', 'light green': '#7ed7a8', 'dark green': '#0f6b4d',
        blue: '#4f6df5', 'light blue': '#86b3ff', 'dark blue': '#2a3b9c',
        purple: '#8a4ed8', pink: '#e87bb8', brown: '#8a5a44'
    };

    function resolveColor(c) {
        if (!c) return '#1f2330';
        if (c.startsWith && c.startsWith('#')) return c;
        return COLORS[c] || c;
    }

    // -----------------------------------------------------------
    // Sprite-Basis
    // -----------------------------------------------------------
    class Sprite {
        constructor(props) {
            this._id = ++Sprite._counter;
            this.x = props.x || 0;
            this.y = props.y || 0;
            this.color = props.color || 'white';
            this.border_color = props.border_color || null;
            this.border_width = props.border_width || 0;
            this.angle = props.angle || 0;
            this.size = props.size || 100;
            this.transparency = props.transparency != null ? props.transparency : 100;
            this.is_hidden = false;
            this._clickHandlers = [];
            this._destroyed = false;
        }

        hide() { this.is_hidden = true; }
        show() { this.is_hidden = false; }
        remove() { this._destroyed = true; }

        get width() { return this._width || 0; }
        get height() { return this._height || 0; }

        is_touching(other) {
            if (!other || other._destroyed || this._destroyed) return false;
            const aLeft   = this.x - this.width / 2;
            const aRight  = this.x + this.width / 2;
            const aBottom = this.y - this.height / 2;
            const aTop    = this.y + this.height / 2;
            // Punkt-im-Rechteck Test fuer mouse-Objekt (kein width/height)
            const ow = (other.width != null) ? other.width : 0;
            const oh = (other.height != null) ? other.height : 0;
            const bLeft   = other.x - ow / 2;
            const bRight  = other.x + ow / 2;
            const bBottom = other.y - oh / 2;
            const bTop    = other.y + oh / 2;
            return !(aRight < bLeft || aLeft > bRight || aTop < bBottom || aBottom > bTop);
        }

        when_clicked(fn) { this._clickHandlers.push(fn); return fn; }

        _hitTest(px, py) {
            return Math.abs(px - this.x) <= this.width / 2 &&
                   Math.abs(py - this.y) <= this.height / 2;
        }
    }
    Sprite._counter = 0;

    class TextSprite extends Sprite {
        constructor(props) {
            super(props);
            this.words = props.words != null ? String(props.words) : '';
            this.font_size = props.font_size || 24;
            this.font = props.font || null;
            this.color = props.color || 'black';
        }

        get width()  { return Math.max(20, this.words.length * this.font_size * 0.55); }
        get height() { return this.font_size * 1.05; }

        _draw(ctx, cw, ch) {
            if (this.is_hidden || !this.words) return;
            const cx = cw / 2 + this.x;
            const cy = ch / 2 - this.y;
            ctx.save();
            ctx.globalAlpha = this.transparency / 100;
            ctx.fillStyle = resolveColor(this.color);
            ctx.font = `${this.font_size}px ${this.font || 'system-ui, -apple-system, "Segoe UI", sans-serif'}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.translate(cx, cy);
            if (this.angle) ctx.rotate(-this.angle * Math.PI / 180);
            ctx.fillText(this.words, 0, 0);
            ctx.restore();
        }
    }

    class CircleSprite extends Sprite {
        constructor(props) {
            super(props);
            this.radius = props.radius || 30;
            this.color = props.color || 'red';
        }

        get width()  { return this.radius * 2; }
        get height() { return this.radius * 2; }

        _draw(ctx, cw, ch) {
            if (this.is_hidden) return;
            const cx = cw / 2 + this.x;
            const cy = ch / 2 - this.y;
            ctx.save();
            ctx.globalAlpha = this.transparency / 100;
            ctx.beginPath();
            ctx.arc(cx, cy, this.radius * (this.size / 100), 0, Math.PI * 2);
            ctx.fillStyle = resolveColor(this.color);
            ctx.fill();
            if (this.border_color && this.border_width > 0) {
                ctx.lineWidth = this.border_width;
                ctx.strokeStyle = resolveColor(this.border_color);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    class BoxSprite extends Sprite {
        constructor(props) {
            super(props);
            this._w = props.width || 60;
            this._h = props.height || 60;
            this.color = props.color || 'blue';
        }

        get width()  { return this._w; }
        set width(v) { this._w = v; }
        get height() { return this._h; }
        set height(v) { this._h = v; }

        _draw(ctx, cw, ch) {
            if (this.is_hidden) return;
            const cx = cw / 2 + this.x;
            const cy = ch / 2 - this.y;
            const w = this._w * (this.size / 100);
            const h = this._h * (this.size / 100);
            ctx.save();
            ctx.globalAlpha = this.transparency / 100;
            ctx.translate(cx, cy);
            if (this.angle) ctx.rotate(-this.angle * Math.PI / 180);
            ctx.fillStyle = resolveColor(this.color);
            ctx.fillRect(-w / 2, -h / 2, w, h);
            if (this.border_color && this.border_width > 0) {
                ctx.lineWidth = this.border_width;
                ctx.strokeStyle = resolveColor(this.border_color);
                ctx.strokeRect(-w / 2, -h / 2, w, h);
            }
            ctx.restore();
        }
    }

    // -----------------------------------------------------------
    // play-Modul
    // -----------------------------------------------------------
    function createPlay(canvas) {
        const ctx = canvas.getContext('2d');
        const cw = canvas.width;
        const ch = canvas.height;

        const state = {
            sprites: [],
            keysDown: new Set(),
            startHandlers: [],
            loopHandlers: [],
            mouse: { x: 0, y: 0, isClicked: false, is_clicked: false },
            running: false,
            stopped: false,
            rafId: null,
            background: '#fbfcfe',
            timers: []
        };

        const KEY_MAP = {
            'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
            ' ': 'space', 'Enter': 'enter', 'Escape': 'escape', 'Tab': 'tab',
            'Shift': 'shift', 'Control': 'control', 'Alt': 'alt'
        };

        function normalizeKey(e) {
            if (KEY_MAP[e.key]) return KEY_MAP[e.key];
            if (e.key && e.key.length === 1) return e.key.toLowerCase();
            return e.key.toLowerCase();
        }

        function onKeyDown(e) {
            if (!state.running) return;
            const k = normalizeKey(e);
            state.keysDown.add(k);
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
        }
        function onKeyUp(e) {
            const k = normalizeKey(e);
            state.keysDown.delete(k);
        }
        function onMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const sx = canvas.width / rect.width;
            const sy = canvas.height / rect.height;
            const px = (e.clientX - rect.left) * sx;
            const py = (e.clientY - rect.top) * sy;
            state.mouse.x = px - cw / 2;
            state.mouse.y = ch / 2 - py;
        }
        function onMouseDown(e) {
            if (!state.running) return;
            onMouseMove(e);
            state.mouse.isClicked = true;
            state.mouse.is_clicked = true;
            for (const sp of state.sprites) {
                if (sp._destroyed || sp.is_hidden) continue;
                if (sp._hitTest(state.mouse.x, state.mouse.y)) {
                    for (const fn of sp._clickHandlers) {
                        try { Promise.resolve(fn()).catch(err => console.error(err)); }
                        catch (err) { console.error(err); }
                    }
                }
            }
        }
        function onMouseUp() { state.mouse.isClicked = false; state.mouse.is_clicked = false; }

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);

        function clearScreen() {
            ctx.fillStyle = state.background;
            ctx.fillRect(0, 0, cw, ch);
        }

        function render() {
            clearScreen();
            for (const sp of state.sprites) {
                if (sp._destroyed) continue;
                sp._draw(ctx, cw, ch);
            }
        }

        async function tick() {
            if (state.stopped) return;
            for (const fn of state.loopHandlers) {
                try { await fn(); } catch (err) {
                    state.errorHandler && state.errorHandler(err);
                    state.stopped = true;
                    return;
                }
            }
            render();
            if (!state.stopped) state.rafId = requestAnimationFrame(tick);
        }

        function destroy() {
            state.stopped = true;
            if (state.rafId) cancelAnimationFrame(state.rafId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
            state.sprites.length = 0;
            clearScreen();
        }

        const play = {
            screen: { width: cw, height: ch },

            new_text(props = {}) {
                const s = new TextSprite(props || {});
                state.sprites.push(s);
                return s;
            },
            new_circle(props = {}) {
                const s = new CircleSprite(props || {});
                state.sprites.push(s);
                return s;
            },
            new_box(props = {}) {
                const s = new BoxSprite(props || {});
                state.sprites.push(s);
                return s;
            },

            key_is_pressed(...keys) {
                for (const k of keys) {
                    if (state.keysDown.has(String(k).toLowerCase())) return true;
                }
                return false;
            },

            mouse: state.mouse,

            when_program_starts(fn) { state.startHandlers.push(fn); return fn; },
            repeat_forever(fn) { state.loopHandlers.push(fn); return fn; },

            timer({ seconds = 0 } = {}) {
                return new Promise(resolve => setTimeout(resolve, seconds * 1000));
            },

            random_number(low, high) {
                return Math.floor(Math.random() * (high - low + 1)) + low;
            },

            async start_program() {
                state.running = true;
                clearScreen();
                for (const fn of state.startHandlers) {
                    try { await fn(); }
                    catch (err) { state.errorHandler && state.errorHandler(err); return; }
                }
                render();
                tick();
            },

            _state: state,
            _destroy: destroy,
            _setErrorHandler(h) { state.errorHandler = h; },
            _setBackground(c) { state.background = resolveColor(c); }
        };

        return play;
    }

    function randint(low, high) {
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }

    global.PlayLib = { createPlay, randint };
})(window);

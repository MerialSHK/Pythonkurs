# -*- coding: utf-8 -*-
# ================================================================
#   PYTHON SPIELE-KURS — Interaktives Tutorial
# ================================================================
#
#   Willkommen! In dieser Datei lernst du Schritt für Schritt,
#   wie man mit Python kleine Spiele programmiert.
#
#   SO FUNKTIONIERT ES:
#   1. Starte das Programm mit start.bat (oder python main.py)
#   2. Du siehst ein Fenster — das ist dein Spielfeld!
#   3. Folge den Aufgaben (Level 1 bis 6)
#   4. Bei jeder Aufgabe: Entferne die # Zeichen vor den
#      Code-Zeilen, um sie zu aktivieren.
#
#   TIPP: In VS Code kannst du Zeilen markieren und
#         Strg+/ drücken, um # zu entfernen oder hinzuzufügen.
#
#   WICHTIG: Die Level bauen aufeinander auf!
#   Mache sie der Reihe nach: erst Level 2, dann 3, dann 4 usw.
#
#   Viel Spass!
# ================================================================

import play
from random import randint

# --- Globale Variablen (immer aktiv) ---
w = play.screen.width / 2
h = play.screen.height / 2
score = 0


# ================================================================
# LEVEL 1 — DEIN ERSTES FENSTER (schon fertig!)
# ================================================================
# Dieses Level ist schon fertig. Du musst nichts ändern.
# Starte einfach das Programm und schau was passiert!
# ERGEBNIS: Ein graues Fenster mit einem Titel oben.
# ================================================================

titel = play.new_text(
    words='Python Spiele-Kurs',
    x=0, y=270,
    font=None, font_size=30, color='white'
)

anleitung = play.new_text(
    words='Folge den Aufgaben in der Datei!',
    x=0, y=230,
    font=None, font_size=18, color='light green'
)

punkte_anzeige = play.new_text(
    words='',
    x=0, y=-270,
    font=None, font_size=20, color='yellow'
)


# ================================================================
# LEVEL 2 — SPRITES ERSTELLEN
# ================================================================
# AUFGABE: Entferne die # Zeichen vor den nächsten 3 Zeilen.
#          (Markiere die 3 Zeilen, dann drücke Strg+/)
# ERGEBNIS: Du siehst einen blauen Kreis, ein rotes Quadrat
#           und einen Spieler-Text (O_O) in der Mitte!
# ================================================================

# spieler = play.new_text(words='O_O', x=0, y=0, font=None, font_size=60, color='yellow')
# kreis = play.new_circle(color='blue', x=-200, y=100, radius=40)
# box = play.new_box(color='red', x=200, y=100, width=80, height=80)


# ================================================================
# LEVEL 3 — BEWEGUNG MIT PFEILTASTEN
# ================================================================
# VORAUSSETZUNG: Level 2 muss zuerst aktiv sein!
#
# AUFGABE: Entferne die # Zeichen vor den 8 Zeilen weiter
#          unten im Code. Suche nach "LEVEL 3" (scrolle runter).
#          Der Code steht im Bereich "repeat_forever".
# ERGEBNIS: Du kannst den Spieler (O_O) mit den Pfeiltasten
#           bewegen!
# ================================================================


# ================================================================
# LEVEL 4 — SPIELFELD-GRENZEN
# ================================================================
# VORAUSSETZUNG: Level 2 und 3 müssen zuerst aktiv sein!
#
# AUFGABE: Entferne die # Zeichen vor den 5 Zeilen weiter
#          unten im Code. Suche nach "LEVEL 4" (scrolle runter).
# ERGEBNIS: Wenn der Spieler den Rand erreicht, wird er
#           zurückgesetzt und du bekommst einen Punkt!
# ================================================================


# ================================================================
# LEVEL 5 — PHYSIK UND LABYRINTH
# ================================================================
# Dieses Level ist unabhängig von Level 2-4.
# Es hat eigene Spielfiguren!
#
# AUFGABE: Das ist ein grösseres Level! Mache 3 Dinge:
#
#   Teil A: Entferne die # vor den nächsten 8 Zeilen
#           (die Wände und das Ziel)
#   Teil B: Entferne die # im Bereich "when_program_starts"
#           (suche "LEVEL 5B" weiter unten)
#   Teil C: Entferne die # im Bereich "repeat_forever"
#           (suche "LEVEL 5C" weiter unten)
#
# WICHTIG: Alle 3 Teile (A, B, C) müssen aktiv sein!
#
# ERGEBNIS: Ein Labyrinth! Bewege den roten Ball mit W/A/S/D
#           zum Ziel. Wenn du es schaffst: "YOU WIN!"
# ================================================================

# --- Teil A: Wände und Ziel (8 Zeilen) ---
# wand1 = play.new_box(color='dark gray', x=-100, y=50, width=200, height=15)
# wand2 = play.new_box(color='dark gray', x=100, y=-50, width=200, height=15)
# wand3 = play.new_box(color='dark gray', x=-150, y=-120, width=15, height=150)
# wand4 = play.new_box(color='dark gray', x=150, y=80, width=15, height=150)
# wand5 = play.new_box(color='dark gray', x=0, y=140, width=300, height=15)
# wand6 = play.new_box(color='dark gray', x=50, y=-150, width=150, height=15)
# physik_spieler = play.new_circle(color='red', x=-200, y=-180, radius=15, border_color='orange')
# ziel = play.new_text(words='ZIEL', x=200, y=170, font=None, font_size=25, color='green')


# ================================================================
# LEVEL 6 — SLOT MACHINE
# ================================================================
# Dieses Level ist unabhängig von Level 2-5.
# Es hat eigene Spielfiguren!
#
# AUFGABE: Mache 2 Dinge:
#
#   Teil A: Entferne die # vor den nächsten 11 Zeilen
#           (die Slot-Machine Oberfläche)
#   Teil B: Entferne die # vor dem gesamten Block
#           "@slot_button.when_clicked" weiter unten
#           (suche "LEVEL 6B" — 12 Zeilen)
#
# WICHTIG: Beide Teile (A und B) müssen aktiv sein!
#
# ERGEBNIS: Klicke auf den gelben "SPIN!" Button.
#           3 Zufallszahlen erscheinen. Wenn alle gleich
#           sind, gewinnst du!
# ================================================================

# --- Teil A: Slot Machine Oberfläche (11 Zeilen) ---
# slot_feld1 = play.new_box(color='light green', x=-150, y=-120, width=80, height=120, border_width=3, border_color='green')
# slot_feld2 = play.new_box(color='light green', x=-50, y=-120, width=80, height=120, border_width=3, border_color='green')
# slot_feld3 = play.new_box(color='light green', x=50, y=-120, width=80, height=120, border_width=3, border_color='green')
# slot_zahl1 = play.new_text(words='?', x=-150, y=-120, font=None, font_size=60)
# slot_zahl2 = play.new_text(words='?', x=-50, y=-120, font=None, font_size=60)
# slot_zahl3 = play.new_text(words='?', x=50, y=-120, font=None, font_size=60)
# slot_button = play.new_box(color='yellow', x=-50, y=-210, width=120, height=40)
# slot_button_text = play.new_text(words='SPIN!', x=-50, y=-210, font=None, font_size=25)
# slot_ergebnis = play.new_text(words='', x=-50, y=-265, font=None, font_size=22, color='white')
# slot_titel = play.new_text(words='--- Slot Machine ---', x=-50, y=-50, font=None, font_size=22, color='orange')
# slot_info = play.new_text(words='Klicke SPIN!', x=-50, y=-75, font=None, font_size=14, color='gray')


# ================================================================
#   AB HIER: PROGRAMM-LOGIK
#   (Hier passieren die Aktionen)
# ================================================================

@play.when_program_starts
def start():
    titel.words = 'Python Spiele-Kurs'
    anleitung.words = 'Folge den Aufgaben in der Datei!'

    # --- LEVEL 5B: Physik einschalten (7 Zeilen) ---
    # physik_spieler.start_physics(bounciness=0.2)
    # wand1.start_physics(can_move=False)
    # wand2.start_physics(can_move=False)
    # wand3.start_physics(can_move=False)
    # wand4.start_physics(can_move=False)
    # wand5.start_physics(can_move=False)
    # wand6.start_physics(can_move=False)


# --- LEVEL 6B: Slot Machine Klick-Aktion (12 Zeilen) ---
# @slot_button.when_clicked
# async def spin():
#     zahl1 = randint(0, 9)
#     zahl2 = randint(0, 9)
#     zahl3 = randint(0, 9)
#     slot_zahl1.words = str(zahl1)
#     slot_zahl2.words = str(zahl2)
#     slot_zahl3.words = str(zahl3)
#     if zahl1 == zahl2 and zahl2 == zahl3:
#         slot_ergebnis.words = 'GEWONNEN!!!'
#         slot_ergebnis.color = 'yellow'
#     else:
#         slot_ergebnis.words = 'Verloren... nochmal!'
#         slot_ergebnis.color = 'red'
#     await play.timer(seconds=2.0)
#     slot_ergebnis.words = ''


frames = 48  # Bildwiederholrate (48 Bilder pro Sekunde)
step = 10    # Bewegungsgeschwindigkeit für Level 5

@play.repeat_forever
async def do():
    global score

    # --- LEVEL 3: Bewegung einschalten (8 Zeilen) ---
    # if play.key_is_pressed('up'):
    #     spieler.y += 5
    # if play.key_is_pressed('down'):
    #     spieler.y -= 5
    # if play.key_is_pressed('left'):
    #     spieler.x -= 5
    # if play.key_is_pressed('right'):
    #     spieler.x += 5

    # --- LEVEL 4: Grenzen einschalten (5 Zeilen) ---
    # if abs(spieler.x) > w or abs(spieler.y) > h:
    #     spieler.x = 0
    #     spieler.y = 0
    #     score += 1
    #     punkte_anzeige.words = 'Punkte: ' + str(score)

    # --- LEVEL 5C: Physik-Steuerung (9 Zeilen) ---
    # physik_spieler.physics.x_speed = 0
    # physik_spieler.physics.y_speed = 0
    # if play.key_is_pressed('w'):
    #     physik_spieler.physics.y_speed = step
    # if play.key_is_pressed('s'):
    #     physik_spieler.physics.y_speed = -1 * step
    # if play.key_is_pressed('a'):
    #     physik_spieler.physics.x_speed = -1 * step
    # if play.key_is_pressed('d'):
    #     physik_spieler.physics.x_speed = step

    # --- LEVEL 5C (Fortsetzung): Ziel erreicht? (5 Zeilen) ---
    # if physik_spieler.is_touching(ziel) and ziel.words != 'YOU WIN!':
    #     ziel.words = 'YOU WIN!'
    #     ziel.font_size = 60
    #     ziel.color = 'yellow'
    #     ziel.x = 0

    await play.timer(seconds=1/frames)


# ================================================================
# PROGRAMM STARTEN — Diese Zeile NICHT ändern oder löschen!
# ================================================================
play.start_program()

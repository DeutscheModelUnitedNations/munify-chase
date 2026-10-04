---
sidebar_position: 13
title: KI-Unterstützung
description: Welche KI-Funktionen dem Vorsitz zur Verfügung stehen und wie die Einstellung gesteuert wird
---

# KI-Unterstützung

CHASE kann optional KI für die Arbeit an Resolutionen einsetzen. Als Vorsitz begegnet dir das an zwei Stellen:

- **Nach dem Annehmen eines Änderungsantrags**: Ändern andere eingereichte Änderungsanträge denselben Absatz, schlägt CHASE vor, welche davon jetzt wahrscheinlich überholt sind und wie die übrigen umformuliert werden könnten, damit sie zum neuen Text passen. Jeden Vorschlag bestätigst oder änderst du selbst.
- **In der Warteschlange für Änderungsanträge**: Eine optionale KI-Rangfolge sortiert offene Textänderungen danach, wie bedeutend ihre Auswirkung erscheint. Dafür braucht es mindestens zwei eingereichte Textänderungen.

Wenn du zum ersten Mal als Vorsitz ein Papier öffnest, fragt dich der Dialog **KI-Funktionen**, wie die KI laufen soll:

![Der KI-Einführungsdialog mit Backend, Lokal (Browser) oder Aus als KI-Modus](shot:chair/ai-onboarding-modal)

- **Backend (empfohlen)**: der Server übernimmt die Arbeit. Das geht nur, wenn auf deinem Server ein KI-Anbieter eingerichtet ist, sonst steht dort "Backend (auf diesem Server nicht konfiguriert)".
- **Lokal (Browser)**: führt ein Modell auf deinem eigenen Gerät aus. Dafür ist WebGPU nötig, und unter **Leistung des lokalen Modells** wählst du das Modell (**Automatisch (empfohlen)**, **Schnellstes** oder **Beste Qualität**).
- **Aus**: keine KI-Funktionen.

Deine Wahl kannst du jederzeit über den Button **KI-Einstellungen** (Roboter-Symbol) im Kopfbereich eines Papiers ändern.

## Wichtig: eine persönliche Einstellung, keine Konferenzeinstellung

Delegierte nutzen KI-Funktionen überhaupt nicht. Es sind reine Vorsitz-Werkzeuge für die Prüfung von Änderungsanträgen. Einen konferenz- oder gremienweiten Schalter zum An- oder Ausschalten gibt es nicht. Jedes Mitglied des Vorsitzes legt seine eigene KI-Einstellung fest, und sie wird auf dem eigenen Gerät gespeichert. Willst du KI-Unterstützung bei der Prüfung von Änderungsanträgen, stelle sicher, dass _du persönlich_ sie aktiviert hast.

Ob die Option **Backend** verfügbar ist, entscheidet, wer deinen CHASE-Server betreibt. Soll KI in deiner ganzen Organisation ausgeschaltet sein, sprich mit den technischen Verantwortlichen deiner Konferenz.

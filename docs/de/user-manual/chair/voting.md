---
sidebar_position: 6
title: Abstimmungen durchführen
description: Abstimmungen per Handzeichen, mündliche und geräte-basierte Abstimmungen einrichten und durchführen
---

# Abstimmungen durchführen

Auf der Seite **Abstimmung** (Alt+4) richtest du jede Abstimmung ein und führst sie durch. Mit **Alt+V** öffnest du dasselbe Setup auch von jeder anderen Vorsitzseite. Läuft bereits eine Abstimmung (vielleicht von einem anderen Gerät gestartet), siehst du den Hinweis "Abstimmung läuft" mit einem Button **Abstimmung fortsetzen**, der sie mit ihren ursprünglichen Einstellungen wieder öffnet.

## Eine Abstimmung einrichten

1. **Abstimmungsart**: wähle **Abstimmung per Handzeichen**, **Mündliche Abstimmung** oder **Geräte-basierte Abstimmung** (in der Offline-Demo nicht verfügbar).
2. **Mehrheitseinstellungen**: **Einfach**, **Absolut** oder **Zwei-Drittel**, dazu **Keine Enthaltungen** oder **Enthaltungen**.
3. Nur bei einer geräte-basierten Abstimmung: lege das **Abstimmungsfenster (Sekunden)** fest (5 bis 300, Standard 20). So lange haben Delegierte Zeit, ihre Stimme auf dem eigenen Gerät abzugeben.
4. **Name der Abstimmung**: wähle eine Vorlage oder tippe einen eigenen. Er wird allen angezeigt. Bleibt das Feld leer, lautet er "Abstimmung".
5. Klicke auf **Abstimmung starten**.

![Das Formular zur Einrichtung einer Abstimmung mit Abstimmungsart, Mehrheitseinstellungen und Namen der Abstimmung](shot:chair/voting-setup)

:::live chair/voting

## Abstimmung per Handzeichen

Führt nacheinander durch **Dafür**, **Dagegen**, **Enthaltung** (falls aktiviert) und die Auswertung. Zähle in jedem Schritt die gehobenen Stimmkarten:

- Leertaste oder ↑ zählt eins dazu, ↓ zieht eins ab. Du kannst die Zahl auch ins Feld tippen.
- Enter oder **Weiter** geht zum nächsten Schritt. Bei der letzten Zählung wird der Button zu **Veröffentlichen** und danach, sobald du das Ergebnis gesehen hast, zu **Schließen**.
- Rücktaste oder **Zurück** führt zum vorherigen Schritt.
- Esc bricht die Abstimmung ohne Ergebnis ab.

Ein Fortschrittsbalken vergleicht deine Zählung mit der Anzahl anwesender Delegationen. Er warnt dich, wenn du mehr Stimmen gezählt hast, als Personen da sind, oder bestätigt eine Übereinstimmung.

![Eine laufende Abstimmung per Handzeichen mit Zählung der Stimmen Dafür und Dagegen](shot:chair/voting-show-of-hands)

## Mündliche Abstimmung

Derselbe Durchlauf durch alle Delegationen wie bei der Anwesenheitsfeststellung, nur dass eine Stimme erfasst wird: **Dagegen** (`J`), **Enthaltung** (`K`, falls erlaubt), **Dafür** (`L`). Aufgerufen werden nur Delegationen, die als anwesend markiert sind. Jede Auswahl springt automatisch zur nächsten Delegation. Ein Live-Diagramm der Ergebnisse aktualisiert sich fortlaufend, und nach der letzten Delegation landest du bei der Auswertung mit **Schließen**. Esc vor dem Ende bricht die Abstimmung ab.

## Geräte-basierte Abstimmung

Hier gibst du selbst nichts ein. Delegierte stimmen auf ihrem eigenen Gerät ab, wo die Abstimmung automatisch aufpoppt. Abstimmen können nur Delegationen, die als anwesend markiert sind. Dein Bildschirm zeigt einen Live-Countdown, eine Liste derer, die noch nicht abgestimmt haben, und (sobald der Countdown endet) das Ergebnis mit einem Button **Schließen**. Du kannst den Countdown nicht vorzeitig beenden, um die Ergebnisse zu sehen. Schließt du das Fenster vor Ablauf des Countdowns, wird die Abstimmung abgebrochen.

## Ergebnisse lesen

Das Ergebnis (**Angenommen** / **Abgelehnt**) wird automatisch anhand der gewählten Mehrheit bestimmt:

- **Abstimmung per Handzeichen**: die Mehrheit wird aus den gezählten Stimmen berechnet. **Einfach** und **Zwei-Drittel** nutzen Dafür plus Dagegen. **Absolut** zählt auch die Enthaltungen mit.
- **Mündliche und geräte-basierte Abstimmung**: die Mehrheit wird aus den als anwesend markierten Delegationen berechnet. **Einfach** lässt Enthaltungen außen vor. **Absolut** und **Zwei-Drittel** nutzen die anwesenheitsbasierten Mehrheiten des Gremiums aus der Karte **Mehrheiten**.

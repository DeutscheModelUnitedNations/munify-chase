---
sidebar_position: 4
title: Anwesenheitsfeststellung & Anwesenheit
description: Anwesenheit erfassen, Anwesenheitsfeststellungen durchführen und NA-Badges scannen
---

# Anwesenheitsfeststellung & Anwesenheit

Auf der Seite **Anwesenheit** (Alt+2) behältst du im Blick, wer im Raum ist.

![Die Anwesenheitsseite des Vorsitzes mit Anwesenheitsfeststellung, Delegationsschaltern und NA-Anwesenheitsscanner](shot:chair/presence-page)

:::live chair/presence

## Anwesenheitsfeststellung

Klicke auf **Anwesenheitsfeststellung**, um einen Vollbild-Durchlauf zu öffnen, der jede Delegation einzeln abfragt:

- **Anwesend** (`L`) oder **Abwesend** (`J`). Beide Markierungen springen automatisch zur nächsten Delegation.
- Mit den Pfeiltasten nach oben und unten springst du bei Bedarf hin und her.
- Nach der letzten Delegation erscheint "Anwesenheitsfeststellung abgeschlossen", und der Durchlauf schließt sich.
- Esc schließt den Durchlauf. Das Schließen beendet die Anwesenheitsfeststellung, zieh sie also in einem Rutsch durch.

Ist auf einem anderen Gerät noch eine Anwesenheitsfeststellung offen, zeigt die Seite Anwesenheit stattdessen "Anwesenheitsfeststellung läuft (Mitglied X / Y)" und einen Button **Anwesenheitsfeststellung fortsetzen**.

Jede Anwesenheitsfeststellung wird protokolliert. Die Liste **N vergangene Anwesenheitsfeststellung(en)** auf der Seite Anwesenheit zeigt, wann jede begann und endete, wer sie durchgeführt hat und wie viele im Verhältnis zur Gesamtzahl anwesend waren.

## Schnelle Anwesenheitsschalter

Jede Zeile unter **Delegationen** hat einen Schalter Anwesend/Abwesend. So korrigierst du einen einzelnen Eintrag, ohne eine ganz neue Anwesenheitsfeststellung zu starten. **Alle Anwesend setzen** und **Alle Abwesend setzen** ändern alle Delegationen auf einmal. **UN-Akteure** werden nur zur Information aufgelistet und haben keinen Schalter.

## Warum die Anwesenheit wichtig ist

Jemanden als anwesend zu markieren ist mehr als Buchführung. Es entscheidet direkt darüber, ob sich die Person selbst auf eine Redeliste setzen oder auf ihrem Gerät abstimmen kann, und es fließt in die live berechneten Mehrheiten ein, die überall in der Vorsitzoberfläche angezeigt werden.

## NA-Badges scannen

Die Karte **NA-Anwesenheit** listet alle, die gerade in deinem Gremium eingecheckt sind, jeweils mit "Eingecheckt seit HH:MM". Klicke auf **NA-Person scannen**, um die Scanner-Schublade zu öffnen:

1. Wähle **Einchecken** oder **Auschecken**.
2. Scanne das gedruckte QR-Badge mit deiner Kamera, oder nutze **Code manuell eingeben** mit dem 6-stelligen Code, falls das Scannen fehlschlägt.
3. Ein laufendes Protokoll zeigt die letzten 10 Scans (grün mit Namen bei Erfolg, rot bei einem Fehler), dazu ein Tonsignal (hoher Ton bei Erfolg, tiefer Ton bei einem Fehler).

Wer eingecheckt wird, wird automatisch aus jedem anderen Gremium ausgecheckt. Auschecken funktioniert auch, wenn die Person gerade woanders eingecheckt ist. Das Protokoll sagt dann, dass sie aus einem anderen Gremium ausgecheckt wurde. Die NA-Karte ist in der Offline-Demo nicht verfügbar.

## Konferenzweites Anwesenheits-Dashboard

Eine eigene Seite **Anwesenheit** (Avatar-Menü, außerhalb eines einzelnen Gremiums) bietet einen konferenzweiten Überblick, nützlich für das Sekretariat genauso wie für den Vorsitz. Sie hat vier Reiter:

- **Nicht anwesend**: NAs, die gerade nirgends eingecheckt sind, und abwesende Delegierte, gruppiert nach Gremium. Dieser Reiter öffnet sich zuerst.
- **Nach Gremium**: Anwesenheitszahlen und Live-Check-ins der NAs pro Gremium. Wer länger als 4 Stunden ohne Check-out eingecheckt ist (wahrscheinlich ein vergessener Badge-Scan), wird markiert.
- **Nach NA**: jeder NA mit Status und QR-Karte, dazu **Alle Karten drucken** und **CSV exportieren**.
- **NA-Historie & Korrekturen**: das vollständige NA-Anwesenheitsprotokoll mit Filtern, einem Button **Eintrag hinzufügen** und einem Bearbeiten-Button pro Zeile für Korrekturen.

Admins exportieren die Anwesenheit für MUNify DELEGATOR mit **Für MUNify Delegator herunterladen** auf der Seite Statistiken.

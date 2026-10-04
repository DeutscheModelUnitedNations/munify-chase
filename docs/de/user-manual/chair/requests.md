---
sidebar_position: 7
title: Anträge
description: Von Delegierten und NAs gestellte Anträge empfangen und erledigen
---

# Anträge

Sind Anträge aktiviert, schicken Delegierte und nichtstaatliche Akteure Anträge (zum Beispiel ein Recht auf Information oder eine Mündliche Abstimmung) von ihrem eigenen Gerät an den Vorsitz. Du bearbeitest sie auf der Seite **Anträge**.

![Die Anträge-Seite des Vorsitzes mit ausstehenden Anträgen und den Schaltflächen Erledigen und Antrag zurückziehen](shot:chair/requests-page)

## Anträge aktivieren

Stelle auf der Seite [Setup](./committee-setup) die Karte **Anträge** auf **An**. Standardmäßig ist sie aus, und in der Offline-Demo steht sie nicht zur Verfügung.

Sobald sie aktiviert ist, erscheint im Dock direkt nach **Abstimmung** ein Tab **Anträge** (Hand-Symbol). Er bekommt Alt+5, und **Resolutionen** wandert auf Alt+6.

Schaltest du sie wieder aus, verschwindet der Tab, Delegierte verlieren ihre Karte **Anträge** und neue Anträge werden abgewiesen. Erledige vorher alle offenen Anträge, denn Delegierte können sie nicht mehr zurückziehen, sobald die Karte weg ist.

## Welche Anträge es gibt

Die Liste der Antragsarten gilt für die ganze Konferenz und wird von Admins unter **Konfiguration**, Tab **Anträge**, verwaltet. Siehe [Antragsarten](../admin/requests). Der Vorsitz kann sie nicht ändern.

- **Standardset laden** fügt die 15 DMUN-Standardanträge hinzu. Recht auf Information, Recht auf Wiederherstellung der Ordnung, Recht auf Klärung eines Missverständnisses, Mündliche Abstimmung und Informelle Sitzung stehen allen offen. Die übrigen Geschäftsordnungsanträge sind als **Nur Delegierte** markiert.
- NAs sehen Antragsarten mit der Markierung **Nur Delegierte** nie.
- Die Reihenfolge, die Admins den Antragsarten geben, bestimmt die Sortierung der Anträge auf deiner Seite.

## Benachrichtigungen

Jeder neue Antrag öffnet einen Hinweis **Neuer Antrag** mit dem Namen des Antrags, wer ihn gestellt hat und einem Link **Anträge ansehen**. Er bleibt, bis du ihn schließt, und schließt sich von selbst, sobald der Antrag erledigt oder zurückgezogen ist, ob von dir oder einem anderen Mitglied des Vorsitzes. Anträge, die schon warteten, als du das Gremium geöffnet hast, erscheinen nicht als Hinweis.

Solange etwas aussteht, zeigt das Anträge-Symbol im Dock einen pulsierenden roten Punkt.

![Ein Hinweis Neuer Antrag in der Vorsitzoberfläche mit einem Link Anträge ansehen](shot:chair/request-toast)

## Die Warteschlange abarbeiten

Jeder ausstehende Antrag zeigt sein Symbol und seinen Namen, Flagge und Namen der Delegation oder des NA (mit dem eigenen Namen der Person in Klammern, falls er abweicht) und den Zeitpunkt, zu dem er gestellt wurde. Die Liste ist nach Antragsart in der Reihenfolge der Admins sortiert, danach die ältesten zuerst.

- **Erledigen** markiert den Antrag als bearbeitet.
- **Antrag zurückziehen** verwirft ihn im Namen der antragstellenden Person, zum Beispiel wenn er sich erledigt hat.

Beides aktualisiert sich live für den gesamten Vorsitz und die antragstellende Person. Ist noch nichts eingegangen, zeigt die Seite "Keine ausstehenden Anträge."

## Verlauf

Die Liste **N kürzliche Anträge** unter der Warteschlange zeigt die letzten 20 erledigten oder zurückgezogenen Anträge, jeweils mit einem Badge **Erledigt** oder **Zurückgezogen** und der Uhrzeit.

## Was Delegierte sehen

Delegierte und NAs bekommen auf ihrer Gremienseite eine Karte **Anträge** mit einer Schaltfläche **Antrag stellen**, einer durchsuchbaren Liste der Antragsarten und ihren eigenen ausstehenden Anträgen, jeweils mit einer Schaltfläche zum Zurückziehen. Jede Person kann pro Antragsart nur einen ausstehenden Antrag gleichzeitig haben. Delegierte können Anträge nur an ihr eigenes Gremium stellen, NAs an jedes Gremium der Konferenz. Beobachter:innen können keine Anträge stellen. Anträge erscheinen nicht auf dem Präsentationsbildschirm.

Siehe [Anträge für Teilnehmende](../participant/requests) für ihre Seite.

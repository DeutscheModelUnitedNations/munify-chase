---
sidebar_position: 7
title: Anträge
description: Von Delegierten und NAs gestellte Anträge empfangen und erledigen
---

# Anträge

Sind Anträge aktiviert, schicken Delegierte und nichtstaatliche Akteure Anträge (zum Beispiel ein Recht auf Information oder eine Mündliche Abstimmung) von ihrem eigenen Gerät an den Vorsitz. Du bearbeitest sie auf der Seite **Anträge**, wo du auch selbst Anträge hinzufügen kannst.

![Die Anträge-Seite des Vorsitzes mit ausstehenden Anträgen und den Schaltflächen Erledigen und Antrag zurückziehen](shot:chair/requests-page)

## Anträge aktivieren

Stelle auf der Seite [Setup](./committee-setup) die Karte **Anträge** auf **An**. Standardmäßig ist sie aus, und in der Offline-Demo steht sie nicht zur Verfügung.

Sobald sie aktiviert ist, erscheint im Dock direkt nach **Abstimmung** ein Tab **Anträge** (Hand-Symbol). Er bekommt Alt+5, und **Resolutionen** wandert auf Alt+6.

Schaltest du sie wieder aus, verschwindet der Tab, Delegierte verlieren ihre Karte **Anträge** und neue Anträge werden abgewiesen. Erledige vorher alle offenen Anträge, denn Delegierte können sie nicht mehr zurückziehen, sobald die Karte weg ist.

## Welche Anträge es gibt

Die Liste der Antragsarten gilt für die ganze Konferenz und wird von Admins unter **Konfiguration**, Tab **Anträge**, verwaltet. Siehe [Antragsarten](../admin/requests). Der Vorsitz kann sie nicht ändern.

- **Standardset laden** fügt die 15 DMUN-Standardanträge hinzu. Recht auf Information, Recht auf Wiederherstellung der Ordnung, Recht auf Klärung eines Missverständnisses, Mündliche Abstimmung und Informelle Sitzung stehen allen offen. Die übrigen Geschäftsordnungsanträge sind als **Nur Delegierte** markiert.
- NAs sehen Antragsarten mit der Markierung **Nur Delegierte** nie.
- Die Reihenfolge, die Admins den Antragsarten geben, bestimmt die Sortierung der Anträge auf deiner Seite und auf dem Präsentationsbildschirm.

## Benachrichtigungen

Jeder neue Antrag öffnet einen Hinweis **Neuer Antrag** mit dem Namen des Antrags, wer ihn gestellt hat und einem Link **Anträge ansehen**. Er bleibt, bis du ihn schließt, und schließt sich von selbst, sobald der Antrag erledigt oder zurückgezogen ist, ob von dir oder einem anderen Mitglied des Vorsitzes. Anträge, die schon warteten, als du das Gremium geöffnet hast, erscheinen nicht als Hinweis.

Solange etwas aussteht, zeigt das Anträge-Symbol im Dock einen pulsierenden roten Punkt.

![Ein Hinweis Neuer Antrag in der Vorsitzoberfläche mit einem Link Anträge ansehen](shot:chair/request-toast)

## Anträge selbst hinzufügen

Nicht alle nutzen ihr Gerät. Wird im Saal ein Länderschild gehoben, reihst du den Antrag mit der Karte **Antrag hinzufügen** über der Warteschlange selbst ein.

Die Karte zeigt zwei Listen nebeneinander: links alle Delegationen und NAs, rechts alle Antragsarten in der Reihenfolge der Admins. Du kannst darin scrollen oder sie mit dem Suchfeld über jeder Liste eingrenzen.

1. Klicke auf die Delegation oder den NA.
2. Klicke auf die Antragsart.
3. Klicke auf **Antrag hinzufügen**. Der Button bleibt deaktiviert, bis beides gewählt ist.

Per Tastatur: Alt+R (oder **Antrag hinzufügen** in der Befehlspalette) springt in die Delegationssuche. Tippe ein paar Buchstaben und drücke Enter für den besten Treffer, mach dasselbe für die Antragsart und drücke dann noch einmal Enter, um den Antrag einzureihen.

Arten, die für den Sitz schon ausstehen, auch solche, die die Delegation selbst gestellt hat, sind mit "Bereits ausstehend" markiert und lassen sich nicht noch einmal hinzufügen. NAs bekommen keine Arten mit **Nur Delegierte**. Das klappt für jeden Sitz im Gremium, auch für Delegationen ohne Konto oder ohne Anmeldung.

## Die Warteschlange abarbeiten

Jeder ausstehende Antrag zeigt sein Symbol und seinen Namen, Flagge und Namen der Delegation oder des NA (mit dem eigenen Namen der Person in Klammern, falls er abweicht) und den Zeitpunkt, zu dem er gestellt wurde. Anträge, die du oder jemand anderes aus dem Vorsitz hinzugefügt hat, tragen ein kleines Stift-Symbol neben dem Namen ("Vom Vorsitz hinzugefügt"). Die Liste ist nach Antragsart in der Reihenfolge der Admins sortiert, danach die ältesten zuerst.

- **Erledigen** markiert den Antrag als bearbeitet.
- **Antrag zurückziehen** verwirft ihn, zum Beispiel wenn er sich erledigt hat.

Beides funktioniert gleich für Anträge, die eine Delegation gestellt hat, und für Anträge vom Vorsitz, und aktualisiert sich live für den gesamten Vorsitz und die antragstellende Person. Ist noch nichts eingegangen, zeigt die Seite "Keine ausstehenden Anträge."

## Verlauf

Die Liste **N kürzliche Anträge** unter der Warteschlange zeigt die letzten 20 erledigten oder zurückgezogenen Anträge, jeweils mit einem Badge **Erledigt** oder **Zurückgezogen** und der Uhrzeit.

## Was Delegierte sehen

Delegierte und NAs bekommen auf ihrer Gremienseite eine Karte **Anträge** mit einer Schaltfläche **Antrag stellen**, einer durchsuchbaren Liste der Antragsarten und ihren eigenen ausstehenden Anträgen, jeweils mit einer Schaltfläche zum Zurückziehen. Jede Person kann pro Antragsart nur einen ausstehenden Antrag gleichzeitig haben. Delegierte können Anträge nur an ihr eigenes Gremium stellen, NAs an jedes Gremium der Konferenz. Beobachter:innen können keine Anträge stellen. Einen Antrag, den der Vorsitz hinzugefügt hat, sieht die Delegation nicht in ihrer eigenen Karte.

Ausstehende Anträge erscheinen außerdem in einer eigenen Kachel auf dem Präsentationsbildschirm, außer du stellst **Anträge anzeigen** auf der Seite [Setup](./committee-setup) aus. Siehe [Präsentationsansicht](./presentation-mode).

Siehe [Anträge für Teilnehmende](../participant/requests) für ihre Seite.

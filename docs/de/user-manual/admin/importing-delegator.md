---
sidebar_position: 8
title: Import aus DELEGATOR
description: Eine Konferenz aus einem MUNify-DELEGATOR-Export anlegen oder von Grund auf neu
---

# Import aus DELEGATOR

Neue Konferenzen in CHASE durchlaufen denselben Assistenten, egal ob du Daten aus MUNify DELEGATOR (dem Schwesterprodukt für die Anmeldung) übernimmst oder bei null anfängst. Ausfüllen kann ihn jede Person, die Konferenz anlegen können am Ende aber nur Global Admins.

## Den Assistenten starten

Klicke im Launcher auf **Konferenz erstellen** (oder **Aus DELEGATOR-Datei importieren**). Du wählst zwischen:

- **Datei hochladen**: ein DELEGATOR-JSON-Export oder eine zuvor gespeicherte JSON-Datei (**JSON-Datei wählen** oder eine .json-Datei auf die Seite ziehen).
- **Neu beginnen**: eine leere Konferenz, in der jeder UN-Mitgliedstaat sofort als mögliche Delegation bereitsteht, fertig zum Zuweisen und Konfigurieren von Hand.

Bist du kein Global Admin, erklärt ein Hinweis, dass du die Datei vorbereiten, aber nicht anwenden kannst.

![Der Bildschirm "Wie möchtest du beginnen?" mit den Optionen Datei hochladen und Neu beginnen](shot:admin/import-start)

## Schritte

1. **Wie heißt deine Konferenz?**: Titel, Start- und Enddatum, Veranstaltungsort. Unter **Konferenz-ID** kannst du die ID aus DELEGATOR übernehmen. Sonst lass die generierte stehen.
2. **Gremien**: lege deine Gremien an und füge mit **Punkt hinzufügen** ihre Punkte der **Tagesordnung** hinzu.
3. **Delegationen**: prüfe importierte Delegationen oder nutze **Land hinzufügen** bei einem Gremium, um Delegationen über denselben Ländercode-Dialog wie in Mission Control hinzuzufügen.
4. **Weitere Akteure**: nichtstaatliche Akteure und UN-Akteure. Diese sind optional.
5. **Anträge**: die Antragstypen, die Delegierte an den Vorsitz schicken können. Nutze **Standardset laden** oder **Antrag hinzufügen** und stelle **Aktiviert** und **Nur Delegierte** pro Typ ein. Alles lässt sich später im Reiter [Anträge](./requests) ändern.
6. **Bearbeiten**: eine Zusammenfassung der ganzen Konferenz mit allen Hinweisen, jeweils mit einem Button **Springen** zum Schritt, der korrigiert werden muss.

![Schritt 1 des Import-Assistenten, der nach Konferenztitel, Daten und Veranstaltungsort fragt](shot:admin/import-wizard-basics)

![Der Schritt Anträge im Import-Assistenten mit geladenen Standard-Antragstypen](shot:admin/import-wizard-requests)

Mit **Zurück** und **Weiter** unten wechselst du zwischen den Schritten, oder du klickst oben in der Schrittleiste auf einen beliebigen Schritt. **JSON ansehen** in der oberen Leiste zeigt dir währenddessen die Rohdaten des Imports, und **Speichern** lädt sie als JSON-Datei herunter. Das ist praktisch, um deinen Fortschritt zu sichern oder einen Import zu debuggen, der sich nicht wie erwartet verhält.

## Prüfungen vor dem Abschließen

Diese Probleme verhindern das Anlegen der Konferenz:

- der Konferenztitel fehlt,
- es gibt keine Gremien,
- ein Gremium hat keinen Namen oder keine Abkürzung,
- zwei Gremien haben denselben Namen oder dieselbe Abkürzung.

Ein Gremium ohne Delegationen erzeugt nur eine Warnung.

## Abschließen

Im letzten Schritt **Bearbeiten** klicken Global Admins auf **Konferenz erstellen**. Du landest direkt im Launcher, wo deine neue Konferenz nun erscheint. Alle können mit **Als JSON herunterladen** die Datei speichern, zum Beispiel um sie einem Global Admin zu geben, der sie anwenden kann.

---
sidebar_position: 8
title: Resolutionen verwalten
description: Ein Papier durch seinen Lebenszyklus führen, Absatzabstimmungen durchführen und Snapshots nutzen
---

# Resolutionen verwalten

Die Seite **Resolutionen** (Alt+5, oder Alt+6 bei aktivierten Anträgen) listet die Papiere des **aktiven Tagesordnungspunkts**, sortiert nach Anzahl der Unterstützerstaaten, mit Tabs zum Filtern nach Status. In der Offline-Demo steht sie nicht zur Verfügung.

Oben steuerst du drei Schalter für das gesamte Gremium: **Änderungsanträge einreichen** und **Änderungsanträge unterstützen** legen fest, ob Delegierte gerade neue Änderungsanträge einreichen oder bestehende unterstützen können. **Unterstützungs-Neubewertung** ist für die Phase gedacht, in der Delegierte ihre Unterstützung ändern dürfen. Dieselben Schalter findest du auch hinter dem Zahnrad-Symbol in jedem Papier.

## Ein Papier erstellen

**Papier erstellen** startet ein neues Arbeitspapier (dafür muss zuerst ein Tagesordnungspunkt aktiv sein). Wird ein Arbeitspapier eingereicht, erscheint es hier unter **Eingereichte Papiere**, und mit **Zum Resolutionsentwurf befördern** bringst du es einen Schritt weiter. Beim Befördern wird automatisch eine Dokumentennummer im Format `ABBR/II/DR.3` vergeben (Gremium, Tagesordnungspunkt, laufende Nummer), außer du legst selbst eine fest, solange das Papier eingereicht ist. Dafür gibt es das Stift-Symbol neben dem Titel.

Mit dem Stern-Button an einem Papier machst du es zum **aktiven Resolutionsentwurf** des Gremiums, also zu dem, der auf dem geteilten Präsentationsbildschirm erscheint. Ein erneuter Klick auf den Stern hebt das wieder auf.

![Die Resolutionenliste des Vorsitzes mit Phasenschaltern, Statusfiltern und der Aktion Zum Resolutionsentwurf befördern](shot:chair/resolutions-list)

## In einem Papier

Im Kopfbereich eines Papiers hat der Vorsitz diese Werkzeuge:

- **Absenden**: ein Arbeitspapier im Namen der Delegierten einreichen.
- **Freigabecodes**: einen **Bearbeitungscode** oder **Unterstützungscode** erstellen, mit dem andere Delegationen ein Arbeitspapier mitbearbeiten oder unterstützen können.
- **Unterstützerstaaten**: sehen, wer das Papier unterstützt, und mit **Sponsor hinzufügen** einen Unterstützerstaat ergänzen.
- Zahnrad-Symbol: die drei Phasenschalter von der Listenseite.
- **KI-Einstellungen** (Roboter-Symbol): deine persönliche KI-Einstellung, siehe [KI-Unterstützung](./ai-assistance).
- **Dokumentverlauf** (Uhr-Symbol): Snapshots, siehe unten.
- **Aktiv setzen** / **Aktuell Aktiv**: derselbe Stern wie auf der Listenseite.
- **PDF herunterladen** und **Typst-Quelle herunterladen**.

## Durch den Lebenszyklus

In einem Papier zeigt eine Schrittleiste: **Arbeitspapier**, **Eingereichte Papiere**, **Resolutionsentwürfe**, **Änderungsantragsphase**, **Abstimmung**, **Final**. Klicke auf den nächsten Schritt, um weiterzugehen, oder auf einen früheren, um zurückzugehen (das Zurückgehen musst du bestätigen).

![Ein Resolutionsentwurf im Schritt Abstimmung mit den Aktionen Absatzabstimmung starten und Abstimmung starten](shot:chair/resolution-voting-phase)

- **Beim Wechsel in die Änderungsantragsphase** wirst du zuerst gefragt, ob Einreichen, Unterstützen und Unterstützungs-Neubewertung automatisch geöffnet werden sollen (**Alles aktivieren**) oder ob deine aktuellen Schaltereinstellungen bleiben (**Einstellungen beibehalten**).
- **Beim Wechsel in die Abstimmung** springt CHASE zum ersten operativen Absatz, bereit für die Abstimmung Absatz für Absatz.
- **Beim Wechsel zu Final** bestätigst du den Schritt und wählst zwischen **Mit Konfetti abschließen 🎉** für einen feierlichen Moment auf dem Präsentationsbildschirm und **Ohne Konfetti abschließen** für einen ruhigeren Abschluss.

## Abstimmung Absatz für Absatz

Im Schritt Abstimmung ist der aktuelle Absatz hervorgehoben. Gehe mit **Als aktuellen Absatz festlegen** am nächsten Absatz weiter (wählst du einen Absatz außer der Reihe, musst du das erst bestätigen) und klicke dann auf **Absatzabstimmung starten** (oder **Abstimmung neu starten**, wenn du eine wiederholen musst). Die Abstimmungseinstellungen öffnen sich vorausgefüllt mit Handzeichen, einfacher Mehrheit und erlaubten Enthaltungen, und du kannst sie vor dem Start ändern. Das Ergebnis (**Angenommen**/**Abgelehnt**) wird pro Absatz festgehalten. Wird ein Absatz abgelehnt, fragt CHASE, ob er aus dem Dokument entfernt (**Absatz entfernen**) oder behalten werden soll (**Absatz behalten**).

![Der Dialog zur Einrichtung einer Absatzabstimmung, vorausgefüllt mit einem Namen für den gewählten Absatz](shot:chair/clause-vote-setup)

**Abstimmung starten** startet die Abstimmung über die Resolution als Ganzes. Die Einstellungen öffnen sich vorausgefüllt mit einer mündlichen Abstimmung, absoluter Mehrheit und erlaubten Enthaltungen, was du ändern kannst.

## Snapshots

Öffne den **Dokumentverlauf** (Uhr-Symbol) und klicke jederzeit auf **Aktuellen Stand speichern**, um das Dokument zu sichern. CHASE speichert außerdem automatisch Snapshots, wenn ein Änderungsantrag übernommen, das Papier eingereicht oder eine Abstimmung abgeschlossen wird. **Wiederherstellen** fragt vorher nach einer Bestätigung und sichert den aktuellen Stand, bevor es zurücksetzt.

## Nächste Schritte

- [Änderungsanträge prüfen](./amendments-review): Änderungsanträge während der Änderungsantragsphase annehmen, ablehnen und abgleichen

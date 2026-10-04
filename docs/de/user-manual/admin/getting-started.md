---
sidebar_position: 1
title: Erste Schritte
description: Zugang zu Mission Control, Admin-Berechtigungsstufen und die Offline-Demokonferenz
---

# Erste Schritte als Admin

## Zwei Ebenen von „Admin“

CHASE unterscheidet zwischen:

- **Konferenz-Admin**: die Rolle **Admin** für eine bestimmte Konferenz (vergeben über [Benutzer & Rollen](./users-roles)). Gibt vollen Konfigurationszugriff auf diese eine Konferenz.
- **Global-Admin**: ein Admin auf Plattformebene. Global-Admins können zusätzlich **komplett neue Konferenzen anlegen**, **Konferenzen löschen** und jede Konferenz konfigurieren, nicht nur die, zu denen sie ausdrücklich hinzugefügt wurden.

Global-Admin-Rechte kommen entweder aus einer Admin-Rolle bei deinem Login-Anbieter oder aus einer Freigabeliste für E-Mail-Adressen oder Domains. Beides richtet die Person ein, die eure CHASE-Instanz hostet. Wenn du CHASE selbst betreibst, schau in den [Self-Hosting-Guide](https://munify.cloud/chase/selfhost/getting-started).

## Der Launcher

Was du nach dem Login siehst, hängt von deiner Berechtigungsstufe ab.

- **Konferenz-Admins und Teammitglieder** sehen für jede ihrer Konferenzen eine Karte. Klicke auf **Konferenz öffnen**, um zum [Mission-Control-Dashboard](./mission-control) zu gelangen.
- **Global-Admins** sehen **Alle Konferenzen**, gruppiert nach **Aktiv**, **Bevorstehend** und **Vergangen**, mit einem Feld **Konferenzen durchsuchen…** oben. Jede Zeile hat ein Zahnrad-Symbol (**Konfigurieren**), das direkt die Konfiguration öffnet, und ein Menü **Mehr** (…) mit **Löschen**.

![Der Launcher für Global-Admins mit allen Konferenzen, gruppiert nach Aktiv, Bevorstehend und Vergangen](shot:admin/launcher-global-admin)

### Eine Konferenz löschen

Nur Global-Admins können eine Konferenz löschen. Öffne **Mehr** (…) in ihrer Zeile, wähle **Löschen** und tippe zur Bestätigung den genauen Konferenznamen ein. Das lässt sich nicht rückgängig machen und entfernt alle Daten dieser Konferenz.

## Zur Konfiguration

Innerhalb einer Konferenz findest du für Admins und Teammitglieder im Menü der oberen Leiste **Mission Control**, **Anwesenheit** und **Statistiken**. Admins bekommen außerdem **Konfiguration**, aufgeteilt in Reiter:

- **Allgemein**: Einstellungen für die ganze Konferenz (siehe [Konferenzeinstellungen](./conference-setup))
- **Benutzer**: Personen einladen und Rollen zuweisen (siehe [Benutzer & Rollen](./users-roles))
- **Gremien**: Gremien anlegen (siehe [Gremien & Delegationen](./committees-delegations))
- **Delegationen**: Länder bzw. Delegationen hinzufügen
- **Nichtstaatliche Akteure**: NAs und UN-Akteure einrichten (siehe [NA-Verwaltung](./nsa-management))
- **Anträge**: die Antragsarten, die Delegierte und NAs an den Vorsitz stellen können (siehe [Anträge](./requests))

:::tip
Der Hilfe-Button (?) in der oberen Leiste öffnet dieses Handbuch auf der Seite zu dem Bildschirm, auf dem du gerade bist. **Strg+K** (**⌘K** auf dem Mac) öffnet die Befehlssuche, mit der du auch direkt zu jedem Gremium, Reiter der Konfiguration oder Reiter der Anwesenheit springst.
:::

## Eine Konferenz anlegen

Neue Konferenzen legst du über denselben **Import**-Ablauf an, mit dem du auch Daten aus MUNify DELEGATOR übernimmst (siehe [Import aus DELEGATOR](./importing-delegator)). Global-Admins finden **Konferenz erstellen** und **Aus DELEGATOR-Datei importieren** unten im Launcher. Andere Nutzer:innen sehen ebenfalls **Konferenz erstellen**. Sie können den ganzen Assistenten ausfüllen, das Ergebnis aber nur als JSON-Datei herunterladen, die dann ein Global-Admin einspielt.

![Der Bildschirm „Wie möchtest du beginnen?“ mit den Optionen Datei hochladen und Neu beginnen sowie dem Hinweis, dass nur Global-Admins die Konferenz direkt anlegen können](shot:admin/import-start)

## Offline-Demokonferenz {#offline-demo-conference}

Du kannst CHASE ohne Konto ausprobieren. Klicke auf der CHASE-Startseite auf **Offline nutzen** oder **Offline-Konferenz starten** (beide mit **Beta** markiert). Damit öffnest du eine Demokonferenz namens „Local Demo Conference“ mit Beispielgremien und Delegationen, direkt in Mission Control, und du hast dort volle Admin-Rechte.

- Du brauchst keinen Login, und nichts wird an einen Server geschickt. Die Daten liegen nur in diesem Browser.
- Funktionen, die einen Server brauchen, sind ausgeblendet: der Reiter **Benutzer**, **Anwesenheit**, **Statistiken** und die Abstimmung über Geräte.
- Der Offline-Modus ist noch in der Beta und kann sich unerwartet verhalten.

## Nächste Schritte

- [Mission Control](./mission-control)
- [Konferenzeinstellungen](./conference-setup)
- [Gremien & Delegationen](./committees-delegations)
- [NA-Verwaltung](./nsa-management)
- [Anträge](./requests)
- [Benutzer & Rollen](./users-roles)
- [Import aus DELEGATOR](./importing-delegator)

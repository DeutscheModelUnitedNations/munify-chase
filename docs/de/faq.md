---
sidebar_position: 10
title: FAQ
description: Häufig gestellte Fragen zu MUNify CHASE
---

# Häufig gestellte Fragen

## Kann ich CHASE für meine Konferenz außerhalb von DMUN nutzen?

Ja. Wir befürworten und erlauben die Nutzung für andere Konferenzen. Details findest du in der [Lizenz](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/LICENSE).

Das Projekt wird noch aktiv weiterentwickelt, deshalb empfehlen wir, vor dem Einsatz bei einer Konferenz mit uns Rücksprache zu halten. Die App wurde bereits auf mehreren DMUN-Konferenzen getestet. Bei Interesse melde dich über die [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). Wir helfen gern, solange die Nutzung unserem gemeinnützigen Gedanken entspricht.

CHASE ist in erster Linie auf die Geschäftsordnung von DMUN ausgelegt. Falls du Anpassungen an die Regeln deiner Konferenz brauchst, melde dich gern bei uns.

## Könnt ihr CHASE für uns hosten?

Ja! Wenn euch Self-Hosting zu aufwendig ist oder die Infrastruktur fehlt, können wir CHASE unter Umständen für euch betreiben. Das ist vor allem für kleinere Konferenzen praktisch.

**Schreibt uns an [vorstand@dmun.de](mailto:vorstand@dmun.de)**, dann besprechen wir, was möglich ist. Je nach Aufwand und Umfang kann eine Servicegebühr anfallen.

## Kann ich beim Projekt mitentwickeln?

Auf jeden Fall. Im [Contributing Guide](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/CONTRIBUTING.md) erfährst du, wie du loslegst. Bug-Reports, Feature-Vorschläge, Verbesserungen an der Dokumentation und Code-Beiträge sind alle willkommen.

## Könnt ihr ein Feature hinzufügen?

Poste Feature-Vorschläge in den [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). Wenn du es selbst umsetzen möchtest, schau in den Contributing Guide.

## Funktioniert CHASE ohne MUNify DELEGATOR?

Ja, aber einige Einrichtungsschritte musst du dann von Hand erledigen. DELEGATOR liefert einen strukturierten Export der Teilnehmenden- und Delegationsdaten, den CHASE direkt importieren kann. Ohne DELEGATOR richtest du Gremien und Teilnehmende manuell ein.

## Welche Login-Anbieter unterstützt CHASE?

Jeden OIDC-kompatiblen Anbieter. Wir empfehlen:

- [pocket-id](https://github.com/pocket-id/pocket-id): nur Passkeys, einfach selbst zu hosten
- [Zitadel](https://zitadel.com/): voller Funktionsumfang, Cloud oder selbst gehostet
- [Logto](https://logto.io/): entwicklerfreundlich, Cloud oder selbst gehostet

Details zur Konfiguration findest du im [Self-Hosting-Guide](https://munify.cloud/chase/selfhost/getting-started).

## Gibt es eine Desktop-App?

Ja. CHASE gibt es als native Desktop-App für macOS, Windows und Linux. Den aktuellen Installer findest du im [Download-Bereich der Startseite](/#download). Dort wird die passende Datei für dein System vorgeschlagen, alle Installer liegen außerdem auf der [GitHub-Releases-Seite](https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest).

Die veröffentlichte Desktop-App verbindet sich mit dem CHASE-Server, für den sie gebaut wurde, und arbeitet weiter, wenn die Verbindung kurz abbricht. Wenn du CHASE selbst hostest, nutze die Web-App im Browser oder baue die Desktop-App mit deiner eigenen Serveradresse.

## Kann ich CHASE ohne Konto oder Server ausprobieren?

Ja. Klicke auf der CHASE-Startseite auf **Offline nutzen**, um eine Konferenz zu starten, die komplett in deinem Browser läuft. Du brauchst weder ein Konto noch eigenes Hosting. Alles wird nur in diesem Browser gespeichert, und der Modus ist noch in der Beta. Resolutionen, Statistiken und Anwesenheitserfassung gibt es offline nicht. Mehr dazu unter [Offline-Demokonferenz](./user-manual/admin/getting-started#offline-demo-conference).

## Welche KI-Anbieter unterstützt CHASE?

Die KI-Hilfe für Änderungsanträge kann auf zwei Arten laufen. Auf dem Server funktioniert CHASE mit jeder OpenAI-kompatiblen API, die du über die Einstellung `AI_PROVIDERS` konfigurierst (Modell, API-Key und Base-URL). Ohne Server-Anbieter kann der Vorsitz ein kleineres Modell lokal im Browser laufen lassen, sofern das Gerät WebGPU unterstützt. Beim ersten Start wird ein Modell von etwa 500 MB heruntergeladen. KI lässt sich auch komplett abschalten.

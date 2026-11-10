---
sidebar_position: 5
title: NA-Verwaltung
description: Nichtstaatliche Akteure und UN-Akteure einrichten
---

# NA-Verwaltung

Der Reiter **Nichtstaatliche Akteure** listet alle NAs und UN-Akteure der Konferenz mit Icon und Rollentyp.

Um einen hinzuzufügen, trage einen **Name** ein, wähle die **Rolle** (**Nichtstaatlicher Akteur** oder **UN-Akteur**) und ein **Icon**, das statt einer Flagge angezeigt wird. Ein Klick auf den Icon-Button öffnet die Auswahl. Suche mit englischen Stichwörtern (zum Beispiel "health" oder "building") und klicke auf ein Icon, um es zu wählen. Klicke auf **NA hinzufügen**, um zu speichern.

Einträge lassen sich nicht bearbeiten. Um einen zu ändern, entferne ihn mit dem Papierkorb-Symbol (mit Rückfrage) und lege ihn neu an.

![Der Reiter Nichtstaatliche Akteure mit dem Generalsekretär und dem IKRK samt Rollentyp](shot:admin/nsa-tab)

Anders als Delegationen sind NAs und UN-Akteure nicht an ein einzelnes Gremium gebunden. Sie gelten für die ganze Konferenz, weil dieselbe Person im Lauf einer Konferenz zwischen Gremien wechseln kann.

## Personen und NA-Karten {#people-and-attendance-codes}

Um jemandem Zugang als NA zu geben, füge die Person unter [Benutzer & Rollen](./users-roles) mit der Rolle **Nichtstaatlicher Akteur** hinzu und verknüpfe sie mit dem NA. Der Vorsitz checkt sie bei den Gremiensitzungen, die sie besucht, ein und aus (siehe [Anwesenheitsfeststellung & Anwesenheit](../chair/roll-call-attendance)): über ihre gedruckte NA-Karte, bei einer Konferenz aus MUNify DELEGATOR auch über ihr digitales Namensschild, oder über die Suche nach ihrem Namen.

Die Karten druckst du unter **Anwesenheit** im Reiter **Nach NA** aus. Dort steht jede NA-Person mit ihrem aktuellen Gremium. Nutze **QR-Karte** für eine einzelne Karte, **Alle Karten drucken** für den ganzen Satz oder **CSV exportieren** für eine Liste. Jede Karte trägt den Namen der Person und einen signierten Code, der bis zum Tag nach dem Konferenzende gilt. Trag deshalb zuerst das Enddatum der Konferenz ein. Zum Drucken muss auf dem Server `SIGNED_CODE_SECRET` gesetzt sein.

Verliert jemand seine Karte, öffne seine **QR-Karte** und wähle **Neue Karte**. Die neue Karte bekommt die nächste Nummer, frühere Karten lehnen die Scanner ab.

Kommt eine Konferenz aus einem verbundenen MUNify DELEGATOR, druckt DELEGATOR die Karten (auf seiner Download-Seite und in der Nutzerkarte jeder Person). Der Reiter weist dann darauf hin, statt das Drucken anzubieten.

![Der Anwesenheitsreiter Nach NA mit Buttons für QR-Karten und Alle Karten drucken](shot:admin/attendance-by-nsa)

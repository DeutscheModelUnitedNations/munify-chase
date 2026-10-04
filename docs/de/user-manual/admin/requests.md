---
sidebar_position: 6
title: Anträge
description: Die Antragsarten einrichten, die Delegierte und NAs an den Vorsitz stellen können
---

# Anträge

Mit Anträgen können Delegierte und NAs Anträge zur Geschäftsordnung und persönliche Rechte (zum Beispiel ein Recht auf Information oder eine Mündliche Abstimmung) direkt von ihrem eigenen Gerät an den Vorsitz stellen. Als Admin legst du fest, welche Antragsarten es gibt. Der Vorsitz jedes Gremiums entscheidet, ob sein Gremium überhaupt Anträge annimmt.

## Der Reiter Anträge

Öffne **Konfiguration** und wechsle zum Reiter **Anträge**. Jede Antragsart ist eine Zeile:

- Die Pfeile **Nach oben verschieben** und **Nach unten verschieben** legen die Reihenfolge fest. Der Vorsitz sieht offene Anträge in dieser Reihenfolge, setze die dringendsten Arten also nach oben.
- **Icon**: ein Font-Awesome-Iconname wie `fa-flag`.
- **Name**: was Delegierte auf dem Button sehen.
- **Aktiviert**: schalte eine Art aus, um sie auszublenden, ohne sie zu löschen.
- **Nur Delegierte**: ist das an, können NAs diesen Antrag nicht stellen.
- Das Papierkorb-Symbol entfernt die Art nach einer Rückfrage.

Änderungen werden gespeichert, sobald du ein Feld bearbeitest.

![Der Reiter Anträge mit Antragsarten, ihren Icons und den Schaltern Aktiviert und Nur Delegierte](shot:admin/requests-tab)

Unter der Tabelle gibt es zwei Buttons:

- **Standardset laden** fügt das Standardset von DMUN mit 15 Antragsarten hinzu. Persönliche Rechte, die Mündliche Abstimmung und die Informelle Sitzung stehen auch NAs offen. Alle anderen Anträge zur Geschäftsordnung sind auf **Nur Delegierte** gesetzt. Arten, deren Name schon existiert, werden übersprungen, du kannst also gefahrlos mehrmals klicken. Die Namen werden in der Sprache angelegt, in der du CHASE gerade nutzt.
- **Antrag hinzufügen** fügt eine leere Zeile mit Flaggen-Icon für eine eigene Art hinzu.

Antragsarten kannst du auch schon beim Anlegen einer Konferenz einrichten, im Schritt **Anträge** des [Import-Assistenten](./importing-delegator).

## Anträge in einem Gremium einschalten

Anträge sind in jedem Gremium standardmäßig aus. Der Vorsitz schaltet sie auf der Setup-Seite seines Gremiums mit der Einstellung **Anträge** ein (siehe [Anträge für den Vorsitz](../chair/requests)). Delegierte und NAs finden sie dann in ihrer Gremienansicht (siehe [Anträge für Teilnehmende](../participant/requests)).

## Gut zu wissen

- Jede Person kann pro Art in einem Gremium nur einen offenen Antrag haben. Sobald er erledigt oder zurückgezogen ist, kann sie ihn erneut stellen.
- Delegierte können nur Anträge an das Gremium stellen, in dem sie sitzen. NAs können sie an jedes Gremium stellen.
- Nur Admins können Antragsarten ändern.

---
sidebar_position: 4
title: Committees & Delegations
description: Creating committees and adding delegations
---

# Committees & Delegations

## Committees

The **Committees** tab lists every committee with its abbreviation, name, and member count. To add one, fill in **Committee Abbreviation** (e.g. "GA") and **Committee Name**, then click **Add Committee**. Existing committees can be edited inline (pencil icon) or deleted (trash icon, asks for confirmation and removes all data of that committee).

A new committee starts without any delegations. Agenda items aren't managed here. Chairs set them up in their committee, and the import wizard lets you add them per committee up front.

![The Committees tab, listing General Assembly and Security Council with their member counts](shot:admin/committees-tab)

## Delegations

The **Delegations** tab lists every delegation (country) with its flag, name, alpha-3 code, and which committees it currently sits in.

![The Delegations tab, listing countries with flags, alpha-3 codes, and committee assignments](shot:admin/delegations-tab)

### Adding delegations

Click **Add Delegation** to open the bulk-add dialog. Paste any mix of alpha-2 or alpha-3 country codes (separated by spaces, commas, semicolons, or new lines). CHASE matches them against its list of countries, shows a preview of recognized countries, and flags anything it couldn't match. Confirm to add all recognized countries at once.

New delegations are seated in **every existing committee** automatically. Remove the seats you don't need as described below.

### Assigning delegations to committees

Click the pencil icon on a delegation to open its edit dialog, a checklist of every committee in the conference. Check or uncheck committees to add or remove that delegation's seat, then **Save**.

### Removing a delegation

The trash icon (**Remove Delegation**) deletes a delegation after a confirmation. Its committee seats are removed with it.

:::tip
For delegations created in the import wizard, the regional group (Africa, Asia-Pacific, Eastern Europe, Latin America & Caribbean, Western Europe & Others) is filled in automatically from each country's UN classification. There's no manual field to set it.
:::

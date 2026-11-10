---
sidebar_position: 5
title: NSA Management
description: Configuring non-state actors and UN actors
---

# NSA Management

The **Non-state Actors** tab lists every NSA and UN actor registered for the conference, alongside their icon and role type.

To add one, fill in a **Name**, choose the **Role** (**Non-state Actor** or **UN Actor**), and an **Icon** to represent them instead of a flag. Click the icon button to open the picker, search by name or keyword (for example "health" or "building") and click an icon to choose it. Click **Add NGO** to save.

Entries can't be edited. To change one, remove it with the trash icon (asks for confirmation) and add it again.

![The Non-state Actors tab, listing the General Secretary and ICRC with their role types](shot:admin/nsa-tab)

Unlike delegations, NSAs and UN actors aren't tied to a single committee. They're conference-wide, since the same person may move between committees during a conference.

## People and NSA cards {#people-and-attendance-codes}

To give someone access as an NSA, add them in [Users & Roles](./users-roles) with the **Non-state Actor** role and link them to the NSA. Chairs check them in and out of whichever committee sessions they attend (see [Roll Call & Attendance](../chair/roll-call-attendance)), by scanning their printed NSA card or, for a conference from MUNify DELEGATOR, their digital nametag, or by finding them by name.

You print the cards from **Attendance**, tab **By NSA**. It lists every NSA person with their current committee. Use **QR card** for a single card, **Print all cards** for the whole set, or **Export CSV** for a list. Each card carries the person's name and a signed code that counts until the day after the conference ends, so set the conference's end date first. Printing cards needs `SIGNED_CODE_SECRET` to be set on the server.

If someone loses their card, open their **QR card** and choose **New card**. The new card gets the next number, and the scanners refuse the earlier ones.

For a conference that comes from a linked MUNify DELEGATOR, DELEGATOR prints the cards (on its downloads page and in each person's user card), and the tab says so instead of offering to print.

![The By NSA attendance tab with QR card buttons and Print all cards](shot:admin/attendance-by-nsa)

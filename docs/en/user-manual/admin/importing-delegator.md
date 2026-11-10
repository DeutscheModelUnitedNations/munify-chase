---
sidebar_position: 8
title: Importing from DELEGATOR
description: Creating a conference from a MUNify DELEGATOR export, or from scratch
---

# Importing from DELEGATOR

New conferences in CHASE go through the same wizard, whether you're pulling data from MUNify DELEGATOR (the sister registration product) or starting from nothing. Anyone can fill it in, but only Global Admins can create the conference at the end.

## Starting the wizard

From the launcher, click **Create Conference** (or **Import from DELEGATOR file**). You'll choose between:

- **Upload file**: a DELEGATOR JSON export, or a previously saved JSON file (**Choose JSON file**, or drop a .json file onto the page).
- **Start fresh**: an empty conference where every UN member state is immediately available as a potential delegation, ready to assign and configure by hand.

If you're not a Global Admin, a notice explains that you can prepare the file but not apply it.

![The "How would you like to begin?" screen, with Upload file and Start fresh options](shot:admin/import-start)

## Steps

1. **What is your conference called?**: title, start/end date, location. Under **Conference ID** you can take over the ID from DELEGATOR. Leave it as generated otherwise.
2. **Committees**: create your committees and add their **Agenda** items with **Add Item**.
3. **Delegations**: review imported delegations, or use **Add Country** on a committee to add delegations with the same country-code dialog used in Mission Control.
4. **Other actors**: non-state actors and UN actors. These are optional.
5. **Requests**: the request types delegates can send to the chairs. A fresh conference starts with DMUN's default set, as does a file without any request types. Use **Load default set** to add missing defaults again or **Add request** for your own, and adjust **Enabled** and **Delegates only** per type. You can change everything later in the [Requests](./requests) tab.
6. **Edit**: a summary of the whole conference with any notices, each with a **Jump** button to the step that needs fixing.

![Step 1 of the import wizard, asking for the conference title, dates, and location](shot:admin/import-wizard-basics)

![The Requests step of the import wizard with the default request types loaded](shot:admin/import-wizard-requests)

Move through the steps with **Back** and **Next** at the bottom, or click any step in the step bar at the top. **View JSON** in the top bar shows the raw import data as you go, and **Save** downloads it as a JSON file. This is handy for saving your progress or debugging an import that isn't behaving as expected.

## Checks before finishing

These problems block creating the conference:

- the conference title is missing,
- no committees exist,
- a committee has no name or no abbreviation,
- two committees share a name or an abbreviation.

A committee without delegations only shows a warning.

## Finishing

On the final **Edit** step, Global Admins click **Create Conference**. You're taken straight to the launcher, where your new conference now appears. Everyone can click **Download as JSON** to save the file, for example to hand it to a Global Admin who can apply it.

## Linking to DELEGATOR

Instead of moving files, CHASE can be linked to one MUNify DELEGATOR instance. The link is set up on the server, not in the interface: both instances sign people in at the same provider and know each other through it. Once it is set up, the launcher shows Global Admins how it fares. From then on:

- Every DELEGATOR conference appears here by itself, with its committees, agenda items, roles, team and, once the assignment is released, its participants. The launcher no longer creates or imports conferences.
- What comes from DELEGATOR is changed there: names, abbreviations, dates and people can't be edited or deleted here. Session state, presentation settings and anything you add locally stay yours.
- DELEGATOR reads back the presence and the resolutions a committee adopts, and accepted working papers arrive here as drafts (marked **From DELEGATOR, version n**) until someone changes them here.
- Changes arrive by themselves. Should something be missing, Global Admins click **Sync now** on the launcher's link card or above a conference's users in the configuration: CHASE asks DELEGATOR for everything again, and DELEGATOR reads CHASE again.
- Removing the link from the setup stops all of this. The rows stay as ordinary local ones.

The file import and the presence export stay available under "advanced" for when there is no link.

---
sidebar_position: 11
title: Presentation Mode
description: What the shared projector screen shows, and how to control its layout
---

# Presentation Mode

The presentation screen (opened with **Alt+P** or the **Open Presentation View** button on the Set up page) is meant for your room's projector. You don't manually switch between "views" on it. It's fully automatic, following whatever's currently happening in the committee:

- Roll call in progress: the scrolling country list.
- A vote running: the matching view for whichever vote type you started (show of hands, roll call, or device-based).
- A draft resolution set active: the whole screen switches to the resolution layout with status, agenda item, majorities, both speakers lists and the document preview. In the Amendment Phase and in Voting it highlights the current clause, and in the Amendment Phase it also shows the amendment you are presenting.
- Otherwise: the layout you chose, with status, majorities, the whiteboard and both speakers lists, plus (if enabled) regional group breakdowns.
- Finalizing a resolution with confetti: a celebratory animation.

![The presentation screen in the default layout, with status, majorities, whiteboard and speakers lists](shot:chair/presentation-default)

:::live chair/presentation

In short: everything you do elsewhere in the chair interface (starting a vote, presenting an amendment, editing the whiteboard) is what drives this screen. There's nothing to pick on the presentation screen itself.

## Pending requests

With [requests](./requests) turned on, a **Requests** tile appears as soon as something is pending. It lists each request with its icon, the flag and name of the delegation or NSA, and the request type, in the same order as your queue. A badge shows how many are pending. If not all of them fit, a "+N more" line sums up the rest.

The tile takes its space from other tiles:

- **Default Layout**: it shares the whiteboard's column, so the whiteboard gets smaller.
- **Layout for Small Screens**: the comment list gets smaller and the whiteboard moves down.
- Resolution layout: the comment list gets smaller.

Once the queue is empty, the tile disappears and the layout returns to normal. Turn it off per committee with **Show requests** on the Set up page. Admins can keep single request types off the screen, for example personal needs, by turning off **On presentation** in the [request types](../admin/requests).

## Layout & sizing

From [Committee Setup](./committee-setup), you control:

- **Layout**: **Default Layout** or **Layout for Small Screens**, for different room displays. The small screen layout leaves out the committee title and agenda item. While a draft resolution is active, the resolution layout is used regardless of this choice.
- Base font size and resolution font size: two independent sliders, since resolution text often needs to be a different size than everything else.
- **Display Regional Blocs**: toggle whether regional-group breakdowns show up.
- **Show requests**: toggle whether pending requests get their own tile. Only shown when requests are on.

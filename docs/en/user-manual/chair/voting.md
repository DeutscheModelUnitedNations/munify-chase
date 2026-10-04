---
sidebar_position: 6
title: Running Votes
description: Setting up and conducting show-of-hands, roll-call, and device-based votes
---

# Running Votes

The **Voting** page (Alt+4) is where you set up and run any vote. You can also press **Alt+V** on any chair page to open the same setup. If a vote is already active (maybe started from another device), you'll see a "Vote in progress" warning with a **Resume Vote** button that reopens it with its original settings.

## Setting up a vote

1. **Type of Vote**: choose **Vote by Show of Hands**, **Roll Call Vote**, or **Device-Based Vote** (not available in the offline demo).
2. **Majority Settings**: **Simple**, **Absolute**, or **Two-thirds**, plus **No Abstentions** or **With Abstentions**.
3. For a device-based vote only: set the **Voting Window (seconds)** (5 to 300, default 20): how long delegates get to cast their vote from their own device.
4. **Vote Title**: pick a preset or type your own. It's shown to everyone and defaults to "Vote" if left blank.
5. Click **Start Vote**.

![The voting setup form, showing vote type, majority settings, and vote title](shot:chair/voting-setup)

:::live chair/voting

## Show of hands

Steps through **In Favor**, **Against**, **Abstain** (if enabled) and the evaluation. At each stage, count the raised placards:

- Space or ↑ adds one, ↓ removes one. You can also type the number into the field.
- Enter or **Next** moves to the next stage. On the last tally the button becomes **Publish**, and then **Close** once you've seen the result.
- Backspace or **Back** returns to the previous stage.
- Esc cancels the vote without a result.

A progress bar compares your count to the number of delegations present, warning you if you've counted more votes than there are people, or confirming a match.

![A show-of-hands vote in progress, tallying votes In Favor and Against](shot:chair/voting-show-of-hands)

## Roll call vote

The same one-at-a-time walkthrough as the attendance roll call, but recording a vote instead: **Against** (`J`), **Abstain** (`K`, if allowed), **In Favor** (`L`). Only delegations marked present are called. Each choice auto-advances to the next delegation. A live result chart updates as you go, and after the last delegation you land on the evaluation with **Close**. Esc before the end cancels the vote.

## Device-based vote

You don't cast anything here. Delegates vote from their own device, which pops up automatically for them. Only delegations marked present can vote. Your screen shows a live countdown, a list of who hasn't voted yet, and (once the countdown ends) the result with a **Close** button. You can't end the countdown early to see results. Closing the window before the countdown ends cancels the vote.

## Reading results

The outcome (**Adopted** / **Rejected**) is determined automatically against the majority you chose:

- **Show of hands**: the majority is calculated from the votes you counted. **Simple** and **Two-thirds** use In Favor plus Against. **Absolute** also counts abstentions.
- **Roll call and device-based**: the majority is calculated from the delegations marked present. **Simple** leaves out abstentions. **Absolute** and **Two-thirds** use the committee's present-based majorities from the **Majorities** card.

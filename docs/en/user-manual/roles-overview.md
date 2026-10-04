---
sidebar_position: 2
title: Roles Overview
description: Understanding user roles and permissions in CHASE
---

# Roles Overview

CHASE assigns each person exactly one role per conference, which determines what they see and can do.

## Available roles

| Role                      | Description                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Admin**                 | Full Mission Control access for one conference: committees, delegations, NSAs, users.                                       |
| **Team Member** (Chair)   | Can open and run any committee of the conference: speakers list, voting, requests, resolutions, attendance.                 |
| **Delegate**              | Represents a specific delegation in one committee. Speaks, votes, sends requests, drafts resolutions.                       |
| **Non-State Actor (NSA)** | Represents an organization rather than a country, typically checked in via a printed QR badge. Can move between committees. |
| **Spectator**             | Read-only access to a committee, without a delegation.                                                                      |

Admins can do everything a Team Member can, so an Admin can also chair a committee.

Where a committee has [Requests](./chair/requests) turned on, Delegates and NSAs can send requests to the chairs. NSAs can't use request types marked **Delegates only**, and Spectators can't send requests at all. Only Admins decide which request types exist.

Delegates, Spectators, and NSAs are covered together as **[Participants](./participant/getting-started)** in this documentation, since their day-to-day experience is largely the same.

## A separate, higher level: Global Admin

Beyond per-conference roles, whoever runs your CHASE instance can additionally grant **Global Admin** access. This lets someone create brand-new conferences and manage any conference on the instance, not just ones they've been explicitly added to. See the [Admin Guide](./admin/getting-started) for the distinction.

## Checking your role

Your role badge is shown in the avatar menu at the top of any CHASE screen. If you believe it's wrong, an Admin can correct it from [Users & Roles](./admin/users-roles).

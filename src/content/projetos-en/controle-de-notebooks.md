---
title: Employee Laptop Tracking
summary: A single view of the company's laptops, with a dashboard that shows what is already secure and what is still missing.
before: Each employee looked up one by one in 365 Admin, with no record of antivirus or LAPS.
after: One central source to look things up, with KPIs for what is done and what is still missing.
kind: Extraction and Cleaning
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: IT internship · Hebe's Life Science
---

## The problem

The IT team had no single view of the company's laptops. To find out who had each machine, which Microsoft license that person used and whether the device was secure, someone had to check 365 Admin one employee at a time. Antivirus and LAPS were not recorded anywhere.

## What I delivered

- **An Excel base** with one row per employee, extracted from Microsoft 365. The antivirus and LAPS columns were added at the team's request and filled in by hand.
- **A Power BI dashboard** with three pages (Licenses, Devices and Security), filters that apply to all of them, a 100% target for LAPS and antivirus, and the Kaspersky cost projected from the 3-year licenses, to plan the renewal.

## Under the hood

For those reviewing the technical side: how the base is organized and how the indicators are calculated. The report itself is in Portuguese, so the column names and values below are kept as they are in it.

### The base

One table, with one row per active account:

- **User name**, **email** and **department**
- Microsoft **license** (Standard or Basic)
- **PC name** and **asset tag**
- **Antivirus** (Kaspersky): active or inactive
- **LAPS**: applied or pending
- **Windows version** (Pro or Home)

### Business rules

1. A shared laptop counts only once.
2. Windows Home counts as a security issue.
3. A laptop without antivirus is a critical issue.
4. Every account without a laptop has a recorded reason.

### Measures

Rule 1 lives in the measure itself: the indicators count **distinct PC names**, not rows. Accounts without a laptop are left out.

```
Notebooks = DISTINCTCOUNTNOBLANK ( Base[Nome PC] )

% LAPS =
DIVIDE (
    CALCULATE ( [Notebooks], Base[LAPS] = "Aplicado" ),
    [Notebooks]
)

Status LAPS =
SWITCH (
    TRUE (),
    [% LAPS] >= 1,    "Meta batida",
    [% LAPS] >= 0.85, "Atenção",
    "Crítico"
)
```

Antivirus follows the same structure. The status turns the percentage into a decision: below 85%, the indicator is critical.

### Data quality

The dashboard also points out what may be wrong in the base itself: PCs with conflicting data across rows, the same asset tag on different PCs, emails outside the company domain and accounts without a department. Department names were standardized with the help of AI and reviewed by me.

## Result

The base and the dashboard became the IT team's central source of information. Finding an employee became a filter, and the indicators show, with targets and status, what is already compliant and what is still missing.

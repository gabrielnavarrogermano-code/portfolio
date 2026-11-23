---
title: Microsoft 365 Licenses, Security and Costs
summary: A dashboard that shows, in one place, who uses which license, which devices are not yet secure and how much the company spends on it.
before: Each employee looked up one by one in 365 Admin, with no record of antivirus, LAPS or license costs.
after: One central source in three tabs, licenses, security and costs, with what is already right and what is still missing.
kind: Extraction and Cleaning
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: IT internship · Hebe's Life Science
---

## The problem

The IT team had no single view of Microsoft 365 accounts and devices. To find out which license each person used, on which computer, and whether that computer was secure, someone had to check 365 Admin one employee at a time. Antivirus and LAPS were not recorded anywhere, and nobody knew how much the licenses cost for each department.

## What I delivered

- **An Excel base** with one row per account or device, extracted from Microsoft 365. Antivirus, LAPS and the reason why someone has no company device were added at the team's request and are filled in by hand, with drop-down lists that reject values outside the standard.
- **A Power BI dashboard** with three tabs, each answering one question:
  - **Licenses:** how many accounts use each license, in each department, and which licenses could be reviewed.
  - **Security:** which devices are missing LAPS or antivirus, or run a Windows version that needs to change, department by department.
  - **Costs:** how much the licenses cost per year, per month, per account and per department.
- **Filters per tab**, only the ones that make sense on each, with tooltips on hover and a dedicated mobile layout.

## Under the hood

For those reviewing the technical side: how the base is organized, how the data is cleaned and how the indicators are calculated. The report itself is in Portuguese, so the column and measure names below are kept as they are in it.

### The base

One table, with one row per record: a person, an admin account, a shared device or a machine without a user.

- **Name**, **email**, **department** and **role**
- Microsoft 365 and Adobe **licenses**
- **PC name** and **asset tag**
- **Antivirus** (Kaspersky) and **LAPS**
- **Windows version**
- **Reason** why someone has no company device

### The cleaning, in Power Query

Before becoming an indicator, each row is cleaned and classified:

1. **Account type:** based on role and name, the row becomes a user, an admin account, a shared device or a machine without a user.
2. **License:** one account can have several licenses. The classification follows a priority order (no license, Basic, Standard), and free licenses are left out, because they change no decision.
3. **Device:** with no PC name, the recorded reason says whether the person uses a personal computer, has no computer or gave no reason.
4. **Security issues:** no LAPS, no antivirus or Windows 11 HOME, which has to become PRO to use LAPS.

### Counting rules

1. An account counts only once, by email: the same email on two rows is one account.
2. A device counts only once, by PC name: a computer used by two people is one device.
3. Not having a device is information, not an issue: it does not add to the problem indicators.
4. LAPS coverage is calculated over all devices, Windows HOME included, on purpose: they need LAPS too.

### Measures

Rules 1 and 2 live in the measures themselves, which count distinct values, not rows. Simplified for reading:

```
Contas Ativas =
CALCULATE (
    DISTINCTCOUNT ( usuarios_office365[E-MAIL] ),
    usuarios_office365[Conta Ativa] = "Sim"
)

Computadores = DISTINCTCOUNTNOBLANK ( usuarios_office365[NOME PC] )

% LAPS =
DIVIDE (
    CALCULATE ( [Computadores], usuarios_office365[Status LAPS] = "Com LAPS" ),
    [Computadores]
)

Custo Licenças (ano) =
    [Contas Standard] * [Preço M365 Standard]
        + [Contas Basic] * [Preço M365 Basic]
        + [Contas Adobe] * [Preço Adobe Acrobat Pro]
        + [Computadores com Antivírus] * [Valor Custo Antivírus] / [Anos Licença Antivírus]
```

The antivirus is paid every three years, so it enters the yearly cost divided by 3. Its price is a parameter: on the Costs tab, a filter simulates other values and the whole cost is recalculated.

### Licenses that could be reviewed

A Standard account for someone without a company device could, in principle, be Basic, which costs much less per account. The dashboard shows these accounts and the reason for each one (personal computer, no computer or no reason given), but it says they **could be reviewed**, not that they should become Basic: someone working on a personal computer may need the Standard apps. The decision stays with whoever knows each person's routine.

### Design decisions

- **No number repeats across tabs.** Before creating a visual, I check whether the metric already appears on another tab.
- **The Licenses tab shows only quantities, and the Costs tab only amounts in reais.**
- **Each tab has only the filters that make sense on it,** with plain names, without technical terms like "N/A" or "Unlicensed".
- **Each license has a fixed color,** the same on every tab.

### Data quality

Besides the drop-down lists in the spreadsheet, the model points out what may be wrong in the base itself: PCs with conflicting data across rows, the same asset tag on different PCs, emails outside the company domain and accounts without a department. Department names were standardized with the help of AI and reviewed by me.

## Result

The spreadsheet and the dashboard became the IT team's central source for Microsoft 365 licenses, security and costs. Finding an employee became a filter, knowing how much a department costs became a chart, and what is left for security to reach 100% is in plain sight, department by department.

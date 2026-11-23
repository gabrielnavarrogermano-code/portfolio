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

## How it works

In short, there are three steps:

1. **The base.** A spreadsheet with one row for each person or device: name, email, department, licenses, antivirus, LAPS and Windows version.
2. **The cleaning.** In Power Query, I organize the rows: I separate users from admin accounts, handle accounts with more than one license and flag what is missing on each computer's security.
3. **The numbers.** In Power BI, each account and each computer is counted only once, and license costs are calculated per year, per month, per account and per department.

The report itself is in Portuguese, so the names in the dashboard are in Portuguese too.

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

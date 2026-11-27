---
title: Microsoft 365 Licenses, Security and Costs
summary: A dashboard that shows, in one place, who uses which license, which devices are not yet secure and how much it costs, with a history that builds itself every month.
before: Each employee looked up one by one in 365 Admin, with no record of antivirus, LAPS or license costs.
after: Four tabs, licenses, security, costs and month-by-month evolution, plus a snapshot of the base saved automatically on the 1st of every month.
kind: Extraction and Cleaning
tools: [Microsoft 365, Excel, Power BI, Power Automate]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: IT internship · Hebe's Life Science
---

## The problem

The IT team had no single view of Microsoft 365 accounts and devices. Finding out each person's license and whether their computer was secure meant checking 365 Admin one by one. Antivirus, LAPS and cost per department were not recorded.

## What I delivered

- **An Excel base** extracted from Microsoft 365, with license prices on a sheet of their own: changing a price means changing one cell.
- **A Power BI dashboard** in four tabs: **Licenses** (quantities), **Security** (what each device is missing), **Costs** (R$ per year, month, account and department) and **Evolution** (what changed since last month, item by item).
- **Monthly history:** on the 1st, a Power Automate flow saves a snapshot of the spreadsheet and emails me a reminder. From these snapshots, the dashboard builds the evolution tab and a one-page report that explains in sentences what changed, which I export to PDF.

The report itself is in Portuguese, so the names in the dashboard are in Portuguese too.

### Decisions that make a difference

- **Each account is counted once** (by email) and so is each device (by PC name). The 3-year antivirus enters the annual cost divided by 3.
- **No number repeats across tabs.** Licenses shows only quantities and Costs only amounts in reais.
- **Errors show up instead of passing silently:** a deleted column stops the refresh, a month without the data shows as "no data", and the dashboard flags repeated asset tags and accounts without a department.
- **Every change is checked:** I compare all measures before and after changing a rule.

## Result

Finding an employee became a filter, knowing how much a department costs became a chart, and what changed in the month is recorded without anyone building a spreadsheet.

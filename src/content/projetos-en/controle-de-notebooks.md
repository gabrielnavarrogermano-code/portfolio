---
title: Microsoft 365 Licenses, Security and Costs
summary: A dashboard that shows, in one place, who uses which license, which devices are not yet secure and how much the company spends on it, with a report that arrives by email on its own every month.
before: Each employee looked up one by one in 365 Admin, with no record of antivirus, LAPS or license costs.
after: One central source in four tabs, licenses, security, costs and a month-by-month comparison, plus a PDF report by email on the 1st of every month.
kind: Extraction and Cleaning
tools: [Microsoft 365, Excel, Power BI, Power Automate]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: IT internship · Hebe's Life Science
---

## The problem

The IT team had no single view of Microsoft 365 accounts and devices. Finding out which license each person used and whether their computer was secure meant checking 365 Admin one employee at a time. Antivirus and LAPS were not recorded, and nobody knew how much the licenses cost per department.

## What I delivered

- **An Excel base** extracted from Microsoft 365, with one row per account or device and drop-down lists for the fields filled in by hand.
- **A Power BI dashboard** with four tabs: **Licenses** (how many accounts use each one, per department), **Security** (what each device is missing), **Costs** (how much the licenses cost per year, month, account and department) and **Comparison** (month-by-month line charts of licenses, costs and the % of pending security issues, with the change from the previous month).
- **An automatic monthly report:** a Power Automate flow generates a PDF comparing the last two months and emails it on the 1st of every month at 6:00 a.m.

## How it works

1. **The base.** A spreadsheet with the name, email, department, licenses, antivirus, LAPS and Windows version of each person or device.
2. **The cleaning.** In Power Query, I separate users from admin accounts, handle accounts with more than one license and flag what is missing on security.
3. **The numbers.** In Power BI, each account and each computer is counted only once, and costs are calculated per year, month, account and department.
4. **The delivery.** On the 1st of every month at 6:00 a.m., Power Automate generates the PDF report and emails it. It compares the last two months (on the December 1st send, October against November) and lists what changed, what was added and what was removed.

The report itself is in Portuguese, so the names in the dashboard are in Portuguese too.

### Design decisions

- **No number repeats across Licenses, Security and Costs;** the Comparison tab only shows how they change from one month to the next. The Licenses tab shows only quantities, while the Costs tab shows only amounts in reais.
- **Each license has a fixed color** and each tab has only the filters that make sense on it, with plain names.
- **Standard accounts for people without a company device are shown as "could be reviewed",** not "should become Basic": the decision stays with whoever knows each person's routine.
- **The model itself points out errors in the base,** such as the same asset tag on different PCs or accounts without a department.

## Result

The dashboard became the IT team's central source for Microsoft 365 licenses, security and costs. Finding an employee became a filter, knowing how much a department costs became a chart, and the month's changes arrive by email without anyone having to ask.

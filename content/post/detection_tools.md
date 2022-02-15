---
title: "Detection strategy and tools for your kubernetes cluster"
description: "Detection of malicious activity can happen on different layers. We will present some, with practical advices on how to tackle it"
date: 2022-02-14T09:21:56Z
draft: false
author: Davide Barbato
tags: [security]
---

Security preventive measures are the foundation of any decent security program, and if you have been in the game enough, you know that solely they aren't sufficient to avoid a security breach: since absolute, perfect security doesn't exist (unless an heavy toll is payed on usability and accessibility), the goal of the game is to increase the cost for a malicious actor to gain access to your crown jewels.

While protections can and will be bypassed, once they get access to your systems, their activity will inevitably leave some traces: that's where detection comes into play to back-up your security controls by alerting on suspicious activity and giving the opportunity to respond in a timely manner and limit the impact of a security breach.

This is why detection is paramount in any security program and should be prioritized even before any preventive control (but seldomly done).

We at Astrokube have helped several customers implement a detection strategy tailored to their unique technology stack, needs and requirements. All of them have common foundations, which brought great value to them, and in this article we will present those fundations and share some tips on how you can implement them yourself.

Lastly, please note that we will not talk about response capabilities, which is the complementary part of a more comprehensive detection and response strategy: the twos can be addressed separately, and we will focus on the former through this article.

## Strategy
Like almost everything, having a strategy layed out definitely improves your chances of successfully implementing what you need and how you need it, maximizing the investment and getting the most out of it.

Speaking about security detection, there are different strategies out there and they all have their pros and cons. The general rule for an effective detection strategy is to reduce the impact (and therefore the damage) of a security breach by detecting it as soon as possible, consistently analyzing activity and producing meaningful alerts.

It's paramount then to collect and analyse all the traces left behind by all the most important systems, e.g. the ones who store and process sensitive data, and let your analysts triage and assess the impact of each alert, which will trigger the response activity based on the outcome of the detection phase.

As we mentioned earlier, the followings lay the foundations of an effective detection strategy:
- Thorough logging: systems, applications, infrastructure, network. The more you log, the more changes you have to detect a breach as soon as possible;
- Centralized logs: make sure to send all your logs to a single pane of glass, which will be your source of truth for security events;
- Effective alerts: the more you log, the more noise you have, that's why it's important to spend time analyzing your logs and create alerts whom have high confidence and enough information to give security analysts all the elements to decide if it's something that needs a deeper look or can be disregarded right away, reducing what is so called "alert fatigue". Failing to provide effective alerts will produce irrelevant, time wasting alerts, leading to frustration and even burn out of your analysts;
- Alert lifecycle: design how an alert is handled, from generation to resolution. This is an high level document, and something like [Palantir's Alerting Detection Framework](https://github.com/palantir/alerting-detection-strategy-framework) may help to implement alerts as code, with the advantage to have a peer-reviewed, audited alerting strategy;
- KPI: define which Key Performance Indicators make more sense for you, which will be used to track and measure effectiveness of your detection strategy.

This is a rough representations on what your detection strategy may look like to accommodate all the points expressed above:

![](/images/detection_strategy/detection_strategy.png "Detection Strategy High Level Diagram")


## Implementing a detection strategy
Let's have a look at how we can implement the aforementioned detection strategy into our security program. We assume we're working with a kubernetes environment, although all the systems mentioned below can be setup on-prem, on multi-cloud and even on an hybrid infrastructure.

### Thorough logging
This is the first and most important step: decide what to log, why, and how to make these logs available for consumption.
Logging capabilities provided out of the box are a good starting point; however it usually fails to address the "detection questions": who did what, when and where. A thorough logging strategy will select, enrich and ship logs who can answer those questions, providing tremendous advantage to security analysts in quickly identifying and triaging an alert.

There are several areas you may want to address logging:
- At application/service level: if you're providing a service to your customers, you want to be sure to include an audit log into your product. The goal of the audit log is to provide enough information on interaction between external services (including users) and your service. Basic activities to log are, but not limited to, the ones related to authentication, authorization, change of sensitive data and/or settings, user management.
- At the kubernetes level: kubernetes provides the [Audit API](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) which regulates what information is logged. Base audit policy is specified at cluster creation time and based on how the cluster has been created, you may have different audit policy. It's important to understand what policy is provided by default and extend it by creating your own custom audit policy (bear in mind that for IaaS offering you may not be able to edit it, although they usually provide a default wide policy).
- At OS level: getting access to the underlying operating system is the most important goal for a malicious actor, where they can access credentials, disrupt the service and move laterally to other systems. It's paramount to configure the OS' logging features to provide enough context on what activities are happening, and alert on suspicious ones. Authentication, access to sensitive file, changes in file permissions, all are valid candidates. Metrics play an important role in detecting some kind of malicious behaviors and it's very important to include those in your detection strategy (we will talk more about metrics for detection in the [Here is the strategy. Now what?](hyperlink) section).
- At network level: a malicious actor may hide their actions within a system, but network activity will always be there, and that's why collecting and analyzing network metrics can spot a breach more effectively than an OS and application level logging.

Depending on which level, there are several tools which can help extract those logs for further analysis. At OS level, rsyslog is a good, built-in, default logging system which can be configured to ship logs to a central rsyslog server. For application and OS level logs in a container world, the industry seems to agree on using [fluentd](https://www.fluentd.org/) for reading and shipping logs outside of the cluster thanks to a dedicated container that runs side-by-side to yours, seamlessly integrating into any workload.
Network logging is usually provided by your IaaS provider when using one to host your kubernetes cluster. You can use [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) alongside [prometheus](https://prometheus.io/) to collect network activity at cluster level. You can (and should) also monitor network activity at the VPC level (if applicable), starting with flow logs and evaluate if a more thorough network monitoring strategy (like packet capture) makes sense for your use case.

Enterprise solutions also exist in this space: DataDog, Splunk, SumoLogic just to name a few, they all provide agents to be installed on the OS, which connects to their SaaS offering, which extract any type of files configured (usually application and operating system) and present the results into a handy web user interface.

### Centralized Logging
Once you have a logging setup, you want to have a central place to review all logs: having a single pane of glass is way more efficient than looking at two or more different systems, giving you tremendous visibility into every activity you decide to log.

There are several solutions out there, both open source (like the Elasticsearch Fluentd Kibana stack) and commercial (like Datadog or Splunk). Whatever you decide to go, there are some basic requirements you want to look for in any solution:
- SSO - to provide easy user management
- Role Base Access Control (RBAC) - to provide granular permissions
- Log retention policy - to comply with local and international laws and regulations
- API - to automate the ingestion and data querying
- Audit logs - to provide a trail of actions performed within the application
- Encryption at rest and in transit - self explanatory!
- Log format agnostic - to be able to ship any type of logs regardless of the format (further normalization of format can and should be done separately)

Depending on the solution chosen, the setup will vary greatly, although most of them will require an agent to be installed to pull the logs and ship them to the central server.

### Effective alerts
The more data you have, the more noise you get, and the harder it gets to extract useful information. It's paramount then to create queries and filters to cut out the unnecessary noise and provide analysts only alerts that are actionable: the advantage is to reduce the response time drastically and make the triage job easier; the disadvantage is to have analysts spending too much time gathering context for alerts which may be false positives, leading to frustration and eventually burn out (it's no coincidence that Security Operation Center turnover rates are high, based on [CriticalStart's report from 2019](https://www.criticalstart.com/resources/new-research-from-criticalstart-finds-8-10-security-analysts-report-annual-soc-turnover-is-reaching-10-to-more-than-50/)).

To verify if you make effective alerts, you should achieve:
- low rates of false positives;
- triage time of less than 10 minutes (ideally no more than 5 minutes);
- more time investigating alerts rather than fixing them

As always, solutions to achieve this depend on your organization and its technology stack. Good candidates are Security Orchestration Automation and Response (SOAR) systems, like [n8n](https://n8n.io/) or [Tines](https://www.tines.com/), which can be used to post process alerts like adding threat intelligence information, setting risk levels, add some type of Machine Learning enrichment, and even automate response when appropriate, just to name a few.

It's also worth noting that creating effective alerts start by logging the right amount of information, which requires collaboration between the security team and other departments.

### Alert lifecycle
Once you have your alerts in place, you are most likely going to fine tune them over time. You may end up with an alert that mistakenly left out potentially interesting use cases and therefore you will start losing visibility, or even worse, you will start creating hyper fine grained alerts, which will make the "effective alerts" task harder, leading to all the negative consequences we mentioned in the previous section.

To avoid that, centralize all your alerts into one place so they are easy to find. Make sure they are clear, that thorough testing went into validating them, and more importantly that they fulfill their goal.

In an ideal world, you could use an alert framework like ADF and store them into a git repository for versioning and auditing purposes. You may then create some sort of automation that automatically pushes those rules into your centralized logging platform so they are immediately in effect.

### KPI
As the old saying goes: you can't improve what you can't measure.
That's why it's important to select some Key Performance Indicators to track your progress.

There are some metrics you want to collect to evaluate how good or bad your strategy is. Below we report just a few, but they greatly depend on your objectives and what is important to you:
- Number of intrusion attempts;
- Number of security breaches;
- Mean time from event to detection;
- Mean time to acknowledge an alert;
- Number of alerts per system/component;
- Number of false positive alerts;
- Number of true positive alerts.

Group those metrics by a selected timeframe (day, week, month) and at each interval take the time to read, understand and improve them (setting each target value will help assessing how good or bad you are scoring, which in turn will help prioritize areas for improvement).

## Here is the strategy. Now what?
So you went through this article and wondered: that's all great but where should I start?

Creating a strategy can be a long, daunting process, and we definitely encourage all of you to start one and keep pushing it. But there are also some quick steps you can start implementing today to better position yourself during the strategy development and implementation:
1. If you work with containers, software like [Falco](https://falco.org/) can help in quickly setting effective alerts at the OS level. Deploy it with alerts sent via webhook to your endpoint of choice or directly to Slack (if in use);
2. If collecting metrics, start by alerting on:
    - Anomalous outbound network traffic;
    - DNS request anomalies or large spikes in DNS requests from a specific host;
    - CPU spikes.
3. Setup centralized logging with the type of logs you have already configured. If none, start with application logs;
4. Select base KPIs like total number of alerts, total number of false and true positive alerts, average triage time (from receiving to closing the alert) and create a process to measure and report on them.

Once you have these basics, you can iterate over them to further refine and tweak the alerts: it's better to start small and one step at the time then implement all at once and end up with a flaky system with low confidence alerts.

## What's next
Once you have your detection strategy in place, you may want to add additional areas not covered in this article like incident response and threat intelligence. You may also want to spend some time setting up and tuning your SOAR solution, which you will quickly realize it's a precious ally and a key part of your automation effort.

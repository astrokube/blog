---
title: "Towards a holistic approach to container security: a strategy"
description: Build a strategic approach to container security.
date: 2022-01-03T09:21:56Z
draft: false
author: Davide Barbato
tags: [security]
---

Containers have become the de-facto standard for running modern and cloud native services, whether they’re provided as service to external stakeholders or used internally.

The [current state of DevOps](https://services.google.com/fh/files/misc/state-of-devops-2021.pdf) report by Google has found that 40% of surveyed businesses are in the high category when it comes to DevOps practice adoption, meaning they’re able to deploy between once-a-week to once-a-month, code goes from staging to production between one day and one week, as well as the fact that they’re able to restore services in less than one day, and finally, that their change failure rate is between 16%-30%. This number has increased from 23% last year, while the medium category shrank from 44% to 28%: All of which means that companies are stepping up their game and accelerating the ability to deliver software with more speed and better stability.

To highlight another data point, based on the [2020 CNFC Survey](https://www.cncf.io/wp-content/uploads/2020/11/CNCF_Survey_Report_2020.pdf), 92% of companies are using containers in production, with a 300% increase since 2016.

Security, on the other hand, didn’t see a significant increase in numbers. It’s no surprise then, that security has been left behind in this race: companies are focusing on releasing software early, often not caring if things break, thanks to the quick recovery and roll-back systems they have in place (most companies go by saying “break early, break fast”). All-the-while, cybersecurity is inherently a proactive game, where necessary analysis and design choices must be made before even starting to code, hindering the development process; something that most companies are not willing to sacrifice in the name of a more secure and robust codebase.

To meet this requirement, cybersecurity enthusiasts soon came up with ways to fill this gap: tools for scanning container images, auditing the cluster’s configuration and network access - These are just a handful of many attempts to inject security in the DevOps workflow, trying to minimize the friction and reduce release time, while adding security to the product and balancing said security with speed.

While there are an incredible amount of tools that look at securing container-based services from different angles, there’s still a lack of clear strategy around consistently applying defensive measures to prevent and detect undesired behaviour in your infrastructure.

It’s no secret that container-based incidents are on the rise: based on two reports, the [Red Hat State of Kubernetes Security 2021 Report](https://www.redhat.com/rhdc/managed-files/cl-state-kubernetes-security-report-ebook-f29117-202106-en_0.pdf) and the [Tripwire State of Container Security Report](https://www.tripwire.com/solutions/devops/tripwire-dimensional-research-state-of-container-security-report-register) (2019), we can clearly see the numbers around this phenomenon: the first reports that 94% of respondents claim to have had at least one security incident involving containers, while in the second, 60% reported at least one security incident.

![](/images/security_strategy/tripwire_incidents.png "Tripwire Report - Incidents")

Consistency comes from a clear strategy, which looks at the product’s security from an holistic point of view: frameworks are particularly good in setting, achieving and maintaining such a strategy if correctly implemented.

There are plenty of security focused frameworks out there, but the problem is: mapping those with latest technologies is not always straightforward, in part because they’re very high level and don’t take into consideration implementation details, but also because containers require a different approach to security than traditional, on-prem infrastructures, and the lack of expertise in this area is starting to come back to bite us.

NIST, the National Institute of Standards and Technology, has done great work setting standards across all areas of information security: from application to risk management, passing through physical security and controls.
Specifically, what we’ll do in this article is to map the [NIST Cyber Security Framework (CSF)](https://www.nist.gov/cyberframework) into the container world in order to move our first step into a more consistent container security strategy.

![](/images/security_strategy/nist_csf.png "NIST Cyber Security Framework")

We’ll give you an overview of each CSF category and how we can translate them into the container world, giving some tips on how to approach them. We’ll then focus on each aspect in more detail in the following articles.

## Identify
You can’t protect what you don’t know, that’s why visibility is key in every organization: it’s the foundation of every successful security strategy. This function of the framework focuses on identifying all potential risks a business is facing, ranging from asset management to risk management, including business environment, governance and risk assessment.

Regarding asset management, since virtualization took off a decade or more ago, visibility has been a problem: how could you protect hosts that run inside others, that abstract, and make operational activities like orchestration transparent? how to protect hosts where part of the infrastructure is ephemeral by nature?

This has been a tricky question to answer, and there still isn’t a single solution: it really depends on your tech stack as to how you correctly enumerate all your assets.

Likely for us, there are still some tips that can help us to move forward in achieving thorough visibility, one above all: logging.

Below is an extract from the Dynatrace report [Securing Containers and Modern Cloud Infrastructure ebook](https://www.dynatrace.com/monitoring/resources/ebooks/the-maturation-of-cloud-native-security/) about most aspects that lack visibility:

![](/images/security_strategy/visibility.png "Dynatrace Report - Visibility")

It’s paramount to create a logging strategy to ensure that the logs:
- Are collected in a central location to provide a single pane of glass;
- Are exported in a timely manner to reduce blind spots;
- Contain enough information to quickly identify the source of the activity, whether that be a pod, a container, an application, or a service;
- Provide enough information to answer the question: who did what, when, and how?

Kubernetes API logs can tell when a new container is deployed or destroyed. Agents that export logs and system metrics to a central location (i.e. DataDog, fluentd, rsyslog) can be installed in each container. These are just two tips that should be taken into account when creating a thorough logging strategy.

## Protect
Protection in cybersecurity means mostly creating a safe environment, with appropriate safeguards, where your workloads are going to run: it's the security baseline you’re providing for your systems, and it can be in the form of both applicational and operational configurations.

Special attention must be paid to safe configuration: based on the Red Hat State of Kubernetes Security report, one of the major sources of security incidents is misconfiguration.

![](/images/security_strategy/incidents_redhat.png "RedHat - Incidents")

Relaxed policies, unlimited privilege accounts and unrestricted network access (to name just a few) are all examples of configurations failing to adequately protect your services. Since configurations rarely change at runtime (thus being immutable), they can usually be audited once, and misconfigurations detected earlier in the developing and deployment process, giving the opportunity of implementing corrective measures.

The following data from the already mentioned Dynatrace report shows the impact deriving from misconfiguration of workloads: unauthorized access to applications and data accounts for 40%, followed by impacted SLA (39%) and malware (38%). This is a great liability from a legal standpoint: the first must be handled under the country’s legal framework (e.g. GDPR breach notification) while the second must respond to customers' contracts.

![](/images/security_strategy/threats.png "Dynatrace Report - Threats")

Making sure misconfigurations are caught early is key to providing a secure and reliable environment, and this is where the `shift security left` movement fits in: by checking for security issues earlier in development phase, a company could adequately protect their services before they go live, avoiding exposing critical vulnerabilities that can cause quite some havoc, as the data shows.

There are multiple ways to achieve a secure baseline. Looking at the container side of things, you can start by creating a base, “golden” container image that complies with security standards (e.g. CIS) and make sure it’s not tampered with (thanks to container image integrity checks), alongside ensuring that any additional layer doesn’t undermine the security of the image.

To summarize: start protecting your development phase by injecting security checks early in the development pipeline. Golden container images, application static code analysis, infrastructure as code auditing, dependencies checks, and linters, are all valid strategies to detect and fix security issues early, and deliver default secure configurations.

## Detection and Respond
Going further, the report by Dynatrace breaks down for us the most common incidents experienced by business in 2020:

![](/images/security_strategy/incidents_dynatrace.png "Dynatrace Report - Incidents")

As detailed in the graph above, mere prevention can’t cut it alone: of the top five incidents, just one could have been avoided thanks to preventing measures, while the other four would have been detected at runtime.

To back up this claim, the following graphs from RedHat highlight the need for more protection at runtime, that is, when the workloads are deployed and activity should be monitored for suspicious behaviors.

![](/images/security_strategy/runtime_01.png "RedHat Report - Runtime Detection")


![](/images/security_strategy/runtime_02.png "RedHat Report - Runtime Detection")

A staggering 98% of responders claimed `Runtime threat detection/response` is something a company should definitely look into, as a must or nice to have.

Similar results also show up in the Tripwire report:

![](/images/security_strategy/runtime_03.png "Tripwire Report - Runtime Detection")

The top four fall under the `Detection and Response` capabilities, which once again turns out to be the most important aspect of a strong container security program.

Applications have become more and more complex and dynamic: there is now an ecosystem of tools designed for scaling, proxying, caching and more, and each one of them potentially introduces security issues, making the attack surface wider and wider.

In such an environment, control can go only so far. You need a consistent and thorough detection and response capability: while the source of the breach may go undetected, as it interacts with the compromised systems, a trail of actions will always be generated, and that’s when detection kicks in.

Several researches have quantified not only how long it takes on average to identify a breach, but also how much it costs.
It’s then key to detect the breach as soon as possible, not only to minimize the scope and impact of the event but also to minimize costs.

The challenges faced when implementing a detection and response strategy are multiple, and they’re strictly with the logging strategy built around the product: being able to answer the `who what when how` question will give the right information to spot and respond to suspicious activity.

While they both share the same challenges, detection and response add their own:
- Cutting through the noise to select only meaningful events to alert on;
- Detecting and responding in a timely fashion;

While cutting through the noise is specific to each environment, detecting and responding in a timely fashion has just one solution: automation. Automating the D&R phases as much as possible will provide repeatable and auditable processes that guarantee consistency and speed.
That’s not all: preparing playbooks with different attack scenarios will prepare you to face the situation thoroughly, minimizing panic and chaos.

Container orchestration platforms provide APIs which can be leveraged to i.e. destroy malicious containers, block network traffic, isolate infected systems, and they must be integrated into the response strategy,

But writing down a list of actions, creating some tooling around them and testing it only once doesn’t really help: in real case scenarios, few things go as expected, and a little deviation may change the situation drastically. That’s why it’s important to set regular tests of the playbooks and the incident response plan as a whole: with the help of tabletop exercises you can ensure your company is ready to face any crisis situation deriving from a security breach, positioning your team ahead of the curve and being able to handle the incident with the least impact possible.

You can begin right now by starting small: simple security assessments with tools like kube-bench or kubesploit can be used as part of regular assessment, while tools like falco can be used to detect malicious activity within the kubernetes cluster in real time, working in place of or alongside with a centralized logging solution.

## Recover
A truly secure system is one that is able to recover in the case of more disrupting events, like your hosting provider region goes down or as an aftermath of a disrupting security attack (i.e. ransomware).

No matter how prepared you are, or how quickly you respond to a crisis situation, you may still face severe damages which may put your business in danger. It’s therefore important to build resilience into every aspect of your business, and especially in the container world.

There’s no special advice here: the same old concepts apply, and platforms like kubernetes have made a great deal on running high availability, scalable systems able to resist spikes of loads and outages.

Multi-cloud solutions are the way to achieve great resilience, and are in fact getting more tracking in light of events such the one reported above: the understanding of the value and the need to build resilience into their offerings is pushing solutions on the right path to achieve that.

It would be amiss of us to not mention backups. Backing up your important data is one of those good old pieces of advice: it’s always relevant.
Making frequent backups and testing it regularly ensures your crown jewels are always safe and restorable in case of need. Make sure to restrict and monitor for access, something invaluable for incident response.

It’s important though to take the time to set up a process to follow through in case of a such dramatic event, similar to the incident response plan mentioned in the previous section. Having a disaster recovery plan and testing it regularly will build the muscles needed to respond swiftly in situations of crisis.

Last but not least: keep testing. The fact that it worked once (perhaps only when you set it up) doesn’t guarantee it’s going to work again. Go to bed confident that if something bad happens tomorrow, your company’s going to be able to recover with the least possible damage and in the shortest amount of time.

High-availability (cross region and multi-cloud), combined with a thorough backup strategy coupled with a robust disaster recovery plan is a good start to tackling and building resilience in your business.

## Conclusions
Identify, Protect, Detect, Respond and Recover are the key elements of a thorough security strategy that can drive security without sacrificing innovation.

Mapping this framework to the increased usage of containers is paramount for building secure platforms.

Based on the reports shown in this article, it’s clear that a mix of prevention and detection measures are key to achieving a strong, mature container security program: it’s impossible to achieve perfect security, especially in such a dynamic environment as containers, and we must assume that vulnerabilities will be introduced in production, either through misconfiguration, supply chain (log4j anyone?) or just code flaws. And what really drives costs up is the amount of time a breach goes undetected and eradicated.

That’s why, here at Astrokube, we keep saying:
> Protection is a must. Detection is paramount.


How to make it happen? By tackling the issue from multiple angles: building scalable high availability resilient services, providing timely detection and response to threats, fostering a culture of security where better collaboration is established between all engineers with the help of open source tools, and shifting security earlier in the development process to make sure you’re building security from the start.

But make no mistake: this has to be a joint effort between all the main engineering departments: Operations, Development, Security (when security expertise is not embedded directly into the teams), they all have to collaborate towards making security transparent and at the benefit of others (and not being a blocker).

Finally, let’s look at how security is embedded in DevOps process:

![](/images/security_strategy/last.png "DevSecOps initiative")

49% say they’re starting, or have already started their DevSecOps journey, while 26% report disconnection between Sec and DevOps. This means: if you’re in that 49%, Congrats! The first step is fundamental and the more you keep going the more you’ll grow, to end up eventually in that 25% with an advanced state.
If you’re in the 26% range, you may want to start thinking seriously about it, or you risk being left behind.

Whether you’re in the 28, 49 or 25 percent Astrokube will lead you on the path towards a stronger, more consistent container security strategy.

In the following weeks, we’ll be releasing more security-oriented content to showcase how you can achieve a stable, mature security strategy to make your workloads more secure, more stable, more resilient.

Stay tuned.

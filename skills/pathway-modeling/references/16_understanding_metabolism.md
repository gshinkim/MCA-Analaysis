# Understanding Metabolism

*Source: `chapter16.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Understanding Metabolism <a id="chap-understanding"></a>

## Introduction

This book is about the control of biochemical systems with a focus on metabolic pathways. The ability to control reaction rates and concentrations in a changing environment is one of the characteristics of living systems. Cells must monitor prevailing conditions and make appropriate decisions. Cells make sure, for example, that adequate phosphate and redox potentials are available at all times. They also have to ensure that major transitions from one state to another (for example cell division) avoid any disruption to subsystems that are essential to cell viability. These activities presumably require a great deal of coordination and control and indeed over sixty years of research has uncovered a myriad number of feedback and feedfoward control loops together with many less obvious means of control.

It is worth examining some of the history of how we came to understand control in biological cells. The first thing to note is that understanding control in any complex system is difficult. It was difficult in the past and it is difficult now. Man's propensity to grasp the many factors involved in a complex system is limited. As a result, reasoning about complex systems cannot be done by intuition alone but requires expertise and the application of approaches from mathematics, engineering and computer science.

## Early Quantitative Efforts

During the early part of the 20th century it became apparent that chemical processes in biological cells were a result of sequences of separate chemical transformations. The first such sequence of steps discovered, later to be called a `pathway', was yeast glycolysis. Subsequently, many other pathways were discovered including the Calvin and Krebs cycle and the many pathways involved in amino acid biosynthesis and degradation. As early as the 1930s, various individuals began taking a theoretical interest in the dynamic properties of such pathways. Much of the early work focused on the question of limiting factors. This may have originated from a statement by Blackmam [Blackman:1905] in 1905 who stated as an axiom: "when a process is conditioned as to its rapidity by a number of separate factors, the rate of the process is limited by the pace of the slowest factor". This implied that the understanding of a complex system could be accomplished by identifying the limiting factor; and so was born the idea of the rate-limiting step, the pacemaker, the bottleneck, or master reaction.

### The Pacemaker

Although the idea of a pacemaker reaction in a pathway was extremely attractive, there were opponents to the idea even as early as the 1930s. Burton [Burton:1936] was probably one of the first to point out that: "In the steady state of reaction chains the principle of the master reaction has no application". Hearon [Hearon:1952] made a more general mathematical analysis and developed strict rules for the prediction of mastery in a linear sequence of enzyme-catalysed reaction. Webb [webb1963] gave a severe criticism of the concept of the pacemaker and of its blind application to solving problems of regulation in metabolism. Waley [Waley1964] made a simple but clear analysis of simple linear chains that showed that rate-limitingness was a shared commodity in a chain of reactions. Later authors from the biochemical community, such as Higgins [Hi63] but particularly Heinrich and Rapoport [HR74a] supported the same conclusion with more advanced analysis. In parallel with this work other communities were coming to the same conclusion. Most notably Sewell Wright, a geneticist, wrote a treatise on `Physiological and Evolutionary Theories of Dominance' [Wright1934] where he discussed the limiting factors in relation to hypothesized networks controlled by `genes'. This work was taken up by Kacser and Burns [KB73] in Edinburgh and was developed in to a major theory of control in pathways. Heinrich and Rapoport [HR74a] simultaneously accomplished the same feat but from a more biochemical perspective. Finally Savageau [SaCurrTop72] in the United States, an engineer by training, developed the same approach and reached similar conclusions.

## Prevailing Ideas

Nevertheless, although there was considerable theoretical and some experimental work that suggested that the concept of the pacemaker was erroneous, the biochemical community, for what ever reason, ignored these results. Instead the biochemistry community, which had largely morphed into molecular biology in the 1970s  developed its own framework for understanding the operating principles of cellular networks. This framework was derived largely through an intuitive approach, based neither on experimental evidence or mathematical reasoning. This ultimately led to a number of unfortunate miss-understandings in how cellular networks operate, misunderstandings that still prevail today.

One of the chief concepts in the traditional control framework is the pacemaker or rate-limiting step. The rate-limiting step is thought to be located near the start of a pathway and because it is rate-limiting, the pathway is controlled by this one key step. In addition, it is proposed that rate-limiting steps are likely to be the site for allosteric regulation. There were a number of criteria that are used to identify possible rate-limiting step though there was no real definitive test. These criteria included:

- The rate-limiting step is the slowest step in the pathway.
- The rate-limiting step has the lowest substrate-affinity (highest $K_m$), this means that the reaction velocity is the lowest when saturating substrate concentrations are present at all enzymes.
- The rate-limiting step will be the regulated step.
- The rate-limiting step is an irreversible reaction.
- The rate-limiting step is usually the first step in the pathway.
- The rate-limiting step is far from equilibrium.

No single criterion could positively identify a rate limiting step but the cross-over theorem is one that was considered important. The technique worked as follows. A metabolic pathway is perturbed by adding an inhibitor of one of the enzyme catalyzed steps and the metabolite concentrations before and after the inhibited step are measured. If the inhibited step is rate limiting then those metabolites upstream would increase and those downstream decrease. The technique was originally developed by Britton Chance [ChanceB:1955] in the 1950s as a means to study the electron transport chain in mitochondria. The advantage here was that many of the intermediates had characteristic absorption spectra. The method was used to identify the sites where electron transfer was being coupled to ATP production. Although applicable to the electron transport chain (Fell, 1996), its subsequent use to identify sites of regulation in metabolic pathways has been considered on theoretical grounds to be untrustworthy (Heinrich et al, 1974).

### Regulatory Enzymes and Feedback Regulation

A key concept in traditional metabolic control theory is that feedback regulation by an end product will necessarily act on the rate-limiting step. Control may also be exerted by inducing or repressing the synthesis of the rate-limiting enzyme. Rate-limiting enzymes could therefore be identified simply by locating regulated steps. For example, a classic rate limiting step in glycolysis was phosphofructokinase since it was regulated by many effectors. Such an assertion makes perfect sense if metabolism it seen as a series of connected pipes and tanks with valves(footnote: Taps or faucets depending on where you live in the world.} that turn on and off the flow of water. However metabolism is not like this, in particular the valves are part of the system and cannot be independently controlled of the pathway. This makes understanding how pathways are controlled much more subtle. Measurements (**ref**) have shown for example that phosphofructokinase is in fact not rate-limiting even though it is heavily regulated. Since the development of recombinant technology in the late 70s, the ability to control enzyme levels has become relatively easy. There are many experiments reported where over expression of a regulated step resulted in no change in the pathway flux even though such steps were considered rate limiting (**tryp reference, pfk and find others**). Even in the face of considerable experimental evidence the idea that regulated steps are rate limiting continues to persist.

## A Modern Understanding of Metabolism

Although the metabolic parts list is almost complete as witnessed by the development of genomic scale metabolic reconstruction (**ref**) our understanding of how metabolism operates is still primitive and incomplete. The last four decades however has seen some progress as described in the earlier chapters of this book. The traditional concepts of metabolic control described in the previous sections are logically untenable and many experiential measurements support this notion. In addition there are now many examples where metabolic engineers have discovered that the traditional approach is next to useless in predicting how to engineer a metabolic pathway. In this final chapter I will summarize some of the more modern operating principles that can help us understand and ultimately successfully engineer metabolic pathways.

## Operating Principles

- Democracy

**A living cell is a molecular democracy with distributed decision making.**

Possibly the most important key concept to understand is that the components of a cell do not act in isolation. This seems a very obvious thing to say but how may times do we hear about a key enzyme, a master protein, a hub, a hot spot or other metaphor in an attempt to reduce a complex system to one component. In practice we often try to simplify a complex problem down to a single entity. One example of this is related to circadian rhythms or any oscillatory system in a cell. The temptation is to find the `oscillatorphore', that single protein responsible for the oscillation. No such protein exists of course. The oscillator is the result of a collection of components acting together. Likewise in metabolism, the behavior we observe is the result of all enzymes acting in unison. The idea that a complex pathway can be distilled down to a single enzyme is too simplistic.

- Context

**The behavior of a part or set of parts only makes sense when related to its functional context.**

The influence that a cellular component has on the phenotype is always modified according to the context in which we find the component. This is related to the first principle but adds the qualifying point that the influence of a component can change according to context, and context can change according to the state of the organism.

- Operation

A living cell does not operate like a digital computer, with a program and a sequential operation. There have been many times in the past when we have tried to compare a digital computer to a living cell sugegsting that cells can be programmed just like a digital computer. This is no surprise since throughout history we have often tried to compare natural systems to what ever is the current major technological development at the time. Biological cells are however quite different from digital computers. Biological cells work in parallel, digital computer work in a sequential mode; biological cell process information in many ways, including analog and sometimes digital. The major problem in comparing a digital computer to a biological cell is that it puts the mind into the wrong mode of thinking and colors subsequent analysis of a biological system which can lead to incorrect conclusions.

- Rate-Limiting Steps

There is no such thing as a rate-limiting step, only degrees of limitingness which can be quantified.

- Systemic Property

Whether an enzyme limits flux or not is a systemic property and cannot be determined from looking at the enzyme alone.

- Front-Loading

In an unregulated pathway with only mass-action or Michaelis-Menten kinetics, sensitivity of the flux to enzyme changes is biased toward the front of the pathway.

- Feedback

Steps regulated by feedback control (or within the feedback loop) are insensitive to changes in enzyme activity (eg by gene expression changes of addition of inhibitors).

- Homeostasis

Metabolic feedback and the rarer feed-forward loops ensure homeostasis of metabolites far from equilibrium through the control of supply and demand. They are not involved in flux control.

- Flux Control

Flux control is achieved by targeted up or down regulation of a set of enzymes or entire pathways either by gene expression changes or much more rapid kinase/phosphatase action on enzymes

- Control is Dynamic

The ability of a give step to control a flux or concentration is dynamic and changes according to the state of the cell.

## Characteristics of a bootleneck?

What are they?

## `Excess' Enzymes

Many the misunderstandings of how metabolism operates can be blamed on the use of verbal logic, intuition and inappropriate analogies (such as connected tanks of water or traffic flow). A key area of confusion is the observation that some enzymes appear to be in excess. That is the Vmax of the enzyme exceeds by a wide margin the range of pathway fluxes that will flow through the enzyme. Without further analysis, it seems that evolution has made a mistake and is maintaining high levels of enzyme concentrations without any apparent fitness advantage. This however cannot be the case because any excess enzyme is likely to reduce the fitness of an organism and therefore by selection any excess enzyme will eventually disappear, and yet the excess enzyme observation is still discussed in the literature.

paradox

## Why are regulated enzymes regulated?

Text

## Further Reading

- Sauro HM (2012) Enzyme Kinetics for Systems Biology. Ambrosius Publishing. ISBN: 978-0982477311

## Exercises

- A question

---

← [[15_behavior_of_stochastic_models|Behavior of Stochastic Models]] · [[index|Wiki index]] · [[17_moiety_conserved_cycles|Moiety Conserved Cycles]] →

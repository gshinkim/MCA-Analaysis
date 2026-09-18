# Modeling Standards and Databases

*Source: `appendixH.tex` — Herbert M. Sauro, “Systems Biology: An Introduction to Pathway Modeling”, First Python Edition v1.22. Converted verbatim; nothing removed.*

Back to the wiki index: [[index]] · [[SKILL]]

---
# Modeling Standards and Databases <a id="app-standards"></a>

## Introduction

The last 10 years have seen a significant increase in the number of simulation tools, all of which use different formats to store models. It was soon realized that some form of standardization for model exchange was necessary. As a result, two proposed standards emerged: CellML [hedley:2001b] and SBML [hucka:2003d] (Systems Biology Markup Language). CellML is primarily a notation for representing biochemical models in mathematical form. SBML on the other hand uses a biologically inspired notation to represent networks from which a mathematical model can be generated. Each standard has its strengths and weaknesses, but SBML has a simpler structure compared to CellML, and as a result has more software support. Many software tools support import and export of SBML. Both standards have very active communities with intracellular models being primarily the domain of SBML and for physiological models CellML. Here we focus on SBML.

### SBML <a id="sec-sbml"></a>

SBML is based on XML and closely follows the way existing modeling packages represent models. For example, SBML represents biochemical networks as a list of chemical transformations. It employs specific and different elements to represent spatial compartments, molecular species, and parameters. In addition, SBML also has a provision for rules which can be used to represent constraints, derived values, and general math.

SBML (<sbml.org>), like any standard, has evolved with time. Major revisions of the standard are captured in levels, while minor modifications and clarifications are captured in versions. An example of a major change within the standard would be the use of MathML in level two of SBML, whereas level one encoded infix (common algebra) strings to denote reaction rates and rules. The most recent level of SBML is level three where new functionality can be supported through extension packages.

## Graphical Layout

Graphical modeling applications [bergmann2006computational] routinely enhance computational models by layout annotations. The SBML community devised a common standard on how to embed the layout information within SBML, called the Layout Extension. This extension [Guages2006] allows a model to store the size and dimension of all model elements, along with textual annotations and reactions. LibSBML has been modified to provide access to all elements of the Layout Extension. Several reference implementations also exist [bergmann2006computational, Deckard2007].

In addition to the layout extension mentioned previously, the community has also intoduced the Systems Biology Graphical Notation (SBGN) (<http://sbgn.org>) that aims to standardize the visual language of computational models. While this standard is still in development and, strictly speaking, is independent of the SBML effort, experience in other fields such as electrical engineering has demonstrated the essential need for standardizing the visual notation for representing models as diagrams.

## MIRIAM

Model Definition Languages such as SBML and CellML target the exchange of models. They aim to pass quantitative computational models from one software tool to another. Both communities agreed upon the Minimum Information Requested In the Annotation of biochemical Models (MIRIAM, [miriam]). These annotations make it possible to carry out searches for models with specific attributes in model repositories. This enables researchers to identify biological phenomena captured by a biochemical model and most importantly, it facilitates model reuse and composition.

In order for a model to be MIRIAM compliant, the model has to be encoded in a standard format such as SBML. Furthermore, it needs to be tied to a reference description, describing the properties and results obtained from the model. Parameters of the computational model have to be provided so it can be loaded into a simulation environment to reproduce the expected results. Other required information includes the model, the creator of the model, the date and time of the last modification, as well as a statement about terms of distribution.

## SBO -- Systems Biology Ontology <a id="sec-sbo"></a>

In order to assign meaning to model constituents, an ontology specific to Systems Biology was developed: The Systems Biology Ontology (SBO, <http://www.ebi.ac.uk/sbo/>). It consists of five controlled vocabularies and two relationships: *is-part-of* and *is-a*. Qualifying model participants such as enzymes, macromolecules, metabolites, or small species such as ions, makes it easier to generate meaning from a model. It also makes the generation of standard visual notations such as SBGN possible. Moreover, it provides help on how to interpret the model computationally, as the SBO allows describing a model as continuous, discrete or logical. One could even go a step further, making explicit kinetic rate laws in a model obsolete. This could be done by referencing the appropriate ontology identifier (e.g. tagging a reaction as following Henri-Michaelis Menten enzyme kinetics and specifying the parameters). The SBO is community driven and new terms or modifications to the existing ontology can be requested by the community.

## Other Ontologies and Formats

The most recent developments in the CellML and SBML communities revolve around the creation of ontologies and refining exchange semantics. Apart from classifying model constituents with an appropriate ontology, one current area of interest is describing the dynamical behavior of a model. The "Terminology for the Description of Dynamics" (TEDDY, (footnote: <http://www.ebi.ac.uk/compneur-srv/teddy/>}) provides a rich ontology to describe and quantify what kinds of behavior a computational model can exhibit (e.g. the characteristics of a model could describe bifurcation behavior whereas the functionality of a model could be described as oscillations or switch behavior). However, knowing that a model exhibits interesting behavior is not usually enough. More information is needed in order to recreate that behavior. The "Minimum Information About a Simulation Experiment" (MIASE, (footnote: <http://www.ebi.ac.uk/compneur-srv/miase/>}) project focuses on this problem. MIASE helps to describe the simulation algorithms and the simulation tools used along with all needed parameter settings. Towards this end, one can use the Kinetic Algorithm Ontology (KiSAO) which relates simulation algorithms and methods to each other. As these ontologies are still currently under development, it will be interesting to see how they evolve and are adopted by the community.

Lastly, we should mention BioPAX [BioPax:2007] which stands for Biological Pathway Exchange. BioPAX is an XML based format that will act as a bridge between different pathway databases and data. In relation to modeling software, BioPAX may offer a means to embed rich annotation data into an SBML or CellML model. Some of this capability is being addressed to a limited extent by the new ontologies being developed at EBI in Cambridge, UK. However, BioPAX may offer a useful complementary way to bind pathway data to computational models.

## Human Readable Formats

SBML and CellML are formats that use XML to represent information. One advantage to using XML is that there is much software available to assist in reading and manipulating XML based data. However, XML is not suited for human consumption; it is designed strictly to be read by computer software. In order for humans to build and read models, human-readable formats are required. Often these are text-based or graphical in nature. With respect to text based formats, there has been a long tradition to using human readable formats for representing
biochemical models, starting with BIOSSIM [Garfinkel:1970]. Other examples of early human readable formats include works by Park [PW73] and Burns [Bu71]. In recent years simulators such as SCAMP [SauroF91] and METAMOD [HM86] also introduced human-readable formats to define models. Both software tools were subsequently developed into Jarnac and PySCeS, respectively.

Other formats of interest include languages that support modular development of models by Smith and Sauro [smith2009antimony] at the University of Washington (called Antimony), and Michael Pederson at the University of Edinburgh [Pederson:LBS:2008]. Blinov, Faeder, Goldstein and Hlavacek developed BioNetGen [Blinov:2004] which is a rules based format for representing systems with multiple states. Cyto-Sim incorporates an interesting human-readable language for representing biochemical systems. The SBML community [SBMLShortHand] has also developed a human-readable script called SBML-shorthand. This notation maps directly onto SBML but is much easier to hand write SBML. The shorthand is also much less verbose and uses infix to represent expressions rather than MathML. Finally, we should mention a Lisp based language called little b (<http://www.littleb.org/>) being developed at Harvard University. The aim of little b is to allow biologists to build models quickly and easily from shared parts.

## Databases

Along with the standardization of model representation, there has been a desire to create model repositories where models published in journals can be stored and retrieved. There are currently five repositories with varying degrees of quality and usability. The most promising is the UK based BioModels Database, which at the current time (July 2013) holds over nine hundred and sixty three curated and working models that can be downloaded in standard SBML and other formats. BioModels also has the great benefit of providing programmatic access to its database via web services, which allows any software program to access the database seamlessly across the internet. Models stored in the BioModels Database are curated, meaning that models will reproduce the author's original intention. In addition, the models are liberally annotated, so model components can be referenced from other database sources.

Another large database has been assembled by the CellML community [Lloyd:2008]. From their site one can convert the CellML into standard C code for compilation into a working model.

The JSim group at the University of Washington has a large database of physiological models <http://nsr.bioeng.washington.edu/Models/> stored in the mathematical language used by the JSim simulation application.

Another useful database is the JWS online database developed by Brett Olivier and Jacky Snoep [olivier:2004] which has over seventy working models. JWS allows export in both SBML and the script format PySCeS which can be easily translated to other formats such as Jarnac script.

Another database called, DOQCS <http://doqcs.ncbs.res.in/>focuses on signaling networks and contains over two hundred models. Models in DOQCS can only be downloaded in Genesis format [kinetikit:2002] however, which limits portability to other frameworks.

---

## Index terms recorded in this chapter

- BioModels
- BioNetGen
- BioPAX
- CellML
- database
- databases
- DOQCS
- graphical layout
- JWS online
- KiSAO
- layout extension
- libSBML
- little b
- MIASE
- MIRIAM
- ontologies
- PySCeS
- SBGN
- SBML
- SBML-shorthand
- SBO
- standards
- systems biology ontolog

---

← [[appendix_g_statistics_reminder|Statistics Reminder]] · [[index|Wiki index]] · [[appendix_i_modeling_with_python|Modeling with Python]] →

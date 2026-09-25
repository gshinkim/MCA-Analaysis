"""Training-data generator for the skill-routing classifier.

Writes train.jsonl next to this file. Labels come only from policy(); requests are
drawn from hand-written phrase banks, slot-filled and augmented. Any example whose
normalized request equals a request in test.jsonl (if present) is dropped.
Python 3 stdlib only. Run: python3 data.py
"""
import json
import random
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SEEDS = HERE.parent / "backend" / "router-eval" / "cases.jsonl"
ORDER = ["mca", "pathway-modeling", "tellurium"]
SEED = 1234
TARGET = {"off": 600, "ask": 1480, "build": 820, "cont": 110}
MIDTURN_ON = 0.40   # on-topic share that is mid-turn  -> ~35% overall
MIDTURN_OFF = 0.04

REFUSED = "write_file workspace/model.txt -> REFUSED — building or changing the model needs the pathway-modeling Skill."


# --------------------------------------------------------------------------- policy
def _ontopic_call(line):
    return line.startswith(("load_skill", "run_python", "run_mca_workflow",
                            "write_file workspace/model", "read_file workspace/"))


def policy(intent, loaded, recent):
    """intent = {"kind": "off"|"ask"|"build"|"cont"} -> ordered list of skills still needed."""
    kind = intent["kind"]
    if kind == "cont":  # rule 4: a continuation inherits the intent the tool calls show
        if not any(_ontopic_call(l) for l in recent):
            return []
        kind = "build" if any(l.startswith("write_file workspace/model") for l in recent) else "ask"
    if kind == "off":  # rule 1
        return []
    need = {"mca", "tellurium"}  # rule 2
    if kind == "build" or any(" -> REFUSED" in l or " -> REJECTED" in l for l in recent):  # rule 3
        need.add("pathway-modeling")
    return [s for s in ORDER if s in need and s not in loaded]  # rule 5


def self_check():
    ask, build, off, cont = ({"kind": k} for k in ("ask", "build", "off", "cont"))
    assert policy(off, [], []) == []
    assert policy(off, ["mca"], ["load_skill mca -> ok"]) == []
    assert policy(ask, [], []) == ["mca", "tellurium"]
    assert policy(build, [], []) == ["mca", "pathway-modeling", "tellurium"]
    assert policy(ask, [], [REFUSED]) == ["mca", "pathway-modeling", "tellurium"]
    rej = "write_file workspace/model.txt -> REJECTED — that Antimony does not load: syntax error at line 3"
    assert policy(ask, ["pathway-modeling"], ["load_skill pathway-modeling -> ok", rej]) == ["mca", "tellurium"]
    assert policy(build, ["tellurium", "pathway-modeling"], []) == ["mca"]
    assert policy(ask, ["mca", "tellurium"], ["run_python -> ok"]) == []
    assert policy(cont, [], ["run_python -> ok"]) == ["mca", "tellurium"]
    assert policy(cont, ["mca"], ["write_file workspace/model.txt -> ok"]) == ["pathway-modeling", "tellurium"]
    assert policy(cont, [], []) == []
    assert policy(build, ORDER, ["write_file workspace/model.txt -> ok"]) == []


# --------------------------------------------------------------------------- slots
SLOTS = {
    "pw": ["glycolysis", "the TCA cycle", "the MAPK cascade", "a toggle switch", "the repressilator",
           "a linear chain S1 -> S2 -> S3", "a branched pathway", "the pentose phosphate pathway",
           "upper glycolysis", "a three-step linear pathway", "a covalent modification cycle",
           "the urea cycle", "fatty acid oxidation", "a two-enzyme pathway", "a feedback-inhibited pathway",
           "serine biosynthesis", "the lac operon", "a phosphorylation cycle", "yeast glycolysis",
           "the Krebs cycle", "a four-step pathway", "a linear pathway X0 -> S1 -> S2 -> X1",
           "the threonine pathway", "a gene regulatory circuit", "the glycogen pathway",
           "a negative feedback loop", "a futile cycle", "the EGFR pathway", "a metabolic chain",
           "tryptophan biosynthesis", "a simple enzyme cascade", "a Goldbeter-Koshland switch"],
    "enz": ["PFK", "hexokinase", "pyruvate kinase", "citrate synthase", "PGI", "aldolase", "GAPDH",
            "E1", "E2", "E3", "the first enzyme", "the last enzyme", "MEK", "ERK", "Raf",
            "isocitrate dehydrogenase", "the kinase", "the phosphatase", "phosphofructokinase",
            "enzyme 2", "the transporter", "HK", "PK", "aspartokinase", "G6PDH"],
    "sp": ["S1", "S2", "S3", "S4", "X", "ATP", "ADP", "G6P", "F6P", "FBP", "pyruvate", "glucose",
           "NADH", "ERK-PP", "protein P", "mRNA", "A", "B", "Xo", "citrate", "lactate", "cAMP",
           "the product", "the intermediate", "M1", "P", "Y", "Glc", "AcCoA"],
    "rx": ["J1", "J2", "J3", "J4", "v1", "v2", "v3", "R1", "R2", "reaction 2", "the PFK step",
           "the uptake reaction", "J0", "the export step", "the last step", "the first reaction",
           "_J0", "vHK", "v_pfk", "the degradation reaction"],
    "p": ["k1", "k2", "k3", "Vmax1", "Vmax", "Km", "Ki", "Vm2", "kcat", "the Hill coefficient",
          "k_deg", "Ki1", "Km2", "E1", "n", "Vf", "Keq", "kf", "kr", "the inhibitor concentration",
          "Xo", "the input flux", "alpha", "beta", "K_I"],
    "n": ["0.1", "0.5", "1", "2", "5", "10", "50", "100", "200", "1000", "0.01", "3", "20", "0.2", "25"],
    "t": ["10", "20", "50", "100", "200", "500", "1000", "60", "300", "5000"],
    "csv": ["data.csv", "workspace/runs/data.csv", "my_timecourse.csv", "exp1.csv", "the uploaded csv",
            "measurements.csv", "the file I uploaded"],
    "err": ["AttributeError: 'RoadRunner' object has no attribute 'getCC2'",
            "CVODE Error: CV_TOO_MUCH_WORK", "CV_CONV_FAILURE", "Steady state failed to converge",
            "NameError: name 'te' is not defined", "KeyError: 'S4'", "Unable to find variable 'k9'",
            "ModuleNotFoundError: No module named 'tellurium'", "the Jacobian is singular",
            "NLEQ2 failed", "invalid selection string", "IndexError: index 3 is out of bounds"],
    "mod": ["negative feedback from {sp} onto {enz}", "a second enzyme", "a degradation reaction for {sp}",
            "a new species {sp}", "a competitive inhibitor of {enz}", "a mitochondrial compartment",
            "an event that doubles {p} at t={t}", "a reversible step between {sp} and {sp}",
            "an allosteric activator of {enz}", "a branch that drains {sp}", "product inhibition on {enz}",
            "a source reaction feeding {sp}", "a sink for {sp}", "an ATP/ADP conserved moiety",
            "feedforward activation from {sp} to {enz}", "a Hill-type repression term",
            "a transport reaction into the cytosol", "a leak reaction", "positive feedback on {enz}",
            "a phosphatase that reverses {rx}", "an extra step after {sp}", "a boundary species Xo"],
}
QUANT = ["the flux control coefficients", "the elasticities", "the concentration control coefficients",
         "the response coefficients", "the steady state", "the Jacobian", "the eigenvalues",
         "a time course", "the stoichiometry matrix", "the conservation laws", "the control coefficient matrix",
         "the scaled elasticity matrix", "the steady-state fluxes", "the unscaled elasticities",
         "the FCC of {rx}", "the control of {enz} over flux", "the link matrix", "the rate-limiting step",
         "the loop gain", "the sensitivity of {sp} to {p}", "the CCCs for {sp}", "the elasticity of {rx} to {sp}"]


def fill(t, rng):
    for _ in range(3):  # slots may contain slots
        t = re.sub(r"\{(\w+)\}", lambda m: rng.choice(SLOTS[m.group(1)]) if m.group(1) in SLOTS else m.group(0), t)
    return t


def lines(s):
    return [l.strip() for l in s.strip().splitlines() if l.strip()]


# --------------------------------------------------------------------------- banks
# ask, refers to the current model (model: has model)
ASK_MODEL = lines("""
Compute the flux control coefficients for this model
Calculate all the scaled elasticities
What's the flux control coefficient of {rx} on the pathway flux?
Which enzyme has the most control over the flux?
Which step is rate-limiting here?
Is {enz} really the rate-limiting enzyme in this model?
How is flux control distributed among the enzymes?
Give me the concentration control coefficients for {sp}
Compute the response coefficient of the flux to {p}
Verify the summation theorem numerically on this model
Check that the connectivity theorem holds for {sp}
Do the flux control coefficients add up to 1 here?
Get the elasticity of {rx} with respect to {sp}
Print the full elasticity matrix
Show me the unscaled control coefficient matrix
Rank the reactions by how much flux control they have
Why is the control coefficient of {rx} negative?
Why do my concentration control coefficients sum to zero?
The FCC of {enz} came out bigger than 1, is that possible?
how much does the steady state flux change if I double {enz}
If I increase {p} by 10%, how much does the flux go up?
Compute the loop gain of the feedback in this model
How strong is the feedback inhibition on {enz}? quantify it
Does the feedback shift control downstream?
Compare the control coefficients with and without feedback by setting {p} to zero
Simulate the model for {t} seconds
Run a time course from 0 to {t}
Plot {sp} and {sp} over time
simulate and plot everything
Run the simulation with {t} points up to t={t}
Show me the time course of all species
What does {sp} do over time?
Does the system actually reach a steady state?
Find the steady state
What are the steady-state concentrations?
What's the steady-state flux through {rx}?
Compute the steady state and report all the fluxes
Scan {p} from {n} to {n} and plot the steady-state flux
Do a parameter scan over {p}
How does {sp} respond as I vary {p}?
Sweep the level of {enz} and plot the flux response
Make a dose-response curve of {sp} against {p}
Plot the flux as a function of {p} on a log scale
Plot the results
Redo the plot with axis labels and a legend
Plot {sp} against {sp} as a phase plane
Draw the reaction network diagram
Save the last plot as a PNG
Export the model as SBML
Save the current model as an SBML file
Give me the SBML for this model
Convert the model to MATLAB code
Export the simulation results to CSV
Package the model and a simulation into a COMBINE archive
Is this steady state stable?
Compute the Jacobian at steady state
What are the eigenvalues of the Jacobian?
Is the system oscillating? check the eigenvalues
Why does this model oscillate?
Is this model bistable?
Find both stable states of the switch
Look for a Hopf bifurcation as {p} changes
Is there hysteresis when I sweep {p} up and then back down?
Plot a bifurcation diagram for {p}
Fit {p} and {p} to the data in {csv}
Estimate the parameters from my time-course data in {csv}
How well does the model fit the data? compute the residuals
Give me confidence intervals for the fitted parameters
Are {p} and {p} identifiable from this data?
Run a Gillespie simulation of this model
Run 50 stochastic trajectories and plot the mean
How noisy is {sp} in a stochastic run?
Why am I getting a CVODE error when I simulate?
simulate fails with CV_TOO_MUCH_WORK, what do I do
roadrunner says {err}
I get "{err}" when I run my script
steadyState() won't converge, help
My getCC call throws an error
Why is getEE returning nan?
The simulation output is completely flat, what's wrong?
Why does {sp} go negative in my simulation?
What do these control coefficients mean?
Interpret the scan results for me
Explain what the elasticity numbers are telling us
Is a flux control coefficient of 0.8 for {enz} a lot?
Summarize the MCA results for this model
Compare the flux at {p} = {n} with {p} = {n}
How does the steady state change between the two conditions?
Compare the control distribution at high and low {sp}
What happens to the flux if I inhibit {enz} by 50%?
Set {p} to {n} and simulate again
Change {p} to {n} for this run and recompute the steady state
Reset the model and rerun the simulation
What are the conserved moieties in this model?
Show me the stoichiometry matrix of this model
Compute the link matrix
What's the rank of the stoichiometry matrix here?
List the reactions and species in the current model
What rate laws does this model use?
What parameters does the model have and what are their values?
Why is the Jacobian singular for this model?
How many independent species are there?
which reaction controls the flux the most
where is the bottleneck in this pathway
is the flux more sensitive to {enz} or {enz}
how sensitive is {sp} to {p}
compute sensitivities of all species to all parameters
does {enz} have any control at all
why does {enz} have almost zero control
what would happen to {sp} if {enz} was overexpressed 5 fold
simulate a 50% knockdown of {enz} by lowering its Vmax
how long does it take to reach steady state
what is the time constant of the relaxation to steady state
does the model conserve mass?
check if the elasticities are consistent with the rate laws
validate the MCA numbers you got
double check the control coefficients with a finite difference
compute the FCCs by perturbing each Vmax by 1%
are the control coefficients the same at a different steady state?
what's the flux through each branch of the pathway
how does control split between the two branches
check the branch-point theorem on this model
plot the elasticities as a bar chart
plot the control coefficients as a heatmap
make a bar chart of the FCCs
give me a table of all control coefficients
run the model to t={t} and show me the final values
what are the initial conditions right now
change the initial concentration of {sp} to {n} and rerun
rerun with {sp} starting at zero
simulate with tighter tolerances
switch the integrator to gillespie and run it
use the rk45 integrator instead of cvode
increase the number of output points to {t}
show only {sp} in the plot
plot the fluxes, not the concentrations
plot the rates of every reaction over time
what's the maximum value {sp} reaches
when does {sp} peak
what's the period of the oscillation
measure the amplitude of the oscillations in {sp}
does the oscillation persist or damp out
find the steady state starting from a different initial condition
are there multiple steady states
compute the nullclines of {sp} and {sp}
how far is the system from equilibrium
what's the mass-action ratio of {rx} compared to Keq
how close to equilibrium is {rx}
is {rx} near-equilibrium or far from it
compute the disequilibrium ratio for each reaction
what's the control coefficient of the flux with respect to {enz} at steady state
how does control of {enz} change as I increase {p}
scan {p} and plot how the FCC of {rx} changes
plot the control coefficients as a function of {sp}
Can you compare this model's control pattern with textbook {pw}?
how does the feedback strength affect stability
at what value of {p} does the system lose stability
find the value of {p} where the oscillations start
run a 2D scan over {p} and {p}
make a heatmap of the flux across {p} and {p}
what's the steady-state flux when {p} is {n}
explain these results to me
why did the steady state solver fail
fix my tellurium script, it crashes with {err}
my simulation is super slow, how do I speed it up
why is the plot empty
why is r.getSteadyStateValues() different from the last simulate row
the fluxes don't balance at steady state, why
is this result physically reasonable?
does this model behave like real {pw}?
""")

# ask, conceptual / general (model: either)
ASK_CONCEPT = lines("""
Explain the summation theorem
What is the connectivity theorem?
What's the difference between an elasticity and a control coefficient?
Define a flux control coefficient
What does a concentration control coefficient measure?
What is a response coefficient and how does it relate to elasticities?
Explain the partitioned response property
What is metabolic control analysis?
Give me a quick intro to MCA
Why isn't there usually a single rate-limiting step?
What does the branch-point theorem say?
Explain front loading in metabolic pathways
How does negative feedback redistribute flux control?
What is loop gain in a feedback pathway?
Explain ultrasensitivity in covalent modification cycles
What is zero-order ultrasensitivity?
How do signalling cascades amplify a signal?
What are moiety conservation laws?
What is a conserved cycle?
Explain elasticities for Michaelis-Menten kinetics
What's the elasticity of an irreversible Michaelis-Menten enzyme at saturation?
Derive the flux control coefficients for a two-step pathway
Show that flux control coefficients sum to one
How do you get control coefficients from elasticities?
Explain the matrix method in MCA
How are the Jacobian and stability related?
When is a steady state stable?
What makes a biochemical system bistable?
Explain hysteresis in biochemical switches
How does the repressilator oscillate?
What is a Hopf bifurcation?
What is a stoichiometry matrix?
Explain Michaelis-Menten kinetics and its assumptions
What does the Hill coefficient tell you?
How does a competitive inhibitor change the apparent Km?
What's the difference between deterministic and stochastic simulation?
When should I use Gillespie instead of ODEs?
How do I estimate parameters from time-course data?
What is a feedforward loop motif?
What's the difference between a steady state and equilibrium?
Explain the quasi-steady-state assumption
What is the Jacobian of a pathway model?
What is SBML?
What's the difference between SBML and Antimony?
What is libRoadRunner?
What is tellurium used for?
What does te.loada do?
What's the difference between getCC and getEE in roadrunner?
Which integrator does roadrunner use by default?
How do I change the integrator tolerances in roadrunner?
How do I run a parameter scan in tellurium?
How do I plot only some species in tellurium?
What does r.reset() do compared to r.resetAll()?
What is supply-demand analysis?
What does rate-limiting mean in MCA terms?
Can a flux control coefficient be negative?
Why do concentration control coefficients sum to zero?
What does it mean when an elasticity is zero?
What's co-response analysis?
How does enzyme saturation affect flux control?
what is metabolic flux
Explain homeostasis in terms of control analysis
Why does product inhibition matter for control?
How can I tell whether a model will oscillate?
What's the difference between local and global sensitivity analysis?
Explain parameter identifiability
What is MCMC used for in model fitting?
What is stochastic focusing?
What is transcriptional bursting?
How does a genetic toggle switch work?
What controls glycolytic flux in yeast?
Which enzyme controls the flux in {pw}?
Is PFK the rate-limiting enzyme of glycolysis?
What regulates flux through the TCA cycle?
How does the MAPK cascade become ultrasensitive?
For a two-step pathway with elasticities {n} and -{n}, what are the flux control coefficients?
If the elasticity of E1 to S is -{n} and of E2 is {n}, what's C_E1?
What's the FCC of a step that's at equilibrium?
Why do enzymes near equilibrium have little control?
Is the enzyme with the highest Vmax the one with the least control?
What does a control coefficient of 1 mean?
How does feedback make a pathway robust?
Why is flux control shared among enzymes?
What's the unscaled vs scaled control coefficient?
Explain why flux control coefficients sum to 1 intuitively
What's the difference between control and regulation in MCA?
What did Kacser and Burns show?
What is the Heinrich-Rapoport approach?
How is MCA related to sensitivity analysis?
Why can't you just overexpress the rate-limiting enzyme to increase flux?
What's the difference between a boundary species and a floating species?
What are amounts vs concentrations in roadrunner?
How are events handled in roadrunner simulations?
How does roadrunner compute steady states?
What's the difference between NLEQ2 and the newton solver?
What's the link matrix used for?
How do conservation laws affect the Jacobian?
What is a reduced stoichiometry matrix?
How do you compute eigenvalues for a biochemical network?
What do complex eigenvalues mean for a pathway?
What does a positive real eigenvalue mean?
How do I know if a steady state is a saddle?
What is a limit cycle?
Explain relaxation oscillators
What is a bifurcation diagram?
What's the difference between reversible and irreversible Michaelis-Menten?
What's the Haldane relationship?
What are mass-action kinetics?
What is a rate law?
Why does the Hill equation give sigmoidal curves?
What's allosteric regulation?
What is a futile cycle and why does it matter?
What's cooperativity in enzyme kinetics?
What's the difference between Km and Kd?
How does the steady state depend on the boundary conditions?
What's a good way to fit a kinetic model to data?
What's the least-squares objective for model fitting?
What is profile likelihood?
How many data points do I need to fit {n} parameters?
What's the difference between sloppy and identifiable parameters?
How does noise scale with copy number in the Gillespie algorithm?
What is the Fano factor?
Why are stochastic trajectories different each run?
What's a propensity function?
How does the tau-leaping method work?
What's a stiff ODE system and why does CVODE handle it?
What does CV_TOO_MUCH_WORK mean?
What does 'steady state failed to converge' usually mean?
Why would steadyState return a negative concentration?
Is PFK a good drug target from a control perspective?
How does ATP demand control glycolysis?
What is flux-balance analysis and how is it different from MCA?
what is a elasticity coefficient
whats a control coefficient
how do feedback loops affect pathway stability
what determines the period of a biochemical oscillator
what is a steady state in a metabolic pathway
explain enzyme kinetics simply
why do pathways have negative feedback
what is the response of a pathway to an inhibitor
""")

# ask frames around quantities -> many distinct skeletons
ASK_FRAMES = lines("""
compute {q}
calculate {q} for me
what are {q}?
can I see {q}
show {q}
I need {q}
give me {q} please
how do I get {q} in tellurium?
get {q} from roadrunner
report {q} at steady state
what does {q} look like for this model
explain {q}
""")

# build, new model (model: mostly empty)
BUILD_NEW = lines("""
Build a model of {pw}
Build a model of a linear three-step pathway X0 -> S1 -> S2 -> X1 with Michaelis-Menten kinetics
Write me an Antimony model of {pw}
Create a kinetic model of {pw} with {enz} and {enz}
Make a toggle switch model with two mutually repressing genes
Create a gene expression model with transcription, translation and degradation
Set up a repressilator model
I need a model of {pw} to play with
Write the Antimony for a branched pathway with two outputs
Construct a model of the MAPK cascade with three tiers
Model {pw} with mass-action kinetics
Make a simple enzyme model S + E <-> ES -> E + P
Create a model of a covalent modification cycle with a kinase and a phosphatase
Build a stochastic model of a birth-death process for mRNA
Set up a Gillespie model of gene expression with bursting
Make a new model of {pw} from scratch
Write a model of upper glycolysis with hexokinase, PGI and PFK
Build a feedback-inhibited linear pathway with 4 steps
Draft a kinetic model of {pw} in Antimony
start a new model: {pw}
new model please, {pw} with reversible steps
Create a two-compartment model with transport between cytosol and mitochondria
Build a model with an event that adds glucose at t={t}
Build a model of a futile cycle between F6P and FBP
Make a model where {sp} is produced at a constant rate and degraded linearly
Implement the Goldbeter-Koshland switch as a model
Write an oscillator model with delayed negative feedback
Set up a model of a bistable switch with positive feedback
Create an SIR-like enzyme model with Hill kinetics
Write a model of {pw} with irreversible Michaelis-Menten steps
Build me a model of the TCA cycle with citrate synthase and isocitrate dehydrogenase
Make me a minimal model of glycolytic oscillations
Build a supply-demand model with ATP production and consumption
Construct a pathway with a branch point at {sp}
Build a model of {pw} and compute its control coefficients
Create a model of {pw} and simulate it
Write a model of {pw} and find its steady state
Build {pw} and tell me which step is rate-limiting
Write a model with a linear chain of 5 reactions and feedback from the end product
Make a model with a conserved ATP/ADP pool
Build a model of a signaling cascade with ultrasensitivity
Create a model with a feedforward loop motif
Set up a model of a gene that represses itself
Make a model of enzyme induction by a substrate
Write a Hill-function toggle switch in Antimony
Create a lac operon model
model {pw} for me
I want a model of {pw} with feedback inhibition from the final product
Make a model for my homework: two enzymes in series, first one reversible
Can you replicate the Teusink yeast glycolysis model in simplified form?
Generate an Antimony file for {pw}
Put together a model of {pw} I can use for MCA
Write a model with S1 -> S2 -> S3 where S3 inhibits the first step
Write a three-gene repressilator with mRNA and protein
Build an ODE model of {pw}
Create a model with a moiety-conserved cycle of NADH and NAD
Make a model of a phosphorylation cascade with two kinases
""")

# build, change existing model (model: has model)
BUILD_EDIT = lines("""
Add negative feedback from {sp} onto the first enzyme
Change the rate law of {rx} to reversible mass action
Add a conserved moiety ATP/ADP to the model
Set up a stochastic version of this model and run a Gillespie simulation
Add a second enzyme to the pathway
Remove reaction {rx} from the model
Delete species {sp} from the model
Replace the Michaelis-Menten rate law on {rx} with a Hill function
Make {rx} reversible
Make {rx} irreversible
Add an inhibitor that acts on {enz}
Split {rx} into two steps
Add a new reaction converting {sp} to {sp}
Add a degradation term for {sp}
Turn {sp} into a boundary species
Make {sp} a floating species instead of fixed
Add product inhibition to {enz}
Put the model inside a compartment called cell
Add a second compartment and a transport reaction
Add an event that sets {p} to {n} at t={t}
Rewrite the model so {enz} is an explicit species
Add allosteric activation of {enz} by {sp}
Add a branch from {sp} to a new product
Change the stoichiometry of {rx} to 2 {sp} -> {sp}
Add a reaction that consumes ATP
Convert the model to a gene expression model with mRNA
Add a feedforward activation from {sp} to {enz}
Change the kinetics of {rx} to random-order bi-bi
Replace {rx} with two reactions in parallel
Add cooperativity to the feedback, Hill coefficient 4
Add a leak reaction out of {sp}
Add Hill repression of {enz} by {sp}
Rename species {sp} to {sp} in the model
Add an assignment rule for total ATP
Fix the syntax error in the Antimony model
The model doesn't load, fix the Antimony
Make the model stochastic-ready with integer molecule counts
Add a new species {sp} produced by {rx}
Modify the model so that {sp} activates {rx}
Extend the pathway by one more step after {sp}
Make the first step depend on {sp} with Michaelis-Menten kinetics
Change the rate law for {rx} to include competitive inhibition by {sp}
Add a reverse reaction for {rx}
Remove the feedback loop from the model
Take out the inhibition of {enz}
Insert an intermediate between {sp} and {sp}
Swap the mass action kinetics for Michaelis-Menten everywhere
Add a positive feedback loop to make the model bistable
Add a delay to the feedback so it oscillates
Couple this pathway to an ATP regeneration reaction
Add a second copy of the pathway in a different compartment
Build a version of this model with feedback and compare control coefficients
Add feedback to the model and see how the FCCs change
Add a demand reaction for {sp} and recompute the steady state
Add {mod} to the model
Add {mod}
Put {mod} into the model
Include {mod}
Extend the model with {mod}
I want {mod} in this model
Modify the model to have {mod}
Edit the Antimony to add {mod}
Rewrite the model with {mod}
Can the model have {mod}?
Now add {mod} and resimulate
Give the model {mod}
""")

# off-topic (model: either)
OFF = lines("""
hi
hello!
hey there
good morning
thanks, that's all
thank you so much
thanks!
ok cool
bye
lol
nice
you're awesome
how are you today?
What's the capital of France?
Rename this chat to glycolysis
Write a haiku about enzymes
How do I change the theme of the app?
Which AI model are you?
What model are you running on?
Are you GPT-4 or Claude?
Can I switch to a different language model in settings?
Which LLM powers this app?
How do I set my API key?
Where do I put my OpenAI key?
How do I export this chat?
Export this conversation as markdown
Can I download the chat as a PDF?
Rename this chat to TCA analysis
Rename the project to {pw} notes
Create a new project called glycolysis
Delete the project named MAPK
How do I make a new project?
Where are my projects saved?
How do I switch projects?
How do I delete this chat?
Clear the chat history
Turn on dark mode
Make the font bigger
How do I change the settings?
Where is the settings page?
How do I log out?
Is there a keyboard shortcut to send a message?
How do I upload a file in this app?
Can you see my screen?
Why is the app so slow today?
Write a poem about enzymes
Write a poem about glycolysis
Write a short story about a lonely enzyme
Write a limerick about ATP
Tell me a joke about biochemists
Write a rap about the Krebs cycle
Compose a sonnet about mitochondria
Make up a song about hexokinase
Write a funny tweet about PFK
Write a bedtime story about a molecule of glucose
Give me a pun about enzymes
What's the weather like in Seattle?
Who won the World Cup in 2022?
What's 17 times 23?
Recommend a good sci-fi book
What should I eat for dinner?
How tall is Mount Everest?
Translate "good morning" into Spanish
Summarize the plot of Hamlet
What's the population of Japan?
Who painted the Mona Lisa?
What's the speed of light?
How do black holes form?
What's the half-life of carbon-14?
Explain the theory of relativity
Explain how neural networks work
What is a transformer model in machine learning?
How do I fine-tune BERT?
What is ModernBERT?
How do I train a PyTorch model?
Fit a linear regression model in sklearn on house prices
What's the best car model for a family?
Who is the most famous fashion model?
How do I reverse a list in Python?
What's the difference between a list and a tuple in Python?
Write a Python function to sort a dictionary by value
How do I read a JSON file in Python?
Fix my JavaScript: undefined is not a function
How do I center a div in CSS?
How do I install numpy?
What does git rebase do?
Write a SQL query to count users by country
How do I make a React component?
Explain Python decorators
What's a lambda function?
How do I use regular expressions in Python?
How do I set up a virtual environment?
Why is my for loop so slow in Python?
Write a bash script to rename files
How do I merge two pandas dataframes?
Help me write a cover letter
Draft an email to my professor asking for an extension
How do I cite a paper in APA format?
Give me tips for studying for finals
How do I stay motivated during a PhD?
What's a good gift for my mom?
Plan a 3 day trip to Tokyo
Tell me a fun fact
What day is it today?
What can you do?
Who made you?
What's your name?
Are you sentient?
Can you remember our previous chats?
Do you store my data?
Is this app free?
How much does this app cost?
How do I report a bug in the app?
Can I share this chat with my lab?
How do I rename the model file in the sidebar?
What does the gear icon do?
How do I resize the panels?
Can I change the chat font?
What keyboard shortcuts are there?
Where do exported files go?
Why did my chat disappear?
Restore my deleted chat
Pin this chat
How do I use this website?
Make a logo for my lab
Design a poster for a biochem club meeting
Write a motivational quote for scientists
Tell me about the history of the Roman Empire
What's the best programming language to learn?
How does the stock market work?
Explain blockchain
How do vaccines get approved?
What's the difference between a virus and bacteria?
What is the meaning of life?
Can you play chess?
What's 2+2?
Write a python script that scrapes a website
How do I use matplotlib subplots for my finance data?
What's the time complexity of quicksort?
Explain object-oriented programming
Write me a haiku about autumn
Write an ode to my coffee mug
I'm bored, entertain me
Tell me something interesting about octopuses
Which is better, vim or emacs?
How do I install a new theme in VS Code?
What's the difference between RAM and storage?
How do I format a hard drive?
help me pick a username
never mind
sorry, wrong chat
ignore that
test
asdf
ok
""")

OFF_FRAMES = lines("""
rename this chat to {x}
call this project {x}
create a project named {x}
write a poem about {x}
write a haiku about {x}
tell me a joke about {x}
write a song about {x}
""")
OFF_X = ["enzymes", "glycolysis", "PFK", "the TCA cycle", "mitochondria", "ATP", "my thesis", "MCA stuff",
         "feedback loops", "my lab", "roadrunner", "hexokinase", "the repressilator", "Monday", "science"]

CONT = lines("""
yes go ahead
continue
try again
ok do it
sure
yes please
go on
keep going
proceed
please continue
retry
do that
sounds good, go
yep
ok
fix it and rerun
go for it
that's fine, carry on
again
try that again
yes
fine
please fix that
finish it
do it
yes, that one
go ahead and fix it
ok continue from where you stopped
alright
sure thing, run it
yes do the rest
keep at it
one more time
redo it
""")

# seed requests from backend/router-eval/cases.jsonl: intent kind only (labels still from policy)
SEED_BUILD = {
    "Build a model of a linear three-step pathway X0 -> S1 -> S2 -> X1 with Michaelis-Menten kinetics",
    "Write me an Antimony model of glycolysis upper half with hexokinase and PFK",
    "Add negative feedback from S3 onto the first enzyme", "Change the rate law of J2 to reversible mass action",
    "Make a toggle switch model with two mutually repressing genes", "Add a conserved moiety ATP/ADP to the model",
    "Set up a stochastic version of this model and run a Gillespie simulation",
    "Create a gene expression model with transcription and translation and degradation",
    "Build a model of a linear pathway with feedback", "Add a second enzyme to the pathway",
    "Build a glycolysis model and compute its control coefficients",
}
SEED_OFF = {"hi", "thanks, that's all", "What's the capital of France?", "Rename this chat to glycolysis",
            "Write a haiku about enzymes", "How do I change the theme of the app?"}

# --------------------------------------------------------------------------- augmentation
IMPERATIVE = set("""compute calculate build simulate plot run add make write create find check export change set fit
show give explain derive estimate scan remove replace convert save draw tell list compare get do use try fix debug
rewrite extend insert delete include modify turn put model implement construct generate summarize describe perform
analyse analyze determine evaluate vary increase double sweep solve identify rank quantify interpret verify validate
print split swap couple update take start draft rename redo reset rerun switch look package measure edit
""".split())
POLITE = ["can you ", "could you ", "please ", "pls ", "I'd like you to ", "would you ", "can u ", "help me ",
          "i need you to ", "kindly ", "could you please "]
LEAD = ["hey, ", "hi! ", "hey ", "quick question: ", "ok ", "so ", "hmm, ", "question - ", "hello, ", "um ",
        "ok so ", "alright, ", "yo "]
TAIL = [" thanks", " thx", " please", " pls", "!", " :)", " asap", " - thanks in advance", " ty", "?", " thank you!",
        " when you get a chance", " cheers"]
CTX_ON = ["I'm working on {pw}.", "My PI asked me about this.", "For my systems biology homework:",
          "I have a model loaded already.", "Context: I'm studying {pw}.", "I'm new to this.",
          "I'm writing up my thesis chapter on {pw}.", "Following up on the last run.",
          "We're looking at {enz} in the lab.", "Quick one before group meeting.",
          "I'm trying to understand the results from earlier.", "Still on the {pw} project."]
TAIL_ON = ["Keep it brief.", "Show your working.", "Use the current model.", "I'm not sure where to start.",
           "Explain it simply.", "Give me numbers.", "Then summarise what you find.", "Be careful with units.",
           "No rush.", "This is for a paper, so be rigorous."]
CTX_OFF = ["Quick unrelated question.", "Random thought:", "Sorry, off topic:", "Totally different topic.",
           "Taking a break from work.", "Not about the model, but", "Something else:", "Unrelated, but"]


def typo(w, rng):
    if len(w) < 4 or not w.isalpha():
        return w
    i = rng.randrange(1, len(w) - 1)
    op = rng.randrange(3)
    if op == 0:
        return w[:i] + w[i + 1] + w[i] + w[i + 2:]
    if op == 1:
        return w[:i] + w[i + 1:]
    return w[:i] + w[i] + w[i:]


def augment(req, kind, rng):
    s = req
    first = s.split(" ", 1)[0].lower().strip(",.:")
    if rng.random() < 0.3:
        if first in IMPERATIVE and not s.startswith(("I ", "I'")):
            s = rng.choice(POLITE) + s[0].lower() + s[1:]
        else:
            s = rng.choice(LEAD) + s
    if rng.random() < 0.2:
        s = s.rstrip() + rng.choice(TAIL)
    if kind == "off":
        if rng.random() < 0.08:
            s = rng.choice(CTX_OFF) + " " + s
    elif kind != "cont":
        if rng.random() < 0.15:
            s = fill(rng.choice(CTX_ON), rng) + " " + s
        if rng.random() < 0.1:
            s = s.rstrip(".") + ". " + rng.choice(TAIL_ON)
    if rng.random() < 0.25:
        s = s.lower()
    if rng.random() < 0.2:
        s = re.sub(r"[?!.,]", "", s)
    if rng.random() < 0.15:
        ws = s.split(" ")
        for _ in range(rng.choice([1, 1, 2])):
            j = rng.randrange(len(ws))
            ws[j] = typo(ws[j], rng)
        s = " ".join(ws)
    return re.sub(r"\s+", " ", s).strip()


# --------------------------------------------------------------------------- requests
def ask_request(rng):
    r = rng.random()
    if r < 0.5:
        t, model = rng.choice(ASK_MODEL), "has model"
    elif r < 0.85:
        t, model = rng.choice(ASK_CONCEPT), rng.choice(["empty", "has model"])
    else:
        t = rng.choice(ASK_FRAMES).replace("{q}", rng.choice(QUANT))
        model = "has model" if rng.random() < 0.8 else "empty"
    s = fill(t, rng)
    if rng.random() < 0.08:  # two asks in one message
        s = s.rstrip(".?") + ". Also, " + fill(rng.choice(ASK_MODEL + ASK_CONCEPT), rng)
    return s, model


def build_request(rng):
    if rng.random() < 0.45:
        t, model = rng.choice(BUILD_NEW), "empty" if rng.random() < 0.75 else "has model"
    else:
        t, model = rng.choice(BUILD_EDIT), "has model"
    s = fill(t, rng)
    if rng.random() < 0.12:  # build + analysis in one message stays build
        tail = fill(rng.choice(ASK_MODEL), rng)
        s = s.rstrip(".?!") + (", then " if rng.random() < 0.5 else ". After that, ") + tail[0].lower() + tail[1:]
    return s, model


def off_request(rng):
    if rng.random() < 0.15:
        s = rng.choice(OFF_FRAMES).replace("{x}", rng.choice(OFF_X))
    else:
        s = fill(rng.choice(OFF), rng)
    return s, rng.choice(["empty", "has model"])


# --------------------------------------------------------------------------- mid-turn stories
ERRORS = ["AttributeError: 'RoadRunner' object has no attribute 'getCC2'",
          "AttributeError: 'RoadRunner' object has no attribute 'getFluxControlCoefficients'",
          "AttributeError: module 'tellurium' has no attribute 'loadAntimonyModel'",
          "NameError: name 'Simulator' is not defined", "NameError: name 'te' is not defined",
          "ValueError: Steady state failed to converge",
          "RuntimeError: CVODE Error: CV_TOO_MUCH_WORK, Module: CVODES, Function: CVode",
          "RuntimeError: CV_CONV_FAILURE: Convergence test failures occurred too many times",
          "KeyError: 'S4'", "RuntimeError: Unable to find variable 'k9'",
          "TypeError: simulate() got an unexpected keyword argument 'npoints'",
          "IndexError: index 3 is out of bounds for axis 1 with size 3",
          "Exception: NLEQ2 failed to converge", "ERROR: timed out after 60s",
          "ValueError: invalid selection string '[S5]'", "ZeroDivisionError: float division by zero"]
REJECTS = ["that Antimony does not load: syntax error at line 3",
           "that Antimony does not load: undefined species 'S4' used in reaction J3",
           "that Antimony does not load: unexpected token '->' at line 5",
           "that Antimony does not load: 'Km' is used but never assigned a value",
           "that Antimony does not load: missing ';' at line 7"]
READS = ["read_file workspace/model.txt -> ok", "read_file workspace/runs/data.csv -> ok",
         "read_file workspace/runs/scan.csv -> ok", "read_file workspace/runs/timecourse.csv -> ok",
         "read_file workspace/runs/fcc.csv -> ok", "read_file workspace/notes.md -> ok"]


def tool_line(kind, loaded, rng):
    r = rng.random()
    write_p = 0.45 if kind == "build" else 0.06
    if r < write_p:
        if "pathway-modeling" not in loaded:
            return REFUSED
        if rng.random() < 0.7:
            return "write_file workspace/model.txt -> ok"
        return "write_file workspace/model.txt -> REJECTED — " + rng.choice(REJECTS)
    r = rng.random()
    if r < 0.5:
        return "run_python -> ok"
    if r < 0.75:
        return "run_python -> " + rng.choice(ERRORS)
    if r < 0.8:
        return "run_mca_workflow -> ok"
    return rng.choice(READS)


def story(kind, model, rng):
    """Simulate a turn: returns loaded, recent, model, step."""
    wanted = ["mca", "tellurium"] + (["pathway-modeling"] if kind == "build" else [])
    loaded, calls = [], []
    n = rng.choice([1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8, 10])
    for _ in range(n):
        todo = [s for s in wanted if s not in loaded]
        if todo and rng.random() < (0.6 if not calls else 0.22):
            s = rng.choice(todo)
        elif rng.random() < 0.04 and "pathway-modeling" not in loaded:
            s = "pathway-modeling"  # over-eager load on an ask
        else:
            s = None
        if s:
            loaded.append(s)
            calls.append(f"load_skill {s} -> ok")
            continue
        line = tool_line(kind, loaded, rng)
        calls.append(line)
        if line == REFUSED and rng.random() < 0.5 and len(calls) < n:
            loaded.append("pathway-modeling")
            calls.append("load_skill pathway-modeling -> ok")
        if line.endswith("model.txt -> ok") and line.startswith("write"):
            model = "has model"
    if rng.random() < 0.1:  # a skill the router auto-loaded: in loaded, no load_skill line
        extra = [s for s in ORDER if s not in loaded]
        if extra:
            loaded.append(rng.choice(extra))
    return loaded, calls[-6:], model, len(calls)


# --------------------------------------------------------------------------- driver
def norm(s, sep=""):
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", sep, s.lower())).strip()


def load_test():
    p = HERE / "test.jsonl"
    keys = set()
    if p.exists():
        for l in p.read_text().splitlines():
            if l.strip():
                req = json.loads(l)["state"]["request"]
                keys |= {norm(req), norm(req, " ")}
    return keys


def main():
    self_check()
    rng = random.Random(SEED)
    test = load_test()
    seen, out, counts, dropped = set(), [], {k: 0 for k in TARGET}, 0

    def add(kind, state):
        nonlocal dropped
        key = json.dumps(state, sort_keys=True)
        if key in seen:
            return False
        seen.add(key)
        if norm(state["request"]) in test or norm(state["request"], " ") in test:
            dropped += 1
            return False
        out.append({"state": state, "need": policy({"kind": kind}, state["loaded"], state["recent"]), "_k": kind})
        counts[kind] += 1
        return True

    for l in SEEDS.read_text().splitlines():
        if l.strip():
            st = json.loads(l)["state"]
            req = st["request"]
            add("off" if req in SEED_OFF else "build" if req in SEED_BUILD else "ask", st)

    gen = {"off": off_request, "ask": ask_request, "build": build_request}
    tries = 0
    while any(counts[k] < TARGET[k] for k in TARGET) and tries < 200000:
        tries += 1
        kind = rng.choice([k for k in TARGET if counts[k] < TARGET[k]])
        if kind == "cont":
            under = rng.choice(["ask", "build"])
            _, model = gen[under](rng)
            req = augment(rng.choice(CONT), "cont", rng)
            if rng.random() < 0.06:  # bare continuation at turn start: nothing to continue
                add(kind, {"request": req, "loaded": [], "recent": [], "model": model, "step": 0})
                continue
            loaded, recent, model, step = story(under, model, rng)
            add(kind, {"request": req, "loaded": loaded, "recent": recent, "model": model, "step": step})
            continue
        req, model = gen[kind](rng)
        req = augment(req, kind, rng)
        mid = rng.random() < (MIDTURN_OFF if kind == "off" else MIDTURN_ON)
        if not mid:
            add(kind, {"request": req, "loaded": [], "recent": [], "model": model, "step": 0})
        elif kind == "off":  # off-topic mid-turn: unrelated calls only
            recent = rng.sample(["list_files workspace -> ok", "read_file workspace/notes.md -> ok",
                                 "list_files workspace/runs -> ok"], rng.choice([1, 2]))
            add(kind, {"request": req, "loaded": [], "recent": recent, "model": model, "step": len(recent)})
        else:
            loaded, recent, model, step = story(kind, model, rng)
            add(kind, {"request": req, "loaded": loaded, "recent": recent, "model": model, "step": step})

    rng.shuffle(out)
    with open(HERE / "train.jsonl", "w") as f:
        for ex in out:
            f.write(json.dumps({"state": ex["state"], "need": ex["need"]}) + "\n")

    n = len(out)
    print(f"test.jsonl: {'found' if test else 'not found'}; dropped {dropped} generated examples matching a test request")
    print(f"count: {n}")
    for s in ORDER:
        print(f"need {s}: {sum(s in e['need'] for e in out) / n:.3f}")
    print(f"need nothing: {sum(not e['need'] for e in out) / n:.3f}")
    print(f"off-topic intent: {sum(e['_k'] == 'off' for e in out) / n:.3f}")
    print(f"continuations: {sum(e['_k'] == 'cont' for e in out) / n:.3f}")
    print(f"mid-turn (step>0): {sum(e['state']['step'] > 0 for e in out) / n:.3f}")
    print(f"distinct requests: {len({e['state']['request'] for e in out})}")
    print(f"skeletons: ask {len(ASK_MODEL) + len(ASK_CONCEPT) + len(ASK_FRAMES) * len(QUANT)}, "
          f"build {len(BUILD_NEW) + len(BUILD_EDIT) - 12 + 12 * len(SLOTS['mod'])}, "
          f"off {len(OFF) + len(OFF_FRAMES) * len(OFF_X)}")


if __name__ == "__main__":
    main()

# Verified API Index

Every entry below appears in the permitted sources. **If a call is not in this
index, do not use it.** Tags: `[T:page]` = Tellurium documentation page,
`[L:rr/...]` = libRoadRunner documentation (linked from the Tellurium index),
`[L:simplesbml]`, `[L:faq]`.

## `tellurium` module (`import tellurium as te`)

### Loading
`loada(ant)` · `loadAntimonyModel(ant)` · `loadSBMLModel(sbml)` · `loads(ant)` ·
`loadCellMLModel(cellml)` · `loadTestModel(string)` · `getTestModel(string)` ·
`listTestModels()` · `model(model_name)` — `[T:tellurium_methods]`, `[T:API]`

### Conversion
`antimonyToSBML(ant)` · `antimonyToCellML(ant)` ·
`sbmlToAntimony(sbml, removeFunctionDefinitions=None)` · `sbmlToCellML(sbml)` ·
`cellmlToAntimony(cellml)` · `cellmlToSBML(cellml)` — `[T:tellurium_methods]`

### Files
`saveToFile(filePath, str)` · `readFromFile(filePath)` — `[T:tellurium_methods]`

### ODEs
`getODEsFromModel(roadrunnerModel)` · `getODEsFromSBMLString(sbmlStr)` ·
`getODEsFromSBMLFile(fileName)` — `[T:tellurium_methods]`

### Math helpers
`getEigenvalues(m)` · `rank(A, atol=1e-13, rtol=0)` ·
`nullspace(A, atol=1e-13, rtol=0)` · `rref(A)` — `[T:tellurium_methods]`

### Plotting
`plot(x, y, show=True, **kwargs)` ·
`plotArray(result, loc='upper right', legendOutside=False, show=True, resetColorCycle=True, xlabel=None, ylabel=None, title=None, xlim=None, ylim=None, xscale='linear', yscale='linear', grid=False, labels=None, **kwargs)` ·
`plotWithLegend(r, result=None, loc='upper right', show=True)` · `show()` ·
`setDefaultPlottingEngine(engine)` · `getDefaultPlottingEngine()` ·
`setSavePlotsToPDF(value)` · `colorCycle(color, polyNumber)` —
`[T:tellurium_methods]`, `[T:API]`

### SED-ML / COMBINE / OMEX
`executeSEDML(sedml_str, workingDir=...)` (example-only; see
`limits_and_discrepancies.md`) · `executeInlineOmex(inline_omex, comp=False)` ·
`executeInlineOmexFromFile(filepath)` ·
`exportInlineOmex(inline_omex, export_location)` ·
`convertCombineArchive(location)` · `convertAndExecuteCombineArchive(location)` ·
`extractFileFromCombineArchive(archive_path, entry_location)` ·
`createCombineArchive(archive_path, file_names, entry_locations, file_formats, master_attributes, description=None)` ·
`addFileToCombineArchive(archive_path, file_name, entry_location, file_format, master, out_archive_path)` ·
`addFilesToCombineArchive(archive_path, file_names, entry_locations, file_formats, master_attributes, out_archive_path)` ·
`getLastReport()` · `setLastReport(report)` · `DumpJSONInfo()` —
`[T:API]`, `[T:notebooks]`

### Environment
`getVersionInfo()` · `printVersionInfo()` · `getTelluriumVersion()` ·
`VersionDict()` · `noticesOff()` · `noticesOn()` · `inIPython()` ·
`installPackage(name)` · `upgradePackage(name)` · `uninstallPackage(name)` ·
`searchPackage(name)` · `runTool(toolFileName)` —
`[T:tellurium_methods]`, `[T:API]`

### Scans
`ParameterScan(rr, **settings)` · `SteadyStateScan(rr, **settings)` ·
`tellurium.analysis.parameterscan.plot2DParameterScan(r, p1, p1Range, p2, p2Range, start, end, points)` — `[T:paramscan]`

`ParameterScan` methods: `plotArray()` · `plotGraduatedArray()` ·
`plotPolyArray()` · `plotMultiArray(param1, param1Range, param2, param2Range)` ·
`plotSurface()` · `plot2DParameterScan(p1, p1Range, p2, p2Range)` ·
`createColormap(color1, color2)` · `createColorPoints()` — `[T:paramscan]`

`ParameterScan` properties: `alpha` · `color` · `colorbar` · `colormap` ·
`dependent` · `endTime` · `endValue` · `independent` · `integrator` · `legend` ·
`numberOfPoints` · `polyNumber` · `rr` · `selection` · `sameColor` ·
`startTime` · `startValue` · `title` · `value` · `width` · `xlabel` · `ylabel` ·
`zlabel` — `[T:paramscan]`

`SteadyStateScan`: only `plotArray()` is documented as working, and it needs
`value`, `startValue`, `endValue`, `numberOfPoints`, `selection` — `[T:paramscan]`

### Other modules
`tellurium.temiriam.getSBMLFromBiomodelsURN(urn=...)` — `[T:notebooks]`

---

## RoadRunner instance (`r = te.loada(...)`)

### Simulation
`simulate(start, end, points, selections=..., steps=...)` · `oneStep(startTime, stepSize)` ·
`internalOneStep(startTime, stepSize, reset)` · `getSimulationData()` ·
`gillespie(start, end, steps, selections)` · `getSeed(integratorName='')` ·
`setSeed(seed, resetModel=True)` —
`[T:notebooks]`, `[T:tellurium_methods]`, `[L:rr/cls_RoadRunner]`

### Integrator
`setIntegrator(name)` · `integrator` (property; assignable to a name string) ·
`getIntegrator()` · `getIntegratorByName(name)` · `getAvailableIntegrators()` ·
`getExistingIntegratorNames()` · `setIntegratorSetting(name, key, value)` ·
`integrator.<setting>` · `integrator.setValue(name, value)` ·
`integrator.getSettings()` · `integrator.getAbsoluteToleranceVector()` ·
`integrator.setIndividualTolerance(sid, value)` —
`[T:notebooks]`, `[L:rr/cls_RoadRunner]`, `[L:rr/cls_Integrator]`, `[L:rr/stochastic]`

### Steady state
`steadyState()` · `getSteadyStateValues()` · `getSteadyStateValuesNamedArray()` ·
`steadyStateSelections` · `getSteadyStateSolver()` · `setSteadyStateSolver(name)` ·
`getRegisteredSteadyStateSolverNames()` · `steadyStateSolverExists(name)` ·
`getSteadyStateThreshold()` · `setSteadyStateThreshold(val)` ·
`conservedMoietyAnalysis` (property) —
`[L:rr/steady_state]`, `[L:rr/cls_RoadRunner]`, `[T:notebooks]`

### Metabolic control analysis
`getCC(variable, parameter)` · `getuCC(variableId, parameterId)` ·
`getEE(reactionId, parameterId, steadyState=True)` · `getuEE(reactionId, parameterId)` ·
`getScaledFluxControlCoefficientMatrix()` · `getUnscaledFluxControlCoefficientMatrix()` ·
`getScaledConcentrationControlCoefficientMatrix()` · `getUnscaledConcentrationControlCoefficientMatrix()` ·
`getScaledElasticityMatrix()` · `getUnscaledElasticityMatrix()` ·
`getScaledFloatingSpeciesElasticity(reactionId, speciesId)` ·
`getUnscaledSpeciesElasticity(reactionIndx, speciesIndx)` ·
`getUnscaledParameterElasticity(reactionId, parameterId)` ·
`getDiffStepSize()` · `setDiffStepSize(val)` ·
`getFrequencyResponse(startFrequency, numberOfDecades, numberOfPoints, parameterName, variableName, useDB, useHz)` —
`[L:rr/metabolic]`, `[L:rr/cls_RoadRunner]`

### Structural analysis
`getFullStoichiometryMatrix()` · `getReducedStoichiometryMatrix()` ·
`getExtendedStoichiometryMatrix()` · `getNrMatrix()` · `getLinkMatrix()` ·
`getL0Matrix()` · `getConservationMatrix()` · `getKMatrix()` —
`[L:rr/stoichiometric]`, `[L:rr/cls_RoadRunner]`

### Stability
`getFullJacobian()` · `getReducedJacobian()` · `getFullEigenValues()` ·
`getReducedEigenValues()` · `getEigenValueIds()` · `getRatesOfChange()` ·
`getIndependentRatesOfChange()` · `getDependentRatesOfChange()` —
`[L:rr/stability]`, `[L:rr/cls_RoadRunner]`

### Selections and values
`selections` · `timeCourseSelections` · `createSelection(sel)` ·
`resetSelectionLists()` · `getValue(sel)` · `setValue(sel, value)` ·
`setValues(keysOrDict, values=None)` · `getSelectedValues()` · `getIds()` ·
`r.<element_id>` · `r["S1"]` / `r["[S1]"]` · `r.S1_amt` / `r.S1_conc` —
`[T:notebooks]`, `[L:rr/selecting_values]`, `[L:rr/cls_RoadRunner]`

### Model enumeration (Tellurium-flattened)
`getFloatingSpeciesIds()` · `getFloatingSpeciesConcentrations([index])` ·
`getNumFloatingSpecies()` · `getBoundarySpeciesIds()` ·
`getBoundarySpeciesConcentrations([index])` · `getNumBoundarySpecies()` ·
`getGlobalParameterIds()` · `getGlobalParameterValues([index])` ·
`getNumGlobalParameters()` · `getCompartmentIds()` · `getCompartmentVolumes([index])` ·
`getNumCompartments()` · `getReactionIds()` · `getReactionRates([index])` ·
`getNumReactions()` · `getConservedMoietyValues([index])` ·
`getNumConservedMoieties()` · `getNumDepFloatingSpecies()` ·
`getNumIndFloatingSpecies()` · `getNumEvents()` · `getNumRateRules()` ·
`setStartTime` · `setEndTime` · `getStartTime` · `getEndTime` ·
`getNumberOfPoints` · `setNumberOfPoints` — `[T:tellurium_methods]`

### Model object (`r.model`, `r.getModel()`)
`getDependentFloatingSpeciesIds()` · `getIndependentFloatingSpeciesIds()` ·
`getFloatingSpeciesConcentrationIds()` · `getBoundarySpeciesConcentrationIds()` ·
`getFloatingSpeciesAmounts` / `setFloatingSpeciesAmounts` ·
`setFloatingSpeciesConcentrations` · `setBoundarySpeciesConcentrations` ·
`setCompartmentVolumes` · `setGlobalParameterValues` ·
`getFloatingSpeciesInitAmounts` / `...InitConcentrations` (+ setters, + id lists) ·
`getStoichiometry(speciesIndex, reactionIndex)` · `getEventIds()` ·
`getConservedMoietyIds()` · `setConservedMoietyValues()` ·
`getAllTimeCourseComponentIds()` · `getModelName()` · `getTime()` · `setTime(time)` ·
`getInfo()` · `keys()` · `items()` — `[L:rr/cls_ExecutableModel]`

### Reset
`reset()` · `resetAll()` · `resetParameter()` · `resetToOrigin()` —
`[T:tellurium_methods]`, `[L:rr/cls_RoadRunner]`

### Import / export
`exportToSBML(filePath, current=True)` · `exportToAntimony(...)` ·
`exportToCellML(...)` · `exportToMatlab(...)` ·
`getAntimony(current=False, removeFunctionDefinitions=None)` ·
`getCurrentAntimony(removeFunctionDefinitions=None)` · `getCellML(current=False)` ·
`getCurrentCellML()` · `getMatlab(current=False)` · `getCurrentMatlab()` ·
`getSBML()` · `getCurrentSBML()` · `load(uriOrDocument)` ·
`getParamPromotedSBML(sbml)` · `saveState(document, option='b')` ·
`loadState(document)` — `[T:tellurium_methods]`, `[L:rr/cls_RoadRunner]`

### Model editing
`addSpeciesConcentration` · `removeSpecies` · `addReaction` · `removeReaction` ·
`addParameter` · `removeParameter` · `addCompartment` · `removeCompartment` ·
`setKineticLaw` · `addAssignmentRule` · `addRateRule` · `removeRules` ·
`addEvent` · `addTrigger` · `addPriority` · `addDelay` · `addEventAssignment` ·
`removeEventAssignment` · `removeEvent` · `regenerateModel()` —
`[L:rr/cls_RoadRunner]`

### Plotting / drawing
`plot(result=None, show=True, xlabel=None, ylabel=None, title=None, linewidth=2, xlim=None, ylim=None, logx=False, logy=False, xscale='linear', yscale='linear', grid=False, ordinates=None, tag=None, labels=None, figsize=(6,4), savefig=None, dpi=80, alpha=1.0, **kwargs)` ·
`draw(**kwargs)` — `[T:tellurium_methods]`

### Jarnac shortcuts
`fs()` `bs()` `rs()` `ps()` `vs()` `sv()` `rv()` `dv()` `sm()` `fjac()` —
`[T:tellurium_methods]`

### Object housekeeping
`isModelLoaded()` · `clearModel()` · `getInfo()` · `getCompiler()` ·
`getConfigurationXML()` · `setConfigurationXML(xml)` · `getExtendedVersionInfo()` ·
`getInstanceCount()` · `getInstanceID()` · `model` / `getModel()` —
`[L:rr/cls_RoadRunner]`, `[L:rr/utility_functions]`

---

## `roadrunner` module

`roadrunner.RoadRunner(sbml)` · `roadrunner.RoadRunner(uriOrSBML='', options=None)` ·
`roadrunner.__version__` ·
`roadrunner.getVersionStr(VERSIONSTR_BASIC | VERSIONSTR_COMPILER | VERSIONSTR_DATE | VERSIONSTR_LIBSBML)` ·
`Config.setValue(Config.LOADSBMLOPTIONS_CONSERVED_MOIETIES, bool)` and the other
`Config.LOADSBMLOPTIONS_*` flags (`RECOMPILE`, `READ_ONLY`,
`MUTABLE_INITIAL_CONDITIONS`, `OPTIMIZE_GVN`,
`OPTIMIZE_INSTRUCTION_SIMPLIFIER`, …) —
`[T:tellurium_methods]`, `[T:notebooks]`, `[L:rr/utility_functions]`,
`[L:rr/cls_Config]`

---

## `phrasedml` module

`convertString(phrasedml_str)` · `setReferencedSBML(name, sbml_str)` ·
`getLastPhrasedError()` · `getLastError()` — `[T:notebooks]`

## `libsedml` / `tesedml`

`readSedML(file)` · `doc.getErrorLog().getNumFailsWithSeverity(LIBSEDML_SEV_ERROR)` ·
`doc.getErrorLog().toString()` — `[T:notebooks]`
(`tesbml` / `tesedml` / `tecombine` are the Tellurium package names `[L:faq]`.)

## `simplesbml`

`SbmlModel(sub_units='')` · `addCompartment(vol, comp_id=)` ·
`addSpecies(species_id, amt, comp=)` · `addParameter(name, value)` ·
`addReaction(reactants, products, expression, local_params=, rxn_id=)` ·
`addEvent(trigger=, assignments=)` · `addRateRule(var, formula)` · `toSBML()` ·
`writeCodeFromString(sbml)` · `loadSBMLStr(sbml)` — `[L:simplesbml]`

## `rrplugins`

`Plugin("tel_auto2000")` · `setProperty(name, value)` (`SBML`, `NMX`,
`ScanDirection`, `PrincipalContinuationParameter`, `PCPLowerBound`,
`PCPUpperBound`) · `execute()` · `BifurcationPoints` · `BifurcationLabels` ·
`BifurcationData` · `plotBifurcationDiagram(pts, lbls)` · `readAllText(path)` —
`[L:rr/bifurcation]`

## Sources

### Tellurium
- https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://tellurium.readthedocs.io/en/latest/API.html
- https://tellurium.readthedocs.io/en/latest/notebooks.html
- https://tellurium.readthedocs.io/en/latest/paramscan.html
- https://tellurium.readthedocs.io/en/latest/quickstart.html
- https://tellurium.readthedocs.io/en/latest/antimony.html

### Tellurium-linked external sources
- https://libroadrunner.readthedocs.io/en/latest/ and its pages
  `metabolic.html`, `steady_state.html`, `stability.html`, `stoichiometric.html`,
  `selecting_values.html`, `simulation_and_integration.html`, `stochastic.html`,
  `bifurcation.html`, `accessing_model.html`, `read_write_functions.html`,
  `utility_functions.html`, `PythonAPIReference/cls_RoadRunner.html`,
  `PythonAPIReference/cls_ExecutableModel.html`,
  `PythonAPIReference/cls_Integrator.html`,
  `PythonAPIReference/cls_SteadyStateSolver.html`,
  `PythonAPIReference/cls_Config.html`
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "libRoadRunner Documents") and https://tellurium.readthedocs.io/en/latest/tellurium_methods.html
- https://simplesbml.readthedocs.io/en/latest/
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "SimpleSBML Documents")
- https://github.com/sys-bio/tellurium/wiki/FAQ
  - Linked from: https://tellurium.readthedocs.io/en/latest/index.html (toctree "FAQ")

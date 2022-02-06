# NAVFAC Deep Foundations Design Tool
This application performs axial capacity analysis for a variety of deep foundation types in stratified soil profiles. The calculations are adapted from the NAVFAC Foundations & Earth Structures Design Manual 7.02, last edited September 1986. This tool allows users to input a custom soil profile with several layers, select a foundation type and installation type, and input a selection of foundation widths and bearing depths to analyze simultaneously. 

After submitting an analysis, the user will be presented with a collection of summary tables showing the ultimate and allowable axial capacity of each foundation in compression and in tension. Beyond the summary tables, the user can view a detailed output for each individual pile showing the results of each calculation. The results may be downloaded in PDF form, and users can save their projects to enable tweaking the input parameters. Additionally, users can clone projects so they can easily analyze different pile types without needing to input the soil data again. 

## Disclaimer
This application is not a substitute for engineering knowledge, and this README is not a design tutorial. Any engineer who uses this tool is expected to understand the NAVFAC analysis process as a prerequite and to review the calculations for accuracy. The author of this program takes no responsibility for any engineering decisions made by anybody using this application. Use it at your own risk.

## Caculations
Calculations are performed based on established soil science and the NAVFAC Foundations & Earth Structures Design Manual 7.02, last edited September 1986. This manual is available to download for free at https://web.mst.edu/~rogersda/umrcourses/ge441/DM7_02.pdf.  

The calculation package is organized into three main files:
- `navfacFunctions.js`, a collection of geotechnical calculation function
- `DeepFoundationAnalysis.js`, DeepFoundationAnalysis class which parses the user input and stores analysis results
- `FoundationCalc.js`, FoundationCalc class which performs and the design calculations for an individual pile

The basic use-case for these classes is as follows:
```
// Create an instance of DeepFoundationAnalysis with the required inputs
let myAnalysis = new DeepFoundationAnalysis(
  layerDepths, layerNames, layerUnitWeights, layerPhis, layerCohesions,
  groundwaterDepth, increment, ignoredDepth);

// Call analyze() with the required inputs to create several instances of 
// FoundationCalc behind the scenes and save results into myAnalysis
myAnalysis.analyze(material, pileType, widthArray,
  bearingDepthArray, FS, ignoredDepth);

// Access the calculation results with the calculations parameter
console.log(myAnalysis.calculations.compressionAnalyses;
console.log(myAnalysis.calculations.tensionAnalyses; 
```

The diagram below illustrates how each of these parts interact with each other behind the scenes:
![diagram illustrating the interaction between navfac, DeepFoundationAnalysis, and FoundationCalc](src/img/navfac_class_interactions.svg)

## Rules to follow when implementing the calculation package
This calculation package itself does not enforce correctly formatting the data input, so it's up to the developer to ensure that correctly-formatted data makes its way into the calculations. Practically, that means checking the rules layed out below on the user side before beginning to operate with the data.

TO BE CLEAR, If these rules are not applied before attempting to perform calculations, the results will at best be completely and obviously broken, and at worst, quietly and unknowingly broken.

### Data Input Rules
#### DeepFoundationAnalysis constructor
- When instantiating a new `DeepFoundationAnalysis`, the following parameters must all be arrays of equal length:
  - `layerDepths`
  - `layerNames`
  - `layerUnitWeights`
  - `layerPhis`
  - `layerCohesions`
- The value of `increment` must be a value that every other depth value involved in the calculation is a multiple of. For example, if the increment is 1, then I could have `layerDepths` of [3, 6, 20], a `groundwaterDepth` of 17, and a `bearingElevation` of 15. However, I could not have, for example, a `bearingElevation` of 14.5 because that 14.5 is not a multiple of 1. If you want to use layers with a 0.5 foot resolution, you need to use an `increment` of 0.5 feet. Lastly, I would never recommend using "uneven" values like 0.33 or 1.5 for `increment`. While they could theoretically work, nobody needs that kind of confusion in their life.
- `layerDepths` must be an array of positive numbers arranged in ascending order with no duplicates.
- `layerNames` must be an array of strings.
- `layerUnitWeights` must be an array of positive numbers.
- `layerPhis` must be an array of integers with values of either 0 (for cohesive soils) or from 28 to 40 inclusive (for granular soils).
- `layerCohesions` must be an array of numbers with values of either 0 (for granular soils) or positive values (for cohesive soils).
- `ignoredDepth` must be any non-negative number following the increment rule. 

#### FoundationCalc constructor
- `detailedSoilProfile` should be the `detailelSoilProfile` saved as a property within `DeepFoundationAnalysis`. 
- `material` must be one of the following strings:
  - "TIMBER"
  - "CONCRETE"
  - "STEEL"
- `pileType` must be one of the following strings:
  - "DRIVEN-SINGLE-H-PILE"
  - "DRIVEN-SINGLE-DISPLACEMENT-PILE"
  - "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE"
  - "DRIVEN-JETTED-PILE"
  - "DRILLED-PILE"
- `width` must be an array with either 1 or 2 positive numbers.
  - 1 number of the pileType is NOT "DRIVEN-SINGLE-H-PILE"
  - 2 numbers if the foundation IS "DRIVEN-SINGLE-H-PILE"
  - If two numbers are passed, the smaller number should be first.
- `bearingDepth` must be a positive multiple of `increment` AND must be less than the deepest depth in the soil profile (ie: `bearingDepth < layerDepths[layerDepths.length-1]`).
- `increment` is the same increment from `DeepFoundationAnalysis`.
- `isCompression` is a boolean. Must be true or false
- `FS` must be a positive number, and should be greater than 1. The recommended value is 3.
- `ignoredDepth` is the same `ignoredDepth` from `DeepFoundationAnalysis`.

#### DeepFoundationAnalysis.analyze()
- `material` - See FoundationCalc constructor.
- `pileType` - See FoundationCalc constructor.
- `widthArray` must be an array of widths meeting the requirements in FoundationCalc constructor.
- `bearingDepthArray` must be an array of depths meeting the requirements in FoundationCalc constructor.
- `FS` - See FoundationCalc constructor.




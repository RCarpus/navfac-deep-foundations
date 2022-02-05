# NAVFAC Deep Foundations Design Tool
This application performs axial capacity analysis for a variety of deep foundation types in stratified soil profiles. The calculations are adapted from the NAVFAC Foundations & Earth Structures Design Manual 7.02, last edited September 1986. This tool allows users to input a custom soil profile with several layers, select a foundation type and installation type, and input a selection of foundation widths and bearing depths to analyze simultaneously. 

After submitting an analysis, the user will be presented with a collection of summary tables showing the ultimate and allowable axial capacity of each foundation in compression and in tension. Beyond the summary tables, the user can view a detailed output for each individual pile showing the results of each calculation. The results may be downloaded in PDF form, and users can save their projects to enable tweaking the input parameters. Additionally, users can clone projects so they can easily analyze different pile types without needing to input the soil data again. 

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




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

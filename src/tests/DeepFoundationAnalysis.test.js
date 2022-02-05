import DeepFoundationAnalysis from "../navfac/DeepFoundationAnalysis";
import FoundationCalc from "../navfac/FoundationCalc";
import {
  effStressBottomProfile,
  effStressMidpointProfile,
} from '../navfac/navfacFunctions';

test(`Generate generalSoilProfile when instantiating DeepFoundationAnalysis`,
  () => {
    const layerDepths = [3, 6, 8.5, 20],
      layerNames = ['Loose Sand', 'Stiff Clay', 'Soft Clay', 'Compact Sand'],
      layerUnitWeights = [120, 120, 125, 135],
      layerPhis = [28, 0, 0, 36],
      layerCohesions = [0, 1500, 300, 0],
      groundwaterDepth = 9.5,
      increment = 0.5,
      ignoredDepth = 3;
    let analysis = new DeepFoundationAnalysis(
      layerDepths, layerNames, layerUnitWeights, layerPhis, layerCohesions,
      groundwaterDepth, increment, ignoredDepth
    );
    expect(analysis.generalSoilProfile.layerNames).toEqual(layerNames);
    expect(analysis.generalSoilProfile.layerDepths).toEqual(layerDepths);
    expect(analysis.generalSoilProfile.layerUnitWeights).toEqual(layerUnitWeights);
    expect(analysis.generalSoilProfile.layerPhis).toEqual(layerPhis);
    expect(analysis.generalSoilProfile.layerCohesions).toEqual(layerCohesions);
    expect(analysis.generalSoilProfile.groundwaterDepth).toBe(groundwaterDepth);
    expect(analysis.increment).toBe(increment);
    expect(analysis.ignoredDepth).toBe(ignoredDepth);
  });

test(`Generate detailedSoilProfile when instantiating DeepFoundationAnalysis`,
  () => {
    // Inputs for the class constructor
    const layerDepths = [3, 6, 8.5, 20],
      layerNames = ['LS', 'StCl', 'SCl', 'CS'],
      layerUnitWeights = [120, 120, 125, 135],
      layerPhis = [28, 0, 0, 36],
      layerCohesions = [0, 1500, 300, 0],
      groundwaterDepth = 9.5,
      increment = 0.5,
      ignoredDepth = 3;

    // expected values for detailedSoilProfile
    const expectedLayerDepths = [
      0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5,
      9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16,
      16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20
    ],
      expectedLayerNames = [
        'LS', 'LS', 'LS', 'LS', 'LS', 'LS',
        'StCl', 'StCl', 'StCl', 'StCl', 'StCl', 'StCl',
        'SCl', 'SCl', 'SCl', 'SCl', 'SCl',
        'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS',
        'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS'
      ],
      expectedLayerUnitWeights = [
        120, 120, 120, 120, 120, 120,
        120, 120, 120, 120, 120, 120,
        125, 125, 125, 125, 125,
        135, 135, 135, 135, 135, 135, 135, 135, 135, 135, 135, 135, 135, 135,
        135, 135, 135, 135, 135, 135, 135, 135, 135
      ],
      expectedLayerPhis = [
        28, 28, 28, 28, 28, 28,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36,
        36, 36, 36, 36, 36, 36
      ],
      expectedLayerCohesions = [
        0, 0, 0, 0, 0, 0,
        1500, 1500, 1500, 1500, 1500, 1500,
        300, 300, 300, 300, 300,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      expectedEffStressBottoms = effStressBottomProfile(
        expectedLayerUnitWeights, increment, groundwaterDepth),
      expectedEffStressMids = effStressMidpointProfile(
        expectedLayerUnitWeights, increment, groundwaterDepth,
        expectedEffStressBottoms);

    let analysis = new DeepFoundationAnalysis(
      layerDepths, layerNames, layerUnitWeights, layerPhis, layerCohesions,
      groundwaterDepth, increment, ignoredDepth
    );
    expect(analysis.detailedSoilProfile.layerNames)
      .toEqual(expectedLayerNames);
    expect(analysis.detailedSoilProfile.layerBottomDepths)
      .toEqual(expectedLayerDepths);
    expect(analysis.detailedSoilProfile.layerUnitWeights)
      .toEqual(expectedLayerUnitWeights);
    expect(analysis.detailedSoilProfile.layerPhis).
      toEqual(expectedLayerPhis);
    expect(analysis.detailedSoilProfile.layerCohesions)
      .toEqual(expectedLayerCohesions);
    expect(analysis.detailedSoilProfile.layerEffStressBottoms)
      .toEqual(expectedEffStressBottoms);
    expect(analysis.detailedSoilProfile.layerEffStressMids)
      .toEqual(expectedEffStressMids);
    expect(analysis.detailedSoilProfile.groundwaterDepth)
      .toBe(groundwaterDepth);
  });

test(`Calling analyze() on a DeepFoundationAnalysis with 3 widths and 4 
  depths should generate 12 compression and 12 tension analyses`, () => {
  // Inputs for the class constructor
  const layerDepths = [3, 6, 8.5, 20],
    layerNames = ['LS', 'StCl', 'SCl', 'CS'],
    layerUnitWeights = [120, 120, 125, 135],
    layerPhis = [28, 0, 0, 36],
    layerCohesions = [0, 1500, 300, 0],
    groundwaterDepth = 9.5,
    increment = 0.5,
    ignoredDepth = 3;

  // Inputs for analyze()
  const material = "CONCRETE",
    pileType = "DRILLED-PILE",
    widthArray = [[1], [2], [3]],
    bearingDepthArray = [5, 12, 17, 19],
    FS = 3;
  
  // create the DeepFoundationAnalysis
  let analysis = new DeepFoundationAnalysis(
    layerDepths, layerNames, layerUnitWeights, layerPhis, layerCohesions,
    groundwaterDepth, increment, ignoredDepth
  );

  // perform the analyses
  analysis.analyze(material, pileType, widthArray, 
    bearingDepthArray, FS, ignoredDepth);
  expect(analysis.calculations.compressionAnalyses).toHaveLength(12);
  expect(analysis.calculations.compressionAnalyses).toHaveLength(12);


});
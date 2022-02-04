import DeepFoundationAnalysis from "../navfac/DeepFoundationAnalysis";
import FoundationCalc from "../navfac/FoundationCalc";
import * as nf from '../navfac/navfacFunctions';

test(`Generate FoundationCalc and assign args in constructor`, () => {
  // Generate a detailedSoilProfile to use in FoundationCalc
  const layerDepths = [3, 6, 8.5, 20],
    layerNames = ['LS', 'StCl', 'SCl', 'CS'],
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
  let detailedSoilProfile = analysis.detailedSoilProfile;

  // values specific to the FoundationCalc
  const material = "TIMBER",
    pileType = "DRIVEN-SINGLE-DISPLACEMENT-PILE",
    width = [1.5],
    bearingDepth = 15,
    isCompression = true,
    FS = 3;

  // expected values for generated properties
  const expectedContactFrictionAngles = [
    21, 21, 21, 21, 21, 21,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
    27, 27, 27, 27, 27, 27
  ];

  const a1 = nf.adhesion(layerCohesions[1], material),
    a2 = nf.adhesion(layerCohesions[2], material),
    expectedAdhesions = [
      0, 0, 0, 0, 0, 0,
      a1, a1, a1, a1, a1, a1,
      a2, a2, a2, a2, a2,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

  const expectedEarthPressureCoefficient = nf.horizontalEarthPressureCoefficient(
    pileType, isCompression);

  const expectedShape = "CIRCLE";
  const expectedPileArea = nf.area(width, expectedShape);
  const expectedPilePerimeter = nf.perimeter(width, expectedShape);

  const expectedNq = nf.granularNq(false, 36);
  const expectedNc = nf.cohesiveNc(bearingDepth, width[0]);

  // Instantiate the FoundationCalc
  let calc = new FoundationCalc(detailedSoilProfile, material, pileType, width,
    bearingDepth, increment, isCompression, FS, ignoredDepth);

  const expectedLimitedBottomStresses = nf.limitEffStress(
    calc.detailedSoilProfile.layerEffStressBottoms,
    width[0],
    increment);
  const expectedLimitedMidStresses = nf.limitEffStress(
    calc.detailedSoilProfile.layerEffStressMids,
    width[0],
    increment);

  expect(calc.detailedSoilProfile).toEqual(detailedSoilProfile);
  expect(calc.material).toBe(material);
  expect(calc.pileType).toBe(pileType);
  expect(calc.width).toBe(width);
  expect(calc.bearingDepth).toBe(bearingDepth);
  expect(calc.increment).toBe(increment);
  expect(calc.isCompression).toBe(isCompression);
  expect(calc.FS).toBe(FS);
  expect(calc.ignoredDepth).toBe(ignoredDepth);
  expect(calc.contactFrictionAngles).toEqual(expectedContactFrictionAngles);
  expect(calc.adhesions).toEqual(expectedAdhesions);
  expect(calc.earthPressureCoefficient).toBe(expectedEarthPressureCoefficient);
  expect(calc.shape).toBe(expectedShape);
  expect(calc.pileArea).toBe(expectedPileArea);
  expect(calc.pilePerimeter).toBe(expectedPilePerimeter);
  expect(calc.isDrilled).toBe(false);
  expect(calc.granularNq).toBe(expectedNq);
  expect(calc.cohesiveNc).toBe(expectedNc);
  expect(calc.limitedBottomStresses).toEqual(expectedLimitedBottomStresses);
  expect(calc.limitedMidStresses).toEqual(expectedLimitedMidStresses);
  expect(calc.skinFrictions).toHaveLength(40);
  calc.skinFrictions.forEach(friction => {
    expect(friction || friction === 0).toBeTruthy();
  });
  expect(calc.sumAll([1, 2, 3, 4, 5])).toBe(15);
  expect(calc.totalSkinFriction).toBeTruthy();
  expect(calc.cohesionAtBearingDepth).toBe(0);
  expect(calc.effStressAtBearing).
    toBe(calc.limitedBottomStresses.limitedEffStress[29]);
  expect(calc.endBearing.value).toBeTruthy();
  expect(calc.endBearing.mode).toBe("GRANULAR");
  expect(calc.pileWeight).
    toBe(nf.pileWeight(material, bearingDepth, expectedPileArea));
  expect(calc.ultimateCapacity).
    toBe(nf.ultimateLoadCapacity(calc.totalSkinFriction,
      calc.endBearing.value, calc.pileWeight, calc.isCompression));
  expect(calc.ultimateCapacity).
    toBe(nf.ultimateLoadCapacity(calc.totalSkinFriction,
      calc.endBearing.value, calc.pileWeight, calc.isCompression, FS));
});
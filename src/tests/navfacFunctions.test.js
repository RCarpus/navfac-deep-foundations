import '../navfacFunctions';
import {
  granularNq,
  poundsToKips,
  ultimateLoadCapacity,
  allowableLoadCapacity,
  contactFrictionAngle,
  horizontalEarthPressureCoefficient,
  adhesion,
  cohesiveNc,
  effStressBottomProfile,
  effStressMidpointProfile,
  limitEffStress,
  perimeter,
  area,
  granularSkinFriction,
  cohesiveSkinFriction,
  cohesiveEndBearing,
  granularEndBearing,
  sublayerDepths,
} from '../navfacFunctions';

// granularNq
test('Drilled pier with phi=0 has Nq of 0', () => {
  expect(granularNq(true, 0)).toBe(0);
  expect(granularNq(false, 0)).toBe(0);
})

test('Drilled pier with phi=26 has Nq of 5', () => {
  expect(granularNq(true, 26)).toBe(5);
});

test('Drilled pier with phi=40 has Nq of 72', () => {
  expect(granularNq(true, 40)).toBe(72);
});

test('Driven pile with phi=26 has Nq of 10', () => {
  expect(granularNq(false, 26)).toBe(10);
});

test('Driven pile with phi=40 has Nq of 145', () => {
  expect(granularNq(false, 40)).toBe(145);
});

// poundsToKips
test('1000 pounds is 1 kip', () => {
  expect(poundsToKips(1000)).toBe(1);
});

test('6482 pounds is 6.482 kips', () => {
  expect(poundsToKips(6482)).toBe(6.482);
});

test('0 pounds is 0 kips', () => {
  expect(poundsToKips(0)).toBe(0);
})

test('982 pounds is .982 kips', () => {
  expect(poundsToKips(982)).toBe(.982);
})

// ultimatLoadCapacity
test(`Ultimate load capacity for a compression pile`, () => {
  expect(ultimateLoadCapacity(3000, 30000, 7000, true)).toBe(33000);
});

test(`Ultimate load capacity for a tension pile`, () => {
  expect(ultimateLoadCapacity(3000, 0, 7000, false)).toBe(10000);
});

// allowableLoadCapacity
test(`Allowable load capacity for a compression pile`, () => {
  expect(allowableLoadCapacity(3000, 30000, 7000, true, 3)).toBe(11000);
})

test(`Allowable load capacity for a tension pile`, () => {
  expect(allowableLoadCapacity(3000, 0, 7000, false, 3)).toBe(8000);
})

// contactFrictionAngle
test(`Contact friction angle for TIMBER with phi=32 is 24`, () => {
  expect(contactFrictionAngle(32, "TIMBER")).toBe(24);
});

test(`Contact friction angle for CONCRETE with phi=35 is 26.25`, () => {
  expect(contactFrictionAngle(35, "CONCRETE")).toBe(26.25);
});

test(`Contact friction angle for STEEL with phi=40 is 20`, () => {
  expect(contactFrictionAngle(40, "STEEL")).toBe(20);
});

test(`Contact friction angle for WOOD with phi=31 is 0`, () => {
  expect(contactFrictionAngle(31, "WOOD")).toBe(0);
});

// horizontalEarthPressureCoefficient
test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-H-PILE" in compression 
  should be 0.75`, () => {
  expect(horizontalEarthPressureCoefficient("DRIVEN-SINGLE-H-PILE", true))
    .toBe(0.75);
});

test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-H-PILE" in tension 
  should be 0.4`, () => {
  expect(horizontalEarthPressureCoefficient("DRIVEN-SINGLE-H-PILE", false))
    .toBe(0.4);
});

test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-DISPLACEMENT-PILE" in 
  compression should be 1.25`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-SINGLE-DISPLACEMENT-PILE",
    true)).toBe(1.25);
});

test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-DISPLACEMENT-PILE" in 
  tension should be 0.8`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-SINGLE-DISPLACEMENT-PILE",
    false)).toBe(0.8);
});

test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE" 
  in compression should be 1.75`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE",
    true)).toBe(1.75);
});

test(`hor. Earth pressure coef. for "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE" 
  in tension should be 1.15`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE",
    false)).toBe(1.15);
});

test(`hor. Earth pressure coef. for "DRIVEN-JETTED-PILE" 
  in compression should be 0.65`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-JETTED-PILE",
    true)).toBe(0.65);
});

test(`hor. Earth pressure coef. for "DRIVEN-JETTED-PILE" 
  in tension should be 0.45`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRIVEN-JETTED-PILE",
    false)).toBe(0.45);
});

test(`hor. Earth pressure coef. for "DRILLED-PILE" 
  in compression should be 0.7`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRILLED-PILE",
    true)).toBe(0.7);
});

test(`hor. Earth pressure coef. for "DRILLED-PILE" 
  in tension should be 0.4`, () => {
  expect(horizontalEarthPressureCoefficient(
    "DRILLED-PILE",
    false)).toBe(0.4);
});

// adhesion
test(`adhesion for clay with c=150 and "CONCRETE" 
  should be 150`, () => {
  expect(adhesion(150, "CONCRETE")).toBe(150);
});

test(`adhesion for clay with c=400 and "CONCRETE" 
  should be 388`, () => {
  expect(adhesion(400, "CONCRETE")).toBe(388);
});

test(`adhesion for clay with c=750 and "CONCRETE" 
  should be 615`, () => {
  expect(adhesion(750, "CONCRETE")).toBe(615);
});

test(`adhesion for clay with c=1850 and "CONCRETE" 
  should be 920`, () => {
  expect(adhesion(1850, "CONCRETE")).toBe(920);
});

test(`adhesion for clay with c=3100 and "CONCRETE" 
  should be 1142.5`, () => {
  expect(adhesion(3100, "CONCRETE")).toBe(1142.5);
});

test(`adhesion for clay with c=5000 and "CONCRETE" 
  should be 1300`, () => {
  expect(adhesion(5000, "CONCRETE")).toBe(1300);
});

test(`adhesion for clay with c=150 and "TIMBER" 
  should be 150`, () => {
  expect(adhesion(150, "TIMBER")).toBe(150);
});

test(`adhesion for clay with c=400 and "TIMBER" 
  should be 388`, () => {
  expect(adhesion(400, "TIMBER")).toBe(388);
});

test(`adhesion for clay with c=750 and "TIMBER" 
  should be 615`, () => {
  expect(adhesion(750, "TIMBER")).toBe(615);
});

test(`adhesion for clay with c=1850 and "TIMBER" 
  should be 920`, () => {
  expect(adhesion(1850, "TIMBER")).toBe(920);
});

test(`adhesion for clay with c=3100 and "TIMBER" 
  should be 1142.5`, () => {
  expect(adhesion(3100, "TIMBER")).toBe(1142.5);
});

test(`adhesion for clay with c=5000 and "TIMBER" 
  should be 1300`, () => {
  expect(adhesion(5000, "TIMBER")).toBe(1300);
});

test(`adhesion for clay with c=100 and "STEEL" 
  should be 100`, () => {
  expect(adhesion(100, "STEEL")).toBe(100);
});

test(`adhesion for clay with c=450 and "STEEL" 
  should be 418`, () => {
  expect(adhesion(450, "STEEL")).toBe(418);
});

test(`adhesion for clay with c=615 and "STEEL" 
  should be 515.2`, () => {
  expect(adhesion(615, "STEEL")).toBe(515.2);
});

test(`adhesion for clay with c=1550 and "STEEL" 
  should be 711`, () => {
  expect(adhesion(1550, "STEEL")).toBe(711);
});

test(`adhesion for clay with c=2700 and "STEEL" 
  should be 730.5`, () => {
  expect(adhesion(2700, "STEEL")).toBe(730.5);
});

test(`adhesion for clay with c=5000 and "STEEL" 
  should be 750`, () => {
  expect(adhesion(5000, "STEEL")).toBe(750);
});

// cohesiveNc
test(`Nc for depth=20 and width=1 should be 9`, () => {
  expect(cohesiveNc(20, 1)).toBe(9);
});

test(`Nc for depth=20 and width=5 should be 9`, () => {
  expect(cohesiveNc(20, 5)).toBe(9);
});

test(`Nc for depth=0 and width=5 should be 6.29`, () => {
  expect(cohesiveNc(0, 5)).toBe(6.29);
});

test(`Nc for depth=20 and width=8 is 8.69 (rounded to 2 places)`, () => {
  expect(Number(cohesiveNc(20, 8).toFixed(2))).toBe(8.69);
});

// effStressBottomProfile
test(`Eff stress bottom profile for an unsaturated soil should return an 
  array uneffected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 100;
  const result = [600, 1225, 1850];
  expect(effStressBottomProfile(unitWeights, increment, groundwaterDepth))
    .toEqual(result);
});

test(`Eff stress bottom profile with groundwater mid-depth return an 
  array partially effected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 10;
  const result = [600, 1225, 1538];
  expect(effStressBottomProfile(unitWeights, increment, groundwaterDepth))
    .toEqual(result);
});

test(`Eff stress bottom profile with groundwater at surface should return an 
  array completely effected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 0;
  const result = [288, 601, 914];
  expect(effStressBottomProfile(unitWeights, increment, groundwaterDepth))
    .toEqual(result);
});

test(`Eff stress bottom profile with a single increment should behave
  as expected.`, () => {
  const unitWeights = [120];
  const increment = 5;
  const groundwaterDepth = 5;
  const result = [600];
  const resultSaturated = [288];
  expect(effStressBottomProfile(unitWeights, increment, groundwaterDepth))
    .toEqual(result);
  expect(effStressBottomProfile(unitWeights, increment, 0))
    .toEqual(resultSaturated);
});

test(`Eff stress midpoint profile for an unsaturated soil should return an 
  array uneffected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 100;
  // effStressBottom = [600, 1225, 1850]
  const effStressBottom = effStressBottomProfile(
    unitWeights, increment, groundwaterDepth);
  const result = [300, 912.5, 1537.5];
  expect(effStressMidpointProfile(unitWeights, increment,
    groundwaterDepth, effStressBottom))
    .toEqual(result);
});

test(`Eff stress midpoint profile with groundwater mid-depth should return an 
  array partially effected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 10;
  // effStressBottom = [600, 1225, 1538]
  const effStressBottom = effStressBottomProfile(
    unitWeights, increment, groundwaterDepth);
  const result = [300, 912.5, 1381.5];
  expect(effStressMidpointProfile(unitWeights, increment,
    groundwaterDepth, effStressBottom))
    .toEqual(result);
});

test(`Eff stress midpoint profile with groundwater at surface should return an 
  array completely effected by pore pressure.`, () => {
  const unitWeights = [120, 125, 125];
  const increment = 5;
  const groundwaterDepth = 0;
  // effStressBottom = [288, 601, 914]
  const effStressBottom = effStressBottomProfile(
    unitWeights, increment, groundwaterDepth);
  const result = [144, 444.5, 757.5];
  expect(effStressMidpointProfile(unitWeights, increment,
    groundwaterDepth, effStressBottom))
    .toEqual(result);
});

test(`Eff stress midpoint profile with one sublayer should behave
  as expected.`, () => {
  const unitWeights = [120];
  const increment = 5;
  const groundwaterDepth = 5;
  // value of effStressBottom shouldn't matter
  const effStressBottom = effStressBottomProfile(
    unitWeights, increment, groundwaterDepth);
  const resultDry = [300];
  const resultSaturated = [144];
  expect(effStressMidpointProfile(unitWeights, increment,
    groundwaterDepth, effStressBottom))
    .toEqual(resultDry);
  expect(effStressMidpointProfile(unitWeights, increment,
    0, effStressBottom))
    .toEqual(resultSaturated);
});

// limitEffStress
test(`Effective stress should not be limited when depth < 20B`, () => {
  const effStress = [100, 200, 300, 400, 500];
  const width = 3;
  const increment = 5;
  const limitedEffStress = limitEffStress(effStress, width, increment);
  expect(limitedEffStress.limitedEffStress).toEqual(effStress);
  expect(limitedEffStress.isLimited).toBe(false);
});

test(`Effective stress should  be limited when depth > 20B`, () => {
  const effStress = [100, 200, 300, 400, 500];
  const width = 1;
  const increment = 5;
  const limitedEffStress = limitEffStress(effStress, width, increment);
  const result = [100, 200, 300, 400, 400];
  expect(limitedEffStress.limitedEffStress).toEqual(result);
  expect(limitedEffStress.isLimited).toBe(true);
});

// perimeter
test(`Perimeter of a circle with diameter 3.6 is approx. 11.31`, () => {
  const diameter = [3.6];
  expect(Number(perimeter(diameter, 'CIRCLE').toFixed(2))).toBe(11.31);
});

test(`Perimeter of a rectangle with width 3.6 and height 4 is 15.2`, () => {
  const width = [3.6, 4];
  expect(Number(perimeter(width, 'RECTANGLE').toFixed(2))).toBe(15.2);
});

test(`Perimeter of an unsupported shape should be 0`, () => {
  const width = [3.6, 4];
  expect(Number(perimeter(width, 'TRIANGLE').toFixed(2))).toBe(0);
});

// area
test(`Area of a circle with diameter 3 should be 7.07`, () => {
  expect(Number(area([3], 'CIRCLE').toFixed(2))).toBe(7.07);
});

test(`Area of a rectangle with width=3 and height=3.5 is 10.5`, () => {
  expect(area([3, 3.5], 'RECTANGLE')).toBe(10.5);
});

test(`Area of an unsupported shape is 0`, () => {
  expect(area([3, 3.5], 'TRIANGLE')).toBe(0);
});

// granularSkinFriction
test(`Granular skin friction of a foundation with different params`, () => {
  const Kh1 = .7,
    P01 = 600,
    delta1 = 20,
    perimeter1 = 3,
    increment1 = 4,
    Kh2 = 1.2,
    P02 = 3233,
    delta2 = 30,
    perimeter2 = 2,
    increment2 = 1;
  expect(Number(granularSkinFriction(
    Kh1, P01, delta1, perimeter1, increment1).toFixed(2)))
    .toBe(1834.41);
  expect(Number(granularSkinFriction(
    Kh2, P02, delta2, perimeter2, increment2).toFixed(2)))
    .toBe(4479.78);
});

// cohesionSkinFriction
test(`Cohesive skin friction of a foundation with different params`, () => {
  const adhesion1 = 500,
    perimeter1 = 2,
    increment1 = 3,
    adhesion2 = 150,
    perimeter2 = 4,
    increment2 = 1;
  expect(cohesiveSkinFriction(adhesion1, perimeter1, increment1)).toBe(3000);
  expect(cohesiveSkinFriction(adhesion2, perimeter2, increment2)).toBe(600);
});

// cohesiveEndBearing
test(`Cohesive end bearing with different params`, () => {
  const cohesion1 = 2000,
    area1 = 3,
    Nc1 = 9,
    cohesion2 = 350,
    area2 = 7,
    Nc2 = 8;
  expect(cohesiveEndBearing(cohesion1, area1, Nc1)).toBe(54000);
  expect(cohesiveEndBearing(cohesion2, area2, Nc2)).toBe(19600);
});

// granularEndBearing
test(`Granular end bearing with different params`, () => {
  const Pt1 = 3000,
    Nq1 = 43,
    area1 = 10,
    Pt2 = 2500,
    Nq2 = 145,
    area2 = 2;
  expect(granularEndBearing(Pt1, Nq1, area1)).toBe(1290000);
  expect(granularEndBearing(Pt2, Nq2, area2)).toBe(725000);
});

// sublayerDepths
test(`Sublayer depths for a depth with several sublayers`, () => {
  const depth = 20,
    increment = 5,
    result = [5, 10, 15, 20];
  expect(sublayerDepths(depth, increment)).toEqual(result);
});

test(`Sublayer depths for a depth with a single sublayer`, () => {
  const depth = 5,
    increment = 5,
    result = [5];
  expect(sublayerDepths(depth, increment)).toEqual(result);
})
/**
 * @module navfac
 * 
 * @description This file contains functions intended to be used for the design 
 * of deep foundations using the NAVFAC design methodology. The design manual 
 * can be downloaded at 
 * https://web.mst.edu/~rogersda/umrcourses/ge441/DM7_02.pdf
 * 
 * The relevant design information begins on page 215 of the pdf.
 * This is 7.2-193 within the context of the document.
 */


/** @constant
 *  @type {number}
 *  @description The unit weight of water in pounds per cubic foot (pcf), 62.4
 */
export const UNIT_WEIGHT_WATER = 62.4;

/** @constant
 *  @type {object}
 *  @description Object to be used as a lookup table for granularNq().
 *    This is defined as a global variable so we don't need to re-define it
 *    each time we call granularNq().
 * 
 *    To use the table, use NQ_LOOKUP_TABLE[phi][index].
 *    index === 0 for drilled pier, index === 1 for driven pile
 *  @see granularNq
 */
export const NQ_LOOKUP_TABLE = {
  26: [5, 10],
  27: [6.5, 12.5],
  28: [8, 15],
  29: [9, 18],
  30: [10, 21],
  31: [12, 24],
  32: [14, 29],
  33: [17, 35],
  34: [21, 42],
  35: [25, 50],
  36: [30, 62],
  37: [38, 77],
  38: [43, 86],
  39: [60, 120],
  40: [72, 145]
}

/**
 *  @param {boolean} isDrilled true if drilled pier, false if driven pile
 *  @param {number} phi an integer value, 26 to 40 inclusive, or 0 for clay
 *  @returns {number} Nq value for the provided foundation type and phi
 *  @description Returns the Bearing Capacity Factor Nq for a given internal
 *    soil friction angle and foundation type (drilled or driven). Applicable
 *    to granular soils only. Clay soils will have Nq of 0.
 * 
 *    Based on the Bearing Capacity Factors table on p.216.
 *    Nq for phi === 27, 29 are linearly interpolated from given values.
 */
export function granularNq(isDrilled, phi) {
  if (phi === 0) return 0;
  const index = isDrilled ? 0 : 1;
  return NQ_LOOKUP_TABLE[phi][index];
}

/**
 *  @param {number} pounds weight of an object in pounds
 *  @returns {number} weight of the object in kips
 *  @description Converts a weight from pounds to kips. 1 kip = 1000 pounds
 */
export function poundsToKips(pounds) {
  return pounds / 1000;
}

/**
 * @param {number} skinFrictionCapacity The skin friction capacity in kips
 * @param {number} endBearingCapacity The end bearing capacity in kips
 * @returns {number} The ultimate load capacity in kips
 * @description Calculates the ultimate load capacity as the sum of the skin 
 *    friction and end bearing capacity. In a tension condition, the skin 
 *    friction will be zero. The end bearing could only be zero if the pile 
 *    was bearing in the ignored zone, which you shouldn't be bothering with
 *    anyway.
 * 
 *    See p.215 for more details
 */
export function ultimateLoadCapacity(skinFrictionCapacity, endBearingCapacity) {
  return skinFrictionCapacity + endBearingCapacity;
}

/**
 * @param {number} internalPhi The internal friction angle as an integer
 * @param {string} material Can be "TIMBER", "CONCRETE", or "STEEL"
 * @returns {number} The contact friction angle for the given phi and material
 * @description Calculates the contact friction angle for a given internal soil 
 *    friction angle and material type. Formulas are given on p.216
 */
export function contactFrictionAngle(internalPhi, material) {
  switch (material) {
    case ("TIMBER"):
      return 0.75 * internalPhi;
    case ("CONCRETE"):
      return 0.75 * internalPhi;
    case ("STEEL"):
      return 20;
    default:
      console.error(`An invalid material type has been provided within 
      contactFrictionAngle. Defaulting to 0 for safety.`);
      return 0;
  }
}

/**
 * @constant
 * @type {object} 
 * @description Lookup table to be used by horizontalEarthPressureCoefficient 
 *  so that this doesn't need to be re-defined at each call. 
 *  To use the table, use KH_LOOKUP_TABLE[pileType][index]
 *  index should be 0 for compression, 1 for tension.
 *  Values used are the averages from the potential range given on p.216
 */
export const KH_LOOKUP_TABLE = {
  "DRIVEN-SINGLE-H-PILE": [0.75, 0.4],
  "DRIVEN-SINGLE-DISPLACEMENT-PILE": [1.25, 0.8],
  "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE": [1.75, 1.15],
  "DRIVEN-JETTED-PILE": [0.65, 0.45],
  "DRILLED-PILE": [0.7, 0.4],
};

/**
 * @param {string} pileType A string value representing the pile type. 
 *    Must be one of the following: 
 *    [
 *      "DRIVEN-SINGLE-H-PILE",
 *      "DRIVEN-SINGLE-DISPLACEMENT-PILE",
 *      "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE",
 *      "DRIVEN-JETTED-PILE",
 *      "DRILLED-PILE"
 *    ]
 * @param {boolean} isCompression true if compression, false if tension
 * @returns {number} The horizontal earth pressure coefficient
 * @description Returns the horizontal earth pressure coefficient for a given 
 *    pile type depending on if it is in compression or tension. The values 
 *    used are the average values in the potential range given in NAVFAC 
 *    on p.216.
 */
export function horizontalEarthPressureCoefficient(pileType, isCompression) {
  const index = isCompression ? 0 : 1;
  return KH_LOOKUP_TABLE[pileType][index];
}

/**
 * @param {number} c the cohesion in pounds per square foot (psf) of a clay
 * @param {string} material the material used. Can take the values 
 *  "TIMBER", "CONCRETE", or "STEEL"
 * @returns {number} the adhesion in pounds per square foot (psf) of the clay
 * @description Calculates the adhesion between a clay and the foundation 
 *  material based on FIGURE 2 on p.219 using linear interpolation
 */
export function adhesion(c, material) {
  switch (material) {
    case ("TIMBER"):
      if (c < 250) return c;
      else if (c < 500) { //adhesion is in range 250-480
        return 250 + (c - 250) / 250 * 230;
      } else if (c < 1000) { //adhesion is in range 480-750
        return 480 + (c - 500) / 500 * 270;
      } else if (c < 2000) { //adhesion is in range 750-950
        return 750 + (c - 1000) / 1000 * 200;
      } else if (c < 4000) { //adhesion is in range 950-1300
        return 950 + (c - 2000) / 2000 * 350;
      } else return 1300;
    case ("CONCRETE"):
      if (c < 250) return c;
      else if (c < 500) { //adhesion is in range 250-480
        return 250 + (c - 250) / 250 * 230;
      } else if (c < 1000) { //adhesion is in range 480-750
        return 480 + (c - 500) / 500 * 270;
      } else if (c < 2000) { //adhesion is in range 750-950
        return 750 + (c - 1000) / 1000 * 200;
      } else if (c < 4000) { //adhesion is in range 950-1300
        return 950 + (c - 2000) / 2000 * 350;
      } else return 1300;
    case ("STEEL"):
      if (c < 250) return c;
      else if (c < 500) { //adhesion is in range 250-460
        return 250 + (c - 250) / 250 * 210;
      } else if (c < 1000) { //adhesion is in range 460-700
        return 460 + (c - 500) / 500 * 240;
      } else if (c < 2000) { //adhesion is in range 700-720
        return 700 + (c - 1000) / 1000 * 20;
      } else if (c < 4000) { //adhesion is in range 720-750
        return 720 + (c - 2000) / 2000 * 30;
      } else return 750;
    default:
      return 0;
  }
}

/**
 * @param {number} depth foundation embedment depth in feet
 * @param {number} width foundation width in feet
 * @returns {number} A number between 6.29 and 9
 * @description Calculates the bearing capacity factor in cohesive soils. 
 *  This assumes a cylindrical foundation. 
 *  The equation used is a 4th order approximation of the curve shown in 
 *  FIGURE 2 on p.219, which asymptotically approaches 9. In most cases,
 *  this function will be returning 9.
 */
export function cohesiveNc(depth, width) {
  let x = depth / width;
  return (x < 4) ? 6.29 + 1.88 * x - 0.506 * x ** 2 + 0.0632 * x ** 3 - 0.0031 * x ** 4 : 9;
}

/**
 * @param {[number]} unitWeights array of unit weights for each sublayer (pcf)
 * @param {number} increment thickness of each sublayer in feet
 * @param {number} groundwaterDepth the depth from ground surface to water, (ft)
 * @returns {[number]} array of effective stress values (psf)
 * @description Calculates the effective vertical stress at the bottom of each 
 *  sublayer given the unit weights of each sublayer, size of each sublayer,
 *  and the depth to groundwater. Returns an array of effective stress values 
 *  in pounds per square foot (psf).
 * 
 *  Effective vertical stress = <total vertical Stress> - <pore water pressure>
 *  total vertical stress = <depth> * <unit weight>
 *  pore water pressure = <depth from top of groundwater table> * UNIT_WEIGHT_WATER
 */
export function effStressBottomProfile(unitWeights, increment, groundwaterDepth) {
  let effStressBottom = [];
  // The calculation will start at the depth of one increment
  let currentDepth = increment;
  // Calculate the effective stress for the first sublayer
  if (groundwaterDepth < increment) {
    effStressBottom[0] = (unitWeights[0] - UNIT_WEIGHT_WATER) * increment;
  } else {
    effStressBottom[0] = unitWeights[0] * increment;
  }
  // Calculate the effective stress for subsequent layers, accounting for water
  // If groundwater is present within a sublayer, the weight of the water gets
  // subtracted from the soil unit weight for that layer.
  for (let i = 1; i < unitWeights.length; i++) {
    currentDepth += increment;
    effStressBottom.push(groundwaterDepth < currentDepth ?
      effStressBottom[i - 1] + (unitWeights[i] - UNIT_WEIGHT_WATER) * increment :
      effStressBottom[i - 1] + unitWeights[i] * increment
    );
  }
  return effStressBottom;
}

/**
 * @param {[number]} unitWeights array of unit weights for each sublayer (pcf)
 * @param {number} increment thickness of each sublayer in feet
 * @param {number} groundwaterDepth the depth from ground surface to water, (ft)
 * @param {[number]} effStressBottom array of calculated effective stress
 *  values at the bottom of each sublayer
 * @returns {[number]} array of effective stress values (psf)
 * @description Calculates the effective vertical stress at the midpoint of each
 *  sublayer given the unit weights of each sublayer, size of each sublayer,
 *  the depth to groundwater, and a calculated array of effective vertical stress 
 *  at the bottom of each sublayer. Returns an array of effective stress values 
 *  in pounds per square foot (psf).
 * 
 *  Effective vertical stress = <total vertical Stress> - <pore water pressure>
 *  total vertical stress = <depth> * <unit weight>
 *  pore water pressure = <depth from top of groundwater table> * UNIT_WEIGHT_WATER 
 * 
 *  For each layer, the effective stress from the above layer is taken from the 
 *  effStressBottom array, and the incremental additional effective vertical 
 *  stress is calculated by cutting the interval in half.
 * 
 *  effStressMidpoint = <effStressBottom from layer above> + 
 *    <half of the incremental vertical stress for the current layer>
 */
export function effStressMidpointProfile(
  unitWeights, increment, groundwaterDepth, effStressBottom) {
  let effStressMidpoint = [];
  let currentDepth = increment;
  // Calculate the effective stress for the first sublayer
  effStressMidpoint[0] = (groundwaterDepth < currentDepth) ?
    (unitWeights[0] - UNIT_WEIGHT_WATER) * (increment / 2) :
    unitWeights[0] * (increment / 2);
  // Calculate the effective stress for subsequent layers, accounting for water
  // If groundwater is present within a sublayer, the weight of the water gets
  // subtracted from the soil unit weight for that layer.
  for (let i = 1; i < unitWeights.length; i++) {
    currentDepth += increment;
    effStressMidpoint.push(groundwaterDepth < currentDepth ?
      effStressBottom[i - 1] + (unitWeights[i] - UNIT_WEIGHT_WATER) * (increment / 2) :
      effStressBottom[i - 1] + unitWeights[i] * (increment / 2)
    );
  }
  return effStressMidpoint;
}

/**
 * @param {[number]} effStress array of effective stress values
 * @param {number} width the width of the foundation in feet
 * @param {number} increment the depth of each sublayer in feet
 * @returns {{[number], boolean}} Object containing possibly modified 
 *  effective stress values and a boolean to indicate if values were modified.
 * @description Limits the effective stress used in calculations to the value 
 *  at 20B, the depth that is 20 times the width of the foundation. 
 *  This practice is recommended when calculating end bearing. Returns an 
 *  object with two properties: the updated effective stress profile and 
 *  a boolean indicating if the profile has been modified.
 *  See p.215 of NAVFAC
 */
export function limitEffStress(effStress, width, increment) {
  const limitingDepth = width * 20;
  let limitedEffStress = [];
  let isLimited = false;
  let currentDepth = 0;
  for (let i = 0; i < effStress.length; i++) {
    currentDepth += increment;
    limitedEffStress.push(
      currentDepth > limitingDepth ? limitedEffStress[i - 1] : effStress[i]
    );
  }
  if (currentDepth > limitingDepth) isLimited = true;
  return { limitedEffStress, isLimited };
}
/**
 * @module FoundationCalc
 * 
 * @description This file contains the FoundationCalc class. This class 
 *  receives a detailedSoilProfile object as input along with details about 
 *  the foundation to be analyzed and performs the calculation. The constructor 
 *  does the calculation and stores the results as a results object.
 */

import * as nf from './navfacFunctions';

/**
 * @param {object} detailedSoilProfile generated by DeepFoundationAnalysis
 * @param {string} material "TIMBER", "CONRETE", or "STEEL"
 * @param {string} pileType Must be one of the following: 
 *    [
 *      "DRIVEN-SINGLE-H-PILE",
 *      "DRIVEN-SINGLE-DISPLACEMENT-PILE",
 *      "DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE",
 *      "DRIVEN-JETTED-PILE",
 *      "DRILLED-PILE"
 *    ]   
 *  @param {Array.<string>} width Arr with one (circle) or two (rect) nums
 *  @param {number} bearingDepth bearing depth of foundation in feet
 *  @param {number} increment thickness of each sublayer (feet)
 *  @param {boolean} isCompression true if compression, false if tension
 *  @param {number} FS Factor of safety, probably 3
 *  @param {number} ignoredDepth depth to ignore in skin friction calc
 *  @property {object} detailedSoilProfile see params
 *  @property {string} material see params
 *  @property {string} pileType see params
 *  @property {Array.<number>} width see params
 *  @property {number} bearingDepth see params
 *  @property {number} increment see params
 *  @property {boolean} isCompression see params
 *  @property {number} FS see params
 *  @property {number} ignoredDepth see params
 *  @property {Array.<number>} contactFrictionAngles Array of contact friction 
 *    angles determined from detailedSoilProfile and material
 *  @property {Array.<number>} adhesions Array of adhesions determined by 
 *    detailedSoilProfile and material
 *  @property {number} earthPressureCoefficient Number determined from 
 *    pileType and isCompression
 *  @property {string} shape Determined from pileType, either "CIRLCE" or 
 *    "RECTANGLE"
 *  @property {number} pileArea Area of the pile determined by it's shape and 
 *    width
 *  @property {number} pilePerimeter Perimeter or circumberence determined by 
 *    its shape and width
 *  @property {boolean} isDrilled true if pileType is "DRILLED-SHAFT" 
 *    otherwise false
 *  @property {number} granularNq Granular bearing capacity factor determined 
 *    by isDrilled, detailedSoilProfile, bearingDepth
 *  @property {number} cohesiveNc Cohesive bearing capacity factor determined 
 *    by detailedSoilProfile, bearingDepth
 *  @property {object} limitedBottomStresses contains array of potentially 
 *    modifed bottom effective stress values and a boolean indicating if 
 *    changes were applied. Determined by detailedSoilProfile, width, 
 *    and increment.
 *    { limitedEffStress : {Array.<number>}, isLimited : {boolean} }
 *  @property {object} limitedMidStresses contains array of potentially 
 *    modifed middle effective stress values and a boolean indicating if 
 *    changes were applied. Determined by detailedSoilProfile, width, 
 *    and increment.
 *    { limitedEffStress : {Array.<number>}, isLimited : {boolean} }
 *  @property {number} effStressAtBearing the effective stress at the 
 *    bearing elevation. Determined by detailedSoilProfile, bearingDepth
 *  @property {Array.<number>} skinFrictions array of incremental skin frition 
 *    values determined by earthPressureCoefficient, limitedMidStresses, 
 *    contactFrictionAngles, pilePerimeter, increment, adhesions, 
 *    ignoredDepth, bearingDepth, detailedSoilProfile
 *  @property {number} totalSkinFriction the sum of the values in skinFrictions
 *  @property {number} endBearing the calculated end bearing value based on 
 *    cohesionAtBearingDepth, cohesiveNc, effStressAtBearing, granularNq, 
 *    pileArea, isCompression
 *  @property {number} pileWeight the weight of the pile based on material, 
 *    bearingDepth and pileArea
 *  @property {number} ultimateCapacity the ultimate capacity determined from 
 *    totalSkinFriction, endBearing.value, pileWeight, isCompression
 *  @property {number} allowableCapacity the allowable capacity determined from 
 *    totalSkinFriciton, endBearing.value, pileWeight, isCompression, FS
 *  @description I'd like to know how this works as well.
 */
export default class FoundationCalc {
  constructor(
    detailedSoilProfile,
    material,
    pileType,
    width,
    bearingDepth,
    increment,
    isCompression,
    FS,
    ignoredDepth) {
    this.detailedSoilProfile = detailedSoilProfile;
    this.material = material;
    this.pileType = pileType;
    this.width = width;
    this.bearingDepth = bearingDepth;
    this.increment = increment;
    this.isCompression = isCompression;
    this.FS = FS;
    this.ignoredDepth = ignoredDepth;

    /* The next several assignments are calculations to get
      the properties needed to calculate capacity. These are 
      all properties that rely on the foundation itselft and 
      are not intrinsic to the soil */
    this.contactFrictionAngles = this.contactFrictionAngleProfile(
      this.detailedSoilProfile.layerPhis, this.material);
    this.adhesions = this.adhesionProfile(
      this.detailedSoilProfile.layerCohesions, this.material);
    this.earthPressureCoefficient = nf.horizontalEarthPressureCoefficient(
      this.pileType, this.isCompression);

    this.shape = this.shapeOfPileType(this.pileType)
    this.pileArea = nf.area(this.width, this.shape);
    this.pilePerimeter = nf.perimeter(this.width, this.shape);

    this.isDrilled = this.pileType === "DRILLED-PILE" ? true : false;
    this.granularNq = this.NqAtBearingDepth(this.isDrilled,
      this.detailedSoilProfile.layerBottomDepths,
      this.detailedSoilProfile.layerPhis,
      this.bearingDepth);

    // We are using the diameter of the circle, or the first value 
    // in the width array for an H-Pile
    this.cohesiveNc = nf.cohesiveNc(this.bearingDepth, this.width[0]);

    this.cohesionAtBearingDepth = this.bearingCohesion(
      this.detailedSoilProfile.layerBottomDepths,
      this.bearingDepth,
      this.detailedSoilProfile.layerCohesions);

    // These limited stress profiles must be used for analysis, not 
    // the profiles that come directly from DeepFoundationAnalysis.
    this.limitedBottomStresses = nf.limitEffStress(
      this.detailedSoilProfile.layerEffStressBottoms,
      this.width[0],
      this.increment);
    this.limitedMidStresses = nf.limitEffStress(
      this.detailedSoilProfile.layerEffStressMids,
      this.width[0],
      this.increment);

    this.effStressAtBearing = this.bearingEffStress(
      this.detailedSoilProfile.layerBottomDepths,
      this.bearingDepth,
      this.limitedBottomStresses.limitedEffStress
    );

    // Perform the skin friction analysis
    this.skinFrictions = this.skinFrictionProfile(
      this.earthPressureCoefficient, this.limitedMidStresses.limitedEffStress,
      this.contactFrictionAngles, this.pilePerimeter,
      this.increment, this.adhesions, this.ignoredDepth,
      this.bearingDepth,
      this.detailedSoilProfile.layerBottomDepths,
      this.detailedSoilProfile.layerPhis
    );
    this.totalSkinFriction = this.sumAll(this.skinFrictions);
    this.endBearing = this.calcEndBearing(
      this.cohesionAtBearingDepth,
      this.cohesiveNc,
      this.effStressAtBearing,
      this.granularNq,
      this.pileArea,
      this.isCompression);
    this.pileWeight = nf.pileWeight(this.material, this.bearingDepth,
      this.pileArea);
    this.ultimateCapacity = nf.ultimateLoadCapacity(
      this.totalSkinFriction,
      this.endBearing.value,
      this.pileWeight,
      this.isCompression
    );
    this.allowableCapacity = nf.allowableLoadCapacity(
      this.totalSkinFriction,
      this.endBearing.value,
      this.pileWeight,
      this.isCompression,
      this.FS);
  }

  /**
   * Maps the soil internal friction angle and material to a new 
   * arrray of contact friction angles
   * @param {Array.<number>} layerPhis array of soil friction angles 
   * @param {string} material "TIMBER", "CONRETE", or "STEEL"
   * @returns {Array.<number>} array of delta values
   */
  contactFrictionAngleProfile = (layerPhis, material) => {
    let contactFrictionAngles = layerPhis.map(phi => {
      return nf.contactFrictionAngle(phi, material)
    });
    return contactFrictionAngles;
  }

  /**
   * Maps the soil cohesion and material to a new array of 
   * adhesion values (psf)
   * @param {Array.<number>} layerCohesions array of soil cohesions
   * @param {string} material "TIMBER", "CONRETE", or "STEEL"
   * @returns {Array.<number>} array of adhesion values
   */
  adhesionProfile = (layerCohesions, material) => {
    let adhesions = layerCohesions.map(c => {
      return nf.adhesion(c, material);
    });
    return adhesions;
  }

  /**
   * maps pileType to shape. The only rectangle is 
   * "DRIVEN-SINGLE-H-PILE", so we are only checking to see if 
   * this is the shape. Otherwise, it must be a circle.
   * @param {string} pileType 
   * @returns "RECTANGLE" or "CIRCLE"
   */
  shapeOfPileType = (pileType) => {
    return pileType === 'DRIVEN-SINGLE-H-PILE'
      ? "RECTANGLE"
      : "CIRCLE"
  }

  /**
   * Determines the granular bearing capacity factor for this pile and 
   * returns the result.
   * @param {boolean} isDrilled boolean indicated foundation is drilled shaft 
   * @param {Array.<number>} layerBottomDepths from detailedSoilProfile 
   * @param {Array.<number>} layerPhis from detailedSoilProfile 
   * @param {number} bearingDepth depth (ft) where foundation bears 
   * @returns {number} Bearing capacity factor for granular material
   */
  NqAtBearingDepth = (isDrilled, layerBottomDepths,
    layerPhis, bearingDepth) => {
    // We use +1 here because we are interested in the soil BELOW
    const bearingIndex = layerBottomDepths.indexOf(bearingDepth) + 1;
    return nf.granularNq(isDrilled, layerPhis[bearingIndex])
  }

  /**
   * Generates a skin friction profile for the pile. This calculation 
   * accounts for initial ignored depth and stops after the embedment depth. 
   * For each sublayer, granularSkinFriction is called if the phi value 
   * nonzero. Otherwise, cohesiveSkinFriction is called. The function returns 
   * a new array with length equal to the number of sublayers.
   * @param {number} Kh 
   * @param {Array.<number>} EffStressMidProfile 
   * @param {Array.<number>} contactFrictionAngleProfile 
   * @param {number} perimeter 
   * @param {number} increment 
   * @param {Array.<number>} adhesionProfile 
   * @param {number} ignoredDepth 
   * @param {number} bearingDepth 
   * @param {Array.<number>} layerBottomDepths 
   * @returns {Array.<number>} Array of skin friction values
   */
  skinFrictionProfile = (Kh, EffStressMidProfile,
    contactFrictionAngleProfile, perimeter, increment,
    adhesionProfile, ignoredDepth, bearingDepth,
    layerBottomDepths, layerPhis) => {
    let skinFrictions = [];
    for (let i = 0; i < layerBottomDepths.length; i++) {
      if (layerBottomDepths[i] <= ignoredDepth ||
        layerBottomDepths[i] > bearingDepth) {
        skinFrictions.push(0);
      } else {
        if (layerPhis[i]) {
          skinFrictions.push(nf.granularSkinFriction(
            Kh, EffStressMidProfile[i],
            contactFrictionAngleProfile[i], perimeter, increment));
        } else {
          skinFrictions.push(nf.cohesiveSkinFriction(
            adhesionProfile[i], perimeter, increment));
        }
      }
    }
    return skinFrictions;
  }

  /**
   * Simple function to sum numbers in an array.
   * @param {Array.<number>} array 
   * @returns the sum of the numbers in the array
   */
  sumAll = (array) => {
    return array.reduce((x, y) => x + y);
  }

  /**
   * Return the cohesion directly below the foundation bearing depth
   * @param {Array.<number>} layerBottomDepths 
   * @param {number} bearingDepth 
   * @param {Array.<number>} cohesions 
   * @returns {number} cohesion directly below the foundation
   */
  bearingCohesion = (layerBottomDepths, bearingDepth, cohesions) => {
    // We want the cohesion directly below the foundation
    const bearingIndex = layerBottomDepths.indexOf(bearingDepth) + 1;
    return cohesions[bearingIndex];
  }

  /**
   * Return the effective stress at the base of the foundation
   * @param {Array.<number>} layerBottomDepths 
   * @param {number} bearingDepth 
   * @param {Array.<number>} limitedEffStresses 
   * @returns {number} the effective stress at the base of the foundation
   */
  bearingEffStress = (layerBottomDepths, bearingDepth,
    limitedEffStresses) => {
    // We want the effect stress At the base of the foundation
    const bearingIndex = layerBottomDepths.indexOf(bearingDepth);
    return limitedEffStresses[bearingIndex];
  }

  /**
   * Calculate the end bearing for the foundation. Uses the cohesive 
   * method if c is greater than zero, otherwise uses the granular method. 
   * Returns 0 if the pile is in tension because end bearing doesn't apply. 
   * Returns an object with value and string indicating which method.
   * @param {number} c cohesion at bearing depth 
   * @param {number} Nc cohesive bearing capacity factor
   * @param {number} Pt effective stress at bearing depth
   * @param {number} Nq granular bearing capacity factor
   * @param {number} area area of pile
   * @param {boolean} isCompression true if compression false if tension
   * @returns {object} object containing bearing capacity value and 
   *  string indicating if bearing was controlled by cohesion of friction.
   *  { value: {number}, mode: {string} }
   */
  calcEndBearing = (c, Nc, Pt, Nq, area, isCompression) => {
    if (!isCompression) return { value: 0, mode: "N/A" };
    let endBearing = {
      value: undefined,
      mode: undefined,
    };
    if (c) {
      endBearing = {
        value: nf.cohesiveEndBearing(c, area, Nc),
        mode: "COHESIVE",
      }
    } else {
      endBearing = {
        value: nf.granularEndBearing(Pt, Nq, area),
        mode: "GRANULAR",
      }
    }
    return endBearing;
  }
}
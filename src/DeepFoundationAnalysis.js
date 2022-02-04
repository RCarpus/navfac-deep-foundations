/**
 * @module DeepFoundationAnalyis
 * 
 * @description This file contains the DeepFoundationAnalysis class. This class 
 *  takes in soil condition data to generate a soil profile. Then, it can 
 *  receive foundation data to perform axial capacity anaylses for a range 
 *  of foundation depths, sizes, material types, and construction methods. 
 * 
 *  These analyses are based on the NAVFAC soils design manual, which can 
 *  be downloaded at 
 *  https://web.mst.edu/~rogersda/umrcourses/ge441/DM7_02.pdf 
 * 
 *  The relevant design information begins on page 215 of the pdf. 
 *  This is 7.2-193 within the context of the document.
 */

import * as nf from './navfacFunctions';

/**
 * @param {Array.<number>} layerDepths depths (feet) to bottom of each stratum. 
 *  Each value must be a multiple of increment or the analysis will break.
 * @param {Array.<string>} layerNames descriptive names for each stratum
 * @param {Array.<number>} layerUnitWeights unit weights (pcf) for each stratum
 * @param {Array.<number>} layerPhis soil friction angles (integer) for strata. 
 *  This should be 0 for clays and 28 to 40 (inclusive) for sands.
 * @param {Array.<number>} layerCohesions soil cohesion (psf) for clays. 
 *  This should be 0 for sands. 
 * @param {number} groundwaterDepth Depth (ft) to groundwater. This must be a 
 *  multiple of increment or analysis will break.
 * @param {number} increment Thickness (ft) of each sublayer to be formed. 
 *  0.5 or 1 is a typical good practice. 
 * @param {number} ignoredDepth Depth (ft) ignored for skin friction analysis. 
 *  This must be a multiple of increment or analysis will break.
 * @description When constructing a new DeepFoundationAnalysis, we generate a 
 *  new detailedSoilProfile based on the information provided by the 
 *  generalSoilProfile. We do this because we want a series of layers that all 
 *  have the same thickness. This makes it easier to analyze foundations with 
 *  varying depths. 
 * 
 *  It is critical that when generating a deepFoundationAnalysis, the increment 
 *  is the smallest unit of length that can be used. Everything else must be 
 *  a multiple of increment for this to work properly. It is recommended that 
 *  increment be kept to either 1 foot for or 0.5 foot.
 * */
export default class DeepFoundationAnalysis {
  constructor(
    layerDepths,
    layerNames,
    layerUnitWeights,
    layerPhis,
    layerCohesions,
    groundwaterDepth,
    increment,
    ignoredDepth) {
    this.generalSoilProfile = {
      layerDepths,
      layerNames,
      layerUnitWeights,
      layerPhis,
      layerCohesions,
      groundwaterDepth,
    };
    this.increment = increment;
    this.ignoredDepth = ignoredDepth;

    // Generate the detailed soil profile using the input data
    this.detailedSoilProfile = this.generateDetailedSoilProfile(
      this.generalSoilProfile, increment);
  }

  /**
   * 
   * @param {object} generalSoilProfile Object containing the following 
   *  params as generated in DeepFoundationAnalysis.constructor() :
   *  layerDepths {Array.<number>}  
   *  layerNames {Array.<string>}  
   *  layerUnitWeights {Array.<number>}  
   *  layerPhis {Array.<number>}  
   *  layerCohesions {Array.<number>}  
   *  groundwaterDepth {number}  
   * @param {number} increment thickness of the sublayers
   * @returns {object} Object containing soil profile cut into several 
   *  layers of thickness equal to increment. 
   *  layerBottomDepths {Array.<number>}  
   *  layerNames {Array.<string>}  
   *  layerUnitWeights {Array.<number>}  
   *  layerPhis {Array.<number>}  
   *  layerCohesions {Array.<number>}  
   *  layerEffStressBottoms {Array.<number>}  
   *  layerEffStressMids {Array.<number>}  
   *  groundwaterDepth {number}     
   * @description Generate a detailed soil profile that is ready for use in 
   *  pile analyses. This takes the layers of variable size from the 
   *  generalSoilProfile and processes it to be a profile with several 
   *  layers of uniform size. It also generates effective stress profiles 
   *  at the bottom and midpoint of each layer.
   */
  generateDetailedSoilProfile = (generalSoilProfile, increment) => {
    // Initialize the arrays that will be included in the final output object
    let layerBottomDepths = [],
      layerNames = [],
      layerUnitWeights = [],
      layerPhis = [],
      layerCohesions = [];

    var currentDepth = 0;
    const numLayers = generalSoilProfile.layerDepths.length;
    // Iterate over each soil layer to build out detailed profile
    for (let i = 0; i < numLayers; i++) {
      // let currentDepth = 0;
      while (currentDepth < generalSoilProfile.layerDepths[i]) {
        currentDepth += increment;
        layerBottomDepths.push(currentDepth);
        layerNames.push(generalSoilProfile.layerNames[i]);
        layerUnitWeights.push(generalSoilProfile.layerUnitWeights[i]);
        layerPhis.push(generalSoilProfile.layerPhis[i]);
        layerCohesions.push(generalSoilProfile.layerCohesions[i]);
      }
    }

    // Use imported navfac functions to generate stress profiles
    let layerEffStressBottoms = nf.effStressBottomProfile(
      layerUnitWeights, increment, generalSoilProfile.groundwaterDepth);
    let layerEffStressMids = nf.effStressMidpointProfile(
      layerUnitWeights, increment, generalSoilProfile.groundwaterDepth,
      layerEffStressBottoms);

    // aggregate our detailedSoilProfile into an object
    const detailedSoilProfile = {
      layerBottomDepths,
      layerNames,
      layerUnitWeights,
      layerPhis,
      layerCohesions,
      layerEffStressBottoms,
      layerEffStressMids,
      groundwaterDepth: generalSoilProfile.groundwaterDepth,
    }

    return detailedSoilProfile;
  }
}
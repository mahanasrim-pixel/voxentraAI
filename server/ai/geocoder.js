/**
 * VOXENTRA Location Extractor & Geocoder
 * Powered by Master Coimbatore Location Intelligence Engine (locationService.js).
 * Strictly extracts verified area, street, landmark, taluk, and coordinates.
 */

const locationService = require('../services/locationService');
const { COIMBATORE_LOCATIONS } = require('../db/coimbatoreLocations');

// Backward compatibility map
const MUNICIPAL_LOCATIONS = {};
for (const loc of COIMBATORE_LOCATIONS) {
  MUNICIPAL_LOCATIONS[loc.canonical_name.toLowerCase()] = {
    name: loc.canonical_name,
    lat: loc.latitude,
    lng: loc.longitude,
    ward: `${loc.taluk} (${loc.revenue_division})`,
    aliases: loc.aliases || []
  };
}

function extractLocation(text = '', lang = 'Tanglish') {
  const resolved = locationService.resolveLocation(text, lang);

  return {
    // Legacy fields
    areaName: resolved.canonicalLocationName || null,
    ward: resolved.taluk ? `${resolved.taluk} Taluk` : null,
    streetName: resolved.street || null,
    landmark: resolved.landmark || null,
    latitude: resolved.latitude || null,
    longitude: resolved.longitude || null,
    geocoded: resolved.matched,

    // Advanced Coimbatore Location Intelligence fields
    district: resolved.district || 'Coimbatore',
    canonicalLocationName: resolved.canonicalLocationName,
    tamilName: resolved.tamilName || null,
    rawLocationText: resolved.rawLocationText,
    locationId: resolved.locationId,
    landmarkId: resolved.landmarkId || null,
    landmarkType: resolved.landmarkType || null,
    taluk: resolved.taluk,
    revenueDivision: resolved.revenueDivision,
    locationPrecision: resolved.locationPrecision,
    geocodingStatus: resolved.geocodingStatus,
    clarificationRequired: resolved.clarificationRequired,
    clarificationType: resolved.clarificationType,
    clarificationPrompt: resolved.clarificationPrompt,
    matched: resolved.matched
  };
}

module.exports = {
  extractLocation,
  MUNICIPAL_LOCATIONS
};

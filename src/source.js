import * as turf from '@turf/turf'
import { getElevation } from "./utils";

export const createSourceData = async (start, end) => {

  let startPointFeature = null
  let endPointFeature = null
  let lineFeature = null

  const [startElevation, endElevation] = (start && end) ? await Promise.all([
    getElevation(start[0], start[1]),
    getElevation(end[0], end[1]),
  ]) : [null, null]

  if(start) {
    startPointFeature = {
      type: 'Feature',
      properties: {
        type: 'start',
        elevation: startElevation,
      },
      geometry: {
        type: 'Point',
        coordinates: start,
      }
    }
  }

  if(end) {
    endPointFeature = {
      type: 'Feature',
      properties: {
        type: 'end',
        elevation: endElevation,
      },
      geometry: {
        type: 'Point',
        coordinates: end,
      }
    }
  }

  if(start && end) {
    const distance = turf.distance(turf.point(start), turf.point(end), 'kilometers') * 1000
    const elevationChange = endPointFeature.properties.elevation - startPointFeature.properties.elevation
    const slope = elevationChange / distance
    const degree = Math.atan(slope) * 180 / Math.PI
    lineFeature = {
      type: "Feature",
      properties: {
        distance: `距離: ${Math.round(100 * distance) / 100}m`,
        elevationChange: `高度差 ${Math.round(100 * elevationChange) / 100}`,
        slope: Math.round(100 * slope) / 100,
        degree: `傾斜: ${Math.round(100 * degree) / 100}°`,
        label: `傾斜: ${Number.isNaN(degree) ? '-' : Math.round(degree)}°\n(距離: ${Math.round(distance)}m)`
      },
      geometry: {
        type: "LineString",
        coordinates: [ start, end],
      }
    }
  }

  const slopeData = {
    type: "FeatureCollection",
    features: [
      startPointFeature,
      endPointFeature,
      lineFeature,
    ].filter(x => !!x)
  }

  return slopeData
}



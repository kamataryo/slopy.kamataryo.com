import * as turf from '@turf/turf'
import { getElevation } from "./utils";

export const createSourceData = async (start, end) => {

  let startPointFeature = null
  let endPointFeature = null
  let lineFeature = null
  let midPointFeature = null

  const [startElevation, endElevation] = (start && end) ? await Promise.all([
    getElevation(start[0], start[1]),
    getElevation(end[0], end[1]),
  ]) : [null, null]

  if(start) {
    startPointFeature = {
      type: 'Feature',
      properties: {
        type: 'both_end',
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
        type: 'both_end',
        elevation: endElevation,
      },
      geometry: {
        type: 'Point',
        coordinates: end,
      }
    }
  }

  if(start && end) {

    midPointFeature = {
      type: 'Feature',
      properties: {
        type: 'mid',
      },
      geometry: {
        type: 'Point',
        coordinates: turf.midpoint(turf.point(start), turf.point(end)).geometry.coordinates,
      }
    }

    const distance = turf.distance(turf.point(start), turf.point(end), 'kilometers') * 1000
    const elevationChange = endPointFeature.properties.elevation - startPointFeature.properties.elevation
    const degree = Math.atan(elevationChange / distance) * 180 / Math.PI

    let distance_label
    if(distance < 1000) {
      distance_label = `${distance.toFixed(0).toLocaleString()} m`
    } else if(distance < 100000) {
      distance_label = `${(distance / 1000).toFixed(2).toLocaleString()} km`
    } else {
      distance_label = `${(distance / 1000).toFixed(1).toLocaleString()} km`
    }

    const elevationChange_label = `${elevationChange > 0 ? '+' : ''}${elevationChange.toFixed(0).toLocaleString()} m`

    const slope_label = Number.isNaN(degree) ? '-' : `${degree.toFixed(0).toLocaleString()}°`

    lineFeature = {
      type: "Feature",
      properties: {
        distance,
        elevationChange,
        degree,
        label: `傾斜: ${slope_label}\n高度差: ${elevationChange_label}\n水平距離: ${distance_label}`
      },
      geometry: {
        type: "LineString",
        coordinates: [ start, end],
      }
    }
  }

  const slopeSourceData = {
    type: "FeatureCollection",
    features: [
      startPointFeature,
      endPointFeature,
      lineFeature,
    ].filter(x => !!x)
  }

  const textSourceData = {
    type: "FeatureCollection",
    features: [
      midPointFeature,
    ].filter(x => !!x)
  }

  return { slopeSourceData, textSourceData }
}



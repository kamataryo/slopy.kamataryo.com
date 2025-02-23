import { drawStyles, getStyle } from "./mapbox-style";
import { createSourceData } from './source'

MapboxDraw.constants.classes.CONTROL_BASE  = 'maplibregl-ctrl';
MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

const map = new maplibregl.Map({
  container: "map",
  center: [139.7690, 35.6804],
  zoom: 10,
  style: getStyle(),
  hash: true,
  localIdeographFontFamily: '"Noto Sans Regular", sans-serif',

});

// const draw = new MapboxDraw({
//   controls: {
//     point: false,
//     polygon: false,
//     combine_features: false,
//     uncombine_features: false,
//     trash: false,
//   },
//   styles: drawStyles,
// });

map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.ScaleControl());
// map.addControl(draw, "top-right");

map.on("load", async () => {

  const start = [ 36.16931477063946, 23.71245824599066]
  const end = [ 24.004432163632345, 21.16264451062996 ]
  const slopeData = await createSourceData(start, end)

  const slopeLayer = {
    id: 'slope',
    source: 'slope',
    type: 'line',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'line-color': 'red',
      'line-width': 5,
    }
  }
  const slopeEndLayer = {
    id: 'slope-end',
    source: 'slope',
    type: 'circle',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'circle-color': 'red',
      'circle-radius': 5,
    }
  }
  const slopeTextLayer = {
    id: 'slope-text',
    source: 'slope',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'label'],
      'text-size': 16,
      'text-offset': [0, 1],
      "text-variable-anchor": ["bottom", "top"],
      "text-allow-overlap": false,
    },
    paint: {
      'text-color': 'red',
      'text-halo-color': 'white',
      'text-halo-width': 4,
    }
  }

  map.addSource('slope', { type: 'geojson', data: slopeData })
  map.addLayer(slopeLayer)
  map.addLayer(slopeEndLayer)
  map.addLayer(slopeTextLayer)


  map.on('click', async (e) => {
    const { lng, lat } = e.lngLat
    const point = [lng, lat]
    const source = e.target.getSource('slope')
    const data = await source.getData()
    const featureCount = data.features.length

    let nextData
    if(featureCount >= 3 || featureCount <= 0) {
      nextData = await createSourceData(point, null)
    } else if(featureCount === 1) {
      const existingPoint = data.features[0].geometry.coordinates
      nextData = await createSourceData(existingPoint, point)
    }

    source.setData(nextData)
  })
});

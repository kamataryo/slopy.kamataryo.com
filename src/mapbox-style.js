export const getStyle = () => {
  return {
    "version": 8,
    "name": "GSI Japan based style",
    "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    "sources": {
      'gsi-std': {
        type: 'raster',
        tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
        tileSize: 128,
        attribution: '国土地理院 標準地図',
        maxzoom: 18,
      },
      // 'gsi-photo': {
      //   type: 'raster',
      //   tiles: ['https://maps.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'],
      //   tileSize: 256,
      //   attribution: '国土地理院 シームレス空中写真',
      // },
      // "gaze": {
      //   type: "geojson",
      //   data: "https://kamataryo.github.io/gazetteer-of-japan/gaze.geojson",
      // }
    },
    "layers": [
      {
        'id': 'gsi-std',
        'type': 'raster',
        'source': 'gsi-std',
        'minzoom': 0,
        'maxzoom': 18,
      },
      // {
      //   'id': 'gsi-photo',
      //   'type': 'raster',
      //   'source': 'gsi-photo',
      //   'minzoom': 0,
      //   'maxzoom': 22,
      // },
      // {
      //   "id": "gaze",
      //   "type": "symbol",
      //   "source": "gaze",
      //   minzoom: 8,
      //   "layout": {
      //     "text-field": ["get", "name"],
      //     "text-font": ["Open Sans Regular"],
      //     "text-size": 14,
      //     "text-allow-overlap": false,
      //     "text-ignore-placement": false,
      //   },
      //   "paint": {
      //     "text-color": "white",
      //     "text-halo-color": "black",
      //     "text-halo-width": 1,
      //   },
      // }
    ]
  }
}

export const slopeLayer = {
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
export const slopeEndLayer = {
  id: 'slope-end',
  source: 'slope',
  type: 'circle',
  filter: ['==', ['get', 'type'], 'both_end'],
  layout: {
    visibility: 'visible',
  },
  paint: {
    'circle-color': 'crimson',
    'circle-radius': 6,
  }
}
export const slopeTextLayer = {
  id: 'slope-text',
  source: 'slope', // TODO: slope-text とするとなぜか表示されない
  type: 'symbol',
  layout: {
    'text-field': ['get', 'label'],
    'text-size': 16,
    'text-offset': [2, 2],
    "text-variable-anchor": ["top", "right", "bottom", "right", "bottom-left", "bottom-right"], // TODO
    "text-allow-overlap": true,
  },
  paint: {
    'text-color': 'red',
    'text-halo-color': 'white',
    'text-halo-width': 4,
  }
}

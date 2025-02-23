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
        attribution: '国土地理院 標準地図'
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
        'maxzoom': 22,
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


export const drawStyles = [
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "LineString"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#e74230",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#e74230",
      "line-dasharray": [0.2, 2],
      "line-width": 2,
    },
  },
];

import { getStyle } from "./mapbox-style";
import { createSourceData } from './source'
import { slopeLayer, slopeEndLayer, slopeTextLayer } from './mapbox-style'

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const inputMethodIndicator = document.querySelector('.input-method-indicator');
inputMethodIndicator.innerHTML = isTouchDevice ? 'タップ' : 'クリック';

const map = new maplibregl.Map({
  container: "map",
  center: [139.7690, 35.6804],
  zoom: 10,
  style: getStyle(),
  hash: true,
  localIdeographFontFamily: 'sans-serif',
  minZoom: 4.5,
  maxZoom: 16.9,
});
window.__slopy_map = map

map.addControl(new maplibregl.NavigationControl());
map.addControl(new maplibregl.GeolocateControl());
map.addControl(new maplibregl.ScaleControl());

map.on("load", async () => {

  const { slopeSourceData, textSourceData } = await createSourceData(null, null)

  map.addSource('slope', { type: 'geojson', data: slopeSourceData })
  map.addSource('slope-text', { type: 'geojson', data: textSourceData })
  map.addLayer(slopeLayer)
  map.addLayer(slopeEndLayer)
  map.addLayer(slopeTextLayer)

  let disableClick = false
  const canvas = map.getCanvas()
  const defaultCursor = canvas.style.cursor

  map.on('click', async (e) => {
    if(disableClick) return

    const { lng, lat } = e.lngLat
    const point = [lng, lat]
    const slopeSource = e.target.getSource('slope')
    const slopeTextSource = e.target.getSource('slope-text')

    const slopeData = await slopeSource.getData()
    const featureCount = slopeData.features.length

    let nextData
    if(featureCount === 0) {
      // この際 async 処理無しの ghost promise となっている
      nextData = await createSourceData(point, null)
    } else if(featureCount === 1) {
      disableClick = true
    try {
        canvas.style.cursor = 'wait'
        const existingPoint = slopeData.features[0].geometry.coordinates
        nextData = await createSourceData(existingPoint, point)
      } catch (error) {
        console.error(error)
      } finally {
        canvas.style.cursor = 'default'
        disableClick = false
      }
    } else {
      canvas.style.cursor = defaultCursor
      nextData = await createSourceData(null, null)
    }
    slopeSource.setData(nextData.slopeSourceData)
    slopeTextSource.setData(nextData.textSourceData)
  })
});

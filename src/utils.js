export const getElevation = async (lng, lat) => {
  try {
    const resp = await fetch(
      `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lng}&lat=${lat}&outtype=JSON`
    )
    const data = await resp.json()
    return data.elevation
  } catch (error) {
    return '-'
  }
};

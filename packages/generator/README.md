<div align="center">
  <h1>
    Proof of Residency Generator
  </h1>

  <img src="https://proofofresidency.xyz/russia.png" alt="Russia POR" width="100%" />

  <br />

Proof of Residency is a Sybil-resistant Proof of Personhood protocol which issues **non-transferable** ERC-721 tokens based on physical mailing addresses. Please refer to the [main project repo](https://github.com/proof-of-residency/proof-of-residency) for further information.

</div>

---

## Overview

This project uses the [TopoJSON world atlas](https://github.com/topojson/world-atlas) and [geo-maps GeoJSON water bodies](https://github.com/simonepri/geo-maps) projects. The TopoJSON was converted to GeoJSON using:

```bash
yarn topo2geo countries=countries-110m-geo.json < countries-110m.json
```

This stack uses [p5js](https://p5js.org) for the generative art designs. The designs are generated from the GeoJSON by projecting the country boundaries and water boundaries using Mercator projection and then scaling the values in between 0 and 1. These shapes are then saved to JSON files to be used in p5js.

_Note: some issues may exist with smaller countries, due to resolution issues of the original maps._

Please see the [website](https://proofofresidency.xyz) for more information!

## License

Licensed under the [MIT license](../../LICENSE).

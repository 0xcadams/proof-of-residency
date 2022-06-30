import * as turf from "@turf/turf";

import fs from "fs";
import iso from "iso-3166-1";

import ProgressBar from "progress";

import { AllCountries, AllWaterBodies, Country } from "../types";

const defaultCountriesResolution = "50m";
const highCountriesResolution = "10m";

export const generate = async () => {
  const allCountries: AllCountries = JSON.parse(
    fs
      .readFileSync(
        `./src/geojson/original/countries-${defaultCountriesResolution}.geo.json`
      )
      .toString()
  );
  const allCountriesHigherResolution: AllCountries = JSON.parse(
    fs
      .readFileSync(
        `./src/geojson/original/countries-${highCountriesResolution}.geo.json`
      )
      .toString()
  );

  let countCountries = 0;

  for (let country of allCountries.features.slice(
    allCountries.features.findIndex((e) => e.properties.name === "Antarctica")
  )) {
    // if (
    //   !(
    //     (
    //       // country.properties.name === "Puerto Rico" ||
    //       country.properties.name === "Hong Kong" ||
    //       country.properties.name === "Lebanon" ||
    //     // country.properties.name === "China" ||
    //     // country.properties.name === "United States of America"
    //   )
    // )
    //   continue;

    const countryIso = getCountryIsoForName(country?.properties?.name);

    if (!countryIso) continue;

    const actualArea = turf.area(country.geometry);

    const countryName = country.properties.name;
    console.log(
      `\n--- ${countryName} (area: ${actualArea.toFixed(0)} m^2) ---`
    );

    if (actualArea < 1e11) {
      country =
        allCountriesHigherResolution.features.find(
          (c) => c.properties.name === country.properties.name
        ) ?? country;

      console.log("(using higher resolution)");
    }

    const fileName = `./sources/countries/${Number(countryIso.numeric)}.json`;

    const countryMultiPolygonNonProjected =
      country.geometry.type === "Polygon"
        ? turf.multiPolygon([country.geometry.coordinates])
        : turf.multiPolygon(country.geometry.coordinates);

    const countryMultiPolygon = turf.toMercator(
      countryMultiPolygonNonProjected,
      { mutate: true }
    );

    const projectedBbox = turf.bbox(countryMultiPolygon);

    const width = Math.abs(projectedBbox[2] - projectedBbox[0]);
    const height = Math.abs(projectedBbox[3] - projectedBbox[1]);

    const widthOrHeight = width > height ? width : height;

    const heightOffset =
      width > height ? (width - height) / 2 / widthOrHeight : 0;
    const widthOffset =
      height > width ? (height - width) / 2 / widthOrHeight : 0;

    const scaledToWidthHeight = countryMultiPolygon.geometry.coordinates.map(
      (outer) =>
        outer.map((inner) =>
          inner.map((coordinate) => {
            if (coordinate.length !== 2) {
              throw new Error("coordinate shouldn't have len !== 2");
            }

            const x =
              Math.abs(coordinate[0] - projectedBbox[0]) / widthOrHeight +
              widthOffset;
            const y =
              Math.abs(coordinate[1] - projectedBbox[3]) / widthOrHeight +
              heightOffset;

            return { x, y };
          })
        )
    );

    // let prevCoord;

    // const scaledToWidthHeightAndFilteredByDuplicates = scaledToWidthHeight.map(
    //   (inner) =>
    //     inner.map((inner) =>
    //       inner.filter((coord, i) => {
    //         return i % 5 === 0 || i > scaledToWidthHeight.length - 4 || i < 4;
    //       })
    //     )
    // );

    // 9458468788581.436 - USA
    // 1626471398612.453 - Iran
    // 1031803670.8134161 - Hong Kong
    const waterBodiesResolution =
      actualArea < 1e10
        ? "250m"
        : actualArea < 1e11
        ? "500m"
        : actualArea < 1e12
        ? "1km"
        : "2km5";

    console.log(
      `Generating waterbodies for ${countryName} with resolution ${waterBodiesResolution}`
    );

    const waterBodies: AllWaterBodies = JSON.parse(
      fs
        .readFileSync(
          `./src/geojson/original/earth-waterbodies-${waterBodiesResolution}.geo.json`
        )
        .toString()
    );

    const mercatorWaterBodies = turf.toMercator(waterBodies, { mutate: true });

    const bar = new ProgressBar(":bar  :percent :etas", {
      total:
        mercatorWaterBodies.geometries.length *
        countryMultiPolygon.geometry.coordinates.length,
    });

    const waterBodiesMapped = mercatorWaterBodies.geometries
      .flatMap((hydro) => {
        if (hydro.type !== "MultiPolygon") {
          throw new Error("Must be MultiPolygon");
        }

        return countryMultiPolygon.geometry.coordinates.map((polygon) => {
          try {
            bar.tick();

            const intersection = turf.intersect(hydro, turf.polygon(polygon));

            if (!intersection) {
              return [];
            }

            const intersectionMultiPolygon =
              intersection.geometry.type === "Polygon"
                ? turf.multiPolygon([intersection.geometry.coordinates])
                : turf.multiPolygon(intersection.geometry.coordinates);

            return intersectionMultiPolygon.geometry.coordinates.flatMap(
              (outer) =>
                outer.map((inner) =>
                  inner.map((coordinate) => {
                    const x =
                      Math.abs(
                        (coordinate[0] - projectedBbox[0]) / widthOrHeight
                      ) + widthOffset;
                    const y =
                      Math.abs(
                        (coordinate[1] - projectedBbox[3]) / widthOrHeight
                      ) + heightOffset;

                    return { x, y };
                  })
                )
            );
          } catch (e) {
            console.error(e);
            return [];
          }
        });
      })
      .filter((arr) => (arr?.length ?? 0) !== 0);

    const output: Country = {
      country: {
        ...countryIso,
        coordinates: scaledToWidthHeight,
      },
      waterBodies: waterBodiesMapped,
    };

    fs.writeFileSync(fileName, JSON.stringify(output));

    console.log(`Saved ${countryName} (${countryIso.numeric})`);

    countCountries++;
  }

  console.log(
    `----- Saved ${countCountries} countries total, out of ${iso.all().length}`
  );
};

const getCountryIsoForName = (name?: string) => {
  let countryIso = iso.whereCountry(name ?? "");

  if (name === "Dem. Rep. Congo") countryIso = iso.whereAlpha3("COD");
  if (name === "Dominican Rep.") countryIso = iso.whereAlpha3("DOM");
  if (name === "Russia") countryIso = iso.whereAlpha3("RUS");
  if (name === "Falkland Is.") countryIso = iso.whereAlpha3("FLK");
  if (name === "Fr. S. Antarctic Lands") countryIso = iso.whereAlpha3("ATA");
  if (name === "Venezuela") countryIso = iso.whereAlpha3("VEN");
  if (name === "Central African Rep.") countryIso = iso.whereAlpha3("CAF");
  if (name === "Eq. Guinea") countryIso = iso.whereAlpha3("GNQ");
  if (name === "eSwatini") countryIso = iso.whereAlpha3("SWZ");
  if (name === "Palestine") countryIso = iso.whereAlpha3("PSE");
  if (name === "Laos") countryIso = iso.whereAlpha3("LAO");
  if (name === "Vietnam") countryIso = iso.whereAlpha3("VNM");
  if (name === "North Korea") countryIso = iso.whereAlpha3("PRK");
  if (name === "South Korea") countryIso = iso.whereAlpha3("KOR");
  if (name === "Iran") countryIso = iso.whereAlpha3("IRN");
  if (name === "Syria") countryIso = iso.whereAlpha3("SYR");
  if (name === "Moldova") countryIso = iso.whereAlpha3("MDA");
  if (name === "Solomon Is.") countryIso = iso.whereAlpha3("SLB");
  if (name === "Taiwan") countryIso = iso.whereAlpha3("TWN");
  if (name === "United Kingdom") countryIso = iso.whereAlpha3("GBR");
  if (name === "Brunei") countryIso = iso.whereAlpha3("BRN");
  if (name === "Czechia") countryIso = iso.whereAlpha3("CZE");
  if (name === "Somaliland") countryIso = iso.whereAlpha3("SOM");
  if (name === "Bosnia and Herz.") countryIso = iso.whereAlpha3("BIH");
  if (name === "S. Sudan") countryIso = iso.whereAlpha3("SSD");
  if (name === "Tanzania") countryIso = iso.whereAlpha3("TZA");
  if (name === "W. Sahara") countryIso = iso.whereAlpha3("ESH");
  if (name === "St-Martin") countryIso = iso.whereAlpha3("MAF");
  if (name === "Micronesia") countryIso = iso.whereAlpha3("FSM");
  if (name === "Marshall Is.") countryIso = iso.whereAlpha3("MHL");
  if (name === "N. Mariana Is.") countryIso = iso.whereAlpha3("MNP");
  if (name === "U.S. Virgin Is.") countryIso = iso.whereAlpha3("VIR");
  if (name === "S. Geo. and the Is.") countryIso = iso.whereAlpha3("SGS");
  if (name === "Br. Indian Ocean Ter.") countryIso = iso.whereAlpha3("IOT");
  if (name === "Saint Helena") countryIso = iso.whereAlpha3("SHN");
  if (name === "Pitcairn Is.") countryIso = iso.whereAlpha3("PCN");
  if (name === "Cayman Is.") countryIso = iso.whereAlpha3("CYM");
  if (name === "British Virgin Is.") countryIso = iso.whereAlpha3("VGB");
  if (name === "São Tomé and Principe") countryIso = iso.whereAlpha3("STP");
  if (name === "Turks and Caicos Is.") countryIso = iso.whereAlpha3("TCA");
  if (name === "St. Vin. and Gren.") countryIso = iso.whereAlpha3("VCT");
  if (name === "St. Kitts and Nevis") countryIso = iso.whereAlpha3("KNA");
  if (name === "Cook Is.") countryIso = iso.whereAlpha3("COK");
  if (name === "St. Pierre and Miquelon") countryIso = iso.whereAlpha3("SPM");
  if (name === "Wallis and Futuna Is.") countryIso = iso.whereAlpha3("WLF");
  if (name === "St-Barthélemy") countryIso = iso.whereAlpha3("BLM");
  if (name === "Fr. Polynesia") countryIso = iso.whereAlpha3("PYF");
  if (name === "Åland") countryIso = iso.whereAlpha3("ALA");
  if (name === "Faeroe Is.") countryIso = iso.whereAlpha3("FRO");
  if (name === "Heard I. and McDonald Is.") countryIso = iso.whereAlpha3("HMD");
  if (name === "Antigua and Barb.") countryIso = iso.whereAlpha3("ATG");

  if (name === "N. Cyprus") return null; // see https://en.wikipedia.org/wiki/Northern_Cyprus for why we skip
  if (name === "Ashmore and Cartier Is.") return null; // https://en.wikipedia.org/wiki/Ashmore_and_Cartier_Islands
  if (name === "Siachen Glacier") return null; // https://en.wikipedia.org/wiki/Siachen_Glacier
  if (name === "Dhekelia") return null; // see https://en.wikipedia.org/wiki/Akrotiri_and_Dhekelia
  if (name === "USNB Guantanamo Bay") return null; // see https://en.wikipedia.org/wiki/Akrotiri_and_Dhekelia
  if (name === "Vatican") return null;
  if (name === "Indian Ocean Ter.") return null;
  if (name === "Antarctica") return null;
  if (name === "Kosovo") return null; // see https://en.wikipedia.org/wiki/Kosovo

  if (!countryIso) {
    console.log(`${name}`);
    // throw new Error(`No country ISO for ${name}`);
  }

  return countryIso;
};

generate().then(() => console.log("done"));

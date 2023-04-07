import { Source, Layer } from "react-map-gl";
import bbox from "@turf/bbox";
import bearing from "@turf/bearing";
import { useEffect } from "react";

const Layers = ({ lanes, mapRef, directionLines }) => {
  const features = lanes.map((lane) => {
    const coords = lane.coords.map((c) => {
      //reverse coordinates for geojson format
      return [c[1], c[0]];
    });
    const geometry = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
      properties: {
        ...lane.node.attributes,
        // color: strokeColor || "white",
        color: "white",
      },
    };
    return geometry;
  });

  const linesGeojson = {
    type: "FeatureCollection",
    features: features,
  };

  const layerStyle = {
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "square",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        5,
        18,
        10,
        19,
        18,
      ],
    },
  };

  useEffect(() => {
    if (
      mapRef &&
      mapRef.current &&
      linesGeojson &&
      linesGeojson.features.length > 0
    ) {
      const bounds = bbox(linesGeojson);
      mapRef.current.fitBounds(bounds, { padding: 40 });
      console.log("      mapRef.current", mapRef.current);
    }
  }, []);

  const connectionsFeatures = directionLines.map((d) => {
    return {
      type: "Feature",
      properties: { name: "line 1" },
      geometry: {
        type: "LineString",
        coordinates: [d.from.split(","), d.to.split(",")],
      },
    };
  });

  const connectionsGeojson = {
    type: "FeatureCollection",
    features: connectionsFeatures,
  };

  const connectionsLayerStyle = {
    id: "connections",
    type: "line",
    source: "connections",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "red",
      "line-width": 4,
    },
  };

  //red arrow showing number of simulated_flow
  const arrowsFeatures = directionLines.map((d) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: d.to.split(","),
      },
      properties: {
        icon: "arrowRed",
        bearing: bearing(d.to.split(","), d.from.split(",")) + 90, //end and penultimate point
        text: d.value,
      },
    };
  });
  const arrowsGeojson = {
    type: "FeatureCollection",
    features: arrowsFeatures,
  };
  const arrowLayerStyle = {
    id: "point",
    source: "arrows",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        0.01,
        18,
        0.5,
        19,
        1,
      ],
      "icon-rotate": ["get", "bearing"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "icon-offset": [-20, 0],

      "text-field": ["get", "text"],
      "text-anchor": "center",
      "text-allow-overlap": true,
      //text color
      "text-offset": [0, 0],
    },
    paint: {
      "text-color": "#202",
      "text-halo-color": "#fff",
      "text-halo-width": 2,
    },
  };

  /*
  const connectionsFeatures = connections
    // .filter((connection) => {
    //   //remove connections that are in the updatedLanes but with different direction
    //   const line = updatedLanes.get(
    //     connection.attributes.from + "_" + connection.attributes.fromLane
    //   );
    //   if (line) {
    //     return (
    //       //connection.attributes.dir.toLowerCase() === line.toLowerCase() ||
    //       line.toLowerCase().includes(connection.attributes.dir.toLowerCase())
    //     );
    //   } else {
    //     return connection;
    //   }
    // })
    .map((connection) => {
      const from = linesMap.get(
        connection.attributes.from + "_" + connection.attributes.fromLane
      );
      const to = linesMap.get(
        connection.attributes.to + "_" + connection.attributes.toLane
      );
      if (!from || !to) return null;
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [from.end, to.start],
        },
        properties: {
          ...connection,
          bearing: bearing(to.start, from.end) + 90, //bearing for arrows layer
        },
      };
    });

  const connectionsGeojson = {
    type: "FeatureCollection",
    features: connectionsFeatures,
  };

  const connectionsLayerStyle = {
    id: "connections",
    type: "line",
    source: "connections",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "red",
      "line-width": 4,
    },
  };

 
  */
  // const laneArrowsFeatures = laneArrowsLayer.map((pin) => {
  //   return {
  //     type: "Feature",
  //     geometry: {
  //       type: "Point",
  //       coordinates: pin.end,
  //     },
  //     properties: {
  //       icon: pin.arrow,
  //       bearing: pin.bearing,
  //     },
  //   };
  // });

  // const laneArrowsGeojson = {
  //   type: "FeatureCollection",
  //   features: laneArrowsFeatures,
  // };

  // const laneArrowsStyle = {
  //   id: "laneArrows",
  //   source: "laneArrows",
  //   type: "symbol",
  //   layout: {
  //     "icon-image": ["get", "icon"],
  //     "icon-size": [
  //       "interpolate",
  //       ["linear"],
  //       ["zoom"],
  //       10,
  //       0.01,
  //       18,
  //       0.5,
  //       19,
  //       1,
  //     ],
  //     "icon-offset": [0, -24],
  //     "icon-rotate": ["get", "bearing"],
  //     "icon-rotation-alignment": "map",
  //     "icon-allow-overlap": true,
  //     "icon-ignore-placement": true,
  //   },
  // };

  return (
    <>
      {/* <Source id="intersections" type="geojson" data={intersectionsGeojson}>
        <Layer {...intersectionsLayerStyle} />
      </Source> */}
      <Source id="connections" type="geojson" data={connectionsGeojson}>
        <Layer {...connectionsLayerStyle} />
      </Source>

      <Source id="route" type="geojson" data={linesGeojson}>
        <Layer {...layerStyle} />
      </Source>

      {/* <Source id="junctions" type="geojson" data={junctionsGeojson}>
        <Layer {...junctionsLayerStyle} />
      </Source> */}

      {/* <Source id="arrows" type="geojson" data={arrowsGeojson}>
        <Layer {...arrowLayerStyle} />
      </Source> */}

      <Source id="laneArrows" type="geojson" data={arrowsGeojson}>
        <Layer {...arrowLayerStyle} />
      </Source>
    </>
  );
};

export default Layers;

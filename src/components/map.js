import * as React from 'react';
import Map from 'react-map-gl';
import { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
//------------------------------
import { useMemo, useRef, useCallback } from 'react';
import XMLNode from './xml/xmlNode';
import XMLLane from './xml/xmlLane';
import XMLJunction from './xml/xmlJunction';
import Layers from "./layers";
import arrowRed from "../assets/arrow_red.png";

var convert = require("xml-js");

const XMLMap = ({ xml, csv }) => {

    const [directionLines, setDirectionLines] = React.useState([]);

    const mapRef = useRef(null);
    const xmlDoc = useMemo(() => {
        return convert.xml2js(xml, { compact: false });
    }, [xml]);
    const root = useMemo(() => new XMLNode(xmlDoc), [xmlDoc]);
    const lanes = useMemo(() => { return root.select({ name: "lane" }).map((l) => new XMLLane(l)); }, [root]);
    const junctions = useMemo(() => root.select({ name: "junction", type: "traffic_light" }).map((l) => new XMLJunction(l)), [root]);
    const intersections = useMemo(() => root.select({ name: "junction", type: "priority" }).map((l) => new XMLLane(l)), [root]);
    const connections = useMemo(() => root.select({ name: "connection" }).map((d) => d), [root]);

    const iconsArray = [
        { name: "arrowRed", image: arrowRed, type: "png", size: { x: 20, y: 20 } },
    ];

    const mapRefCallback = useCallback((ref) => {
        if (ref !== null) {
            //Set the actual ref we use elsewhere
            mapRef.current = ref;
            const map = ref;
            const loadImage = () => {
                iconsArray.forEach((icon) => {
                    if (!map.hasImage(icon.name)) {
                        let img = new Image(icon.size.x, icon.size.y);
                        img.crossOrigin = "Anonymous"; //it's not cross origin, but this quiets the canvas error
                        img.onload = () => {
                            map.addImage(icon.name, img);
                        };
                        img.src = icon.image;
                    }
                });
            };

            loadImage();
            map.on("styleimagemissing", (e) => {
                const id = e.id; // id of the missing image
                console.log(id);
                loadImage();
            });
        }
    }, []);

    const setCursor = (cursor) => {
        if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = cursor;
        }
    };
    const onMouseEnter = useCallback((event) => {
        const feature = event.features && event.features[0];
        setCursor("pointer")

        const id = feature && feature.properties && feature.properties.id;
        const shape = feature && feature.properties && feature.properties.shape;

        const csvData = csv.filter((d) => d.edge_id === id.split("_")[0]);

        if (csvData.length > 0) {
            const edges = JSON.parse(csvData[0].outgoing_edges.replace(/'/g, '"'))
            const flow = JSON.parse(csvData[0].simulated_flow.replace(/'/g, '"'))

            // console.log('edges', edges);
            // console.log('flow', flow);
            // console.log('root', root);
            // console.log('lanes', lanes);
            // console.log('junctions', junctions);
            // console.log('intersections', intersections);
            // console.log('connections', connections);

            const lines = []
            edges.forEach((element, index) => {
                const node = lanes.find(d => d.node.attributes.id.split("_")[0] === element)
                if (node) {
                    console.log('node', node);
                    lines.push({
                        from: shape.split(" ").pop(),
                        to: node.node.attributes.shape.split(" ")[0],
                        value: flow[index]
                    })
                    // lines.push({
                    //     from: element,
                    //     to: node,
                    // })
                }
            });
            setDirectionLines(lines);
        }

    }, []);
    const onMouseLeave = useCallback(() => setCursor("auto"), []);

    return (
        <Map
            ref={mapRefCallback}
            initialViewState={{
                longitude: 8.539050000000088,
                latitude: 47.3946754960979,
                zoom: 11
            }}
            style={{ width: "100%", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxAccessToken={
                "pk.eyJ1Ijoic3dlcnQiLCJhIjoiY2s3bHNtdjF2MDJ1eTNmcGowanU5MHR4ZiJ9.hzhWj9bhgD5itpWAPc3nNA"
            }
            interactiveLayerIds={["route"]}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <NavigationControl />
            <Layers
                lanes={lanes}
                junctions={junctions}
                intersections={intersections}
                connections={connections}
                // edges={edges}
                mapRef={mapRef}
                // updatedLanes={updatedLanes}
                directionLines={directionLines}
            />
        </Map>
    );
}

export default XMLMap;
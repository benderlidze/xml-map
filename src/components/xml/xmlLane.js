import XMLNode from './xmlNode';

function truncate(number, index = 0) {
    return +number.toString().slice(0, (number.toString().indexOf(".")) + (index + 1));
}

export default class XMLLane {
    constructor(xmlNode) {
        this.node = xmlNode;
        let co = this.node.getOne("shape", "").split(" ");
        co = co.map(c => c.split(","));
        co = co.map(([x, y]) => [parseFloat(y) || 0, parseFloat(x) || 0]);
        let s = parseFloat(this.node.getOne("speed", "0"));
        s = truncate(s * 3.6, 6); // m/s -> km/h
        let arrows = this.node.select({ name: "param", key: "arrows" });
        arrows = arrows.map(a => a.getOne("value").split(" "));
        arrows = arrows.flat().sort().join("").toLowerCase() || "";
        this._cache = {
            id: this.node.getOne("id", ""),
            speed: s,
            disallow: this.node.getOne("disallow", null),
            coords: co,
            arrows,
        }
    }
    static get empty() {
        return new XMLLane(XMLNode.empty);
    }
    get isempty() {
        return this.id === "";
    }
    get id() {
        return this._cache.id;
    }
    get edgeId() {
        return this._cache.id.split("_")[0];
    }
    get speed() {
        return this._cache.speed;
    }
    get disallow() {
        return this._cache.disallow;
    }
    get coords() {
        return this._cache.id ? this._cache.coords : [[0, 0]];
    }
    get arrows() {
        return this._cache.arrows;
    }
    set speed(s) {
        this._cache.speed = s;
        this.node.set({ speed: (s / 3.6).toString() }); // km/h -> m/s
    }
    set disallow(d) {
        this._cache.disallow = d;
        this.node.set({ disallow: d });
    }
    set coords(co) {
        this._cache.coords = co;
        this.node.set({ shape: co.map(([x, y]) => x.toString() + "," + (-y).toString()).join(" ") });
    }
    set arrows(arr) {
        this._cache.arrows = arr;
        this.node.set({ arrows: arr });
    }
    set(values) {
        if (values.speed !== undefined) {
            this.speed = values.speed;
        }
        if (values.disallow !== undefined) {
            this.disallow = values.disallow;
        }
        if (values.coords !== undefined) {
            this.coords = values.coords;
        }
        if (values.arrows !== undefined) {
            this.arrows = values.arrows;
        }
    }
}
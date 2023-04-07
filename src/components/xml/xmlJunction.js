import XMLNode from './xmlNode';

export default class XMLJunction {
    constructor(xmlNode) {
        this.node = xmlNode;
        this._cache = {
            id: this.node.getOne("id", ""),
            type: this.node.getOne("type", ""),
            x: parseFloat(this.node.getOne("x", "0")),
            y: parseFloat(this.node.getOne("y", "0")),
        }
    }
    static get empty() {
        return new XMLJunction(XMLNode.empty);
    }
    get isempty() {
        return this.id === "";
    }
    get id() {
        return this._cache.id;
    }
    get type() {
        return this._cache.type;
    }
    get x() {
        return this._cache.x;
    }
    get y() {
        return this._cache.y;
    }
    set type(t) {
        this._cache.type = t;
        this.node.set({ type: t });
    }
    set x(x) {
        this._cache.x = x;
        this.node.set({ x: x.toString() });
    }
    set y(y) {
        this._cache.y = y;
        this.node.set({ y: y.toString() });
    }
    set(values) {
        if(values.type !== undefined) {
            this.type = values.type;
        }
        if(values.x !== undefined) {
            this.x = values.x;
        }
        if(values.y !== undefined) {
            this.y = values.y;
        }
    }
}
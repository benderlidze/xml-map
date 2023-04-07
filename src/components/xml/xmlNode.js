export default class XMLNode {
    constructor(xml) {
        this.type = xml.type || "document";
        this.name = xml.name || "";
        this.attributes = xml.attributes || {};
        this.children = (xml.elements || []).map(e => new XMLNode(e));
    }
    static get empty() {
        return new XMLNode({});
    }
    get(options) {
        let res = {};
        for(const opt in options) {
            if(opt === "name") {
                res.name = this.name;
            }
            else {
                const attr = this.attributes[opt];
                res[opt] = attr === undefined ? options[opt] : attr;
            }
        }
        return res;
    }
    getOne(param, def) {
        const _def = def === undefined ? null : def;
        return this.get({[param]: _def})[param];
    }
    set(values) {
        for(const val in values) {
            if(val === "name") {
                this.name = values.name;
            }
            else {
                if(values[val] === null && this.attributes[val]) delete this.attributes[val];
                else this.attributes[val] = values[val];
            }
        }
    }
    select(options) {
        let res = [];
        let match = true;
        for(const opt in options) {
            if(opt === "name") {
                if(this.name !== options.name) {
                    match = false;
                    break;
                }
            }
            else if(this.getOne(opt) !== options[opt]) {
                match = false;
                break;
            }
        }
        if(match) res.push(this);
        for(const child of this.children) {
            res = [...res, ...child.select(options)];
        }
        return res;
    }
}
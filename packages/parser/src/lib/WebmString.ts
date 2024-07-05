import { WebmBase } from "./WebmBase";

export class WebmString extends WebmBase<Uint8Array, string> {
    constructor(name?: string, start = 0) {
        super(name, start);
    }

    override getType() {
        return "String";
    }

    override updateBySource() {
        this.data = this.source;
    }

    override updateByData() {
        this.source = this.data;
    }

    override getValue(): string {
        let result = "";
        this.source!.forEach((code) => {
            result += String.fromCharCode(code);
        });
        return result;
    }
}

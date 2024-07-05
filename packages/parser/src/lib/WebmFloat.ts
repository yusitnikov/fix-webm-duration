import { WebmBase } from "./WebmBase";

export class WebmFloat extends WebmBase<number, number> {
    constructor(name?: string, start = 0) {
        super(name, start);
    }

    override getType() {
        return "Float";
    }

    getFloatArrayType() {
        return this.source && this.source.length === 4 ? Float32Array : Float64Array;
    }

    override updateBySource() {
        const byteArray = this.source!.reverse();
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType(byteArray.buffer);
        this.data = floatArray[0];
    }

    override updateByData() {
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType([this.data!]);
        const byteArray = new Uint8Array(floatArray.buffer);
        this.source = byteArray.reverse();
    }
}

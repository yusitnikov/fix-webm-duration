import {WebmBase} from "./WebmBase";
import {SectionType} from "./SectionsMetadata";

export class WebmFloat extends WebmBase<number> {
    constructor(name: string, type = SectionType.Float) {
        super(name, type);
    }

    private getFloatArrayType() {
        return this.source && this.source.length === 4 ? Float32Array : Float64Array;
    }

    updateBySource() {
        const byteArray = this.source.reverse();
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType(byteArray.buffer);
        this.data = floatArray[0];
    }

    updateByData() {
        const floatArrayType = this.getFloatArrayType();
        const floatArray = new floatArrayType([ this.data ]);
        const byteArray = new Uint8Array(floatArray.buffer);
        this.source = byteArray.reverse();
    }

    getValue() {
        return this.data;
    }

    setValue(value: number) {
        this.setData(value);
    }
}

import {WebmBase} from "./WebmBase";
import {SectionType} from "./SectionsMetadata";

const padHex = (hex: string) => hex.length % 2 === 1 ? "0" + hex : hex;

export class WebmUint extends WebmBase<string> {
    constructor(name: string, type = SectionType.Uint) {
        super(name, type);
    }

    updateBySource() {
        // use hex representation of a number instead of number value
        this.data = "";
        for (let i = 0; i < this.source.length; i++) {
            const hex = this.source[i].toString(16);
            this.data += padHex(hex);
        }
    }
    
    updateByData() {
        const length = this.data.length / 2;
        this.source = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            const hex = this.data.substring(i * 2, i * 2 + 2);
            this.source[i] = parseInt(hex, 16);
        }
    }

    getValue() {
        return parseInt(this.data, 16);
    }

    setValue(value: number) {
        this.setData(padHex(value.toString(16)));
    }
}

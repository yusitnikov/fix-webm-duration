import {SectionType} from "./SectionsMetadata";

export class WebmBase<DataT> {
    source?: Uint8Array;
    data?: DataT;

    // noinspection JSUnusedGlobalSymbols
    constructor(
        public name = "Unknown",
        public type = SectionType.Unknown,
    ) {
    }

    updateBySource() { }

    setSource(source: Uint8Array) {
        this.source = source;
        this.updateBySource();
    }

    updateByData() { }

    setData(data: DataT) {
        this.data = data;
        this.updateByData();
    }
}

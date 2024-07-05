export class WebmBase<DataT, ValueT> {
    public source: Uint8Array | undefined;
    public data: DataT | undefined;

    protected constructor(
        public name = "Unknown",
        public start = 0,
    ) {}

    getType() {
        return "Unknown";
    }

    updateBySource() {
        // NOOP
    }

    setSource(source: Uint8Array) {
        this.source = source;
        this.updateBySource();
    }

    updateByData() {
        // NOOP
    }

    setData(data: DataT) {
        this.data = data;
        this.updateByData();
    }

    getValue(): ValueT {
        return this.data as unknown as ValueT;
    }

    setValue(value: ValueT) {
        this.setData(value as unknown as DataT);
    }
}

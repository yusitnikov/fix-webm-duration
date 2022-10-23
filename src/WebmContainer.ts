import {WebmBase} from "./WebmBase";
import {sections, SectionType} from "./SectionsMetadata";
import {WebmUint} from "./WebmUint";
import {WebmFloat} from "./WebmFloat";

interface WebmContainerDataItem {
    id: number;
    idHex: string;
    data: WebmBase<any>;
}

export class WebmContainer extends WebmBase<WebmContainerDataItem[]> {
    private offset = 0;

    constructor(name: string, type = SectionType.Container) {
        super(name, type);
    }

    readByte() {
        return this.source[this.offset++];
    }

    readUint() {
        const firstByte = this.readByte();
        const bytes = 8 - firstByte.toString(2).length;
        let value = firstByte - (1 << (7 - bytes));
        for (let i = 0; i < bytes; i++) {
            // don't use bit operators to support x86
            value *= 256;
            value += this.readByte();
        }
        return value;
    }

    updateBySource() {
        this.data = [];
        let end: number;
        for (this.offset = 0; this.offset < this.source.length; this.offset = end) {
            const id = this.readUint();
            const len = this.readUint();
            end = Math.min(this.offset + len, this.source.length);
            const data = this.source.slice(this.offset, end);

            const info = sections[id] || { name: "Unknown", type: SectionType.Unknown };
            const ctrMap = {
                [SectionType.Container]: WebmContainer,
                [SectionType.Uint]: WebmUint,
                [SectionType.Float]: WebmFloat,
            };
            const ctr = ctrMap[info.type] ?? WebmBase;
            const section: WebmBase<any> = new ctr(info.name, info.type);
            section.setSource(data);
            this.data.push({
                id,
                idHex: id.toString(16),
                data: section
            });
        }
    }

    writeUint(x: number, draft: boolean) {
        let bytes: number, flag: number;
        for (bytes = 1, flag = 0x80; x >= flag && bytes < 8; bytes++, flag *= 0x80) { }

        if (!draft) {
            let value = flag + x;
            for (let i = bytes - 1; i >= 0; i--) {
                // don't use bit operators to support x86
                const c = value % 256;
                this.source[this.offset + i] = c;
                value = (value - c) / 256;
            }
        }

        this.offset += bytes;
    }

    writeSections(draft = false) {
        this.offset = 0;
        for (let i = 0; i < this.data.length; i++) {
            const section = this.data[i],
                content = section.data.source,
                contentLength = content.length;
            this.writeUint(section.id, draft);
            this.writeUint(contentLength, draft);
            if (!draft) {
                this.source.set(content, this.offset);
            }
            this.offset += contentLength;
        }
        return this.offset;
    }

    updateByData() {
        // run without accessing this.source to determine total length - need to know it to create Uint8Array
        const length = this.writeSections(true);
        this.source = new Uint8Array(length);
        // now really write data
        this.writeSections();
    }

    getSectionById<SectionT extends WebmBase<any>>(id: number) {
        for (let i = 0; i < this.data.length; i++) {
            const section = this.data[i];
            if (section.id === id) {
                return section.data as SectionT;
            }
        }
        return null;
    }
}

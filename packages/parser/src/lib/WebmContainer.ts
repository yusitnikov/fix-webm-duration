/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebmBase } from "./WebmBase";
import { sections, SectionKey, SectionsMap } from "./sections";
import { SectionType } from "./SectionType";
import { WebmUint } from "./WebmUint";
import { WebmFloat } from "./WebmFloat";
import { WebmString } from "./WebmString";

type SectionTypeMap = {
    [SectionType.Container]: WebmContainer;
    [SectionType.Uint]: WebmUint;
    [SectionType.Float]: WebmFloat;
    [SectionType.String]: WebmString;
};
type TypeBySectionKey<IdType extends SectionKey> = SectionsMap[IdType]["type"] extends keyof SectionTypeMap
    ? SectionTypeMap[SectionsMap[IdType]["type"]]
    : WebmBase<any, any>;

export interface WebmContainerItem<IdType extends SectionKey = SectionKey> {
    id: IdType;
    idHex?: string;
    data: TypeBySectionKey<IdType>;
}

export class WebmContainer extends WebmBase<WebmContainerItem[], WebmContainerItem[]> {
    public offset = 0;

    constructor(
        name?: string,
        public isInfinite = false,
        start = 0,
    ) {
        super(name, start);
    }

    override getType() {
        return "Container";
    }

    readByte() {
        return this.source![this.offset++];
    }

    readUint() {
        const firstByte = this.readByte();
        const bytes = 8 - firstByte.toString(2).length;
        let value = firstByte - (1 << (7 - bytes));
        for (let i = 0; i < bytes; i++) {
            value <<= 8;
            value |= this.readByte();
        }
        return value;
    }

    override updateBySource() {
        this.data = [];
        let end: number;
        for (this.offset = 0; this.offset < this.source!.length; this.offset = end) {
            const start = this.offset;

            const id = this.readUint() as SectionKey;
            const { name, type } = sections[id] ?? {};

            const len = this.readUint();

            end = this.source!.length;
            if (len >= 0) end = Math.min(this.offset + len, end);

            const data = this.source!.slice(this.offset, end);

            let section: WebmBase<any, any>;
            switch (type) {
                case SectionType.Container:
                    section = new WebmContainer(name, len < 0, start);
                    break;
                case SectionType.Uint:
                    section = new WebmUint(name, start);
                    break;
                case SectionType.Float:
                    section = new WebmFloat(name, start);
                    break;
                case SectionType.String:
                    section = new WebmString(name, start);
                    break;
                default:
                    section = new WebmBase(name, start);
                    break;
            }
            section.setSource(data);
            this.data.push({
                id,
                idHex: id.toString(16),
                data: section,
            });
        }
    }

    writeUint(x: number, draft = false) {
        let bytes: number;
        for (bytes = 1; (x < 0 || x >= 1 << (7 * bytes)) && bytes < 8; bytes++) {
            // NOOP
        }

        if (!draft) {
            for (let i = 0; i < bytes; i++) {
                this.source![this.offset + i] = (x >> (8 * (bytes - 1 - i))) & 0xff;
            }

            this.source![this.offset] &= (1 << (8 - bytes)) - 1;
            this.source![this.offset] |= 1 << (8 - bytes);
        }

        this.offset += bytes;
    }

    writeSections(draft = false) {
        this.offset = 0;
        for (let i = 0; i < this.data!.length; i++) {
            const section = this.data![i],
                content = section.data.source!,
                contentLength = content.length;
            this.writeUint(section.id, draft);
            this.writeUint(
                section.data instanceof WebmContainer && section.data.isInfinite ? -1 : contentLength,
                draft,
            );
            if (!draft) {
                this.source!.set(content, this.offset);
            }
            this.offset += contentLength;
        }
        return this.offset;
    }

    override updateByData() {
        // run without accessing this.source to determine total length - need to know it to create Uint8Array
        const length = this.writeSections(true);
        this.source = new Uint8Array(length);
        // now really write data
        this.writeSections();
    }

    getSectionById<IdType extends SectionKey>(id: IdType): TypeBySectionKey<IdType> | null {
        for (let i = 0; i < this.data!.length; i++) {
            const section = this.data![i];
            if (section.id === id) {
                return section.data as unknown as TypeBySectionKey<IdType>;
            }
        }
        return null;
    }
}

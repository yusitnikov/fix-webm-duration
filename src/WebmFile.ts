import {WebmContainer} from "./WebmContainer";
import {SectionType} from "./SectionsMetadata";
import {WebmFloat} from "./WebmFloat";
import {Options} from "./Options";
import {WebmUint} from "./WebmUint";

export class WebmFile extends WebmContainer {
    constructor(source: Uint8Array) {
        super("File", SectionType.File);

        this.setSource(source)
    }

    fixDuration(duration: number, {logger = console.log}: Options = {}) {
        if (!logger) {
            logger = () => {};
        }

        const segmentSection = this.getSectionById<WebmContainer>(0x8538067);
        if (!segmentSection) {
            logger('[fix-webm-duration] Segment section is missing');
            return false;
        }

        const infoSection = segmentSection.getSectionById<WebmContainer>(0x549a966);
        if (!infoSection) {
            logger('[fix-webm-duration] Info section is missing');
            return false;
        }

        const timeScaleSection = infoSection.getSectionById<WebmUint>(0xad7b1);
        if (!timeScaleSection) {
            logger('[fix-webm-duration] TimecodeScale section is missing');
            return false;
        }

        let durationSection = infoSection.getSectionById<WebmFloat>(0x489);
        if (durationSection) {
            if (durationSection.getValue() <= 0) {
                logger('[fix-webm-duration] Duration section is present, but the value is empty');
                durationSection.setValue(duration);
            } else {
                logger('[fix-webm-duration] Duration section is present');
                return false;
            }
        } else {
            logger('[fix-webm-duration] Duration section is missing');
            // append Duration section
            durationSection = new WebmFloat("Duration");
            durationSection.setValue(duration);
            infoSection.data.push({
                id: 0x489,
                idHex: "489",
                data: durationSection
            });
        }

        // set default time scale to 1 millisecond (1000000 nanoseconds)
        timeScaleSection.setValue(1000000);
        infoSection.updateByData();
        segmentSection.updateByData();
        this.updateByData();

        return true;
    }

    toBlob(mimeType: string) {
        return new Blob([ this.source.buffer ], { type: mimeType || "video/webm" });
    }
}

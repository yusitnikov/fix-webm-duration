import { Options, WebmFile, WebmFloat } from "@fix-webm-duration/parser";

export const fixParsedWebmDuration = (file: WebmFile, duration: number, options: Options = {}): boolean => {
    let logger = options.logger;
    if (logger === undefined) {
        logger = (message) => console.debug(message);
    } else if (!logger) {
        logger = () => {
            // NOOP
        };
    }

    const segmentSection = file.getSectionById(0x8538067);
    if (!segmentSection) {
        logger("[fix-webm-duration] Segment section is missing");
        return false;
    }

    const infoSection = segmentSection.getSectionById(0x549a966);
    if (!infoSection) {
        logger("[fix-webm-duration] Info section is missing");
        return false;
    }

    const timeScaleSection = infoSection.getSectionById(0xad7b1);
    if (!timeScaleSection) {
        logger("[fix-webm-duration] TimecodeScale section is missing");
        return false;
    }

    let durationSection = infoSection.getSectionById(0x489);
    if (durationSection) {
        if (durationSection.getValue() <= 0) {
            logger(`[fix-webm-duration] Duration section is present, but the value is ${durationSection.getValue()}`);
            durationSection.setValue(duration);
        } else {
            logger(`[fix-webm-duration] Duration section is present, and the value is ${durationSection.getValue()}`);
            return false;
        }
    } else {
        logger("[fix-webm-duration] Duration section is missing");
        // append Duration section
        durationSection = new WebmFloat("Duration");
        durationSection.setValue(duration);
        infoSection.data!.push({
            id: 0x489,
            data: durationSection,
        });
    }

    // set default time scale to 1 millisecond (1000000 nanoseconds)
    timeScaleSection.setValue(1000000);
    infoSection.updateByData();
    segmentSection.updateByData();
    file.updateByData();

    return true;
};

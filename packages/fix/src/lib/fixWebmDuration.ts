import { Options, WebmFile } from "@fix-webm-duration/parser";
import { fixParsedWebmDuration } from "./fixParsedWebmDuration";

export const fixWebmDuration = async (blob: Blob, duration: number, options?: Options): Promise<Blob> => {
    try {
        const file = await WebmFile.fromBlob(blob);
        if (fixParsedWebmDuration(file, duration, options)) {
            return file.toBlob(blob.type);
        }
    } catch {
        // NOOP
    }

    return blob;
};

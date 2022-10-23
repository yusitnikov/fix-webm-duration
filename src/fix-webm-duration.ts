import {Options} from "./Options";
import {WebmFile} from "./WebmFile";

export function fixWebmDuration(blob: Blob, duration: number, callback: (fixedBlob: Blob) => void, options?: Options): void;
export function fixWebmDuration(blob: Blob, duration: number, options?: Options): Promise<Blob>;
export function fixWebmDuration(blob, duration, callback, options?) {
    // The callback may be omitted - then the third argument is options
    if (typeof callback === "object") {
        options = callback;
        callback = undefined;
    }

    if (!callback) {
        // @ts-ignore
        return new Promise(function(resolve) {
            fixWebmDuration(blob, duration, resolve, options);
        });
    }

    try {
        const reader = new FileReader();
        reader.onloadend = function() {
            try {
                const file = new WebmFile(new Uint8Array(reader.result as ArrayBuffer));
                if (file.fixDuration(duration, options)) {
                    blob = file.toBlob(blob.type);
                }
            } catch (ex) {
                // ignore
            }
            callback(blob);
        };
        reader.readAsArrayBuffer(blob);
    } catch (ex) {
        callback(blob);
    }
}

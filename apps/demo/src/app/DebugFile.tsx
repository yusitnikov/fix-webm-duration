import { useEffect, useMemo, useState } from "react";
import { WebmFile } from "@fix-webm-duration/parser";
import { VideoViewer } from "./VideoViewer";
import { WebmViewer } from "@fix-webm-duration/react-viewer";
import { fixParsedWebmDuration } from "@fix-webm-duration/fix";

export interface DebugFileProps {
    file: Blob;
    duration?: number;
}

export const DebugFile = ({ file, duration }: DebugFileProps) => {
    const [fileArray, setFileArray] = useState<Uint8Array | null>(null);
    useEffect(() => {
        WebmFile.blobToArray(file).then(setFileArray).catch(console.error);
    }, [file]);

    const parsedFile = useMemo(() => fileArray && new WebmFile(fileArray), [fileArray]);
    const fixedParsedFile = useMemo(() => {
        if (!fileArray || !duration) {
            return null;
        }

        const file = new WebmFile(fileArray);
        fixParsedWebmDuration(file, duration);
        file.updateBySource();
        return file;
    }, [fileArray, duration]);
    const fixedFile = useMemo(() => fixedParsedFile && fixedParsedFile.toBlob(file?.type), [fixedParsedFile, file]);

    const [viewFixed, setViewFixed] = useState(duration !== undefined);
    const fileToView = viewFixed ? fixedParsedFile : parsedFile;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {duration && <div>Duration: {duration}ms</div>}

            {duration !== undefined && (
                <div>
                    <label>
                        <input
                            type={"checkbox"}
                            checked={viewFixed}
                            onChange={(event) => setViewFixed(event.target.checked)}
                        />
                        &nbsp; View fixed file
                    </label>
                </div>
            )}

            {fileToView && (
                <>
                    <div>
                        <VideoViewer file={viewFixed ? fixedFile : file} />
                    </div>
                    <div>
                        <WebmViewer value={fileToView} />
                    </div>
                </>
            )}
        </div>
    );
};

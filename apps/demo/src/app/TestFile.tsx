import { useState } from "react";
import { DebugFile } from "./DebugFile";

export const TestFile = () => {
    const [file, setFile] = useState<Blob | undefined>();

    return (
        <>
            <input type={"file"} accept="video/*,audio/*" onChange={(ev) => setFile(ev.target.files?.[0])} />

            {file && <DebugFile file={file} />}
        </>
    );
};

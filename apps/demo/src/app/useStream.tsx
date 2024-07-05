import { useEffect, useState } from "react";

const endStream = (stream: MediaStream) => {
    for (const track of stream.getTracks()) {
        track.stop();
    }
};

export const useStream = (constraints: MediaStreamConstraints) => {
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const promise = window.navigator.mediaDevices.getUserMedia(constraints);
        promise.then(setStream).catch(console.error);

        return () => {
            promise.then(endStream);
        };
    }, [constraints]);

    return stream;
};

export const useEndStream = (stream: MediaStream | null) =>
    useEffect(() => {
        return () => {
            if (stream) {
                endStream(stream);
            }
        };
    }, [stream]);

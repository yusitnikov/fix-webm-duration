import { useMemo } from "react";
import { useStream } from "./useStream";
import { TestStream } from "./TestStream";

export interface TestVideoAudioProps {
    video: boolean;
}

export const TestVideoAudio = ({ video }: TestVideoAudioProps) => {
    const constraints = useMemo(
        (): MediaStreamConstraints => ({
            video,
            audio: true,
        }),
        [video],
    );
    const stream = useStream(constraints);

    if (!stream) {
        return <div>Waiting for the stream...</div>;
    }

    return <TestStream stream={stream} video={video} />;
};

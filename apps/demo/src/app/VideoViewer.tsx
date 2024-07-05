import { useEffect, useRef } from "react";

export interface VideoViewerProps {
    file: Blob | null;
}

export const VideoViewer = ({ file }: VideoViewerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (file && videoRef.current) {
            videoRef.current.src = window.URL.createObjectURL(file);
        }
    }, [file]);

    return <video ref={videoRef} muted={true} controls={true} width={400} height={300} />;
};

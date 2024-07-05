import { useEffect, useMemo, useState } from "react";
import { useEndStream } from "./useStream";
import { TestStream } from "./TestStream";

export const TestCanvas = () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const stream = useMemo(() => canvas && canvas.captureStream(60), [canvas]);
    useEndStream(stream);

    // Draw something into the canvas so that the captured stream gets the data
    useEffect(() => {
        if (!canvas) {
            return;
        }

        const interval = setInterval(() => {
            const ctx = canvas.getContext("2d")!;

            ctx.clearRect(0, 0, 400, 300);

            ctx.fillStyle = "white";
            ctx.rect(0, 0, 400, 300);
            ctx.fill();

            ctx.font = "48px serif";
            ctx.fillStyle = "black";
            ctx.fillText(new Date().toLocaleString(), 0, 150, 400);
        }, 1000);

        return () => clearInterval(interval);
    }, [canvas]);

    return (
        <>
            <canvas width={400} height={300} style={{ width: 400, height: 300 }} ref={setCanvas} />

            {stream && <TestStream stream={stream} video={true} />}
        </>
    );
};

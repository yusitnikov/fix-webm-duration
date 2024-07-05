import { WebmBase, WebmContainer, WebmFloat, WebmString, WebmUint } from "@fix-webm-duration/parser";

export interface WebmViewerProps {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: WebmBase<any, any>;
}

export const WebmViewer = ({ name, value }: WebmViewerProps) => {
    const niceName = name && value.name === "Unknown" ? name : value.name;

    return (
        <>
            {value instanceof WebmContainer && value.isInfinite && "[infinite] "}
            [0x{value.start.toString(16)}] {niceName}: {value.getType()} = <WebmViewerInner value={value} />
        </>
    );
};

const WebmViewerInner = ({ value }: WebmViewerProps) => {
    if (value instanceof WebmContainer) {
        return (
            <ul>
                {value.getValue().map(({ id, data }, index) => (
                    <li key={index}>
                        <WebmViewer name={id.toString(16)} value={data} />
                    </li>
                ))}
            </ul>
        );
    }

    if (value instanceof WebmUint || value instanceof WebmFloat || value instanceof WebmString) {
        return <span>{value.getValue()}</span>;
    }

    return <span>({value.source!.length} bytes)</span>;
};

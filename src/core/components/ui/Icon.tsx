"use client";

import { useEffect, useState } from "react";
import { _Icon } from "@/core/const";
import styles from "./Icon.module.css";

interface IconProps {
    icon: keyof typeof _Icon; // ví dụ "icon-sidebar-1"
    size?: number;
    className?: string;
}

export const Icon = ({ icon, size, className }: IconProps) => {
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        fetch(_Icon[icon])
            .then((res) => res.text())
            .then((text) => setSvg(text));
    }, [icon]);

    return (
        <span
            style={{
                width: size ? `${size}px` : "",
                height: size ? `${size}px` : "",
                display: "inline-block",
            }}
            className={`${styles.icon} ${className}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

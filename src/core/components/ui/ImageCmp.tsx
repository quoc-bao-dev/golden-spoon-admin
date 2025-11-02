import { _Image } from "@/core/const";
import Image from "next/image";

type ImageCmpProps = {
    src: keyof typeof _Image;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
};

export const ImageCmp = ({
    src,
    alt,
    width,
    height,
    className,
}: ImageCmpProps) => {
    return (
        <Image
            src={_Image[src]}
            alt={alt || src || ""}
            width={width || 0}
            height={height || 0}
            className={className}
        />
    );
};

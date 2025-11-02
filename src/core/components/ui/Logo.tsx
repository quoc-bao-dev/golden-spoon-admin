import { ImageCmp } from "./ImageCmp";

type LogoProps = {
    width?: number;
    height?: number;
    className?: string;
};

export const Logo = ({ width, height, className }: LogoProps) => {
    return (
        <ImageCmp
            src="logo"
            alt="logo"
            width={width || 0}
            height={height || 0}
            className={`object-contain ${className}`}
        />
    );
};

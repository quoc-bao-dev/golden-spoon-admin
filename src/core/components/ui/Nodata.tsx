import { ImageCmp } from "./ImageCmp";

type NodataProps = {
    message?: string;
    className?: string;
};

export const Nodata = ({
    message = "Chưa có lịch sử giao dịch nào.",
    className,
}: NodataProps) => {
    return (
        <div>
            <ImageCmp
                src="no-data"
                alt="no-data"
                className={className}
                width={227}
                height={213}
            />
            <p className="text-center text-gray-500 pt-2">{message}</p>
        </div>
    );
};

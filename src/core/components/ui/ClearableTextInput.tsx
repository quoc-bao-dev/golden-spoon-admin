import { ActionIcon, TextInput, TextInputProps } from "@mantine/core";
import { Icon } from "./Icon";

type ClearableTextInputProps = Omit<TextInputProps, "rightSection"> & {
    value?: string;
    onClear?: () => void;
};

export const ClearableTextInput = ({
    value,
    onChange,
    onClear,
    ...props
}: ClearableTextInputProps) => {
    const hasValue = value && value.length > 0;

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onChange) {
            // Create a synthetic event to clear the input
            const syntheticEvent = {
                currentTarget: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };

    return (
        <TextInput
            {...props}
            value={value}
            onChange={onChange}
            rightSection={
                hasValue ? (
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={handleClear}
                        className="cursor-pointer"
                    >
                        <Icon icon="icon-close" size={18} />
                    </ActionIcon>
                ) : null
            }
        />
    );
};

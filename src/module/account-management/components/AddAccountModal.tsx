import { Modal, Textarea, Text, Button, Stack, Group } from "@mantine/core";
import { useState } from "react";

type AddAccountModalProps = {
    opened: boolean;
    onClose: () => void;
    onSubmit?: (accounts: string[]) => void;
};

export const AddAccountModal = ({
    opened,
    onClose,
    onSubmit,
}: AddAccountModalProps) => {
    const [accountList, setAccountList] = useState("");

    const handleSubmit = () => {
        // Parse accounts from textarea
        const lines = accountList
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const accounts = lines.map((line) => {
            const [phone, password] = line.split("|").map((s) => s.trim());
            return `${phone}|${password}`;
        });

        if (onSubmit) {
            onSubmit(accounts);
        }

        // Reset and close
        setAccountList("");
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Text fw={600} size="lg">
                    Thêm tài khoản
                </Text>
            }
            size="lg"
            radius="md"
            centered
        >
            <Stack gap="md">
                {/* Account List Label */}
                <Text size="sm" fw={500}>
                    Danh sách tài khoản
                </Text>

                {/* Textarea */}
                <Textarea
                    value={accountList}
                    onChange={(e) => setAccountList(e.currentTarget.value)}
                    placeholder={`0969886969 | ZXCVBNM6988
0969886970 | PASSWORD123
0969886971 | ABCDEFGH456`}
                    minRows={6}
                    maxRows={10}
                    autosize
                    styles={{
                        input: {
                            fontFamily: "monospace",
                            fontSize: "14px",
                        },
                    }}
                />

                {/* Hint */}
                <Group gap={8} align="flex-start">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 shrink-0">
                        <Text
                            size="10px"
                            fw={700}
                            c="blue"
                            className="leading-none"
                        >
                            i
                        </Text>
                    </div>
                    <Text size="sm" c="dimmed" className="flex-1">
                        Nhập định dạng "số điện thoại | mật khẩu". Ví dụ:{" "}
                        <Text component="span" fw={500} className="font-mono">
                            0969886969 | ZXCVBNM6988
                        </Text>
                    </Text>
                </Group>

                {/* Action Buttons */}
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        color="brand"
                        onClick={handleSubmit}
                        disabled={!accountList.trim()}
                    >
                        Thêm
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

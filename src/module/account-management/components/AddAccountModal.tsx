import {
    Modal,
    Textarea,
    Text,
    Button,
    Stack,
    Group,
    ScrollArea,
} from "@mantine/core";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/core/components/ui";
import { useCreateAccountMutation } from "@/service/accounts";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

type AddAccountModalProps = {
    opened: boolean;
    onClose: () => void;
    onSubmit?: (result: {
        accounts: { password: string; phone_number: string }[];
        successCount: number;
        failCount: number;
        allSuccess: boolean;
    }) => void;
};

export const AddAccountModal = ({
    opened,
    onClose,
    onSubmit,
}: AddAccountModalProps) => {
    const [accountList, setAccountList] = useState("");
    const [lineErrors, setLineErrors] = useState<string[]>([]);
    const queryClient = useQueryClient();
    const { mutateAsync: createAccount, isPending } = useCreateAccountMutation({
        skipInvalidate: true,
    });

    const handleSubmit = async () => {
        const lines = accountList
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const parsed: { password: string; phone_number: string }[] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split("|");
            if (parts.length !== 2) {
                showErrorToast(
                    `Dòng ${
                        i + 1
                    } không đúng định dạng. Dùng: 0969886969 | ZXCVBNM6988`
                );
                return;
            }
            const phone = parts[0].trim();
            const password = parts[1].trim();
            if (!phone || !password) {
                showErrorToast(
                    `Dòng ${i + 1} thiếu số điện thoại hoặc mật khẩu`
                );
                return;
            }
            parsed.push({ phone_number: phone, password });
        }

        console.log("Parsed accounts:", parsed);

        // reset previous errors
        setLineErrors(Array(lines.length).fill(""));

        // Fire all requests concurrently, each guarded with Promise.race timeout
        const TIMEOUT_MS = 15000;
        const withTimeout = async (payload: {
            password: string;
            phone_number: string;
        }) => {
            return Promise.race([
                createAccount(payload),
                new Promise<never>((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Request timeout")),
                        TIMEOUT_MS
                    )
                ),
            ]);
        };

        const promises = parsed.map((payload, index) =>
            withTimeout(payload)
                .then((data) => ({ ok: true as const, index, data }))
                .catch((err: unknown) => ({ ok: false as const, index, err }))
        );

        const results = await Promise.all(promises);

        let successCount = 0;
        let failCount = 0;
        const newErrors = Array(lines.length).fill("");
        const successResults: string[] = [];
        const failResults: string[] = [];

        results.forEach((res) => {
            if (res.ok) {
                const response = res.data;
                if (response.code === 0) {
                    successCount += 1;
                    successResults.push(response.message);
                } else {
                    failCount += 1;
                    const errorMsg =
                        response.message ||
                        response.error?.detail ||
                        "Không xác định";
                    newErrors[res.index] = errorMsg;
                    failResults.push(errorMsg);
                }
            } else {
                failCount += 1;
                let message = "Không xác định";
                if (res.err instanceof AxiosError) {
                    const responseData = res.err.response?.data as any;
                    message =
                        responseData?.message ||
                        responseData?.error?.detail ||
                        res.err.message ||
                        "Lỗi mạng";
                } else if (res.err instanceof Error) {
                    message = res.err.message;
                }
                newErrors[res.index] = message;
                failResults.push(message);
            }
        });

        setLineErrors(newErrors);

        // Invalidate once after all mutations complete
        if (successCount > 0) {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        }

        // Summary toasts
        if (successResults.length > 0) {
            const uniqueSuccessMessages = [...new Set(successResults)];
            uniqueSuccessMessages.forEach((msg) => {
                showSuccessToast(msg);
            });
        }

        if (failResults.length > 0) {
            const uniqueFailMessages = [...new Set(failResults)];
            uniqueFailMessages.forEach((msg) => {
                showErrorToast(msg);
            });
        }

        onSubmit?.({
            accounts: parsed,
            successCount,
            failCount,
            allSuccess: failCount === 0 && parsed.length > 0,
        });
    };

    return (
        <Modal
            opened={opened}
            onClose={isPending ? () => {} : onClose}
            title={
                <Text fw={600} size="lg">
                    Thêm tài khoản
                </Text>
            }
            size="lg"
            radius="md"
            centered
            closeOnClickOutside={!isPending}
            closeOnEscape={!isPending}
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
                    disabled={isPending}
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

                {/* show error message */}
                {lineErrors.some((m) => m) && (
                    <div className="bg-red-50 rounded-md p-2 border border-red-200">
                        <ScrollArea h={100}>
                            <Stack gap={4}>
                                {lineErrors.map((msg, idx) =>
                                    msg ? (
                                        <Text key={idx} size="sm" c="red">
                                            Dòng {idx + 1}: {msg}
                                        </Text>
                                    ) : null
                                )}
                            </Stack>
                        </ScrollArea>
                    </div>
                )}

                {/* Action Buttons */}
                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="brand"
                        onClick={handleSubmit}
                        disabled={!accountList.trim() || isPending}
                        loading={isPending}
                    >
                        Thêm
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

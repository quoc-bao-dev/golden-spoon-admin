import type { BatchResult } from "@/core/hooks/useBatchProcessor";
import type { AccountLoginResponse } from "@/service/accounts";
import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Group,
    Progress,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCircleCheck,
    IconLoader2,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

type LoginProcessBannerProps = {
    isProcessing: boolean;
    processInfo?: {
        processedCount: number;
        totalCount: number;
        currentBatch: number;
        totalBatches: number;
        progress: number;
    };
    results?: BatchResult<AccountLoginResponse>[];
    onClose?: () => void;
    accountMap?: Map<string, { name: string; email: string; phone: string }>; // Map accountId -> account info
};

export const LoginProcessBanner = ({
    isProcessing,
    processInfo,
    results,
    onClose,
    accountMap,
}: LoginProcessBannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    // Reset visibility khi bắt đầu xử lý mới
    useEffect(() => {
        if (isProcessing) {
            setIsVisible(true);
        }
    }, [isProcessing]);

    // Không hiển thị nếu không có processInfo và không có results
    if (!isProcessing && (!results || results.length === 0)) {
        return null;
    }

    // Nếu đã đóng, không hiển thị
    if (!isVisible) {
        return null;
    }

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    // Helper để check login có thành công không
    const isLoginSuccessful = (data?: AccountLoginResponse): boolean => {
        if (!data?.message) return true;
        const message = data.message.toLowerCase();
        return (
            !message.includes("login unsuccessful") &&
            !message.includes("login unsuccessfu")
        );
    };

    const successCount =
        results?.filter((r) => {
            if (r.success && r.data) {
                return isLoginSuccessful(r.data);
            }
            return false;
        }).length || 0;
    const failedCount = (results?.length || 0) - successCount;

    return (
        <Box style={{ position: "relative" }}>
            <Alert
                color={"blue.2"}
                c={"blue.1"}
                title={
                    <Group gap="xs">
                        {isProcessing ? (
                            <>
                                <IconLoader2
                                    size={20}
                                    stroke={1.5}
                                    className="animate-spin"
                                    color="var(--mantine-color-blue-6)"
                                />
                                <Text fw={600} size="sm">
                                    Đang xử lý đăng nhập
                                </Text>
                            </>
                        ) : (
                            <>
                                {failedCount > 0 ? (
                                    <IconAlertCircle
                                        size={20}
                                        stroke={1.5}
                                        color="var(--mantine-color-red-6)"
                                    />
                                ) : (
                                    <IconCircleCheck
                                        size={20}
                                        stroke={1.5}
                                        color="var(--mantine-color-green-6)"
                                    />
                                )}
                                <Text fw={600} size="sm">
                                    Hoàn thành đăng nhập
                                </Text>
                            </>
                        )}
                    </Group>
                }
                styles={{
                    root: {
                        borderRadius: "8px",
                        // border: "1px solid",
                    },
                    title: {
                        marginBottom: "8px",
                        paddingRight: !isProcessing ? "32px" : "0",
                    },
                }}
            >
                <Stack gap="md">
                    {/* Progress Bar - chỉ hiển thị khi đang xử lý */}
                    {isProcessing && processInfo && (
                        <Box>
                            <Group justify="space-between" mb="xs">
                                <Text size="sm" c="dimmed">
                                    Đang xử lý {processInfo.processedCount}/
                                    {processInfo.totalCount} tài khoản
                                </Text>
                                <Text size="sm" c="dimmed" fw={500}>
                                    {processInfo.progress}%
                                </Text>
                            </Group>
                            <Progress
                                value={processInfo.progress}
                                color="blue"
                                size="lg"
                                radius="xl"
                                animated
                            />
                        </Box>
                    )}

                    {/* Results Summary - chỉ hiển thị sau khi xong */}
                    {!isProcessing && results && results.length > 0 && (
                        <Box>
                            <Group gap="xs">
                                <Badge
                                    color="green"
                                    variant="light"
                                    size="lg"
                                    radius="md"
                                    leftSection={
                                        <IconCircleCheck
                                            size={14}
                                            stroke={2}
                                            style={{ marginRight: 4 }}
                                        />
                                    }
                                >
                                    Thành công: {successCount}
                                </Badge>
                                {failedCount > 0 && (
                                    <Badge
                                        color="red"
                                        variant="light"
                                        size="lg"
                                        radius="md"
                                        leftSection={
                                            <IconAlertCircle
                                                size={14}
                                                stroke={2}
                                                style={{ marginRight: 4 }}
                                            />
                                        }
                                    >
                                        Thất bại: {failedCount}
                                    </Badge>
                                )}
                            </Group>
                        </Box>
                    )}
                </Stack>
            </Alert>
            {!isProcessing && (
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        zIndex: 10,
                    }}
                >
                    <IconX size={24} stroke={1.5} />
                </ActionIcon>
            )}
        </Box>
    );
};

import {
    Alert,
    ActionIcon,
    Progress,
    ScrollArea,
    Text,
    Box,
    Group,
    Badge,
    Stack,
} from "@mantine/core";
import { Icon } from "@/core/components/ui";
import type { BatchResult } from "@/core/hooks/useBatchProcessor";
import type { AccountLoginResponse } from "@/service/accounts";
import { useState, useEffect } from "react";

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
        <Alert
            color={"blue.0"}
            c={"blue.1"}
            title={
                <Group justify="space-between" align="center" w={"100%"}>
                    <Group gap="xs">
                        {isProcessing ? (
                            <>
                                <Icon icon="icon-login" size={18} />
                                <Text fw={600} size="sm">
                                    Đang xử lý đăng nhập
                                </Text>
                            </>
                        ) : (
                            <>
                                <Icon
                                    icon={
                                        failedCount > 0
                                            ? "icon-info-red"
                                            : "icon-check-graund"
                                    }
                                    size={18}
                                />
                                <Text fw={600} size="sm">
                                    Hoàn thành đăng nhập
                                </Text>
                            </>
                        )}
                    </Group>
                    {!isProcessing && (
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="sm"
                            onClick={handleClose}
                        >
                            <Icon icon="icon-close" size={16} />
                        </ActionIcon>
                    )}
                </Group>
            }
            styles={{
                root: {
                    borderRadius: "8px",
                    border: "1px solid",
                },
                title: {
                    marginBottom: "8px",
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
                        {processInfo.totalBatches > 1 && (
                            <Text size="xs" c="dimmed" mt="xs">
                                Batch {processInfo.currentBatch}/
                                {processInfo.totalBatches}
                            </Text>
                        )}
                    </Box>
                )}

                {/* Results Summary - chỉ hiển thị sau khi xong */}
                {!isProcessing && results && results.length > 0 && (
                    <Box>
                        <Group gap="xs" mb="md">
                            <Badge
                                color="green"
                                variant="light"
                                size="lg"
                                radius="md"
                            >
                                Thành công: {successCount}
                            </Badge>
                            {failedCount > 0 && (
                                <Badge
                                    color="red"
                                    variant="light"
                                    size="lg"
                                    radius="md"
                                >
                                    Thất bại: {failedCount}
                                </Badge>
                            )}
                        </Group>

                        {/* Results List */}
                        <ScrollArea h={Math.min(results.length * 60 + 20, 300)}>
                            <Stack gap="xs">
                                {results.map((result, index) => {
                                    const accountId = result.input as string;
                                    const accountInfo =
                                        accountMap?.get(accountId);
                                    const accountName =
                                        accountInfo?.name ||
                                        accountInfo?.phone ||
                                        accountId;
                                    const isSuccess =
                                        result.success &&
                                        result.data &&
                                        isLoginSuccessful(result.data);

                                    return (
                                        <Box
                                            key={index}
                                            p="xs"
                                            style={{
                                                borderRadius: "6px",
                                                backgroundColor: isSuccess
                                                    ? "#F0FDF4"
                                                    : "#FEF2F2",
                                                border: "1px solid",
                                                borderColor: isSuccess
                                                    ? "#D1FAE5"
                                                    : "#FEE2E2",
                                            }}
                                        >
                                            <Group
                                                justify="space-between"
                                                align="flex-start"
                                                gap="sm"
                                            >
                                                <Group
                                                    gap="xs"
                                                    style={{ flex: 1 }}
                                                >
                                                    <Icon
                                                        icon={
                                                            isSuccess
                                                                ? "icon-check-graund"
                                                                : "icon-info-red"
                                                        }
                                                        size={16}
                                                        className={
                                                            isSuccess
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }
                                                    />
                                                    <Box style={{ flex: 1 }}>
                                                        <Text
                                                            size="sm"
                                                            fw={500}
                                                            c={
                                                                isSuccess
                                                                    ? "green"
                                                                    : "red"
                                                            }
                                                        >
                                                            {accountName}
                                                        </Text>
                                                        {result.data
                                                            ?.message && (
                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                                mt={2}
                                                            >
                                                                {
                                                                    result.data
                                                                        .message
                                                                }
                                                            </Text>
                                                        )}
                                                        {result.error && (
                                                            <Text
                                                                size="xs"
                                                                c="red"
                                                                mt={2}
                                                            >
                                                                {result.error instanceof
                                                                Error
                                                                    ? result
                                                                          .error
                                                                          .message
                                                                    : String(
                                                                          result.error
                                                                      )}
                                                            </Text>
                                                        )}
                                                    </Box>
                                                </Group>
                                                <Badge
                                                    color={
                                                        isSuccess
                                                            ? "green"
                                                            : "red"
                                                    }
                                                    variant="light"
                                                    size="sm"
                                                    radius="md"
                                                >
                                                    {isSuccess
                                                        ? "Thành công"
                                                        : "Thất bại"}
                                                </Badge>
                                            </Group>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </ScrollArea>
                    </Box>
                )}
            </Stack>
        </Alert>
    );
};

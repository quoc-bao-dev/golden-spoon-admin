"use client";

import {
    Icon,
    ImageCmp,
    QRCode,
    showErrorToast,
    showSuccessToast,
} from "@/core/components/ui";
import { copyToClipboard } from "@/core/util";
import { useDepositRequestQuery } from "@/service/deposits";
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useMemo, useState } from "react";

const presetAmounts = [50000, 100000, 200000, 500000];

export const TopupPage = () => {
    const [amount, setAmount] = useState<number>(presetAmounts[0]);

    const { data: depositRequest } = useDepositRequestQuery();

    console.log("depositRequest", depositRequest);
    console.log(
        "[qr_code_url]",
        depositRequest?.data.bank_info.qr_code_url + "&amount=" + amount || ""
    );

    const handleCopy = async (text: string, label: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            showSuccessToast(`${label} đã được sao chép vào clipboard`);
        } else {
            showErrorToast("Không thể sao chép. Vui lòng thử lại.");
        }
    };

    const handlePresetClick = (presetAmount: number) => {
        setAmount(presetAmount);
    };

    // Generate QR code data for payment
    // Format: VietQR standard or simple payment info
    const qrCodeData = useMemo(() => {
        return `facebook.com`;
    }, [amount]);

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Grid
                gutter="lg"
                className=" min-h-0 bg-white p-4 rounded-lg shadow-2xl/8 w-[1000px]"
            >
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card
                        radius="lg"
                        shadow="none"
                        className="h-full border border-gray-200!"
                    >
                        <Stack gap="sm">
                            <Group gap="xs">
                                <Text fw={600} size={"24px"}>
                                    Thông tin đơn hàng
                                </Text>
                            </Group>

                            <Stack gap="xs">
                                <Group wrap="nowrap" gap="sm" align="center">
                                    <Box className="size-[48px] rounded-md bg-gray-100 flex items-center justify-center">
                                        <ImageCmp
                                            src="bank"
                                            width={32}
                                            height={32}
                                        />
                                    </Box>
                                    <Box className="flex-1 min-w-0">
                                        <Text fw={600}>
                                            {
                                                depositRequest?.data.bank_info
                                                    .bank_name
                                            }
                                        </Text>
                                        <Text size="sm" c="gray.4">
                                            Ngân hàng quân đội - Chi nhánh TP
                                            HCM
                                        </Text>
                                    </Box>
                                </Group>
                            </Stack>

                            <Stack gap={4} mt={12}>
                                <Text size="sm" c="gray.4">
                                    Số tài khoản
                                </Text>
                                <Group align="center" justify="space-between">
                                    <Text fw={600}>
                                        {
                                            depositRequest?.data.bank_info
                                                .account_number
                                        }
                                    </Text>
                                    <Tooltip label="Sao chép số tài khoản">
                                        <ActionIcon
                                            variant="subtle"
                                            size="lg"
                                            onClick={() =>
                                                handleCopy(
                                                    depositRequest?.data
                                                        .bank_info
                                                        .account_number || "",
                                                    "Số tài khoản"
                                                )
                                            }
                                        >
                                            <Icon icon="icon-copy" size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Stack>
                            <Divider color="gray.2" variant="dashed" />
                            <Stack gap={4}>
                                <Text size="sm" c="gray.6">
                                    Tên chủ tài khoản
                                </Text>
                                <Group align="center" justify="space-between">
                                    <Text fw={600}>
                                        {
                                            depositRequest?.data.bank_info
                                                .account_owner
                                        }
                                    </Text>
                                    <Tooltip label="Sao chép tên chủ tài khoản">
                                        <ActionIcon
                                            variant="subtle"
                                            size="lg"
                                            onClick={() =>
                                                handleCopy(
                                                    depositRequest?.data
                                                        .bank_info
                                                        .account_owner || "",
                                                    "Tên chủ tài khoản"
                                                )
                                            }
                                        >
                                            <Icon icon="icon-copy" size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Stack>
                            <Divider color="gray.2" variant="dashed" />
                            <Stack gap="sm">
                                <Box className="flex flex-col gap-2">
                                    <Text size="sm" c="gray.6">
                                        Chọn số tiền (đ)
                                    </Text>
                                    <Box className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                                        <Text fw={600} size="lg">
                                            {amount.toLocaleString()} đ
                                        </Text>
                                    </Box>
                                </Box>
                                <Group gap="xs" wrap="wrap">
                                    {presetAmounts.map((v) => (
                                        <Button
                                            key={v}
                                            variant={
                                                amount === v
                                                    ? "filled"
                                                    : "light"
                                            }
                                            size="xs"
                                            c={amount === v ? "white" : "gray"}
                                            color={
                                                amount === v ? "blue" : "gray.5"
                                            }
                                            fw={600}
                                            onClick={() => handlePresetClick(v)}
                                        >
                                            {v.toLocaleString()} đ
                                        </Button>
                                    ))}
                                </Group>
                                <Box className="text-sm text-blue-500 bg-blue-50 rounded-md p-2 flex gap-2 items-center border border-blue-500 ">
                                    <Icon icon="icon-info" size={18} />{" "}
                                    <Text component="span">
                                        Nạp tối thiểu 50,000 đ
                                    </Text>
                                </Box>
                            </Stack>
                            <Divider color="gray.2" variant="dashed" />

                            <Stack gap={4}>
                                <Text size="sm" c="gray.6">
                                    Nội dung chuyển khoản
                                </Text>
                                <Group align="center" justify="space-between">
                                    <Text fw={600}>
                                        {
                                            depositRequest?.data.bank_info
                                                .transfer_content
                                        }
                                    </Text>
                                    <Tooltip label="Sao chép nội dung chuyển khoản">
                                        <ActionIcon
                                            variant="subtle"
                                            size="lg"
                                            onClick={() =>
                                                handleCopy(
                                                    depositRequest?.data
                                                        .bank_info
                                                        .transfer_content || "",
                                                    "Nội dung chuyển khoản"
                                                )
                                            }
                                        >
                                            <Icon icon="icon-copy" size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card
                        radius="lg"
                        className="h-full flex flex-col items-center justify-center bg-linear-to-b from-[#FCE88D] to-[#EA8A13]"
                    >
                        <Stack align="center" gap="xs">
                            <Text fw={600} size={"24px"} className="mb-4!">
                                Quét mã QR để thanh toán
                            </Text>
                            <Group gap="sm" className="bg-white p-4 rounded-md">
                                <ImageCmp src="momo" width={80} />
                                <ImageCmp src="viet-qr" width={80} />
                                <ImageCmp src="napas" width={80} />
                            </Group>
                            <Box className="bg-white p-3 rounded-xl shadow-sm mt-2 relative">
                                <QRCode
                                    value={
                                        depositRequest?.data.bank_info
                                            .qr_code_url +
                                            "&amount=" +
                                            amount || ""
                                    }
                                    size={220}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="H"
                                    className="w-[220px] h-[220px] rounded-lg"
                                />
                                {/* <Box className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Box className="bg-white rounded-lg shadow-md p-1 flex items-center justify-center">
                                        <Icon icon="icon-gold-gate" size={40} />
                                    </Box>
                                </Box> */}
                            </Box>
                            <Text size="sm" ta="center" mt={12}>
                                Sử dụng{" "}
                                <span className="font-bold">App MoMo</span> hoặc
                                ứng dụng <br />
                                <span className="font-bold">ngân hàng</span> để
                                quét mã
                            </Text>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
};

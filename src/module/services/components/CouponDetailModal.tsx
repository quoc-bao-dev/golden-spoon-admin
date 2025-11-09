"use client";

import { Icon, showErrorToast, showSuccessToast } from "@/core/components/ui";
import { getBrandImageUrl } from "@/core/util/imageUrl";
import { useClaimVoucherMutation } from "@/service/vouchers";
import {
    ActionIcon,
    Button,
    Collapse,
    Divider,
    Group,
    Modal,
    ScrollArea,
    Select,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Coupon } from "../page/ServicesPage";

type CouponDetailModalProps = {
    opened: boolean;
    onClose: () => void;
    coupon: Coupon | null;
    onBuy?: (coupon: Coupon, quantity: number) => void;
};

export const CouponDetailModal = ({
    opened,
    onClose,
    coupon,
    onBuy,
}: CouponDetailModalProps) => {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(
        coupon?.listAccounts?.[0] ?? null
    );
    const [voucherDetailsOpen, setVoucherDetailsOpen] = useState(true);
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
    });

    // Update selectedAccount when coupon changes
    useEffect(() => {
        if (coupon?.listAccounts?.[0]) {
            setSelectedAccount(coupon.listAccounts[0]);
        }
    }, [coupon?.listAccounts]);

    // Calculate countdown from validTo date
    useEffect(() => {
        if (!coupon?.validTo) return;

        const updateCountdown = () => {
            try {
                // Parse validTo date (format: DD/MM/YYYY)
                const [day, month, year] = coupon.validTo.split("/");
                const expiryDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                    23,
                    59,
                    59
                );
                const now = new Date();
                const diff = expiryDate.getTime() - now.getTime();

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(
                        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutes = Math.floor(
                        (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    setCountdown({ days, hours, minutes });
                } else {
                    setCountdown({ days: 0, hours: 0, minutes: 0 });
                }
            } catch (error) {
                console.error("Error calculating countdown:", error);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000); // Update every second

        return () => clearInterval(interval);
    }, [coupon?.validTo]);

    const optionsAccounts = useMemo(() => {
        return coupon?.listAccounts?.map((account) => ({
            label: account,
            value: account,
        }));
    }, [coupon]);

    const { mutate: claimVoucher, isPending: isClaiming } =
        useClaimVoucherMutation({
            onSuccess: (data) => {
                showSuccessToast(data.message || "Claim voucher thành công!");
                if (onBuy) {
                    onBuy(coupon!, 1);
                }
                onClose();
            },
            onError: (error) => {
                const errorMessage =
                    (error.response?.data as any)?.message ||
                    error.message ||
                    "Claim voucher thất bại. Vui lòng thử lại.";
                showErrorToast(errorMessage);
            },
        });

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString("vi-VN")}₫`;
    };

    const handleBuy = () => {
        // Validate: Bắt buộc chọn tài khoản
        if (!selectedAccount) {
            showErrorToast("Vui lòng chọn tài khoản");
            return;
        }

        // Call claim API
        claimVoucher({
            voucherId: coupon!.id,
            payload: {
                account_customer_id: selectedAccount,
            },
        });
    };

    if (!coupon) return null;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            radius="md"
            centered
            withCloseButton={true}
            size="auto"
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Left Section - Image */}
                <div className="w-full md:w-[50%] relative  flex items-center justify-center px-6 pb-6">
                    <div className="relative max-h-[534px] w-full h-full ">
                        {/* Image */}
                        <Image
                            src={getBrandImageUrl(
                                coupon.brandFeatureImageFileName
                            )}
                            alt={coupon.merchant}
                            width={1000}
                            height={1000}
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>

                {/* Right Section - Details with ScrollArea */}
                <div className="w-full md:w-[50%] flex flex-col max-h-[80vh] pb-6">
                    <ScrollArea className="flex-1">
                        <Stack gap="md" px="md">
                            {/* Header with close button */}
                            <Group
                                justify="space-between"
                                align="flex-start"
                                pos={"sticky"}
                                top={0}
                                bg="white"
                                className="z-100"
                            >
                                <Title
                                    order={3}
                                    fw={700}
                                    size={"24px"}
                                    className="flex-1"
                                >
                                    {coupon.name}
                                </Title>
                            </Group>

                            {/* Offer Status */}
                            <Group gap="lg" align="center">
                                <div className="flex gap-2">
                                    <Icon icon="icon-fire" size={20} />
                                    <Text size="sm" c="#FD7E14">
                                        Kết thúc sau
                                    </Text>
                                </div>
                                <div className="flex gap-2 ">
                                    <div className="flex flex-col gap-2 items-center ">
                                        <div className="text-white bg-[#FD7E14] text-xs rounded-lg font-medium size-[26px] flex items-center justify-center">
                                            {String(countdown.days).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            ngày
                                        </p>
                                    </div>

                                    <div className="text-[#FD7E14] "> : </div>

                                    {/* hours */}
                                    <div className="flex flex-col gap-2 items-center ">
                                        <div className="text-white bg-[#FD7E14] text-xs rounded-lg font-medium size-[26px] flex items-center justify-center">
                                            {String(countdown.hours).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            giờ
                                        </p>
                                    </div>

                                    <div className="text-[#FD7E14] "> : </div>

                                    {/* minutes */}
                                    <div className="flex flex-col gap-2 items-center ">
                                        <div className="text-white bg-[#FD7E14] text-xs rounded-lg font-medium size-[26px] flex items-center justify-center">
                                            {String(countdown.minutes).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            phút
                                        </p>
                                    </div>
                                </div>
                            </Group>

                            {/* Quantity Selector */}
                            <div>
                                <Text size="sm" fw={500} className="-my-2!">
                                    Số lượng:{" "}
                                    <Text span c="dimmed" size="" fw={600}>
                                        1
                                    </Text>
                                </Text>
                            </div>

                            {/* Pricing Display */}
                            <Stack gap="xs">
                                <Text size="xl" fw={700} c="red">
                                    {formatCurrency(coupon.price)}
                                </Text>
                            </Stack>

                            {/* Account Selection */}
                            <div>
                                <Text size="sm" fw={500} mb="xs">
                                    Chọn tài khoản
                                </Text>
                                <Select
                                    value={selectedAccount}
                                    onChange={setSelectedAccount}
                                    defaultValue={
                                        coupon?.listAccounts?.[0] ?? null
                                    }
                                    data={optionsAccounts}
                                    rightSection={
                                        <span className="text-gray-500">
                                            <Icon
                                                icon="icon-arrow-down"
                                                size={24}
                                            />
                                        </span>
                                    }
                                />
                            </div>

                            {/* Buy Button */}
                            <Button
                                size="lg"
                                style={{
                                    justifyContent: "space-between!important",
                                }}
                                className="text-gray-900  w-full "
                                onClick={handleBuy}
                                c={"gray.9"}
                                fw={700}
                                loading={isClaiming}
                                disabled={isClaiming}
                                rightSection={
                                    <Icon icon="icon-cart" size={24} />
                                }
                            >
                                Mua Ngay
                            </Button>

                            {/* Voucher Details Section */}
                            <div>
                                <Group
                                    justify="space-between"
                                    align="center"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setVoucherDetailsOpen(
                                            !voucherDetailsOpen
                                        )
                                    }
                                    mb="xs"
                                >
                                    <Text fw={700} size="lg">
                                        Chi tiết voucher
                                    </Text>
                                    <span className="text-gray-600">
                                        {voucherDetailsOpen ? (
                                            <Icon icon="icon-minus" size={24} />
                                        ) : (
                                            <Icon icon="icon-plus" size={24} />
                                        )}
                                    </span>
                                </Group>
                                <Collapse in={voucherDetailsOpen}>
                                    <Stack gap="sm" pt="xs">
                                        <Divider my="3px" color="gray.2" />

                                        {/* === row === */}
                                        <div className="flex w-full  gap-3">
                                            <Text
                                                size="sm"
                                                fw={500}
                                                mb={4}
                                                className="w-[40%]"
                                                c={"gray.4"}
                                            >
                                                Địa điểm sử dụng
                                            </Text>
                                            <div className="flex flex-col gap-1">
                                                <Text size="sm" c="#121926">
                                                    {coupon.merchant}
                                                </Text>
                                                <div className="flex gap-2 items-center ">
                                                    <Text
                                                        size="sm"
                                                        c="blue"
                                                        className="cursor-pointer hover:underline"
                                                    >
                                                        Xem tất cả chi nhánh
                                                    </Text>
                                                    <Icon
                                                        icon="icon-arrow-up"
                                                        size={16}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Divider my="3px" color="gray.2" />

                                        {/* === row === */}
                                        <div className="flex w-full  gap-3">
                                            <Text
                                                size="sm"
                                                fw={500}
                                                mb={4}
                                                className="w-[40%]"
                                                c={"gray.4"}
                                            >
                                                HSD
                                            </Text>
                                            <Text size="sm" c="#121926">
                                                {coupon.validTo}
                                            </Text>
                                        </div>
                                    </Stack>
                                </Collapse>
                            </div>
                        </Stack>
                    </ScrollArea>
                </div>
            </div>
        </Modal>
    );
};

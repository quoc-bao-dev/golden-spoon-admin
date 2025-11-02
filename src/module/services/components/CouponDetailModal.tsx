"use client";

import { Icon, ImageCmp } from "@/core/components/ui";
import {
    Badge,
    Button,
    Group,
    Modal,
    NumberInput,
    ScrollArea,
    Select,
    Stack,
    Text,
    Title,
    Collapse,
    Checkbox,
    ActionIcon,
} from "@mantine/core";
import { useState } from "react";
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
    const [quantity, setQuantity] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(
        "peachytran420@gmail.com"
    );
    const [setAsDefault, setSetAsDefault] = useState(false);
    const [voucherDetailsOpen, setVoucherDetailsOpen] = useState(true);
    const [termsOpen, setTermsOpen] = useState(false);

    if (!coupon) return null;

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString("vi-VN")}₫`;
    };

    const discountAmount = coupon.value - coupon.price;
    const discountPercent = Math.round((discountAmount / coupon.value) * 100);

    const handleBuy = () => {
        if (onBuy) {
            onBuy(coupon, quantity);
        }
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="xl"
            radius="md"
            centered
            padding={0}
            withCloseButton={false}
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Left Section - Image */}
                <div className="w-full md:w-[40%] relative bg-gray-50 flex items-center justify-center p-6">
                    <div className="relative w-full aspect-square max-w-md">
                        {/* Discount Badge */}
                        <Badge
                            className="absolute top-0 left-0 z-10 bg-red-500 text-white"
                            size="lg"
                        >
                            -{discountPercent}%
                        </Badge>

                        {/* Image */}
                        <ImageCmp
                            src="image-commbo"
                            className="w-full h-full object-cover rounded-lg"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>

                {/* Right Section - Details with ScrollArea */}
                <div className="w-full md:w-[60%] flex flex-col max-h-[80vh]">
                    <ScrollArea className="flex-1">
                        <Stack gap="md" p="md">
                            {/* Header with close button */}
                            <Group justify="space-between" align="flex-start">
                                <Title order={3} fw={600} className="flex-1">
                                    Coupon {formatCurrency(coupon.value)}
                                </Title>
                                <ActionIcon
                                    variant="subtle"
                                    onClick={onClose}
                                    size="lg"
                                >
                                    <Icon icon="icon-close" size={20} />
                                </ActionIcon>
                            </Group>

                            {/* Offer Status */}
                            <Group gap="xs" align="center">
                                <Text size="sm" c="dimmed">
                                    Kết thúc sau
                                </Text>
                                <Badge color="red" variant="light">
                                    04 : 20 : 59
                                </Badge>
                            </Group>

                            {/* Purchase Counter */}
                            <Group gap="xs" align="center">
                                <Icon icon="icon-user-search" size={16} />
                                <Text size="sm" c="dimmed">
                                    69K Đã mua
                                </Text>
                            </Group>

                            {/* Product Description */}
                            <Text
                                size="sm"
                                c="dimmed"
                                className="leading-relaxed"
                            >
                                Trải nghiệm Dimsum thủ công tại Crystal Jade
                                Hong Kong Kitchen với những món ăn được làm thủ
                                công, mang đến cho bạn một hành trình ẩm thực
                                đáng nhớ.
                            </Text>

                            {/* Quantity Selector */}
                            <div>
                                <Text size="sm" fw={500} mb="xs">
                                    Số lượng
                                </Text>
                                <NumberInput
                                    value={quantity}
                                    onChange={(value) =>
                                        setQuantity(Number(value) || 1)
                                    }
                                    min={1}
                                    max={99}
                                    className="w-24"
                                />
                            </div>

                            {/* Pricing Display */}
                            <Stack gap="xs">
                                <Text
                                    size="sm"
                                    td="line-through"
                                    c="dimmed"
                                    className="line-through"
                                >
                                    {formatCurrency(coupon.value)}
                                </Text>
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
                                    data={[
                                        {
                                            value: "peachytran420@gmail.com",
                                            label: "peachytran420@gmail.com (69,420)",
                                        },
                                    ]}
                                    rightSection={
                                        <span className="text-gray-500">▼</span>
                                    }
                                />
                                <Checkbox
                                    checked={setAsDefault}
                                    onChange={(e) =>
                                        setSetAsDefault(e.currentTarget.checked)
                                    }
                                    label="Đặt làm tài khoản mua mặc định"
                                    mt="xs"
                                    size="sm"
                                />
                            </div>

                            {/* Buy Button */}
                            <Button
                                size="lg"
                                color="yellow"
                                className="bg-[#FFD479] text-gray-900 hover:bg-[#FFC85A] w-full"
                                onClick={handleBuy}
                                leftSection={
                                    <span className="text-gray-900">🛒</span>
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
                                    <Text fw={500} size="sm">
                                        Chi tiết voucher
                                    </Text>
                                    <span className="text-gray-600">
                                        {voucherDetailsOpen ? "−" : "+"}
                                    </span>
                                </Group>
                                <Collapse in={voucherDetailsOpen}>
                                    <Stack gap="sm" pl="md">
                                        <div>
                                            <Text size="sm" fw={500} mb={4}>
                                                Địa điểm sử dụng
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Crystal Jade Kitchen HCM và HN
                                            </Text>
                                            <Text
                                                size="sm"
                                                c="blue"
                                                className="cursor-pointer hover:underline"
                                            >
                                                Xem tất cả chi nhánh
                                            </Text>
                                        </div>
                                        <div>
                                            <Text size="sm" fw={500} mb={4}>
                                                HSD
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                {coupon.validTo}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text size="sm" fw={500} mb={4}>
                                                Thời gian áp dụng
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Từ thứ 2 đến thứ 5 hàng tuần
                                            </Text>
                                        </div>
                                    </Stack>
                                </Collapse>
                            </div>

                            {/* Terms and Conditions Section */}
                            <div>
                                <Group
                                    justify="space-between"
                                    align="center"
                                    className="cursor-pointer"
                                    onClick={() => setTermsOpen(!termsOpen)}
                                    mb="xs"
                                >
                                    <Text fw={500} size="sm">
                                        Chính sách và điều khoản sử dụng
                                    </Text>
                                    <span className="text-gray-600">
                                        {termsOpen ? "−" : "+"}
                                    </span>
                                </Group>
                                <Collapse in={termsOpen}>
                                    <Stack gap="sm" pl="md">
                                        <Text size="sm" c="dimmed">
                                            • Voucher có giá trị trong thời gian
                                            quy định
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            • Không áp dụng với các chương trình
                                            khuyến mãi khác
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            • Voucher không thể hoàn tiền
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            • Cần đặt chỗ trước khi sử dụng
                                        </Text>
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

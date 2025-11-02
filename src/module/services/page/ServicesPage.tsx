"use client";

import { Icon, ImageCmp } from "@/core/components/ui";
import {
    Badge,
    Button,
    Card,
    Group,
    ScrollArea,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useState } from "react";

type Coupon = {
    id: string;
    name: string;
    merchant: string;
    value: number;
    price: number;
    validFrom: string;
    validTo: string;
    category: "all" | "for-you" | "partner";
};

const ServicesPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string | null>("newest");

    // Mock data
    const coupons: Coupon[] = Array(16)
        .fill(null)
        .map((_, i) => ({
            id: String(i + 1),
            name: "Coupon 50k",
            merchant: "Golden Gate",
            value: 50000,
            price: 50000,
            validFrom: "01/10/2025",
            validTo: "31/12/2100",
            category: i % 3 === 0 ? "all" : i % 3 === 1 ? "for-you" : "partner",
        }));

    // Filter coupons
    const filteredCoupons = coupons.filter((coupon) => {
        const matchesSearch =
            !searchValue ||
            coupon.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            coupon.merchant.toLowerCase().includes(searchValue.toLowerCase());

        const matchesCategory =
            activeCategory === "all" || coupon.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort coupons
    const sortedCoupons = [...filteredCoupons].sort((a, b) => {
        if (sortBy === "newest") {
            return b.id.localeCompare(a.id);
        }
        if (sortBy === "bestselling") {
            // Mock: sort by ID for demonstration
            return a.id.localeCompare(b.id);
        }
        if (sortBy === "lowest-price") {
            return a.price - b.price;
        }
        if (sortBy === "highest-discount") {
            // Mock: higher value = higher discount
            return b.value - a.value;
        }
        return 0;
    });

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString("vi-VN")}₫`;
    };

    const categories = [
        { value: "all", label: "#tất cả" },
        { value: "for-you", label: "#dành riêng cho bạn" },
        { value: "partner", label: "#ưu đãi từ đối tác" },
    ];

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "bestselling", label: "Bán chạy nhất" },
        { value: "lowest-price", label: "Giá thấp nhất" },
        { value: "highest-discount", label: "Giảm sâu nhất" },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between w-full flex-wrap gap-4">
                    <Title order={3} className="font-semibold">
                        Dịch vụ
                    </Title>
                    <div className="flex gap-2 flex-1 justify-end flex-wrap">
                        <div className="relative flex-1 max-w-xs min-w-[200px]">
                            <TextInput
                                placeholder="Tìm kiếm"
                                value={searchValue}
                                onChange={(e) =>
                                    setSearchValue(e.currentTarget.value)
                                }
                                className="w-full"
                                leftSection={
                                    <Icon icon="icon-search" size={18} />
                                }
                            />
                        </div>
                        <Group gap="xs">
                            {categories.map((category) => (
                                <Badge
                                    key={category.value}
                                    onClick={() =>
                                        setActiveCategory(category.value)
                                    }
                                    variant={
                                        activeCategory === category.value
                                            ? "filled"
                                            : "light"
                                    }
                                    size="lg"
                                    className={`cursor-pointer ${
                                        activeCategory === category.value
                                            ? "bg-[#FFD479] text-gray-900 hover:bg-[#FFD479]"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                    color="brand"
                                >
                                    {category.label}
                                </Badge>
                            ))}
                        </Group>
                        <Select
                            placeholder="Sắp xếp ưu đãi theo"
                            value={sortBy}
                            onChange={setSortBy}
                            data={sortOptions}
                            className="min-w-[200px]"
                        />
                    </div>
                </div>
            </div>

            {/* Coupon Grid */}
            <ScrollArea>
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 2, lg: 4 }}
                    spacing="lg"
                >
                    {sortedCoupons.map((coupon) => (
                        <Card
                            key={coupon.id}
                            shadow="sm"
                            padding="0"
                            radius="lg"
                            className="overflow-hidden border border-gray-200!"
                        >
                            {/* Coupon Visual Header */}
                            <div className="p-4 ">
                                <ImageCmp
                                    src="image-commbo"
                                    className="w-full h-full object-cover rounded-lg"
                                    width={400}
                                />
                            </div>

                            {/* Merchant Details */}
                            <Stack gap={2} p="md">
                                <Group gap="xs" align="center">
                                    <Icon icon="icon-gold-gate" size={16} />
                                    <Text fw={600} size="xs">
                                        {coupon.merchant}
                                    </Text>
                                </Group>
                                <Text c="gray.9" fw={600} className=" pt-2!">
                                    Coupon {formatCurrency(coupon.value)} VND
                                </Text>

                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-1">
                                        <Text size="sm" c="gray.5">
                                            {coupon.validFrom} -{" "}
                                            {coupon.validTo}
                                        </Text>
                                        <Text fw={600} size="md" c="gray.6">
                                            {formatCurrency(coupon.price)}
                                        </Text>
                                    </div>
                                    <Button
                                        size="sm"
                                        color="brand"
                                        className="bg-[#FFD479] text-gray-900 hover:bg-[#FFC85A] rounded-full! w-fit!"
                                    >
                                        Mua
                                    </Button>
                                </div>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </ScrollArea>

            {/* Empty State */}
            {sortedCoupons.length === 0 && (
                <div className="flex items-center justify-center h-64">
                    <Text c="gray.5" size="lg">
                        Không tìm thấy dịch vụ nào
                    </Text>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;

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
import { Skeleton } from "@mantine/core";
import { useMemo, useState } from "react";
import { CouponDetailModal } from "../components";
import { useMyOffersQuery, useVouchersQuery } from "@/service/vouchers";

export type Coupon = {
    id: string;
    name: string;
    merchant: string;
    value: number;
    price: number;
    validFrom: string;
    validTo: string;
    category: "all" | "for-you" | "partner";
    brandFeatureImageFileName?: string;
};

const ServicesPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string | null>("newest");
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

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

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString("vi-VN")}₫`;
    };

    const categories = [
        { value: "all", label: "#tất cả" },
        { value: "my-offers", label: "#ưu đãi của tôi" },
    ];

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "bestselling", label: "Bán chạy nhất" },
        { value: "lowest-price", label: "Giá thấp nhất" },
        { value: "highest-discount", label: "Giảm sâu nhất" },
    ];

    const { data: vouchers, isLoading: isVouchersLoading } = useVouchersQuery();

    const { data: myOffers, isLoading: isMyOffersLoading } = useMyOffersQuery();
    const isLoading =
        activeCategory === "my-offers" ? isMyOffersLoading : isVouchersLoading;

    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        } catch {
            return iso;
        }
    };

    const getBrandImageUrl = (fileName?: string) => {
        if (!fileName) return "";
        if (fileName.startsWith("http")) return fileName;
        return `https://imagedelivery.net/1J0pLjFdKJBzEdIlr1bDRQ/${fileName}/public`;
    };

    const remoteCoupons = useMemo<Coupon[]>(() => {
        const items = vouchers?.data?.vouchers ?? [];
        return items.map((v) => ({
            id: v.id,
            name: v.title,
            merchant: v.brands?.[0]?.title ?? "Golden Gate",
            value: Number(v.denomination_value) || 0,
            price: Number(v.denomination_value) || 0,
            validFrom: formatDate(v.valid_from_date),
            validTo: formatDate(v.expiry_date),
            category: "all",
            brandFeatureImageFileName: v.brands?.[0]?.logo_id,
        }));
    }, [vouchers]);

    // Map my-offers response groups into Coupon list
    const myOffersCoupons = useMemo<Coupon[]>(() => {
        const groups = myOffers?.data?.groups ?? [];
        const list: Coupon[] = [];
        groups.forEach((g) => {
            const brand = g.brands?.[0];
            g.vouchers?.forEach((v) => {
                list.push({
                    id: v.id,
                    name: g.title,
                    merchant: brand?.title ?? "Golden Gate",
                    value: Number(g.denomination_value) || 0,
                    price: Number(g.denomination_value) || 0,
                    validFrom: formatDate(v.valid_from_date),
                    validTo: formatDate(v.expiry_date),
                    category: "all",
                    brandFeatureImageFileName: brand?.logo_id,
                });
            });
        });
        return list;
    }, [myOffers]);

    // Prefer API data based on activeCategory, fallback to mock
    const preferred =
        activeCategory === "my-offers" ? myOffersCoupons : remoteCoupons;
    const sourceCoupons = preferred.length > 0 ? preferred : coupons;

    // Filter coupons
    const filteredCoupons = sourceCoupons.filter((coupon) => {
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

    const handleCouponClick = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setModalOpened(true);
    };

    const handleModalClose = () => {
        setModalOpened(false);
        setSelectedCoupon(null);
    };

    const handleBuy = (coupon: Coupon, quantity: number) => {
        console.log("Buy coupon:", coupon, "Quantity:", quantity);
        // TODO: Implement buy logic
    };

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
                    {isLoading &&
                        Array.from({ length: 8 }).map((_, idx) => (
                            <Card
                                key={`skeleton-${idx}`}
                                shadow="sm"
                                padding="0"
                                radius="lg"
                                className="overflow-hidden border border-gray-200!"
                            >
                                <div className="p-4 ">
                                    <Skeleton height={160} radius="md" />
                                </div>
                                <Stack gap={8} p="md">
                                    <Group gap="xs" align="center">
                                        <Skeleton
                                            height={32}
                                            width={32}
                                            circle
                                        />
                                        <Skeleton height={12} width={120} />
                                    </Group>
                                    <Skeleton height={18} width="80%" />
                                    <Group
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Stack gap={6}>
                                            <Skeleton height={12} width={160} />
                                            <Skeleton height={14} width={80} />
                                        </Stack>
                                        <Skeleton
                                            height={28}
                                            width={64}
                                            radius="xl"
                                        />
                                    </Group>
                                </Stack>
                            </Card>
                        ))}
                    {!isLoading &&
                        sortedCoupons.map((coupon) => (
                            <Card
                                key={coupon.id}
                                shadow="sm"
                                padding="0"
                                radius="lg"
                                className="overflow-hidden border border-gray-200! cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleCouponClick(coupon)}
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
                                        {coupon.brandFeatureImageFileName ? (
                                            <img
                                                src={getBrandImageUrl(
                                                    coupon.brandFeatureImageFileName
                                                )}
                                                alt={coupon.merchant}
                                                className="size-[32px] rounded-sm object-cover"
                                            />
                                        ) : (
                                            <Icon
                                                icon="icon-gold-gate"
                                                size={16}
                                            />
                                        )}
                                        <Text fw={600} size="sm">
                                            {coupon.merchant}
                                        </Text>
                                    </Group>
                                    <Text
                                        c="gray.9"
                                        fw={600}
                                        className=" pt-2!"
                                    >
                                        {/* TODO:   */}
                                        {/* Coupon {formatCurrency(coupon.value)} VND */}

                                        {coupon.name}
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

            {/* Coupon Detail Modal */}
            <CouponDetailModal
                opened={modalOpened}
                onClose={handleModalClose}
                coupon={selectedCoupon}
                onBuy={handleBuy}
            />
        </div>
    );
};

export default ServicesPage;

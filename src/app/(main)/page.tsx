"use client";

import {
    Button,
    Card,
    Text,
    Group,
    Stack,
    TextInput,
    Select,
    Modal,
    Badge,
} from "@mantine/core";
import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/core/components/ui";

export default function Home() {
    const [opened, setOpened] = useState(false);

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Mantine + Tailwind Color Sync Demo
                    </h1>
                    <p className="text-lg text-gray-600">
                        Kiểm tra màu đồng bộ giữa Mantine components và Tailwind
                        CSS
                    </p>
                </div>

                {/* Color Palette Demo */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={500} mb="md">
                        Color Palette Comparison
                    </Text>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Tailwind Colors */}
                        <div>
                            <Text size="md" fw={500} mb="sm" c="blue">
                                Tailwind CSS Colors
                            </Text>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-sm">bg-blue-500</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span className="text-sm">bg-red-500</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm">
                                        bg-green-500
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span className="text-sm">
                                        bg-yellow-500
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                                    <span className="text-sm">bg-gray-500</span>
                                </div>
                            </div>
                        </div>

                        {/* Mantine Colors */}
                        <div>
                            <Text size="md" fw={500} mb="sm" c="blue">
                                Mantine Components
                            </Text>
                            <div className="space-y-2">
                                <Badge color="blue" size="lg">
                                    Blue Badge
                                </Badge>
                                <Badge color="red" size="lg">
                                    Red Badge
                                </Badge>
                                <Badge color="green" size="lg">
                                    Green Badge
                                </Badge>
                                <Badge color="yellow" size="lg">
                                    Yellow Badge
                                </Badge>
                                <Badge color="gray" size="lg">
                                    Gray Badge
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Interactive Components */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="lg" fw={500} mb="md">
                        Interactive Components
                    </Text>

                    <Stack gap="md">
                        <Group gap="md">
                            <Button color="blue" variant="filled">
                                Blue Button
                            </Button>
                            <Button color="red" variant="filled">
                                Red Button
                            </Button>
                            <Button color="green" variant="filled">
                                Green Button
                            </Button>
                            <Button color="yellow" variant="filled">
                                Yellow Button
                            </Button>
                        </Group>

                        <Group gap="md">
                            <Button color="blue" variant="outline">
                                Blue Outline
                            </Button>
                            <Button color="red" variant="outline">
                                Red Outline
                            </Button>
                            <Button color="green" variant="outline">
                                Green Outline
                            </Button>
                            <Button color="yellow" variant="outline">
                                Yellow Outline
                            </Button>
                        </Group>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Text Input"
                                placeholder="Enter text..."
                                color="blue"
                            />
                            <Select
                                label="Select Option"
                                placeholder="Choose option..."
                                data={["Option 1", "Option 2", "Option 3"]}
                                color="blue"
                            />
                        </div>

                        <Button
                            color="blue"
                            variant="filled"
                            onClick={() => setOpened(true)}
                        >
                            Open Modal
                        </Button>

                        <Group gap="md" mt="md">
                            <Button
                                color="green"
                                variant="filled"
                                onClick={() =>
                                    showSuccessToast("Copied to clipboard!")
                                }
                            >
                                Show Success Toast
                            </Button>
                            <Button
                                color="red"
                                variant="filled"
                                onClick={() =>
                                    showErrorToast(
                                        "Không thể sao chép. Vui lòng thử lại."
                                    )
                                }
                            >
                                Show Error Toast
                            </Button>
                        </Group>
                    </Stack>
                </Card>

                {/* Dark Mode Test */}
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    className="bg-gray-100"
                >
                    <Text size="lg" fw={500} mb="md">
                        Dark Mode Support
                    </Text>
                    <Text size="sm" c="dimmed" mb="md">
                        Thay đổi theme của hệ thống để xem dark mode. Màu sẽ tự
                        động đồng bộ.
                    </Text>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg border">
                            <Text size="sm" fw={500} mb="sm">
                                Light Mode
                            </Text>
                            <div className="flex gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                <div className="w-6 h-6 bg-red-500 rounded"></div>
                                <div className="w-6 h-6 bg-green-500 rounded"></div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-800 rounded-lg border">
                            <Text size="sm" fw={500} mb="sm" c="white">
                                Dark Mode
                            </Text>
                            <div className="flex gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                <div className="w-6 h-6 bg-red-500 rounded"></div>
                                <div className="w-6 h-6 bg-green-500 rounded"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Modal Demo */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Modal Demo"
                color="blue"
            >
                <Stack gap="md">
                    <Text>
                        Đây là modal demo để kiểm tra màu đồng bộ giữa Mantine
                        và Tailwind.
                    </Text>
                    <div className="flex gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm">
                            Màu này giống với Mantine blue
                        </span>
                    </div>
                    <Group justify="flex-end">
                        <Button
                            variant="outline"
                            onClick={() => setOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="blue"
                            onClick={() => {
                                showSuccessToast("Xác nhận thành công!");
                                setOpened(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
}

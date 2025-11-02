import { Group, Paper, Text, Divider, Stack } from "@mantine/core";

export type StatItem = {
    label: string;
    value: string | number;
    color?: string;
};

type StatsProps = {
    items: StatItem[];
    className?: string;
};

export const Stats = ({ items, className }: StatsProps) => {
    return (
        <Paper
            px={4}
            py={7}
            radius="md"
            className={`bg-gray-50 border border-gray-200 ${className || ""}`}
        >
            <Group gap={0} wrap="nowrap">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-0">
                        <div className="px-4">
                            <Text
                                size="sm"
                                fw={500}
                                style={{
                                    color: item.color || "#000",
                                }}
                            >
                                {item.label}: {item.value}
                            </Text>
                        </div>
                        {index < items.length - 1 && (
                            <Divider
                                orientation="vertical"
                                className="mx-2 h-6"
                                color="gray.3"
                            />
                        )}
                    </div>
                ))}
            </Group>
        </Paper>
    );
};

import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

type ProcessingInterruptedModalProps = {
    opened: boolean;
    onClose: () => void;
    onConfirm?: () => void; // Callback khi người dùng xác nhận reload (trước khi reload)
};

/**
 * Modal cảnh báo khi người dùng cố gắng reload trong quá trình xử lý
 */
export const ProcessingInterruptedModal = ({
    opened,
    onClose,
    onConfirm,
}: ProcessingInterruptedModalProps) => {
    const handleConfirm = () => {
        onConfirm?.();
        onClose();
        // Reload trang
        window.location.reload();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <IconAlertTriangle
                        size={24}
                        stroke={1.5}
                        color="var(--mantine-color-orange-6)"
                    />
                    <Text fw={600} size="lg">
                        Cảnh báo
                    </Text>
                </Group>
            }
            centered
            size="md"
        >
            <Stack gap="lg">
                <Alert
                    color="orange"
                    variant="light"
                    icon={<IconAlertTriangle size={20} stroke={1.5} />}
                    radius="md"
                >
                    <Stack gap="xs">
                        <Text size="sm" fw={600} c="orange.7">
                            Bạn đang trong quá trình xử lý đăng nhập
                        </Text>
                        <Text size="sm" c="dimmed" lh={1.6}>
                            Nếu bạn reload trang bây giờ, quá trình xử lý sẽ bị
                            hủy và bạn sẽ mất tiến trình hiện tại. Bạn có chắc
                            chắn muốn tiếp tục?
                        </Text>
                    </Stack>
                </Alert>

                <Group justify="flex-end" gap="sm" mt="xs">
                    <Button variant="default" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button color="orange" onClick={handleConfirm}>
                        Vẫn reload
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

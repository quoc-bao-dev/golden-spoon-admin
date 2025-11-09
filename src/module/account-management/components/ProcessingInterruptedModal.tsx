import { Modal, Button, Text, Stack, Group, Alert } from "@mantine/core";
import { Icon } from "@/core/components/ui";

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
                    <Icon icon="icon-info-red" size={20} />
                    <Text fw={600} size="lg">
                        Cảnh báo
                    </Text>
                </Group>
            }
            centered
            size="md"
        >
            <Stack gap="md">
                <Alert
                    color="orange"
                    icon={<Icon icon="icon-info-red" size={18} />}
                >
                    <Text size="sm" fw={500} mb="xs">
                        Bạn đang trong quá trình xử lý đăng nhập
                    </Text>
                    <Text size="sm" c="dimmed">
                        Nếu bạn reload trang bây giờ, quá trình xử lý sẽ bị hủy
                        và bạn sẽ mất tiến trình hiện tại. Bạn có chắc chắn muốn
                        tiếp tục?
                    </Text>
                </Alert>

                <Group justify="flex-end" gap="sm" mt="md">
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

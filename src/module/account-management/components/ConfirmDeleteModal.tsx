import { Button, Group, Modal, Text } from "@mantine/core";

type ConfirmDeleteModalProps = {
    opened: boolean;
    count: number;
    onClose: () => void;
    onConfirm: () => void;
    isPending?: boolean;
};

export const ConfirmDeleteModal = ({
    opened,
    count,
    onClose,
    onConfirm,
    isPending,
}: ConfirmDeleteModalProps) => {
    return (
        <Modal
            opened={opened}
            onClose={isPending ? () => {} : onClose}
            title={<Text fw={600}>Xác nhận xóa</Text>}
            centered
            radius="lg"
            padding="lg"
            closeOnClickOutside={!isPending}
            closeOnEscape={!isPending}
        >
            <Text mb="md">
                Bạn có chắc muốn xóa {count} tài khoản? Hành động này không thể
                hoàn tác.
            </Text>
            <Group justify="flex-end">
                <Button
                    variant="default"
                    onClick={onClose}
                    disabled={!!isPending}
                >
                    Hủy
                </Button>
                <Button color="red" onClick={onConfirm} loading={!!isPending}>
                    Xóa
                </Button>
            </Group>
        </Modal>
    );
};

export default ConfirmDeleteModal;

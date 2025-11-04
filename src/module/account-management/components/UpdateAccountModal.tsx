import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/core/components/ui";
import { useUpdateAccountMutation } from "@/service/accounts";
import { AxiosError } from "axios";

type UpdateAccountModalProps = {
    opened: boolean;
    accountId: string | null;
    email: string | null;
    phone?: string | null;
    onClose: () => void;
};

export const UpdateAccountModal = ({
    opened,
    accountId,
    email,
    phone,
    onClose,
}: UpdateAccountModalProps) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");

    const { mutateAsync: updateAccount, isPending } = useUpdateAccountMutation(
        {}
    );

    const handleSubmit = async () => {
        if (!accountId) return;
        setServerError("");
        // simple validation: required + min 6
        if (!password.trim()) {
            setError("Mật khẩu là bắt buộc");
            return;
        }
        if (password.trim().length < 6) {
            setError("Mật khẩu phải tối thiểu 6 ký tự");
            return;
        }
        setError("");
        try {
            await updateAccount({ id: accountId, password });
            showSuccessToast("Cập nhật thông tin người dùng thành công");
            setPassword("");
            onClose();
        } catch (e) {
            if (e instanceof AxiosError) {
                const msg = (e.response?.data as any)?.detail?.[0]?.msg;
                showErrorToast(msg || "Cập nhật thông tin người dùng thất bại");
                setServerError(msg || "");
            } else {
                showErrorToast("Cập nhật thông tin người dùng thất bại");
            }
        }
    };

    const handleClose = () => {
        setPassword("");
        setError("");
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={isPending ? () => {} : handleClose}
            title={<Text fw={600}>Cập nhật thông tin người dùng</Text>}
            centered
            radius="lg"
            padding="lg"
            closeOnClickOutside={!isPending}
            closeOnEscape={!isPending}
        >
            <Group gap="sm" grow>
                <TextInput label="Email" value={email || ""} readOnly />
                <TextInput label="Số điện thoại" value={phone || ""} readOnly />
            </Group>
            <TextInput
                mt="md"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu mới"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                error={error || serverError || undefined}
                disabled={isPending}
            />

            <Group justify="flex-end" mt="lg">
                <Button
                    variant="default"
                    onClick={handleClose}
                    disabled={isPending}
                >
                    Hủy
                </Button>
                <Button
                    color="brand"
                    onClick={handleSubmit}
                    loading={isPending}
                >
                    Đồng ý
                </Button>
            </Group>
        </Modal>
    );
};

export default UpdateAccountModal;

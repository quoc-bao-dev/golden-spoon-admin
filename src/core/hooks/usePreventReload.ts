import { useEffect, useState, useRef } from "react";

const CONFIRMED_RELOAD_FLAG = "confirmedReload";

/**
 * Hook để ngăn chặn reload/đóng trang khi đang trong quá trình xử lý
 * Kết hợp beforeunload event với custom modal
 *
 * @param isProcessing - Flag cho biết đang trong quá trình xử lý
 * @param onShowModal - Callback để hiển thị custom modal
 * @returns Object chứa showModal state và setShowModal function
 *
 * @example
 * ```tsx
 * const { showModal, setShowModal } = usePreventReload(
 *   isProcessing,
 *   () => setShowWarningModal(true)
 * );
 * ```
 */
export function usePreventReload(
    isProcessing: boolean,
    onShowModal?: () => void
) {
    const [showModal, setShowModal] = useState(false);
    const confirmedReloadRef = useRef(false);

    useEffect(() => {
        if (!isProcessing) {
            setShowModal(false);
            return;
        }

        // Handle beforeunload event (reload, close tab, navigate away)
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Nếu người dùng đã confirm reload, không ngăn chặn
            if (confirmedReloadRef.current) {
                try {
                    sessionStorage.removeItem(CONFIRMED_RELOAD_FLAG);
                } catch (error) {
                    // Ignore
                }
                return;
            }

            // Check sessionStorage xem có flag confirmed không
            try {
                const confirmed = sessionStorage.getItem(CONFIRMED_RELOAD_FLAG);
                if (confirmed === "true") {
                    sessionStorage.removeItem(CONFIRMED_RELOAD_FLAG);
                    return;
                }
            } catch (error) {
                // Ignore
            }

            // Lưu flag vào sessionStorage để thông báo sau reload
            try {
                sessionStorage.setItem(
                    "loginProcessingInterrupted",
                    JSON.stringify({
                        timestamp: Date.now(),
                    })
                );
            } catch (error) {
                console.error("Failed to save to sessionStorage:", error);
            }

            // Browser sẽ hiển thị dialog mặc định
            e.preventDefault();
            e.returnValue = ""; // Chrome requires returnValue
            return ""; // Some browsers require return value
        };

        // Handle keyboard shortcuts (F5, Ctrl+R, Ctrl+Shift+R)
        const handleKeyDown = (e: KeyboardEvent) => {
            // F5
            if (e.key === "F5") {
                e.preventDefault();
                if (onShowModal) {
                    onShowModal();
                } else {
                    setShowModal(true);
                }
                return false;
            }

            // Ctrl+R or Cmd+R (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === "r") {
                e.preventDefault();
                if (onShowModal) {
                    onShowModal();
                } else {
                    setShowModal(true);
                }
                return false;
            }

            // Ctrl+Shift+R or Cmd+Shift+R (hard reload)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "R") {
                e.preventDefault();
                if (onShowModal) {
                    onShowModal();
                } else {
                    setShowModal(true);
                }
                return false;
            }
        };

        // Add event listeners
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isProcessing, onShowModal]);

    // Clear sessionStorage flag khi không còn processing
    useEffect(() => {
        if (!isProcessing) {
            try {
                sessionStorage.removeItem("loginProcessingInterrupted");
                confirmedReloadRef.current = false;
            } catch (error) {
                console.error("Failed to remove from sessionStorage:", error);
            }
        }
    }, [isProcessing]);

    // Function để confirm reload (gọi từ modal)
    const confirmReload = () => {
        confirmedReloadRef.current = true;
        try {
            sessionStorage.setItem(CONFIRMED_RELOAD_FLAG, "true");
        } catch (error) {
            console.error("Failed to save confirmed reload flag:", error);
        }
    };

    return {
        showModal,
        setShowModal,
        confirmReload,
    };
}

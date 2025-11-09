/**
 * Chia mảng thành các batch (lô) với kích thước cố định
 * @param array - Mảng cần chia
 * @param size - Kích thước mỗi batch
 * @returns Mảng các batch
 * @example
 * chunkArray([1, 2, 3, 4, 5, 6], 2) // [[1, 2], [3, 4], [5, 6]]
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
    if (size <= 0) {
        throw new Error("Batch size must be greater than 0");
    }

    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        batches.push(array.slice(i, i + size));
    }
    return batches;
}

/**
 * Tính progress percentage (0-100)
 * @param processed - Số item đã xử lý
 * @param total - Tổng số item
 * @returns Progress percentage (0-100)
 * @example
 * calculateProgress(5, 20) // 25
 */
export function calculateProgress(processed: number, total: number): number {
    if (total === 0) return 0;
    if (processed >= total) return 100;
    return Math.round((processed / total) * 100);
}

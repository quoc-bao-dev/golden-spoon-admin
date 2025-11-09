import { useCallback, useRef, useState } from "react";
import { chunkArray, calculateProgress } from "../utils/batchUtils";

/**
 * Kết quả xử lý cho mỗi item
 */
export interface BatchResult<TOutput> {
    input: any; // Input item gốc (ID hoặc object)
    success: boolean; // Thành công hay thất bại
    data?: TOutput; // Dữ liệu response nếu thành công
    error?: Error | any; // Lỗi nếu thất bại
}

/**
 * Thông tin về quá trình xử lý
 */
export interface ProcessInfo {
    isProcessing: boolean;
    currentBatch: number; // Batch đang xử lý (1-based)
    totalBatches: number; // Tổng số batch
    processedCount: number; // Số item đã xử lý
    totalCount: number; // Tổng số item
    successCount: number; // Số item thành công
    failedCount: number; // Số item thất bại
    currentBatchItems: any[]; // Items trong batch hiện tại
    results: BatchResult<any>[]; // Kết quả chi tiết của tất cả items
    progress: number; // Tiến trình (0-100)
}

/**
 * Cấu hình cho batch processor
 */
export interface BatchProcessorConfig<TInput, TOutput> {
    batchSize: number; // Số lượng item xử lý trong 1 batch
    delayBetweenBatches?: number; // Delay (ms) giữa các batch (default: 0)
    onBatchStart?: (batch: TInput[]) => void;
    onBatchComplete?: (results: BatchResult<TOutput>[]) => void;
    onItemComplete?: (item: TInput, result: BatchResult<TOutput>) => void;
    onError?: (error: Error, item: TInput) => void;
    onComplete?: (allResults: BatchResult<TOutput>[]) => void;
}

/**
 * Hook xử lý batch processing
 *
 * @param processFn - Hàm xử lý từng item, nhận vào item và index, trả về Promise
 * @param config - Cấu hình cho batch processor
 * @returns Object chứa process function, cancel function, reset function và processInfo
 *
 * @example
 * ```tsx
 * const { process, cancel, reset, processInfo } = useBatchProcessor(
 *   async (id) => await loginAccount(id),
 *   {
 *     batchSize: 5,
 *     delayBetweenBatches: 100,
 *     onBatchComplete: (results) => {
 *       console.log('Batch completed:', results);
 *     },
 *     onComplete: (allResults) => {
 *       console.log('All batches completed:', allResults);
 *     }
 *   }
 * );
 *
 * // Sử dụng
 * await process(['id1', 'id2', 'id3']);
 * ```
 */
export function useBatchProcessor<TInput, TOutput>(
    processFn: (item: TInput, index: number) => Promise<TOutput>,
    config: BatchProcessorConfig<TInput, TOutput>
) {
    const [processInfo, setProcessInfo] = useState<ProcessInfo>({
        isProcessing: false,
        currentBatch: 0,
        totalBatches: 0,
        processedCount: 0,
        totalCount: 0,
        successCount: 0,
        failedCount: 0,
        currentBatchItems: [],
        results: [],
        progress: 0,
    });

    const isCancelledRef = useRef(false);
    const currentPromiseRef = useRef<Promise<BatchResult<TOutput>[]> | null>(
        null
    );

    /**
     * Reset state về ban đầu
     */
    const reset = useCallback(() => {
        isCancelledRef.current = false;
        setProcessInfo({
            isProcessing: false,
            currentBatch: 0,
            totalBatches: 0,
            processedCount: 0,
            totalCount: 0,
            successCount: 0,
            failedCount: 0,
            currentBatchItems: [],
            results: [],
            progress: 0,
        });
    }, []);

    /**
     * Hủy quá trình đang chạy
     */
    const cancel = useCallback(() => {
        isCancelledRef.current = true;
        setProcessInfo((prev) => ({
            ...prev,
            isProcessing: false,
            currentBatchItems: [],
        }));
    }, []);

    /**
     * Xử lý một batch
     */
    const processBatch = async (
        batch: TInput[],
        batchIndex: number,
        globalIndex: number
    ): Promise<BatchResult<TOutput>[]> => {
        if (isCancelledRef.current) {
            return [];
        }

        // Callback onBatchStart
        config.onBatchStart?.(batch);

        // Update processInfo - batch đang xử lý
        setProcessInfo((prev) => ({
            ...prev,
            currentBatch: batchIndex + 1,
            currentBatchItems: batch,
        }));

        // Xử lý tất cả items trong batch đồng thời
        const batchPromises = batch.map(async (item, itemIndex) => {
            try {
                const data = await processFn(item, globalIndex + itemIndex);
                const result: BatchResult<TOutput> = {
                    input: item,
                    success: true,
                    data,
                };

                // Callback onItemComplete
                config.onItemComplete?.(item, result);

                return result;
            } catch (error) {
                const result: BatchResult<TOutput> = {
                    input: item,
                    success: false,
                    error:
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                };

                // Callback onError
                config.onError?.(
                    error instanceof Error ? error : new Error(String(error)),
                    item
                );

                // Callback onItemComplete
                config.onItemComplete?.(item, result);

                return result;
            }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        const results: BatchResult<TOutput>[] = batchResults.map((result) =>
            result.status === "fulfilled"
                ? result.value
                : {
                      input: null,
                      success: false,
                      error: new Error("Promise rejected"),
                  }
        );

        // Update processInfo sau khi batch hoàn thành
        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.length - successCount;

        setProcessInfo((prev) => {
            const newProcessedCount = prev.processedCount + results.length;
            const newSuccessCount = prev.successCount + successCount;
            const newFailedCount = prev.failedCount + failedCount;

            return {
                ...prev,
                processedCount: newProcessedCount,
                successCount: newSuccessCount,
                failedCount: newFailedCount,
                results: [...prev.results, ...results],
                progress: calculateProgress(newProcessedCount, prev.totalCount),
                currentBatchItems: [], // Clear sau khi batch xong
            };
        });

        // Callback onBatchComplete
        config.onBatchComplete?.(results);

        return results;
    };

    /**
     * Bắt đầu xử lý tất cả items
     */
    const process = useCallback(
        async (items: TInput[]): Promise<BatchResult<TOutput>[]> => {
            if (items.length === 0) {
                return [];
            }

            // Reset state
            isCancelledRef.current = false;
            const batches = chunkArray(items, config.batchSize);

            setProcessInfo({
                isProcessing: true,
                currentBatch: 0,
                totalBatches: batches.length,
                processedCount: 0,
                totalCount: items.length,
                successCount: 0,
                failedCount: 0,
                currentBatchItems: [],
                results: [],
                progress: 0,
            });

            const allResults: BatchResult<TOutput>[] = [];
            let globalIndex = 0;

            // Xử lý từng batch tuần tự
            for (let i = 0; i < batches.length; i++) {
                if (isCancelledRef.current) {
                    break;
                }

                const batch = batches[i];
                const batchResults = await processBatch(batch, i, globalIndex);
                allResults.push(...batchResults);
                globalIndex += batch.length;

                // Delay giữa các batch (trừ batch cuối cùng)
                if (
                    i < batches.length - 1 &&
                    config.delayBetweenBatches &&
                    config.delayBetweenBatches > 0
                ) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, config.delayBetweenBatches)
                    );
                }
            }

            // Update processInfo - hoàn thành
            setProcessInfo((prev) => ({
                ...prev,
                isProcessing: false,
                currentBatch: 0,
                currentBatchItems: [],
                progress: 100,
            }));

            // Callback onComplete
            config.onComplete?.(allResults);

            return allResults;
        },
        [processFn, config]
    );

    return {
        process,
        cancel,
        reset,
        processInfo,
    };
}

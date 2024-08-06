export function sleep(us) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Calculate remaining microseconds and wait in a busy loop
            const start = performance.now();
            while (performance.now() - start < us / 1000) {
                // Busy-wait loop to handle the remaining microseconds
            }
            resolve();
        }, Math.floor(us / 1000));
    });
}
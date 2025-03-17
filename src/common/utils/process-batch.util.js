export const processInBatches = async (tasks, batchSize = 20) => {
    const results = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize);
        console.log(`Processing batch: ${i / batchSize + 1}`);

        // eslint-disable-next-line no-await-in-loop
        const batchResults = await Promise.allSettled(batch.map((task) => task()));

        results.push(...batchResults);
    }

    return results;
};

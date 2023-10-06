export const cacheWithAsyncRefresh = async asyncSupplier => {
  let value;

  const asyncRefresh = async () => (value = await asyncSupplier());

  // Warm cache
  await asyncRefresh();

  return () => {
    asyncRefresh().catch(console.error);

    return value;
  };
};

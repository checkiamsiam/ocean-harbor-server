export const generateNewID = (
  prefix: string,
  lastIdWithSignatures: string
): string => {
  const lastId = lastIdWithSignatures
    ? lastIdWithSignatures.slice(2)
    : (0).toString().padStart(6, "0");
  const incrementedId = (parseInt(lastId) + 1).toString().padStart(6, "0");
  return `${prefix}${incrementedId}`;
};

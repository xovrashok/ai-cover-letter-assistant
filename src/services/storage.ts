export interface StorageData {
  apiKey: string;
  resume: string;
}

export const getStorageData = async (): Promise<StorageData> => {
  const result = await chrome.storage.local.get({
    apiKey: "",
    resume: "",
  });
  return { apiKey: result.apiKey as string, resume: result.resume as string };
};

export const saveStorageData = async (
  apiKey: string,
  resume: string,
): Promise<void> => {
  await chrome.storage.local.set({ apiKey, resume });
};

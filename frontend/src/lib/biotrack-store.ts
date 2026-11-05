
export type WasteRecord = {
  id: string;
  department: string;
  category: string;
  quantity: number;
  unit: string;
  date: string;
  notes: string;
};

export type ContainerRecord = {
  id: string;
  wasteId: string;
  department: string;
  category: string;
  quantity: number;
  status: string;
  createdAt: string;
};

export type CollectionRecord = {
  id: string;
  containerId: string;
  collector: string;
  vehicle: string;
  status: string;
  date: string;
};

export type HandoverRecord = {
  id: string;
  containerId: string;
  facility: string;
  receiver: string;
  status: string;
  date: string;
};

export type ActivityRecord = {
  id: string;
  action: string;
  user: string;
  date: string;
};

export type BioTrackData = {
  wasteRecords: WasteRecord[];
  containers: ContainerRecord[];
  collectionRecords: CollectionRecord[];
  handoverRecords: HandoverRecord[];
  activities: ActivityRecord[];
};

const STORAGE_KEY = "biotrack-data";

const emptyData: BioTrackData = {
  wasteRecords: [],
  containers: [],
  collectionRecords: [],
  handoverRecords: [],
  activities: [],
};

export function getBioTrackData(): BioTrackData {
  if (typeof window === "undefined") return emptyData;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyData, ...JSON.parse(saved) } : emptyData;
  } catch {
    return emptyData;
  }
}

export function saveBioTrackData(data: BioTrackData): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  window.dispatchEvent(new Event("biotrack-data-updated"));
}

export function subscribeToBioTrackData(
  callback: () => void
): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("biotrack-data-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("biotrack-data-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

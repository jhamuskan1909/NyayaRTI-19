import { RtiApplicationData } from "@/types/rti";
import { TrackedApplication, TrackedStatus } from "@/types/tracker";

const STORAGE_KEY = "nyayarti_tracked_applications_v1";

function uuid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readAll(): TrackedApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(apps: TrackedApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

export function getTrackedApplications(): TrackedApplication[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getTrackedApplication(id: string): TrackedApplication | undefined {
  return readAll().find((a) => a.id === id);
}

export function trackApplication(rtiData: RtiApplicationData): TrackedApplication {
  const now = new Date().toISOString();
  const app: TrackedApplication = {
    id: uuid(),
    title: rtiData.subject || rtiData.publicAuthority || "Untitled RTI Application",
    stage: rtiData.stage,
    publicAuthority: rtiData.publicAuthority || "Unspecified Authority",
    applicantName: rtiData.applicantName || "Unspecified Applicant",
    status: "drafted",
    filedDate: null,
    responseDeadline: null,
    isLifeOrLiberty: rtiData.isLifeOrLiberty ?? false,
    respondedDate: null,
    appealFiledDate: null,
    appealDeadline: null,
    rtiData,
    createdAt: now,
    updatedAt: now,
  };
  const apps = readAll();
  apps.push(app);
  writeAll(apps);
  return app;
}

export function updateTrackedApplication(
  id: string,
  patch: Partial<TrackedApplication>
): TrackedApplication | null {
  const apps = readAll();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  apps[idx] = { ...apps[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(apps);
  return apps[idx];
}

export function deleteTrackedApplication(id: string) {
  writeAll(readAll().filter((a) => a.id !== id));
}

export function markFiled(id: string, isLifeOrLiberty = false, filedDate: string = new Date().toISOString()) {
  const filed = new Date(filedDate);
  const deadline = new Date(filed);
  if (isLifeOrLiberty) {
    deadline.setHours(deadline.getHours() + 48);
  } else {
    deadline.setDate(deadline.getDate() + 30);
  }
  return updateTrackedApplication(id, {
    status: "filed",
    filedDate,
    isLifeOrLiberty,
    responseDeadline: deadline.toISOString(),
  });
}

export function markResponded(id: string, respondedDate: string = new Date().toISOString()) {
  return updateTrackedApplication(id, { status: "responded", respondedDate });
}

export function markAppealed(id: string, appealFiledDate: string = new Date().toISOString()) {
  const appealDeadline = new Date(appealFiledDate);
  appealDeadline.setDate(appealDeadline.getDate() + 30);
  return updateTrackedApplication(id, {
    status: "appealed",
    appealFiledDate,
    appealDeadline: appealDeadline.toISOString(),
  });
}

export function markClosed(id: string) {
  return updateTrackedApplication(id, { status: "closed" });
}

export function refreshOverdueStatuses(): TrackedApplication[] {
  const apps = readAll();
  const now = new Date();
  let changed = false;
  const updated = apps.map((a) => {
    if (a.status === "filed" && a.responseDeadline && new Date(a.responseDeadline) < now) {
      changed = true;
      return { ...a, status: "overdue" as TrackedStatus, updatedAt: now.toISOString() };
    }
    return a;
  });
  if (changed) writeAll(updated);
  return updated.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
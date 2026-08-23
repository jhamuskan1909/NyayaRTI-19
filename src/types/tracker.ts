import { RtiApplicationData, RtiStage } from "@/types/rti";

export type TrackedStatus =
  | "drafted"
  | "filed"
  | "overdue"
  | "responded"
  | "appealed"
  | "closed";

export interface TrackedApplication {
  id: string;
  title: string;              // derived label, e.g. subject or publicAuthority
  stage: RtiStage;            // section6_application | first_appeal_19_1 | inspection_2_j
  publicAuthority: string;
  applicantName: string;

  status: TrackedStatus;
  filedDate: string | null;
  responseDeadline: string | null;   // filedDate + 30d, or +48h if life/liberty
  isLifeOrLiberty: boolean;

  respondedDate: string | null;
  appealFiledDate: string | null;
  appealDeadline: string | null;

  rtiData: RtiApplicationData;  // full snapshot, so it can be re-exported/re-edited later

  createdAt: string;
  updatedAt: string;
}
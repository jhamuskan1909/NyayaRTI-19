export type RtiStage = 'section6_application' | 'first_appeal_19_1' | 'inspection_2_j';

export type AppealGround = 
  | 'no_response_30_days'
  | 'incomplete_misleading_info'
  | 'unlawful_exemption_sec8'
  | 'excessive_fee_demanded'
  | 'refusal_to_accept_application';

export interface FirstAppealDetails {
  originalRtiRegNo: string;
  originalRtiDate: string;
  originalPioName: string;
  originalPioAddress: string;
  groundOfAppeal: AppealGround;
  groundDescription: string;
  reliefSought: string;
  firstAppellateAuthority: string;
}

export interface InspectionDetails {
  proposedDates: string;
  specificWorksOrFiles: string;
  samplesRequested: boolean;
  sampleDescription: string;
}

export interface RtiApplicationData {
  stage: RtiStage;
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  isBpl: boolean;
  bplCardNo: string;
  isLifeOrLiberty: boolean;
  publicAuthority: string;
  department: string;
  pioDesignation: string;
  pioAddress: string;
  subject: string;
  timePeriod: string;
  queries: string[];
  applicationFeeMode: 'IPO (Indian Postal Order)' | 'Court Fee Stamp' | 'Online Portal Payment' | 'Demand Draft' | 'BPL (Exempt)';
  feeDetails: string;
  declarations: {
    isCitizen: boolean;
    nonExemptSec8: boolean;
    sec6Clause3Transfer: boolean;
  };
  stateOrCentral: 'Central Government' | 'State Government';
  stateName?: string;
  firstAppeal?: FirstAppealDetails;
  inspection?: InspectionDetails;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  statusUpdate?: string;
  stageSuggested?: RtiStage;
}

export interface ExtractionResponse {
  replyMessage: string;
  clarifyingQuestions?: string[];
  updatedRti: Partial<RtiApplicationData>;
  missingFields: string[];
  categoryDetected?: string;
  modelUsed?: string;
  stageSuggested?: RtiStage;
}
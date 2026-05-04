export interface MergeOptions {
  pageBreakBetween?: boolean;
  pageBreakHtml?: string;
}

export interface MergeProgress {
  current: number;
  total: number;
  fileName?: string;
}

export interface MergeError {
  message: string;
  fileIndex?: number;
  originalError?: unknown;
}

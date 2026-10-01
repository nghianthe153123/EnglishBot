import type { LookupOutcome, Provider, WordResult } from '@englishbot/api-contracts';

export type PopupView =
  { state: 'loading'; text: string } | { state: 'result'; text: string; outcome: LookupOutcome };

export interface BatchView {
  snapshotId: string;
  thresholdSnapshot: number;
  state: 'unsent' | 'unavailable' | 'unknown' | 'verified-mock';
  items: readonly WordResult[];
  importText: string;
  setId?: string;
  setUrl?: string;
  accountId?: string;
}

export interface PopupProps {
  view: PopupView;
  added: boolean;
  adding: boolean;
  addMessage: string;
  onClose: () => void;
  onRetry: () => void;
  onOptions: () => void;
  onAdd: () => void;
}

export interface OptionsProps {
  provider: Provider | null;
  threshold: string;
  thresholdError: string;
  keyConfigured: boolean;
  onProvider: (provider: Provider) => void;
  onThreshold: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export interface QueueProps {
  words: readonly WordResult[];
  batches: readonly BatchView[];
  threshold: number | null;
  onOptions: () => void;
}

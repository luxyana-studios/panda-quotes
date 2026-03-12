import { Platform } from 'react-native';

// Dynamically require react-native-iap so a missing/unavailable native module
// is caught at runtime instead of crashing the JS bundle on import.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let iap: any = null;
try {
  iap = require('react-native-iap');
} catch {
  // Native module not available (e.g. Expo Go). All functions will no-op gracefully.
}

// ─── Re-exported types (shapes only — no native runtime needed) ───────────────

export type TipProduct = {
  id: string;
  displayPrice: string;
};

export type TipPurchase = {
  id?: string;
  purchaseToken?: string;
};

export type TipPurchaseError = {
  code: string;
  message: string;
};

export type UnsubscribeFn = () => void;

// ─── Tier definitions ─────────────────────────────────────────────────────────

export type TipTier = {
  sku: string;
  fallbackPrice: string;
  emoji: string;
  title: string;
  description: string;
};

export const TIP_TIERS: TipTier[] = [
  {
    sku: 'panda_tip_099',
    fallbackPrice: '$0.99',
    emoji: '🍃',
    title: 'A bamboo leaf',
    description: 'A small token of gratitude',
  },
  {
    sku: 'panda_tip_199',
    fallbackPrice: '$1.99',
    emoji: '🍵',
    title: 'A cup of green tea',
    description: 'Keep the wisdom flowing',
  },
  {
    sku: 'panda_tip_499',
    fallbackPrice: '$4.99',
    emoji: '🐾',
    title: "A panda's gratitude",
    description: 'Support future adventures',
  },
];

export const TIP_SKUS = TIP_TIERS.map((t) => t.sku);

// ─── Listener registration (keeps react-native-iap out of screen components) ──

export function onPurchaseUpdated(
  cb: (purchase: TipPurchase) => void
): UnsubscribeFn {
  if (!iap?.purchaseUpdatedListener) return () => {};
  const sub = iap.purchaseUpdatedListener(cb);
  return () => sub.remove();
}

export function onPurchaseError(
  cb: (error: TipPurchaseError) => void
): UnsubscribeFn {
  if (!iap?.purchaseErrorListener) return () => {};
  const sub = iap.purchaseErrorListener(cb);
  return () => sub.remove();
}

export function isUserCancelledError(code: string): boolean {
  // ErrorCode.UserCancelled = 'user-cancelled'
  return code === 'user-cancelled';
}

// ─── IAP lifecycle ────────────────────────────────────────────────────────────

export async function initializeIAP(): Promise<boolean> {
  if (!iap?.initConnection) return false;
  try {
    await iap.initConnection();
    return true;
  } catch {
    return false;
  }
}

export async function fetchTipProducts(): Promise<TipProduct[]> {
  if (!iap?.fetchProducts) return [];
  try {
    const result = await iap.fetchProducts({ skus: TIP_SKUS, type: 'in-app' });
    return (result ?? []) as TipProduct[];
  } catch {
    return [];
  }
}

export async function purchaseTip(sku: string): Promise<void> {
  if (!iap?.requestPurchase) throw new Error('IAP not available');
  const request = Platform.select({
    ios: { apple: { sku } },
    android: { google: { skus: [sku] } },
    default: { apple: { sku } },
  });
  await iap.requestPurchase({ request, type: 'in-app' });
}

export async function completePurchase(purchase: TipPurchase): Promise<void> {
  if (!iap?.finishTransaction) return;
  await iap.finishTransaction({ purchase, isConsumable: true });
}

export function cleanupIAP(): void {
  iap?.endConnection?.();
}

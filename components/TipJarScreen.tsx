import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  initializeIAP,
  fetchTipProducts,
  purchaseTip,
  completePurchase,
  cleanupIAP,
  onPurchaseUpdated,
  onPurchaseError,
  isUserCancelledError,
  TIP_TIERS,
  type TipTier,
  type TipProduct,
  type TipPurchase,
  type TipPurchaseError,
} from '@/services/tipjar';

interface TipJarScreenProps {
  onBack: () => void;
}

// ─── Sanctuary colour palette ──────────────────────────────────────────────────
const C = {
  bg:           '#171210',   // deep forest floor
  surface:      '#221b11',   // card surface
  surfaceHigh:  '#2c2416',   // elevated card
  gold:         '#c9974a',   // warm candlelight gold
  goldSoft:     'rgba(201,151,74,0.15)',
  sage:         '#90b889',   // muted bamboo sage
  sageSoft:     'rgba(144,184,137,0.14)',
  earth:        '#9b7b5a',   // warm earth
  earthSoft:    'rgba(155,123,90,0.16)',
  cream:        '#f0e6cf',   // warm parchment white
  creamHalf:    'rgba(240,230,207,0.55)',
  creamFaint:   'rgba(240,230,207,0.22)',
  creamGhost:   'rgba(240,230,207,0.08)',
  hairline:     'rgba(240,230,207,0.10)',
} as const;

const TIER_PALETTE = [
  { accent: C.sage,  soft: C.sageSoft  },
  { accent: C.gold,  soft: C.goldSoft  },
  { accent: C.earth, soft: C.earthSoft },
] as const;

const EASE_OUT    = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASE_SPRING = Easing.bezier(0.34, 1.15, 0.64, 1);

type ScreenState = 'loading' | 'ready' | 'purchasing' | 'success' | 'error';

// ─── Reusable ornament ────────────────────────────────────────────────────────
function Ornament({ width = '60%' }: { width?: string }) {
  return (
    <View style={[o.row, { width: width as `${number}%` }]}>
      <View style={o.line} />
      <View style={o.dotWrap}>
        <View style={o.dot} />
        <View style={[o.dot, o.dotMid]} />
        <View style={o.dot} />
      </View>
      <View style={o.line} />
    </View>
  );
}
const o = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  line:   { flex: 1, height: 1, backgroundColor: C.hairline },
  dotWrap:{ flexDirection: 'row', gap: 3, alignItems: 'center' },
  dot:    { width: 3, height: 3, borderRadius: 2, backgroundColor: C.creamFaint },
  dotMid: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(201,151,74,0.5)' },
});

// ─── Main component ───────────────────────────────────────────────────────────
export function TipJarScreen({ onBack }: TipJarScreenProps) {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<ScreenState>('loading');
  const [products, setProducts] = useState<TipProduct[]>([]);
  const [purchasingSku, setPurchasingSku] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ── Avatar breathing glow ──────────────────────────────────────────
  const glowScale  = useSharedValue(1);
  const glowOp     = useSharedValue(0.35);

  // ── Staggered content reveal ───────────────────────────────────────
  const heroOp   = useSharedValue(0); const heroY   = useSharedValue(28);
  const letterOp = useSharedValue(0); const letterY = useSharedValue(22);
  const labelOp  = useSharedValue(0);
  const t0Op     = useSharedValue(0); const t0Y     = useSharedValue(16);
  const t1Op     = useSharedValue(0); const t1Y     = useSharedValue(16);
  const t2Op     = useSharedValue(0); const t2Y     = useSharedValue(16);
  const footerOp = useSharedValue(0);

  const heroStyle   = useAnimatedStyle(() => ({ opacity: heroOp.value,   transform: [{ translateY: heroY.value   }] }));
  const letterStyle = useAnimatedStyle(() => ({ opacity: letterOp.value, transform: [{ translateY: letterY.value }] }));
  const labelStyle  = useAnimatedStyle(() => ({ opacity: labelOp.value  }));
  const t0Style     = useAnimatedStyle(() => ({ opacity: t0Op.value,     transform: [{ translateY: t0Y.value     }] }));
  const t1Style     = useAnimatedStyle(() => ({ opacity: t1Op.value,     transform: [{ translateY: t1Y.value     }] }));
  const t2Style     = useAnimatedStyle(() => ({ opacity: t2Op.value,     transform: [{ translateY: t2Y.value     }] }));
  const footerStyle = useAnimatedStyle(() => ({ opacity: footerOp.value }));
  const glowStyle   = useAnimatedStyle(() => ({ transform: [{ scale: glowScale.value }], opacity: glowOp.value }));

  const tierAnimStyles = [t0Style, t1Style, t2Style];

  function startGlow() {
    glowScale.value = withRepeat(
      withTiming(1.12, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      -1, true
    );
    glowOp.value = withRepeat(
      withTiming(0.55, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      -1, true
    );
  }

  function animateIn() {
    const fast   = { duration: 640, easing: EASE_OUT };
    const spring = { duration: 580, easing: EASE_SPRING };

    heroOp.value   = withDelay(80,   withTiming(1, fast));
    heroY.value    = withDelay(80,   withTiming(0, spring));

    letterOp.value = withDelay(300,  withTiming(1, fast));
    letterY.value  = withDelay(300,  withTiming(0, spring));

    labelOp.value  = withDelay(480,  withTiming(1, fast));

    t0Op.value     = withDelay(560,  withTiming(1, fast));
    t0Y.value      = withDelay(560,  withTiming(0, spring));

    t1Op.value     = withDelay(700,  withTiming(1, fast));
    t1Y.value      = withDelay(700,  withTiming(0, spring));

    t2Op.value     = withDelay(840,  withTiming(1, fast));
    t2Y.value      = withDelay(840,  withTiming(0, spring));

    footerOp.value = withDelay(1080, withTiming(1, fast));
  }

  // ── IAP lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    startGlow();

    const unsubPurchase = onPurchaseUpdated(async (purchase: TipPurchase) => {
      if (!mounted) return;
      try {
        await completePurchase(purchase);
        setState('success');
        setPurchasingSku(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        setState('error');
        setPurchasingSku(null);
        setErrorMessage('Could not complete your purchase. Please try again.');
      }
    });

    const unsubError = onPurchaseError((error: TipPurchaseError) => {
      if (!mounted) return;
      setPurchasingSku(null);
      if (!isUserCancelledError(error.code)) {
        setState('error');
        setErrorMessage('Something went wrong. Please try again.');
      } else {
        setState('ready');
      }
    });

    async function init() {
      const connected = await initializeIAP();
      if (!mounted) return;
      if (!connected) {
        setState('error');
        setErrorMessage('In-app purchases are not available on this device.');
        animateIn();
        return;
      }
      const fetched = await fetchTipProducts();
      if (!mounted) return;
      setProducts(fetched);
      setState('ready');
      animateIn();
    }

    init();
    return () => {
      mounted = false;
      unsubPurchase();
      unsubError();
      cleanupIAP();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTip(tier: TipTier) {
    if (state === 'purchasing') return;
    setState('purchasing');
    setPurchasingSku(tier.sku);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await purchaseTip(tier.sku);
    } catch {
      setState('ready');
      setPurchasingSku(null);
    }
  }

  function getPrice(tier: TipTier): string {
    const product = products.find((p) => p.id === tier.sku);
    return product?.displayPrice ?? tier.fallbackPrice;
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/* Deep atmospheric glows */}
      <View style={s.glowCenter} />
      <View style={s.glowTopRight} />
      <View style={s.glowBottomLeft} />

      {/* Back */}
      <Pressable
        style={[s.back, { top: insets.top + 16 }]}
        onPress={onBack}
        hitSlop={20}
      >
        <Text style={s.backArrow}>←</Text>
        <Text style={s.backLabel}>Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 72, paddingBottom: insets.bottom + 56 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* ══ LOADING ═══════════════════════════════════════════════ */}
        {state === 'loading' && (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={C.gold} />
            <Text style={s.loadingText}>opening the grove…</Text>
          </View>
        )}

        {/* ══ SUCCESS ═══════════════════════════════════════════════ */}
        {state === 'success' && (
          <Animated.View style={[s.successWrap, { opacity: heroOp }]}>
            <View style={s.successGlowRing}>
              <Text style={s.successEmoji}>🐼</Text>
            </View>
            <Text style={s.successKanji}>深謝</Text>
            <Text style={s.successTitle}>With deep gratitude</Text>
            <Ornament width="50%" />
            <Text style={s.successMsg}>
              Hagu bows to the forest floor. Your kindness keeps the bamboo
              alive — and the quiet wisdom flowing for all who wander through.
            </Text>
            <Pressable style={s.continueBtn} onPress={onBack}>
              <Text style={s.continueBtnText}>Continue the journey</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}
        {state !== 'loading' && state !== 'success' && (
          <>
            {/* ── Hero ──────────────────────────────────────────── */}
            <Animated.View style={[s.hero, heroStyle]}>
              {/* Outermost ghost ring */}
              <View style={s.ringGhost}>
                {/* Breathing glow disc */}
                <Animated.View style={[s.glowDisc, glowStyle]} />
                {/* Gold ring */}
                <View style={s.ringGold}>
                  {/* Photo */}
                  <View style={s.avatarFrame}>
                    <Image
                      source={require('@/assets/modi.jpeg')}
                      style={s.avatar}
                      contentFit="cover"
                    />
                  </View>
                </View>
              </View>

              <Text style={s.heroName}>H A G U</Text>
              <Text style={s.heroSub}>the panda philosopher</Text>
              <View style={s.heroTagRow}>
                <View style={s.heroTag}><Text style={s.heroTagText}>🎋 daily wisdom</Text></View>
                <View style={s.heroTagDot} />
                <View style={s.heroTag}><Text style={s.heroTagText}>🍵 mindfulness</Text></View>
              </View>
              <Ornament width="55%" />
            </Animated.View>

            {/* ── Letter ────────────────────────────────────────── */}
            <Animated.View style={[s.letter, letterStyle]}>
              <Text style={s.letterQuote}>"</Text>
              <Text style={s.letterBody}>
                Every morning you paused. You breathed. You listened. That
                quiet moment — that small ritual — is what this app lives for.
              </Text>
              <Text style={s.letterBody2}>
                If Hagu's words have found you in a still moment and stayed,
                consider leaving something behind. Keep the grove alive.
              </Text>
              <View style={s.letterDivider} />
              <Text style={s.letterSign}>— Hagu the Panda</Text>
            </Animated.View>

            {/* ── Section label ─────────────────────────────────── */}
            <Animated.View style={[s.sectionRow, labelStyle]}>
              <View style={s.sectionLine} />
              <Text style={s.sectionText}>CHOOSE AN OFFERING</Text>
              <View style={s.sectionLine} />
            </Animated.View>

            {/* ── Tier cards ────────────────────────────────────── */}
            {TIP_TIERS.map((tier, i) => {
              const isPurchasing = purchasingSku === tier.sku;
              const { accent, soft } = TIER_PALETTE[i];
              const isFeatured = i === 1;

              return (
                <Animated.View
                  key={tier.sku}
                  style={[s.tierWrap, tierAnimStyles[i]]}
                >
                  {isFeatured && (
                    <View style={s.featuredTab}>
                      <Text style={s.featuredTabText}>✦  most beloved</Text>
                    </View>
                  )}

                  <Pressable
                    style={[
                      s.tierCard,
                      { borderTopColor: accent, backgroundColor: isFeatured ? C.surfaceHigh : C.surface },
                      isFeatured && s.tierCardFeatured,
                      state === 'purchasing' && !isPurchasing && s.tierDim,
                    ]}
                    onPress={() => handleTip(tier)}
                    disabled={state === 'purchasing'}
                    android_ripple={{ color: soft, borderless: false }}
                  >
                    {isPurchasing ? (
                      <View style={s.tierLoadingRow}>
                        <ActivityIndicator color={accent} size="small" />
                        <Text style={[s.tierLoadingText, { color: accent }]}>
                          Processing…
                        </Text>
                      </View>
                    ) : (
                      <View style={s.tierInner}>
                        {/* Left: emoji slab */}
                        <View style={[s.emojiSlab, { backgroundColor: soft }]}>
                          <Text style={s.tierEmoji}>{tier.emoji}</Text>
                        </View>

                        {/* Center: text */}
                        <View style={s.tierText}>
                          <Text style={s.tierTitle}>{tier.title}</Text>
                          <Text style={s.tierDesc}>{tier.description}</Text>
                        </View>

                        {/* Right: price */}
                        <View style={s.priceWrap}>
                          <Text style={[s.priceAmount, { color: accent }]}>
                            {getPrice(tier)}
                          </Text>
                          <Text style={s.priceCta}>tap to give</Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}

            {/* ── Error ─────────────────────────────────────────── */}
            {state === 'error' && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{errorMessage}</Text>
                <Pressable onPress={() => { setState('ready'); setErrorMessage(''); }}>
                  <Text style={s.errorDismiss}>Dismiss</Text>
                </Pressable>
              </View>
            )}

            {/* ── Footer ────────────────────────────────────────── */}
            <Animated.View style={[s.footer, footerStyle]}>
              <Ornament width="40%" />
              <Text style={s.footerText}>
                All offerings are one-time. No subscriptions.{'\n'}
                Your kindness is held with care. 🐾
              </Text>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  // Root & background
  root: { flex: 1, backgroundColor: C.bg },
  glowCenter: {
    position: 'absolute', top: '20%', left: '15%',
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(201,151,74,0.04)',
  },
  glowTopRight: {
    position: 'absolute', top: -60, right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(144,184,137,0.04)',
  },
  glowBottomLeft: {
    position: 'absolute', bottom: -100, left: -60,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(201,151,74,0.03)',
  },

  // Back button
  back: {
    position: 'absolute', left: 20, zIndex: 20,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  backArrow: { color: C.creamHalf, fontSize: 18 },
  backLabel: { color: C.creamHalf, fontSize: 14, fontWeight: '500', letterSpacing: 0.4 },

  // Scroll
  scroll: { alignItems: 'center', paddingHorizontal: 20, gap: 20 },

  // Loading
  loadingWrap: { minHeight: 360, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: C.creamFaint, fontSize: 13, fontStyle: 'italic', letterSpacing: 1 },

  // Hero
  hero: { alignItems: 'center', gap: 12, width: '100%' },

  ringGhost: {
    width: 172, height: 172, borderRadius: 86,
    borderWidth: 1, borderColor: C.creamGhost,
    alignItems: 'center', justifyContent: 'center',
  },
  glowDisc: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(201,151,74,0.12)',
  },
  ringGold: {
    width: 152, height: 152, borderRadius: 76,
    borderWidth: 2, borderColor: 'rgba(201,151,74,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFrame: {
    width: 136, height: 136, borderRadius: 68,
    overflow: 'hidden',
    borderWidth: 3, borderColor: 'rgba(201,151,74,0.35)',
    shadowColor: C.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  avatar: { width: '100%', height: '100%' },

  heroName: {
    fontSize: 28, fontWeight: '800',
    color: C.cream, letterSpacing: 10, marginTop: 6,
  },
  heroSub: {
    fontSize: 11, color: C.creamFaint,
    letterSpacing: 3.5, textTransform: 'uppercase',
    marginTop: -6,
  },
  heroTagRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 2, marginBottom: 6,
  },
  heroTag: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: C.hairline,
  },
  heroTagText: { color: C.creamHalf, fontSize: 11, letterSpacing: 0.3 },
  heroTagDot: {
    width: 3, height: 3, borderRadius: 2,
    backgroundColor: C.creamFaint,
  },

  // Letter card
  letter: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 24,
    width: '100%',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(201,151,74,0.45)',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  letterQuote: {
    fontSize: 48, lineHeight: 38,
    color: C.gold, fontWeight: '900',
    opacity: 0.5, marginBottom: -4,
  },
  letterBody: {
    fontSize: 15, lineHeight: 24,
    color: C.cream, letterSpacing: 0.15,
  },
  letterBody2: {
    fontSize: 15, lineHeight: 24,
    color: C.creamHalf, fontStyle: 'italic', letterSpacing: 0.15,
  },
  letterDivider: {
    height: 1, backgroundColor: C.hairline, marginVertical: 4,
  },
  letterSign: {
    fontSize: 13, color: C.gold,
    fontWeight: '600', textAlign: 'right',
    letterSpacing: 0.4, opacity: 0.8,
  },

  // Section separator
  sectionRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, width: '100%',
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.hairline },
  sectionText: {
    color: C.creamFaint, fontSize: 10,
    letterSpacing: 3.5, fontWeight: '600',
  },

  // Tier cards
  tierWrap: { width: '100%' },

  featuredTab: {
    alignSelf: 'center',
    backgroundColor: C.gold,
    paddingHorizontal: 14, paddingVertical: 5,
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    marginBottom: -2,
    zIndex: 1,
  },
  featuredTabText: {
    color: C.bg, fontSize: 10,
    fontWeight: '800', letterSpacing: 2,
    textTransform: 'uppercase',
  },

  tierCard: {
    borderRadius: 16, borderTopWidth: 2,
    paddingVertical: 18, paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 5,
    minHeight: 80,
  },
  tierCardFeatured: {
    borderTopLeftRadius: 0, borderTopRightRadius: 0,
  },
  tierDim: { opacity: 0.4 },

  tierInner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  emojiSlab: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  tierEmoji: { fontSize: 24 },

  tierText: { flex: 1, gap: 3 },
  tierTitle: {
    fontSize: 15, fontWeight: '700',
    color: C.cream, letterSpacing: 0.1,
  },
  tierDesc: {
    fontSize: 12, color: C.creamHalf, letterSpacing: 0.1,
  },

  priceWrap: { alignItems: 'flex-end', gap: 2 },
  priceAmount: {
    fontSize: 18, fontWeight: '800', letterSpacing: 0.3,
  },
  priceCta: {
    fontSize: 10, color: C.creamFaint,
    letterSpacing: 1, textTransform: 'uppercase',
  },

  tierLoadingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, minHeight: 44,
  },
  tierLoadingText: { fontSize: 14, fontStyle: 'italic' },

  // Error
  errorBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14, padding: 18,
    alignItems: 'center', gap: 10, width: '100%',
    borderWidth: 1, borderColor: C.hairline,
  },
  errorText: {
    color: C.creamHalf, fontSize: 14,
    textAlign: 'center', lineHeight: 20,
  },
  errorDismiss: {
    color: C.cream, fontSize: 13,
    fontWeight: '600', textDecorationLine: 'underline', opacity: 0.7,
  },

  // Footer
  footer: { alignItems: 'center', gap: 14, width: '100%', marginTop: 4 },
  footerText: {
    fontSize: 12, color: C.creamFaint,
    textAlign: 'center', lineHeight: 19, letterSpacing: 0.2,
  },

  // Continue button (success)
  continueBtn: {
    marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(201,151,74,0.45)',
    paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  continueBtnText: {
    color: C.cream, fontSize: 15,
    fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Success
  successWrap: {
    flex: 1, alignItems: 'center',
    gap: 20, paddingHorizontal: 24,
    minHeight: 500, justifyContent: 'center',
  },
  successGlowRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(201,151,74,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,151,74,0.3)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 6,
  },
  successEmoji: { fontSize: 56 },
  successKanji: {
    fontSize: 13, color: C.gold,
    letterSpacing: 6, fontWeight: '300', opacity: 0.6,
  },
  successTitle: {
    fontSize: 28, fontWeight: '700',
    color: C.cream, letterSpacing: 0.5, textAlign: 'center',
  },
  successMsg: {
    fontSize: 15, lineHeight: 25,
    color: C.creamHalf, textAlign: 'center',
    fontStyle: 'italic', maxWidth: 300, letterSpacing: 0.2,
  },
});

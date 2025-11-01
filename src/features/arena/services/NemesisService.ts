export interface NemesisStatBlock {
  mentalStrength: number;
  motivation: number;
  triggerDefense: number;
  addictionLevel: number;
  cravingsResisted: number;
  streakDays: number;
  streakDisplayText: string;
}

export interface NemesisProfile {
  heroName: string;
  archetype: string;
  avatar: string;
  stats: NemesisStatBlock;
  achievements: string[];
  tagline: string;
  isAITarget: boolean;
  specialFeatures: string[];
}

export interface NemesisInput {
  userHeroName?: string | null;
  userArchetype?: string | null;
  userAvatarSeed?: string | null;
  userStats?: Partial<NemesisStatBlock> | null;
  lastRelapseDate?: string | null;
  quitDate?: string | null;
  cravingsResisted?: number | null;
}

const DEFAULT_STATS: NemesisStatBlock = {
  mentalStrength: 60,
  motivation: 55,
  triggerDefense: 45,
  addictionLevel: 45,
  cravingsResisted: 12,
  streakDays: 7,
  streakDisplayText: '7 days',
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deriveStreakDisplay(streakDays: number): string {
  if (streakDays < 1) {
    return '0 hours';
  }

  return streakDays === 1 ? '1 day' : `${streakDays} days`;
}

function computeStreakDays(lastRelapseDate?: string | null, quitDate?: string | null): number {
  const reference = lastRelapseDate || quitDate;
  if (!reference) {
    return DEFAULT_STATS.streakDays;
  }

  const parsed = new Date(reference);
  if (Number.isNaN(parsed.getTime())) {
    return DEFAULT_STATS.streakDays;
  }

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return clamp(diffDays + 2, 1, 999);
}

function generateAvatar(seed: string): string {
  const baseUrl = 'https://api.dicebear.com/7.x/bottts/svg';
  const params = new URLSearchParams({
    seed,
    backgroundColor: '0f172a',
    radius: '40',
  });
  return `${baseUrl}?${params.toString()}`;
}

function deriveNemesisStats(input?: Partial<NemesisStatBlock> | null, cravingsResisted?: number | null, streakMeta?: { lastRelapseDate?: string | null; quitDate?: string | null }): NemesisStatBlock {
  const base = input ?? {};

  const streakDays = computeStreakDays(streakMeta?.lastRelapseDate, streakMeta?.quitDate);
  const streakDisplayText = deriveStreakDisplay(streakDays);

  return {
    mentalStrength: clamp((base.mentalStrength ?? DEFAULT_STATS.mentalStrength) + 8, 40, 100),
    motivation: clamp((base.motivation ?? DEFAULT_STATS.motivation) + 6, 35, 100),
    triggerDefense: clamp((base.triggerDefense ?? DEFAULT_STATS.triggerDefense) + 5, 25, 95),
    addictionLevel: clamp((base.addictionLevel ?? DEFAULT_STATS.addictionLevel) - 4, 10, 90),
    cravingsResisted: clamp((cravingsResisted ?? base.cravingsResisted ?? DEFAULT_STATS.cravingsResisted) + 5, 0, 9999),
    streakDays,
    streakDisplayText,
  };
}

function deriveSpecialFeatures(stats: NemesisStatBlock): string[] {
  const features: string[] = [];

  if (stats.mentalStrength >= 75) {
    features.push('Iron Will Protocol');
  }
  if (stats.triggerDefense >= 60) {
    features.push('Trigger Anticipation Matrix');
  }
  if (stats.motivation >= 70) {
    features.push('Relapse Forecast HUD');
  }
  if (features.length === 0) {
    features.push('Adaptive Breathing Shield');
  }

  return features;
}

export function createNemesisProfile(input: NemesisInput = {}): NemesisProfile {
  const heroName = input.userHeroName ? `${input.userHeroName}'s Nemesis` : 'Nemesis AI';
  const seed = input.userAvatarSeed || heroName;
  const stats = deriveNemesisStats(input.userStats, input.cravingsResisted, {
    lastRelapseDate: input.lastRelapseDate,
    quitDate: input.quitDate,
  });

  return {
    heroName,
    archetype: 'Shadow Rival',
    avatar: generateAvatar(`nemesis-${seed}`),
    stats,
    achievements: ['relapseSentinel', 'hydrationMaster'],
    tagline: 'An adaptive rival that mirrors your growth and pushes you forward.',
    isAITarget: true,
    specialFeatures: deriveSpecialFeatures(stats),
  };
}


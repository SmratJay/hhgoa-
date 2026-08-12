export type ContributionTier = 1 | 2 | 3 | 4 | 5;

export interface TierMetadata {
  tier: ContributionTier;
  label: string;
  minContributions: number;
  maxContributions: number | null;
  asset: string;
  visualDescription: string;
}

export const tierAssets: Record<ContributionTier, string> = {
  1: "/images-hut/tier1.png",
  2: "/images-hut/tier2.png",
  3: "/images-hut/tier3.png",
  4: "/images-hut/tier4.png",
  5: "/images-hut/tier5.png",
};

const tierMetadata: Record<ContributionTier, TierMetadata> = {
  1: {
    tier: 1,
    label: "Fresh Arrival",
    minContributions: 0,
    maxContributions: 99,
    asset: tierAssets[1],
    visualDescription: "Very sparse shack with only a few props stocked.",
  },
  2: {
    tier: 2,
    label: "Beach Regular",
    minContributions: 100,
    maxContributions: 499,
    asset: tierAssets[2],
    visualDescription: "Low to moderate stocking for a consistent builder.",
  },
  3: {
    tier: 3,
    label: "Night Shipper",
    minContributions: 500,
    maxContributions: 799,
    asset: tierAssets[3],
    visualDescription: "Moderate to high shack density with more visible supplies.",
  },
  4: {
    tier: 4,
    label: "Heavy Contributor",
    minContributions: 800,
    maxContributions: 1499,
    asset: tierAssets[4],
    visualDescription: "High density shack for a serious GitHub grind.",
  },
  5: {
    tier: 5,
    label: "Cracked Dev",
    minContributions: 1500,
    maxContributions: null,
    asset: tierAssets[5],
    visualDescription: "Maximum density shack for elite commit energy.",
  },
};

export function getContributionTier(contributions: number): ContributionTier {
  const safeContributions = Math.max(0, Math.floor(contributions));

  if (safeContributions < 100) return 1;
  if (safeContributions < 500) return 2;
  if (safeContributions < 800) return 3;
  if (safeContributions < 1500) return 4;
  return 5;
}

export function getTierMetadata(tier: ContributionTier): TierMetadata {
  return tierMetadata[tier];
}

export function getPintsFromCommits(commits: number): number {
  return Math.round(Math.max(0, Math.floor(commits)) / 5);
}


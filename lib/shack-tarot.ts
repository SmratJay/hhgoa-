export interface TarotArchetype {
  name: string;
  subtitle: string;
  description: string;
  stats: {
    label: string;
    value: number; // 0 to 100
  }[];
  perk: string;
  alignment: string;
  weaponOfChoice: string;
  quest: string;
  weakness: string;
  quote: string;
  codingHours: string;
}

export function getTarotArchetype(commits: number): TarotArchetype {
  if (commits < 100) {
    return {
      name: "The Sunbathing Lurker",
      subtitle: "Silent Observer of the Sand",
      description: "You thrive on the gentle sea breeze and passive absorption of ideas. You are storing energy for a massive build session, waiting for the tide to turn.",
      stats: [
        { label: "Beach Chill", value: 95 },
        { label: "Caffeine Drive", value: 20 },
        { label: "Terminal Speed", value: 15 },
        { label: "Sand Resistance", value: 85 }
      ],
      perk: "+20% Networking, Immune to Sunburn",
      alignment: "Neutral Peaceful",
      weaponOfChoice: "iPad Pro in a Ziploc bag",
      quest: "Finding a hammock with a strong enough Wi-Fi signal from the nearby cafe.",
      weakness: "Sudden low-tide warnings and highly persuasive coconut vendors.",
      quote: "\"Why compile code now when the ocean is compiling waves at 60 Hz?\"",
      codingHours: "12:00 PM – 2:00 PM (Between dips)"
    };
  } else if (commits < 500) {
    return {
      name: "The Arambol Solopreneur",
      subtitle: "Casual Builder & Cafe Dweller",
      description: "Armed with a laptop and a coconut, you build products directly from beach beds. You appreciate clean code but value the sunset view more.",
      stats: [
        { label: "Beach Chill", value: 80 },
        { label: "Caffeine Drive", value: 55 },
        { label: "Terminal Speed", value: 45 },
        { label: "Sand Resistance", value: 60 }
      ],
      perk: "+15% Wi-Fi Hunting, Unlimited Coconuts",
      alignment: "Chaotic Creative",
      weaponOfChoice: "Refurbished MacBook Air + polarized sunglasses",
      quest: "Launching a micro-SaaS to automate calculating beach bed rentals.",
      weakness: "Power cuts during production deploys and distraction from drum circles.",
      quote: "\"I ship on public Wi-Fi because danger makes the API calls faster.\"",
      codingHours: "4:00 PM – 6:30 PM (Sun-downer shift)"
    };
  } else if (commits < 800) {
    return {
      name: "The FOSS Beachcomber",
      subtitle: "Steady Contributor to the Sands",
      description: "A seasoned builder who leaves no trace but clean commits. You love open-source, solve pull requests between surf sessions, and write sandproof code.",
      stats: [
        { label: "Beach Chill", value: 60 },
        { label: "Caffeine Drive", value: 70 },
        { label: "Terminal Speed", value: 65 },
        { label: "Sand Resistance", value: 75 }
      ],
      perk: "+30% PR Review Speed, Sandproof Keyboard",
      alignment: "Lawful Sandbox",
      weaponOfChoice: "ThinkPad running Arch Linux covered in stickers",
      quest: "Refactoring a 10k LOC legacy repository to run entirely on edge servers.",
      weakness: "Unresolvable merge conflicts and salt water corrosion on USB ports.",
      quote: "\"Fork the beach. Merge the sunset. Pull requests welcome.\"",
      codingHours: "8:00 AM – 11:30 AM (Morning clarity)"
    };
  } else if (commits < 1500) {
    return {
      name: "The Midnight-Oil Shipper",
      subtitle: "Night-Owl Architect of Goa",
      description: "While others party on the beaches of Anjuna, you optimize compiler routines. You thrive in the dark, fueled by lofi beats, caffeine, and raw focus.",
      stats: [
        { label: "Beach Chill", value: 30 },
        { label: "Caffeine Drive", value: 90 },
        { label: "Terminal Speed", value: 85 },
        { label: "Sand Resistance", value: 40 }
      ],
      perk: "+50% Night Focus, Moonlit Aura",
      alignment: "Chaotic Caffeinated",
      weaponOfChoice: "Custom split keyboard + dual 4K monitors in a dark hotel room",
      quest: "Building a localized devnet that bypasses regional connectivity outages.",
      weakness: "Strong morning sunlight and chirping tropical birds.",
      quote: "\"The code compile logs look much cleaner when lit by the moon.\"",
      codingHours: "11:00 PM – 4:30 AM (Extreme silence)"
    };
  } else {
    return {
      name: "The Legendary Sand-Lord",
      subtitle: "Unstoppable Demigod of Commits",
      description: "You eat syntax errors for breakfast and compile entire ecosystems in your head. Your keyboard is smoking, and your commit activity is legendary.",
      stats: [
        { label: "Beach Chill", value: 10 },
        { label: "Caffeine Drive", value: 99 },
        { label: "Terminal Speed", value: 99 },
        { label: "Sand Resistance", value: 90 }
      ],
      perk: "Absolute Domination, Keyboard Sparkle Effect",
      alignment: "Ascended Developer",
      weaponOfChoice: "Vim run directly through mind waves and a custom mechanical grid",
      quest: "Rewriting the underlying transport layer of the internet to run on beach sand.",
      weakness: "Literally none, except maybe running out of black coffee.",
      quote: "\"I don't find bugs. Bugs find me and apologize.\"",
      codingHours: "24/7 (Sleep is just a background thread)"
    };
  }
}

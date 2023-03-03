import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  DiscordIcon,
  MediumIcon,
  YoutubeIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.spaceinvaders-swap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/spaceinvaders-swap",
      },
      {
        label: "Community",
        href: "https://docs.spaceinvaders-swap.finance/contact-us/telegram",
      },
      {
        label: "INVA",
        href: "https://docs.spaceinvaders-swap.finance/tokenomics/inva",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://spaceinvaders-swap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.spaceinvaders-swap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.spaceinvaders-swap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.spaceinvaders-swap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/spaceinvaders-swap",
      },
      {
        label: "Documentation",
        href: "https://docs.spaceinvaders-swap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@spaceinvaders-swap-1/s/spaceinvaders-swap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.spaceinvaders-swap.finance/help/faq#is-spaceinvaders-swap-safe-has-spaceinvaders-swap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.spaceinvaders-swap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/spaceinvaders-swap",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/spaceinvaders-swap",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/SpaceinvadersSwapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/SpaceinvadersSwap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/SpaceinvadersSwapVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/spaceinvaders-swap_ita",
      },
      {
        label: "русский",
        href: "https://t.me/spaceinvaders-swap_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/spaceinvaders-swapturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/SpaceinvadersSwapPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/SpaceinvadersswapEs",
      },
      {
        label: "日本語",
        href: "https://t.me/spaceinvaders-swapjp",
      },
      {
        label: "Français",
        href: "https://t.me/spaceinvaders-swapfr",
      },
      {
        label: "Deutsch",
        href: "https://t.me/SpaceinvadersSwap_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/Spaceinvadersswap_Ph",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/SpaceinvadersSwapGeorgia",
      },
      {
        label: "हिन्दी",
        href: "https://t.me/SpaceinvadersSwapINDIA",
      },
      {
        label: "Announcements",
        href: "https://t.me/SpaceinvadersSwapAnn",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/spaceinvaders-swap",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/spaceinvaders-swap_official",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/spaceinvaders-swap/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/spaceinvaders-swap",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://medium.com/spaceinvaders-swap",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@spaceinvaders-swap_official",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));

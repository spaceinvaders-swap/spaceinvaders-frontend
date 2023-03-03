import { ContextApi } from "@spaceinvaders-swap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("About"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.spaceinvaders-swap.finance/contact-us",
        isHighlighted: true,
      },
      {
        label: t("Brand"),
        href: "https://docs.spaceinvaders-swap.finance/brand",
      },
      {
        label: t("Blog"),
        href: "https://medium.com/spaceinvaders-swap",
      },
      {
        label: t("Community"),
        href: "https://docs.spaceinvaders-swap.finance/contact-us/telegram",
      },
      {
        label: t("Litepaper"),
        href: "https://v2litepaper.spaceinvaders-swap.finance/",
      },
    ],
  },
  {
    label: t("Help"),
    items: [
      {
        label: t("Customer Support"),
        href: "https://docs.spaceinvaders-swap.finance/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.spaceinvaders-swap.finance/help/troubleshooting",
      },
      {
        label: t("Guides"),
        href: "https://docs.spaceinvaders-swap.finance/get-started",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: "Github",
        href: "https://github.com/spaceinvaders-swap",
      },
      {
        label: t("Documentation"),
        href: "https://docs.spaceinvaders-swap.finance",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.spaceinvaders-swap.finance/code/bug-bounty",
      },
      {
        label: t("Audits"),
        href: "https://docs.spaceinvaders-swap.finance/help/faq#is-spaceinvaders-swap-safe-has-spaceinvaders-swap-been-audited",
      },
      {
        label: t("Careers"),
        href: "https://docs.spaceinvaders-swap.finance/hiring/become-a-chef",
      },
    ],
  },
];

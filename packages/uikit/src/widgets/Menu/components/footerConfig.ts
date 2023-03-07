import { ContextApi } from "@offsideswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("About"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.offsideswap.finance/contact-us",
        isHighlighted: true,
      },
      {
        label: t("Brand"),
        href: "https://docs.offsideswap.finance/brand",
      },
      {
        label: t("Blog"),
        href: "https://blog.offsideswap.finance/",
      },
      {
        label: t("Community"),
        href: "https://docs.offsideswap.finance/contact-us/telegram",
      },
      {
        label: t("Litepaper"),
        href: "https://v2litepaper.offsideswap.finance/",
      },
    ],
  },
  {
    label: t("Help"),
    items: [
      {
        label: t("Customer Support"),
        href: "https://docs.offsideswap.finance/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.offsideswap.finance/help/troubleshooting",
      },
      {
        label: t("Guides"),
        href: "https://docs.offsideswap.finance/get-started",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: "Github",
        href: "https://github.com/offsideswap",
      },
      {
        label: t("Documentation"),
        href: "https://docs.offsideswap.finance",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.offsideswap.finance/code/bug-bounty",
      },
      {
        label: t("Audits"),
        href: "https://docs.offsideswap.finance/help/faq#is-offsideswap-safe-has-offsideswap-been-audited",
      },
      {
        label: t("Careers"),
        href: "https://docs.offsideswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

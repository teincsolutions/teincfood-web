import type { MetadataRoute } from "next";
import { siteConfig, storeLinks } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  const playStoreUrl = storeLinks.buyer.playStore;
  const playId = playStoreUrl.match(/[?&]id=([^&]+)/)?.[1];

  return {
    name: siteConfig.name,
    short_name: "Teinc Food",
    description: siteConfig.description,
    id: `${siteConfig.url}/`,
    start_url: `${siteConfig.url}/`,
    scope: `${siteConfig.url}/`,
    display: "standalone",
    background_color: "#FFF9F5",
    theme_color: "#FF7622",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    related_applications: playId
      ? [
          {
            platform: "play",
            url: playStoreUrl,
            id: playId,
          },
        ]
      : undefined,
  };
}
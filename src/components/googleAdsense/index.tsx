import React, { useEffect } from "react";
import { useSiteMetadata } from "../queries";
import { PageProps } from "gatsby";

interface AdsenseAutoProps {
  currentPath?: string;
}

export const AdsenseAuto: React.FC<AdsenseAutoProps> = (props) => {
  const { currentPath } = props;
  const { adsense } = { ...useSiteMetadata() };

  useEffect(() => {
    if (window) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, [currentPath]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={adsense?.clientKey}
      data-ad-slot={adsense?.slot1}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

interface AdsenseHoriProps {
  currentPath: string;
}

export const AdsenseHori: React.FC<AdsenseHoriProps> = (props) => {
  const { currentPath } = props;
  const { adsense } = { ...useSiteMetadata() };

  useEffect(() => {
    if (window) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, [currentPath]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={adsense?.clientKey}
      data-ad-slot={adsense?.slot1}
      data-ad-format="horizontal"
      data-full-width-responsive="true"
    />
  );
};

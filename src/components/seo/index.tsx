/**
 * Seo component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useSiteMetadata } from "../queries";

interface SeoProps {
  title?: string | null;
  description?: string | null;
  pathname?: string;
  children?: React.ReactNode;
  type?: string;
  noindex?: boolean;
  keywords?: string[];
}

const Seo: React.FC<SeoProps> = (props) => {
  const siteMetadata = useSiteMetadata();

  const seo = {
    title: props.title || siteMetadata.title!,
    description: props.description || siteMetadata.description!,
    image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    url: `${siteMetadata.siteUrl}${props.pathname || ""}`,
    twitterUsername: `${siteMetadata.social?.twitter}`,
    index: props.noindex ? `noindex follow` : `index, follow`,
    type: props.type || "article",
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="robots" content={seo.index} />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"
      />
      <meta
        name="google-site-verification"
        content="VlqJHuoT2MVEQTHfsITxNCg6bOLvmXMQnCxegBEQ3rk"
      />
      <meta name="description" content={seo.description} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:locate" content="ja_JP" />
      <meta name="og:type" content={seo.type} />
      <meta name="og:url" content={seo.url} />
      <meta name="og:image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      {props.keywords && (
        <meta name="keywords" content={props.keywords.join(`,`)} />
      )}
      {props.children}
    </>
  );
};

export default Seo;

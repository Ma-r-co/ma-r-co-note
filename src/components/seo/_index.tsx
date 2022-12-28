/**
 * Seo component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import icon from "../../images/moai_icon_grayed.png";

interface SeoProps {
  description: string;
  lang: string;
  url?: string;
  meta: (
    | { name: string; content: string | null | undefined; property?: undefined }
    | {
        property: string;
        content: string | null | undefined;
        name?: undefined;
      }
  )[];
  keywords: string[];
  title?: string;
  image: string;
  type: string;
  noindex: boolean;
}

const defaultProps: SeoProps = {
  description: ``,
  lang: `ja`,
  meta: [],
  keywords: [],
  image: icon,
  type: `article`,
  noindex: false,
};

const Seo: React.FC<SeoProps> = (props = defaultProps) => {
  const {
    description,
    lang,
    url,
    meta,
    keywords,
    title,
    image,
    type,
    noindex,
  } = props;
  const { site }: Queries.SeoQuery = useStaticQuery(
    graphql`
      query Seo {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  );

  const metaDescription = description || site?.siteMetadata?.description;
  const index = noindex ? `noindex follow` : `index, follow`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      meta={[
        {
          name: `robots`,
          content: `${index}`,
        },
        {
          name: `viewport`,
          content: `width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0`,
        },
        {
          name: `google-site-verification`,
          content: `VlqJHuoT2MVEQTHfsITxNCg6bOLvmXMQnCxegBEQ3rk`,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:locate`,
          content: `ja_JP`,
        },
        {
          property: `og:type`,
          content: type,
        },
        {
          property: `og:url`,
          content: `${url}`,
        },
        {
          property: `og:image`,
          content: `${site?.siteMetadata?.siteUrl}${image}`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:site`,
          content: `@${site?.siteMetadata?.author}`,
        },
        {
          name: `twitter:creator`,
          content: `@${site?.siteMetadata?.author}`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  );
};

export default Seo;

import { useStaticQuery, graphql } from "gatsby";

export const useSiteMetadata = () => {
  const { site }: Queries.SiteQuery = useStaticQuery(
    graphql`
      query Site {
        site {
          siteMetadata {
            title
            description
            image
            author
            siteUrl
            social {
              twitter
              github
            }
            siteRecaptchaKey
            adsense {
              clientKey
              slot1
            }
          }
        }
      }
    `
  );
  return site!.siteMetadata!;
};

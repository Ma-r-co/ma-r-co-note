import type { GatsbyConfig, graphql } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Ma-r-co note`,
    author: `Ma-r-co`,
    description: `競技プログラミング, Python, React, Fintech, AML/CFTについての技術ブログです.`,
    image: "/icons/icon-512x512.png",
    siteUrl: `https://marco-note.net`,
    social: {
      twitter: `@marco_marticus`,
      github: `Ma-r-co`,
    },
    siteRecaptchaKey: "6LdGn6IZAAAAALP1ZCquqx_vOw64Di7ghraKV5dJ",
    adsense: {
      clientKey: "ca-pub-7416328580394075",
      slot1: "4572443902",
    },
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: ["/tags/*"],
      },
    },
    `gatsby-plugin-slug`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://marco-note.net`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: 80,
              icon: false,
              maintainCase: false,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-emojis`,
            options: {
              active: true,
              class: "emoji-icon",
              size: 64,
              styles: {
                display: "inline",
                margin: "0",
                "margin-top": "0px",
                "margin-right": "3px",
                "margin-left": "3px",
                position: "relative",
                top: "5px",
                width: "20px",
              },
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener",
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: "gatsby-remark-katex",
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        // The option defaults to true
        checkSupportedExtensions: false,
      },
    },
    // {
    //   resolve: `gatsby-plugin-feed`,
    //   options: {
    //     query: `
    //     {
    //       site {
    //         siteMetadata {
    //           title
    //           description
    //           siteUrl
    //           site_url: siteUrl
    //         }
    //       }
    //     }
    //   `,
    //     feeds: [
    //       {
    //         serialize: ({ query: { site, allMarkdownRemark } }) => {
    //           return allMarkdownRemark.edges.map(edge => {
    //             return Object.assign({}, edge.node.frontmatter, {
    //               description: edge.node.excerpt,
    //               date: edge.node.frontmatter.date,
    //               url:
    //                 site.siteMetadata.siteUrl +
    //                 `/${edge.node.frontmatter.slug}/`,
    //               guid:
    //                 site.siteMetadata.siteUrl +
    //                 `/${edge.node.frontmatter.slug}/`,
    //               custom_elements: [{ "content:encoded": edge.node.html }],
    //             })
    //           })
    //         },
    //         query: `
    //         {
    //           allMarkdownRemark(
    //             sort: { order: DESC, fields: [frontmatter___date] },
    //           ) {
    //             edges {
    //               node {
    //                 excerpt
    //                 html
    //                 fields { slug }
    //                 frontmatter {
    //                   title
    //                   date
    //                   slug
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       `,
    //         output: "/rss.xml",
    //         title: "Ma-r-co RSS Feed",
    //       },
    //     ],
    //   },
    // },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ma-r-co note`,
        short_name: `Ma-r-co note`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#3AAFA9`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/moai_icon_grayed.png`,
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-offline`,
    "gatsby-plugin-netlify",
  ],
};

export default config;

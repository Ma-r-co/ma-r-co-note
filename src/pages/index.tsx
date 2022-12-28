import React from "react";
import styled from "styled-components";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import Blog from "../components/blog";
import Polygon from "../components/polygon";
import { AdsenseAuto } from "../components/googleAdsense";
// import Image from "gatsby-image"

/* ===============================================
#  page component
=============================================== */
const Wrapper = styled.div`
  background: var(--background);
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 370px;
  padding-top: 25px;
  padding-bottom: 75px;
  z-index: 999;
  .message {
    position: absolute;
    width: 100%;
    padding: 0 10px;
    max-width: var(--width);
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    text-align: center;
    height: var(--topHeight);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #ffffff;
    z-index: 9999;
    h1 {
      font-size: 1.8rem;
      text-transform: uppercase;
      font-weight: 600;
    }
    .gatsby-image-wrapper {
      border-radius: 50%;
      opacity: 0.8;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
  .inner {
    .adsbygoogle {
      margin-bottom: 25px;
    }
  }
  @media screen and (max-width: 780px) {
    margin-bottom: 40px;
  }
`;

interface BlogIndexProps {
  data: Queries.BlogIndexQuery;
  location: PageProps["location"];
}

const BlogIndex: React.FC<BlogIndexProps> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges;
  const { title, description } = data.site!.siteMetadata!;
  return (
    <Layout location={location}>
      <Polygon
        height="370px"
        background="linear-gradient(45deg, #2B7A78 0%, #17252A 74%)"
      />
      <Wrapper>
        <div className="message">
          {/* <Image fixed={data.avatar.childImageSharp.fixed} alt="author" /> */}
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="inner">
          <div>
            <AdsenseAuto />
          </div>
          {posts.map(({ node }) => {
            return (
              <Blog
                title={node.frontmatter?.title || location.toString()}
                key={node.fields?.slug}
                slug={`/${node.frontmatter?.slug}/`}
                date={node.frontmatter?.date || "2000-01-01"}
                description={node.frontmatter?.description}
                excerpt={node.excerpt || ""}
                tags={
                  node.frontmatter?.tags
                    ? Array.from(node.frontmatter.tags)
                    : []
                }
              />
            );
          })}
          <div>
            <AdsenseAuto />
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
};

export default BlogIndex;

interface HeadProps {}

export const Head: React.FC<HeadProps> = () => {
  return <Seo />;
};

export const pageQuery = graphql`
  query BlogIndex {
    site {
      siteMetadata {
        title
        description
      }
    }
    avatar: file(absolutePath: { regex: "/tony.jpg/" }) {
      childImageSharp {
        fixed(width: 80, height: 80) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            description
            tags
            slug
          }
        }
      }
    }
  }
`;

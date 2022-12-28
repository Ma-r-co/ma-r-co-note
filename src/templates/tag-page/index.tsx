import React from "react";
import { FaHashtag } from "react-icons/fa";
import { graphql, HeadProps, PageProps } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Blog from "../../components/blog";
import Wrapper from "./style";

interface TagPageTemplateProps {
  data: Queries.TagPageTemplateQuery;
  location: PageProps["location"];
  pageContext: {
    slug: string;
  };
}

const TagPageTemplate: React.FC<TagPageTemplateProps> = ({
  data,
  location,
  pageContext,
}) => {
  const tagName = pageContext.slug;
  const posts = data.allMarkdownRemark.edges;
  return (
    <Layout location={location}>
      <Wrapper className="inner">
        <div className="top">
          <h1>
            <FaHashtag />
            <span>{tagName}</span>
          </h1>
          <p>
            <b>{posts.length}</b>件の投稿があります
          </p>
        </div>
        {posts.map(({ node }) => {
          const title = node.frontmatter?.title || node.fields?.slug;
          return (
            <Blog
              title={title || ""}
              key={node.fields?.slug}
              slug={`/${node.frontmatter?.slug}/`}
              date={node.frontmatter?.date || "2000-01-01"}
              description={node.frontmatter?.description}
              excerpt={node.excerpt || ""}
              tags={Array.from(node.frontmatter?.tags || [])}
            />
          );
        })}
      </Wrapper>
    </Layout>
  );
};

export default TagPageTemplate;

export const Head: React.FC<
  HeadProps<Queries.TagPageTemplateQuery, { slug: string }>
> = (props) => {
  const tagName = props.pageContext.slug;

  return (
    <Seo
      title={`タグ: ${tagName}`}
      description={`${tagName}タグを含む記事の一覧ページです`}
      noindex
    />
  );
};

export const pageQuery = graphql`
  query TagPageTemplate($slug: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$slug] } } }
      sort: { frontmatter: { date: DESC } }
      limit: 1000
    ) {
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

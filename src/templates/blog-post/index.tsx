import React from "react";
import { graphql, HeadProps, PageProps } from "gatsby";
import rehypeReact from "rehype-react";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { Tags } from "../../components/modules";
import Paging from "../../components/paging-single";
import Share from "../../components/share";
import Toc from "../../components/toc";
import Related, { Latest } from "../../components/related";
import Wrapper from "./style";
import { AdsenseAuto, AdsenseHori } from "../../components/googleAdsense";
import type { RelatedPost, LatestPost, Post } from "../../types/Post";

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    adsense: AdsenseHori,
  },
}).Compiler;

interface BlogPostTemplateProps {
  data: Queries.BlogPostBySlugQuery;
  location: PageProps["location"];
  pageContext: {
    slug: string;
    relatedPosts: RelatedPost[];
    latestPosts: LatestPost[];
    previous: Post["node"] | null;
    next: Post["node"] | null;
  };
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data,
  location,
  pageContext,
}) => {
  const post = data.markdownRemark!;
  const site = data.site?.siteMetadata;
  const siteTitle = data.site?.siteMetadata?.title;
  const { previous, next } = pageContext;
  return (
    <Layout location={location}>
      <Wrapper className="inner">
        <article>
          <div className="info">
            <div className="date">{post.frontmatter?.date}</div>
            <h1>{post.frontmatter?.title}</h1>
            <Tags tags={Array.from(post.frontmatter!.tags!)} />
          </div>
          <Toc data={data.markdownRemark?.tableOfContents || ""} />
          {/* <section dangerouslySetInnerHTML={{ __html: post.html }} /> */}
          <section>{renderAst(post.htmlAst)}</section>
          <Share
            title={post.frontmatter?.title || ""}
            url={`${site?.siteUrl}/${post.frontmatter?.slug}/`}
          />
          <AdsenseAuto />
          {pageContext.relatedPosts.length === 0 ? (
            <Latest latest={pageContext.latestPosts} />
          ) : (
            <Related
              related={pageContext.relatedPosts}
              latest={pageContext.latestPosts}
            />
          )}
        </article>
        <Paging
          prev={{
            slug: previous ? `/${previous.frontmatter.slug}/` : "",
            title: previous ? previous.frontmatter.title : "",
          }}
          next={{
            slug: next ? `/${next.frontmatter.slug}/` : "",
            title: next ? next.frontmatter.title : "",
          }}
        />
      </Wrapper>
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head: React.FC<HeadProps<Queries.BlogPostBySlugQuery>> = (
  props
) => {
  const post = props.data.markdownRemark;
  return (
    <Seo
      title={post?.frontmatter?.title}
      description={post?.frontmatter?.description || post?.excerpt}
      pathname={props.location.pathname}
    />
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
        tags
        slug
      }
      htmlAst
    }
  }
`;

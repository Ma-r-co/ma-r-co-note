import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import styled from "styled-components"
import { FaGithub, FaTwitter, FaRss, FaSitemap } from "react-icons/fa"
import { useSiteMetadata } from "../queries"
import {GatsbyImage} from "gatsby-plugin-image"

const Wrapper = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  z-index: 9999999;
  padding: 20px 0;
  margin-top: auto;
  justify-content: center;
  background: var(--background);
  margin: 0;
  color: var(--primaryGray);
  .upper-inner {
    margin: auto;
    font-size: 0.9rem;
    display: flex;
    width: 100%;
    max-width: var(--width);
    a {
      text-decoration: none;
      color: var(--primaryGray);
      margin-right: 35px;
    }
    a:hover {
      color: var(--text);
    }
    .right {
      margin-left: auto;
      display: flex;
      align-items: center;
      a {
        font-size: 1.1rem;
        text-decoration: none;
        margin-right: 35px;
        font-weight: 600;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .lower-inner {
    font-size: 0.9rem;
    width: 100%;
    padding: 0 auto;
  }
  @media screen and (max-width: 780px) {
    .upper-inner {
      padding: 0 10px;
      padding-bottom: 10px;
      flex-direction: column-reverse;
      .right {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
      }
    }
  }
`

const Feedly = () => {
  return (
    <StaticQuery
      query={graphql`
        query FeedlyQuery {
          avatar: file(absolutePath: { regex: "/feedly.png/" }) {
            childImageSharp {
              fixed(width: 22, height: 22) {
                ...GatsbyImageSharpFixed
              }
              gatsbyImageData(layout: FIXED, width: 22, height:22)
            }
          }
        }
      `}
      render={data => <GatsbyImage image={data.avatar.childImageSharp.gatsbyImageData} alt='feedly logo' />}
    />
  )
}

const Footer = () => {
  const { author, social, siteUrl } = useSiteMetadata()
  return (
    <Wrapper>
      <div className="upper-inner">
        <Link to='/contact'>お問合せ</Link>
        <Link to='/disclaimer'>免責事項</Link>
        <Link to='/privacy-policy'>プライバシーポリシー</Link>
        <div className="right">
          {social.twitter !== ""
            ? (
              <a
              href={`https://twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              )
              : ("")}
          {social.github !== "" ? (
            <a
            href={`https://github.com/${social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          ) : (
            ""
            )}
          <a
            href="#TODO"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Feedly />
          </a>
          <a href={`${siteUrl}/sitemap.xml`}>
            <FaSitemap />
          </a>
          <a href={`${siteUrl}/rss.xml`}>
            <FaRss />
          </a>
        </div>
      </div>
      <div className='lower-inner'>
        <address>© {author}. All rights reserved.</address>
      </div>
    </Wrapper>
  )
}

export default Footer

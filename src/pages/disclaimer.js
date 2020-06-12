import React from "react"
import {Link} from 'gatsby'
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Wrapper = styled.div`
  width: var(--width);
  h1 {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 10px 0 30px 0;
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    padding: 20px 0 10px 0;
  }
  p {
    font-size: 1rem;
    padding: 0 0 10px 0;
  }
`

const PrivacyPolicy = ({ location }) => {
  return (
    <Layout location={location} >
      <SEO title="免責事項" noindex />
      <Wrapper className='inner'>
        <h1>免責事項</h1>
        <p>marco-note.net(以下当ブログ)で掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が<Link to='/contact'>お問合せフォーム</Link>よりご連絡下さい。確認後、対応させて頂きます。</p>
        <p>当ブログからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p>
        <p>当ブログのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当ブログに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
      </Wrapper>
    </Layout>
  )
}

export default PrivacyPolicy

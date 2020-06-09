import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Wrapper = styled.div`
  width: var(--width);
  text-align: center;
  h1 {
    font-size: 1.4rem;
    font-weight: 600;
    padding: 10px 0;
  }
  p {
    font-size: 0.9rem;
  }
`

const ThanksPage = (props, location) => (
  <Layout location={location} title="thanks">
    <SEO title="thanks" noindex />
    <Wrapper>
      <h1>Thanks!</h1>
      <p>お問い合せを受け付けました. ありがとうございます.</p>
    </Wrapper>
  </Layout>
)

export default ThanksPage

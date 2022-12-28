import { HeadProps, PageProps } from "gatsby";
import React from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import Seo from "../components/seo";

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
`;
interface NotFoundPageProps {
  location: PageProps["location"];
}

const NotFoundPage: React.FC<NotFoundPageProps> = (props) => (
  <Layout location={props.location}>
    <Wrapper>
      <h1>NOT FOUND</h1>
      <p>ページが見つかりませんでした</p>
    </Wrapper>
  </Layout>
);

export default NotFoundPage;

export const Head: React.FC<HeadProps> = (props) => {
  return <Seo title="NOT FOUND" noindex />;
};

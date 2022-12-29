import React from "react";
import { HeadProps, Link, PageProps } from "gatsby";
import styled from "styled-components";
import Layout from "../components/layout";
import Seo from "../components/seo";

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
`;

interface DisclaimerProps {
  location: PageProps["location"];
}

const Disclaimer: React.FC<DisclaimerProps> = ({ location }) => {
  return (
    <Layout location={location}>
      <Wrapper className="inner">
        <h1>免責事項</h1>
        <p>
          marco-note.net(以下当ブログ)で掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的ではございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が
          <Link to="/contact">お問合せフォーム</Link>
          よりご連絡下さい。確認後、対応させて頂きます。
        </p>
        <p>
          当ブログからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
        </p>
        <p>
          当ブログの情報は、可能な限り正確を期するよう努めておりますが、その内容の正確性や安全性を保障するものではありません。万が一,
          当ブログの情報のご利用等により何らかの不都合や損失が発生したとしても,
          当ブログでは一切の責任を負いかねます。
        </p>
        <p>
          また、当ブログに掲載した情報は、予告なく変更・削除される可能性があります。
        </p>
        <p>あらかじめご了承ください。</p>
      </Wrapper>
    </Layout>
  );
};

export default Disclaimer;

export const Head: React.FC<HeadProps> = (props) => {
  return <Seo title="免責事項" noindex />;
};

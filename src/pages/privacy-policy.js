import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Wrapper = styled.div`
  width: var(--width);
  h1 {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 10px 0;
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
      <Seo title="プライバシーポリシー" noindex />
      <Wrapper className='inner'>
        <h1>プライバシーポリシー</h1>
        <h2>1. 個人情報の利用目的</h2>
        <p>marco-note.net(以下当ブログ)では、お問い合わせ、メールマガジンへの登録などの際に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。</p>
        <p>これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。</p>
        <h2>2.個人情報の第三者への開示</h2>
        <p>当ブログでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p>
        <p>・本人のご了解がある場合</p>
        <p>・法令等への協力のため、開示が必要となる場合</p>
        <h2>3. 個人情報の開示、訂正、追加、削除、利用停止</h2>
        <p>ご本人からの個人データの開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させていただいた上、速やかに対応させていただきます。</p>
        <h2>4.広告の配信について</h2>
        <p>当ブログは第三者配信の広告サービス「Google Adsense グーグルアドセンス」を利用しています。</p>
        <p>広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。
        Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は「<a href="https://www.google.co.jp/policies/technologies/ads/" target="_blank" rel="noopener noreferrer">広告 – ポリシーと規約 – Google</a>」をご覧ください。</p>
        <p>また、当ブログでは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
        第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookie（クッキー）を設定したりこれを認識したりする場合があります
        </p>
        <h2>5. アクセス解析ツールについて</h2>
        <p>当ブログでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。</p>
        <p>このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。Google Analyticsの利用により収集されたデータは、<a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer">Google社のプライバシーポリシー</a>に基づいて管理されます。</p>
        <h2>6. 当ブログへのコメントについて</h2>
        <p>当ブログでは、スパム・荒らしへの対応として、コメントの際に使用されたIPアドレスを記録しています。</p>
        <p>これはブログの標準機能としてサポートされている機能で、スパム・荒らしへの対応以外にこのIPアドレスを使用することはありません。また、メールアドレスとURLの入力に関しては、任意となっております。全てのコメントは管理人が事前にその内容を確認し、承認した上での掲載となりますことをあらかじめご了承下さい。加えて、次の各号に掲げる内容を含むコメントは管理人の裁量によって承認せず、削除する事があります。</p>
        <p>・特定の自然人または法人を誹謗し、中傷するもの。</p>
        <p>・極度にわいせつな内容を含むもの。</p>
        <p>・禁制品の取引に関するものや、他者を害する行為の依頼など、法律によって禁止されている物品、行為の依頼や斡旋などに関するもの。</p>
        <p>・その他、公序良俗に反し、または管理人によって承認すべきでないと認められるもの。</p>
      </Wrapper>
    </Layout>
  )
}

export default PrivacyPolicy

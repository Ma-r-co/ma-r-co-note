---
title: Gatsby - MarkdownページにAdSenseを挿入する方法
date: 2020-11-11T00:00:00.000Z
description: GatsbyのMarkdownで作成したページの途中にAdSenseを挿入する方法をご紹介。
slug: how-to-insert-adsense-to-markdown
tags: 
  - Gatsby
keywords: Gatsby
---

以前に[GatsbyサイトにGoogle AdSenseを導入する方法](/how-to-introduce-adsense-to-gatsby)をご紹介しました。  
その方法では広告を表示したい場所にAdSense用のReactコンポーネントを配置する必要があるため、Markdownでコンテンツを作っている場合はページの途中に広告を表示することができませんでした。  
そこで、今回はMarkdownで作成したページの途中にAdSenseを挿入する方法を説明します。

## アプローチ
`rehype-react`を用いることで、Markdownファイル中の特定のhtmlタグをビルド時にAdSense用コンポーネントで置換します。

```md
<!-- Markdownファイル.md -->

## 1日目
今日はいい天気ですね。〜〜〜〜。

<adsense></adsense>  <!-- このadsenseタグがAdSense用コンポーネントで置換される -->

## 2日目
こんばんは、〇〇です。...........。

```

## 1. 準備
**Google AdSenseスクリプトの挿入**および**AdSense用コンポーネントの準備**はできているものとします。  
未済の場合は[前回記事](/how-to-introduce-adsense-to-gatsby)を参照してください。

## 2. react-hypeのインストール
`rehype-react`をインストールします。
```shell
$ yarn add rehype-react
# or
$ npm install rehype-react
```

<adsense></adsense>

## 3. Markdownページテンプレートにrehype-reactを導入用する
Markdownページのテンプレートを編集していきます。  
今回はGatsbyの公式が提供しているMarkdownページテンプレート`src/templates/blogTemplate.js`を使用して説明します。

### rehypeインスタンスの作成
`rehype-react`とAdSense用コンポーネントをインポートして、rehypeインスタンス(下記では`renderAst`)を作成する。

```jsx
// src/templates/blogTemplate.js

import rehypeReact from 'rehype-react'
import { AdSense } from '../components/adsense/adsense';

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    'adsense': AdSense, // この設定により、adsenseタグがAdSenseコンポーネントに置換される
  },
}).Compiler;

// 以下省略
```

### graphqlで`htmlAst`をクエリする
rehypeインスタンスは`htmlAst`を変換して`html`を生成するため、graphqlで`htmAst`をクエリする。

```jsx
// src/templates/blogTemplate.js

// 省略

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
      htmlAst  // これを追加する
    }
  }
`
```

### `dangerouslySetInnerHTML`をrehypeインスタンスで置き換える
テンプレートではMarkdownコンテンツを挿入する部分が`<div dangerouslySetInnerHTML={{ __html: html }}/>`のようになっているが、ここをrehypeインスタンスで置換して`htmlAst`を描画させる。

```jsx
// src/templates/blogTemplate.js

// 省略

export default function Template({
  data,
}) {
  const { markdownRemark } = data
  const { frontmatter, htmlAst } = markdownRemark  // htmlAstを使用する
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        {/* <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        /> */}
        <div>{renderAst(post.htmlAst)}</div> {/* renderAstに置き換える。引数にhtmlAstを渡す。 */}
      </div>
    </div>
  )
}

// 省略

```


## 4. Markdownページの広告を表示したい場所に`<adsense>`タグを挿入する
あとはMarkdownページのお好みの場所に`<adsense></adsense>`を挿入すれば良い。  
自己終了タグ(`<adsense/>`)では正しく動作しないため注意。

```md
<!-- Markdownファイル.md -->

## 1日目
今日はいい天気ですね。〜〜〜〜。

<adsense></adsense>  <!-- このadsenseタグがAdSense用コンポーネントで置換される -->

## 2日目
こんばんは、〇〇です。...........。

```

以上です。

## 参考
:link: [AdSense in Gatsby](https://www.idesignpixels.com/posts/adsense-in-gatsby)

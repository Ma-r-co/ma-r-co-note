---
title: GatsbyサイトにGoogle AdSenseを導入する方法
date: 2020-11-10T00:00:00.000Z
description: このブログにGoogle Adsenseを導入したのでメモ。プラグインを使わない方法を紹介。
slug: how-to-introduce-adsense-to-gatsby
tags: 
  - Gatsby
keywords: Gatsby
---

最近本ブログにGoogleAdSenseを導入しました。

ネット上の情報を頼りにいろいろと試してみましたが、プラグインがうまく動かず苦労しました。  
四苦八苦した結果なんとか導入できたので、私の方法を紹介します。


## アプローチ
大抵の情報ではプラグインを使用する手順が多いが、前述のようにうまくいかなかったのでプラグイン無しで実装した。

 - 方法1: プラグインを活用 (gatsby-plugin-google-adsense + react-adsense)
 - 方法2: プラグイン無し  **→今回はこちらで**


## 1. Google AdSenseのscriptタグを追加する
`gatsby-plugin-google-adsense`を使えばヨロシクやってくれるはずだが、なぜか私のサイトでは動かない...  
そのため、`src/html.js`を使用して全体テンプレートにscriptタグを直接記入する。


まず, `.cache/default-html.js`を`src`配下にコピーして, `html.js`の雛形とする。
```shell
$ cp -p .cache/default-html.js src/html.js
```
 
そして, scriptタグを挿入する。  
挿入場所はheadタグ内でもbodyタグ内でもどちらでもOK。
```jsx
// src/html.js

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        {/* 省略 */}
      </head>
      <body {...props.bodyAttributes}>
        {/* 省略 */}
        {/* 以下のようにscriptタグを挿入！ */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      </body>
    </html>
  )
}
```

これで`src/html.js`がすべてのページの雛形として使われるため、全ページにスクリプトタグが付与される。  
確認として、`gatsby build`を実行して、ページのソースに上記で挿入したscriptタグが見えればOK。
```shell
$ # gatsby clean を忘れずに
$ gatsby clean
$ gatsby build
$ gatsby serve
```

<adsense></adsense>

## 2. Google AdSense用のコンポーネントを作成する
これも`react-adsense`というプラグインを使えばヨロシクやってくれるが、 今後の拡張性を考えて自前で実装する。

ポイントは2つ。

まず、adsenseスクリプトに広告の描画を指示するために`window.adsbygoogle`に空オブジェクトを`push`する必要がある。これを`useEffect()`で実行する。
```javascript
window.adsbygoogle = window.adsbygoogle || []
window.adsbygoogle.push({})
```

そして、`useEffect()`の実行タイミングを`currentPath`で制御する。  
こうしておかないと`gatsby develop`で再描画が起きる度にエラーが発生しリロードが必要になるため非常に不便。
```jsx
export const Adsense = ( props ) => {
  const { currentPath } = props
  useEffect(() => {
    // 省略
  }, [currentPath]);
  return (
    <ins
      // 省略
    />
  )
```

全体をまとめると以下。

```jsx
// src/components/googleAdsense/index.js

import React, { useEffect } from 'react';


export const Adsense = ( props ) => {
  const { currentPath } = props
  
  useEffect(() => {
    if (window) {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
    }
  }, [currentPath]);

  return (
      <ins 
        className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client="ca-pub-123456789" // 自サイトのコードに置き換える
        data-ad-slot="123456789" // 自サイトのスロットに置き換える
        data-ad-format='auto'  // 自由
        data-full-width-responsive='true' // 自由
      />
  )
}
```

<adsense></adsense>

## 3. Google AdSense用のコンポーネントを配置する
広告を表示したい場所にStep2にて作成したコンポーネントを配置する。
例えば、ブログ記事のテンプレートに配置したい場合は以下のようにする。

```jsx
// src/templates/blogTemplate.js

import React from "react"
import { graphql } from "gatsby"
import { Adsense } from "../components/googleAdsense/index.js"

export default Template = ({
  data,
}) => {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <Adsense/> {/* 広告を表示したい場所にAdsenseコンポーネントを配置する */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <Adsense/> {/* 広告を表示したい場所にAdsenseコンポーネントを配置する */}
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  // 省略
`
```

ここまでうまく実装できていれば、サイトに広告が表示される。
開発環境では実際の広告は表示されず、黄色背景(もしくは透明)の領域が表示されるはず。

<adsense></adsense>

## 4. Markdown記事内に広告を配置する
[Gatsby - MarkdownページにAdSenseを挿入する方法](/how-to-insert-adsense-to-markdown)


## 参考
:link:[Fix Google AdSense loading issues with React](https://mao-tss.medium.com/fix-google-adsense-loading-issues-with-react-f338cbd61ac4)  
:link:[GatsbyサイトにGoogleAdSenseを導入する](https://qiita.com/bob_yama/items/2b24fca112587a1bf8e8)


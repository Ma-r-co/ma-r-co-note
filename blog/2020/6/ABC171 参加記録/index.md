---
title: 【Python】ABC171 参加記録
date: 2020-06-21T00:00:00.000Z
description: AtCoder Beginner Contest 171(ABC171)に参加した. 結果は5完2532ndでパフォーマンス1092. Python解答を載せます. F問題の解説を更新しました.
slug: abc-171-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

[2020/6/22 F問題の解説を更新しました]

ABC171に参加しました. 
結果は5完2532ndでパフォーマンス1092.. ショックです... C問題がまともに解けませんでした.

今回は文字列を扱う問題ばかりでしたね.

ちなみに, 前回物議を醸したからか, 公式解説がとても丁寧.  
個人ブログのPython解答の存在意義がなくなってしまう...

## A - αlphabet
```python
a = input()
if ord('a') <= ord(a) <= ord('z'):
    print('a')
else:
    print('A')
```

文字を扱う系の問題のときは, Pythonでは`ord()`と`chr()`を抑えておけば大抵OK.

> **ord(c)**  
> 1 文字の Unicode 文字を表す文字列に対し、その文字の Unicode コードポイントを表す整数を返します。例えば、 > ord('a') は整数 97 を返し、 ord('€') (ユーロ記号) は 8364 を返します。これは chr() の逆です。  
> <cite> [Python公式ドキュメント](https://docs.python.org/ja/3/library/functions.html#ord) </cite>

## B - Mix Juice
ほぼ公式解説通り.


```python
N, K = map(int, input().split())
P = list(map(int, input().split()))
P.sort()
print(sum(P[:K]))
```

## C - One Quadrillion and One Dalmatians
これがなかなか解けなかった.  
C史上最高に手こづった...  
公式解答を読んだけど, なぜそれでいけるのかまだちゃんと理解できていない...

まずWA解答から紹介.

```python
# WA解答
N = int(input())
ans = []
while N > 0:
    # N -= 1  公式解答との違いはここだけ. -1するとなぜ通るのか...
    ans.append(chr(ord('a') + N % 26))
    N //= 26

print(''.join(reversed(ans)))
```
これがなぜ通らないのかはわかる.  
普通の26進表記とは異なるのだ. 位取りのゼロ($0$)に相当する文字が存在しない.  
例えば $zz+1\rightarrow aa$ であり, $a0$ ではない.
そのため, 単純に26で割っていくだけでは答えがずれていく...

で、なんとか考え方を変えて, コンテスト中にACしたコードは以下.  
C史上最大の実装量である.

```python
N = int(input())

# 桁数を決める
digit = 1  # 桁数
num = pow(26, digit) # その桁数での最大番号
while num < N:
    digit += 1
    num += pow(26, digit)

# その桁数内でのNの順番を0-indexで求める.
# (つまり, 2桁であれば'aa' -> 0, 'zz' -> 675 となる.)
order = N - (num - pow(26, digit)) - 1

# orderの26進数表記Xを求める.
# 例えば, 3桁でorder=28のとき, X = [0, 1, 2]
X = [0] * digit
cur = digit - 1
while order > 0:
    X[cur] = order % 26
    order //= 26
    cur -= 1

# 最後に, 各桁の文字を求める. 'a' + Xi.
ans = []
for x in X:
    c = chr(ord('a') + x)
    ans.append(c)

print(''.join(ans))
```

## D - Replacing

コンテスト中はCを後回しにしてDに進んだ. Counterで瞬殺. 

```python
import sys
from collections import Counter


N = int(input())
A = list(map(int, input().split()))
Q = int(input())

C = Counter(A)
total = sum(A)
for s in sys.stdin.readlines():
    b, c = map(int, s.split())
    k = C[b]
    total += (c - b) * k
    print(total)
    C[b] = 0
    C[c] += k
```

## E - Red Scarf
**Nが偶数**というのがポイント.  
実装が一番軽かった.

```python
N = int(input())
A = list(map(int, input().split()))

L = 0
for a in A:
    L ^= a

for a in A:
    print(L ^ a)
```

## F - Strivore
この問題は以下のように言い換えることができる.

- 長さ$|S|+K$の任意の文字列のうち, 文字列$S$を部分文字列としてもつものはいくつあるか? 

推測だけど, この問題文だと難しすぎるので, 解法を思いつくヒントを与えるために最終的にあの問題文になったんじゃなかろうか.

lesson-learnedは,   
*文字列の問題では* ***「左から見て$i$番目に初めて文字$c$が登場するとき、」*** *という考え方がポイントになる*  
かな.


```python
# pypyでないとTLEになる

# 0~nまでの階乗およびその逆元の値を求める関数.
def prepare(n):
    global MOD
    modFacts = [0] * (n + 1)
    modFacts[0] = 1
    for i in range(n):
        modFacts[i + 1] = (modFacts[i] * (i + 1)) % MOD

    invs = [1] * (n + 1)
    invs[n] = pow(modFacts[n], MOD - 2, MOD)
    for i in range(n, 1, -1):
        invs[i - 1] = (invs[i] * i) % MOD

    return modFacts, invs


MOD = 10 ** 9 + 7
K = int(input())
S = input()
L = len(S)

# 組合せ計算のための前処理
modFacts, invs = prepare(K + L)

# 累乗計算のための前処理
pow25 = [1] * max(L + 1, K + 1)
pow26 = [1] * max(L + 1, K + 1)
for i in range(max(L, K)):
    pow25[i + 1] = (pow25[i] * 25) % MOD
    pow26[i + 1] = (pow26[i] * 26) % MOD
# なお, この前処理は必須ではない. pow()はlogオーダーで計算できるため,
# 下のループ内でpow(25, n - L, MOD)などと書いて直接計算しても十分間に合う.

ans = 0
for n in range(L, L + K + 1):
    # "Si以外の位置の文字を選ぶ通り数"
    nonSi = (pow25[n - L] * pow26[L + K - n]) % MOD
    
    # "S1 ~ S_N-1 の位置を選ぶ通り数"
    Si = (modFacts[n - 1] * invs[L - 1] * invs[n - 1 - (L - 1)]) % MOD
    
    ans += nonSi * Si
    ans %= MOD

print(ans)
```
---
title: 【Python】ABC177 解説
date: 2020-08-29T00:00:00.000Z
description: AtCoder Beginner Contest 177(ABC177)のPythonによる解答・解説を載せます.
slug: abc-177-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC177に参加しました. 
結果は5完714thでパフォーマンス1662.  
全体的に易し目でしたが早解きに助けられました.  

以下, A~F問題の解説および解答例です.


## A - Don't be late
`距離 = 速さ × 時間` 
```python
D, T, S = map(int, input().split())
ans = 'Yes' if S * T >= D else 'No'
print(ans)
```

## B - Substring
実装に意外と手こずり, 1WAを出してしまった...

```python
S = input()
T = input()

ls = len(S)
lt = len(T)

ans = 1 << 31
for i in range(ls - lt + 1):
    cnt = 0
    for j in range(lt):
        if S[i + j] != T[j]:
            cnt += 1
    ans = min(ans, cnt)
print(ans)
```

## C - Sum of product of pairs
累積和の典型問題. 良問だと思う.

```python
MOD = 10 ** 9 + 7
N = int(input())
A = list(map(int, input().split()))

# 累積和を求める
S = [0] * (N + 1)
for i in range(N):
    S[i + 1] = S[i] + A[i]

# 各A_iについて, A_i * (S[N] - S[i + 1]) を求める
SN = S[-1]
ans = 0
for i in range(N - 1):
    a = A[i]
    cnt = a * (SN - S[i + 1])
    ans = (ans + cnt) % MOD
print(ans)
```

## D - Friends 
UnionFind一発。  

UnionFindにはいろいろな実装があるが, 本問では**parents配列にノード数を保持する**実装だと非常に簡単に解ける.
以下のようにしてノード数を保持する.
- 自身が**子**のとき, 親ノード番号を格納する. 自身が**根**のとき, ノード数を**負の数**で格納する.
- つまり,　負の数のときは自身が根であり, その絶対値がその木のノード数を表す.
- 初期化時は、すべてのノードを$-1$で初期化する.


```python
import sys


class UnionFind():
    def __init__(self, n):
        self.parents = [-1] * n

    def find(self, x):
        if self.parents[x] < 0:
            return x
        else:
            self.parents[x] = self.find(self.parents[x])
            return self.parents[x]

    def union(self, x, y):
        x = self.find(x)
        y = self.find(y)

        if x == y:
            return

        if self.parents[x] > self.parents[y]:
            x, y = y, x

        self.parents[x] += self.parents[y]
        self.parents[y] = x


N, M = map(int, input().split())
info = [tuple(map(int, s.split())) for s in sys.stdin.readlines()]

uf = UnionFind(N)
for a, b in info:
    a -= 1; b -= 1
    uf.union(a, b)

ans = min(uf.parents)

print(-ans)
```

## E - Coprime
最近のE問題の中では簡単だった.
方針は以下.

- $pairwise\ coprime \Leftrightarrow A_i\text{の素因数に重複がない}$ である.
- よって, 各$A_i$を順に素因数分解して重複がないかチェックする. 
- 通常の素因数分解では$\mathcal{O}(\sqrt{A})$のため間に合わないが, 高速素因数分解と呼ばれる手法により$\mathcal{O}(\log A)$まで計算量を落とすことができる. Ref: [エラトステネスの篩に基づく高速な素因数分解](https://qiita.com/rsk0315_h4x/items/ff3b542a4468679fb409)

```python
from math import gcd


def create_sieve(n):
    sieve = [0] * (n + 1)

    for i in range(2, n + 1):
        if sieve[i] == 0:
            j = i ** 2
            while j <= n:
                sieve[j] = i
                j += i

    return sieve


def fast_factorization(n, sieve):
    from collections import Counter
    arr = Counter()
    while n > 1:
        p = sieve[n]
        if p == 0:
            arr[n] += 1
            break
        else:
            arr[p] += 1
            n //= p
    return arr


N = int(input())
A = list(map(int, input().split()))

# setwise判定
tmp = 0
for a in A:
    tmp = gcd(tmp, a)
isSetwise = (tmp == 1)


# pairwise判定
M = 10 ** 6
sieve = create_sieve(M)
done = set() # 素数の重複をチェックするためのset
isPairwise = True
for a in A:
    arr = fast_factorization(a, sieve)  # 高速素因数分解
    for p in arr.keys():
        if p in done:
            isPairwise = False
        else:
            done.add(p)

# 答え
if isPairwise:
    ans = 'pairwise coprime'
elif isSetwise:
    ans = 'setwise coprime'
else:
    ans = 'not coprime'
print(ans)
```

また, もっと簡単な解法もあるそう.  これなら$\mathcal{O}(A\log A)$.
<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">フェネック「もっと単純に「全てのd&gt;1について、dの倍数が1個以下か？」でも良くて、これだと調和級数でO(AlogA)になるねー。この方針だとpythonとかでかなりすっきり書けるよ」<a href="https://t.co/yYKdbO5wYY">https://t.co/yYKdbO5wYY</a></p>&mdash; 競技プログラミングをするフレンズ (@kyopro_friends) <a href="https://twitter.com/kyopro_friends/status/1299709833755521024?ref_src=twsrc%5Etfw">August 29, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

```python
# pairwise判定 の部分を下記に変更する
M = 10 ** 6
sieve = [0] * (M + 1)
for a in A:
    sieve[a] += 1

cnt = 0
isPairwise = True
for i in range(2, M + 1):
    tmp = 0
    for j in range(i, M + 1, i):
        tmp += sieve[j]
    isPairwise &= (tmp <= 1)
    # pythonic に書くなら下記の1行でOK
    # isPairwise &= (sum(sieve[j] for j in range(i, M + 1, i)) <= 1)
```


## F - I hate Shortest Path Problem
TBA

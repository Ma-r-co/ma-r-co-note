---
title: 【Python】キャディプログラミングコンテスト2021(ABC193) 解説
date: 2021-02-20T00:00:00.000Z
description: キャディプログラミングコンテスト2021(AtCoder Beginner Contest 193, ABC193)に参加しました。結果は4完1237位パフォーマンス1388. A~E問題の解説およびPython解答例を掲載します。
slug: abc-193-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

キャディプログラミングコンテスト2021(AtCoder Beginner Contest 193, ABC193)に参加しました。  
結果は$4$完$1237$位パフォーマンス$1388$。  

うーん、残念な結果。

以下, A~E問題の解説およびPython解答例です。



<adsense></adsense>



## A - Discount 解説
誤差を心配するほどでもない。

```python
A, B = map(int, input().split())
print(100 * (A - B) / A)
```

## B - Play Snuke 解説
$X_i > A_i$ を満たすお店で購入することが可能。購入可能なお店の中で最安値を見つける。

```python
N = int(input())
M = [tuple(map(int, input().split())) for _ in range(N)]

ans = float('inf')
for a, p, x in M:
    if x - a > 0:
        ans = min(ans, p)
print(ans if ans < (1 << 64) else -1)
```

<adsense></adsense>

## C - Unexpressed
二分探索やエラトステネスの篩を駆使して計算量を減らしたりしたけど、そんなこと必要なかったようである。。悲しい。

```python
from math import sqrt

N = int(input())
M = int(sqrt(N))

table = [1] * (M + 1)  # table[i]: "エラトステネスの篩"的なもの
cnt = 0
for i in range(2, M + 1):
    if table[i] == 1:
        # i^j で表せすことができる数の個数を数える
        ok = 2
        ng = 40
        while abs(ok - ng) > 1:
            mid = (ok + ng) // 2
            if pow(i, mid) <= N:
                ok = mid
            else:
                ng = mid
        cnt += ok - 1

        # i^j のものをすべて探索済みにする
        k = i * i
        while k <= M:
            table[k] = 0
            k *= i
print(N - cnt)
```

## D - Poker
かなり手こずってしまった。。  
単純な全探索ということに気づくのが遅れた。。。

`collections.Counter`を使ってカード・手札を管理すると実装しやすい。

```python
from collections import Counter


def calc_score(U: Counter) -> int:
    ''' 手札の点数を計算する関数
    '''
    return sum(k * pow(10, v) for k, v in U.items())


K = int(input())
cards = Counter(dict((i, K) for i in range(1, 10)))  # cards: まだ見えていないカード
S = Counter(dict((i, 0) for i in range(1, 10)))  # S: 高橋くんの手札
T = Counter(dict((i, 0) for i in range(1, 10)))  # T: 青木くんの手札
for c in input():
    if c != '#':
        c = int(c)
        S[c] += 1
        cards[c] -= 1
for c in input():
    if c != '#':
        c = int(c)
        T[c] += 1
        cards[c] -= 1

cnt = 0
for s in range(1, 10):  # 裏向きのカードを全探索する。 s: 高橋くんの裏向きカード, t: 青木くんの裏向きカード
    if cards[s] > 0:
        var_s = cards[s]
        cards[s] -= 1
        S[s] += 1
        score_S = calc_score(S)
        for t in range(1, 10):
            if cards[t] > 0:
                var_t = cards[t]
                T[t] += 1
                score_T = calc_score(T)
                if score_S > score_T:  # 高橋くんが勝つときの場合の数を計算する
                    cnt += var_s * var_t
                T[t] -= 1
        S[s] -= 1
        cards[s] += 1
L = K * 9 - 8  # L: 見えていないカードの枚数
print(cnt / (L * (L - 1)))  # 全体は LP2 = L * (L - 1) 通りとなる


```

<adsense></adsense>

## E - Oversleeping
解き方は思いついたが実装しきれなかった。。 
そして自前の拡張GCDの実装が間違っていた。。

考え方は以下。

- $Z = 2X + 2Y, R = P + Q$ とおく。  
- 電車が$n$回目、高橋くんが$m$回目の周期のとき、それぞれの時刻範囲$t_n, t_m$は以下のように表せる。  
$\begin{aligned} Zn + X & \leq t_n & < Zn + X + Y　\\ Rm + P & \leq t_m &< R*m + P + Q \end{aligned}$
- ここで、$X \leq i < X + Y$、$P \leq j < P + Q$ として$t_n = t_m$となる整数$i, j$が存在するとき、以下の式が成り立つ。  
$\begin{aligned} & Zn + i　&= Rm + j \\ \Leftrightarrow & Zn + Rm &= j - i  \cdots \text{①} \end{aligned}$
- したがって、①式を満たす最小の非負整数$n, m$を見つければ良い。これは拡張ユークリッドの互除法により求められる。
- また, $i, j$を全探索すればよいが、実際は$j - i$のバリエーションだけ探索すればよく、$\mathcal{O}(Y + Q + \log(X + Y + P + Q))$で計算できる。  

```python
import sys
sys.setrecursionlimit(10 ** 6)


def extGCD(a, b):
    '''
    ax + by = gcd(a, b) を満たす整数解x, yを求める
    返り値: gcd(a, b), x, y
    '''
    if b == 0:
        d = abs(a)
        x, y = (1, 0) if a >= 0 else (-1, 0)
    else:
        d, s, t = extGCD(b, a % b)
        x = t
        y = s - (a // b) * t
    return d, x, y


INF = (1 << 64)
T = int(input())
query = [tuple(map(int, input().split())) for _ in range(T)]
for X, Y, P, Q in query:
    ans = INF
    Z, R = 2 * X + 2 * Y, P + Q
    a, b = Z, -R
    d, n_, m_ = extGCD(a, b)
    a_ = a // d
    b_ = b // d
    done = set()  # 探索済みの j - i を格納する
    for i in range(X, X + Y):
        for j in range(P, P + Q):
            c = j - i
            if c % d == 0 and c not in done:
                done.add(c)
                c_ = c // d
                '''
                an + bm = c の一般解
                n = b't + c'n'
                m = -a't + c'm'
                (a' = a // d,
                 b' = b // d,
                 c' = c // d,
                 d = gcd(a, b)
                 n', m': an + bm = gcd(a, b) の解の一つ
                )
                '''
                # nの一般解(a', b', c', n', m') がわかっているので、最小の非負整数nを二分探索により探す
                if b_ < 0:
                    ok = -INF
                    ng = INF
                else:
                    ok = INF
                    ng = -INF
                while abs(ok - ng) > 1:
                    mid = (ok + ng) // 2
                    if b_ * mid + c_ * n_ >= 0:  # n = b' * mid + c' * n'
                        ok = mid
                    else:
                        ng = mid
                n = b_ * ok + c_ * n_
                t = Z * n + i  # nがわかればtが計算できる
                ans = min(ans, t)  # tの最小値を求める
    print('infinity' if ans == INF else ans)
```

<adsense></adsense>

##　F - Zebraness
TBA

## まとめ
精進します。
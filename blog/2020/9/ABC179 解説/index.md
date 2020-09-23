---
title: 【Python】ABC179 解説
date: 2020-09-19T00:00:00.000Z
description: AtCoder Beginner Contest 179(ABC179)のPythonによる解答・解説を載せます.
slug: abc-179-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC179は参加できず、バーチャル参加しました.  結果は5完59:44.   
もし出ていたなら850位くらいでしょうか.  

以下, A~F問題の解説および解答例です.

*[2020/09/23]D,F問題の解説を更新しました.*

## A - Plural Form

```python
S = input()
suf = 'es' if S[-1] == 's' else 's'
print(S + suf)
```

## B - Go to Jail
公式解説通り.

```python
N = int(input())
D = [tuple(map(int, input().split())) for _ in range(N)]
for i in range(N - 2):
    if all(d[0] == d[1] for d in D[i: i + 3]):
        print('Yes')
        exit()
else:
    print('No')
```

## C - A x B + C
公式解説通り.  
この問題にけっこう時間を取られた.  

```python
N = int(input())
cnt = 0
for a in range(1, N):
    n = (N - 1) // a
    cnt += n
print(cnt)
```

## D - Leaping Tak
これは実装が難しかった.  D問題でSeg木を使ったのは初めてかも.  
$\mathcal{O}(n^2)$のDP解法はすぐに考えつくと思うが, これをどうやって計算量を減らすか.  

解法を3つ載せます.  

### 解法1: 公式解答 - 配るDP
```python
MOD = 998244353
N, K = map(int, input().split())
S = [tuple(map(int, input().split())) for _ in range(K)]
S.sort()

f = [0] * N  # f: マスiまで移動する方法の個数(0-index)
f[0] = 1
a = [0] * (N + 1) # ai := fi - f_i-1
a[1] = -1  # この初期条件の-1を忘れないように注意!

for i in range(0, N - 1):
    for l, r in S:
        if i + l < N:
            a[i + l] += f[i]
            a[i + l] %= MOD
        if i + r + 1 < N:
            a[i + r + 1] -= f[i]
            a[i + r + 1] %= MOD
    f[i + 1] = (f[i] + a[i + 1]) % MOD

print(f[-1])
```

### 解法2: 貰うDP - 累積和
```python
MOD = 998244353
N, K = map(int, input().split())
S = [tuple(map(int, input().split())) for _ in range(K)]
S.sort()

dp = [0] * N
dp[0] = 1
dpsum = [0] * (N + 1)  # dpsum: 累積和
dpsum[1] = 1

for i in range(1, N):
    for l, r in S:
        li = i - r
        ri = i - l
        if ri < 0:
            continue
        li = max(0, li)
        dp[i] += dpsum[ri + 1] - dpsum[li]
        dp[i] %= MOD
    dpsum[i + 1] = (dpsum[i] + dp[i]) % MOD

print(dp[-1])
```

### 解法3: 貰うDP - 累積和をSeg木で管理

- 以下, **貰うDP**を考える. $f_i := マスiまで移動する方法$とする.
- ある$f_i$について, 区間$[l, r]$が与えられると $f_i$ += $f_{i - r} + f_{i - (r + 1)} + \cdots + f_{i - l}$ で計算できる. この右辺をどうやったら高速に求められるか?
- そこでセグ木を用いて, $f_{i - r} + f_{i - (r + 1)} + \cdots + f_{i - l} =$SegTree.get($l$, $r + 1$)という形で$\log$オーダーで取得できるようにする.

```python
from operator import add


class SegmentTree():
    """
    update, get を提供するSegmentTree

    Attributes
    ----------
    __n : int
        葉の数。2 ^ i - 1
    __dot :
        Segment function
    __e: int
        単位元
    __node: list
        Segment Tree
    """
    def __init__(self, A, dot, e):
        """
        Parameters
        ----------
        A : list
            対象の配列
        dot :
            Segment function
        e : int
            単位元
        """
        n = 2 ** (len(A) - 1).bit_length()
        self.__n = n
        self.__dot = dot
        self.__e = e
        self.__node = [e] * (2 * n)
        for i in range(len(A)):
            self.__node[i + n] = A[i]
        for i in range(n - 1, 0, -1):
            self.__node[i] = self.__dot(self.__node[2 * i], self.__node[2 * i + 1])
    
    def update(self, i, c):
        i += self.__n
        node = self.__node
        node[i] = c % MOD
        while i > 1:
            i //= 2
            node[i] = self.__dot(node[2 * i], node[2 * i + 1]) % MOD

    def get(self, l, r):
        vl, vr = self.__e, self.__e
        l += self.__n
        r += self.__n
        while (l < r):
            if l & 1:
                vl = self.__dot(vl, self.__node[l]) % MOD
                l += 1
            l //= 2
            if r & 1:
                r -= 1
                vr = self.__dot(vr, self.__node[r]) % MOD
            r //= 2
        return self.__dot(vl, vr) % MOD
    

MOD = 998244353
N, K = map(int, input().split())
section = [tuple(map(int, input().split())) for _ in range(K)]
section.sort()

st = SegmentTree([0] * N, add, 0)
st.update(0, 1)
for i in range(1, N):
    fi = 0
    for l, r in section:
        L = max(0, i - r)
        R = i - l
        if R >= 0:
            fi += st.get(L, R + 1)
    st.update(i, fi)

print(st.get(N - 1, N))
```


## E - Sequence Sum
**ABC175 D - Moving Piece**の類題で, 考察は比較的簡単だと思う.  
実装が少し難しい.  

以下, 公式解答と同じ考え方での解答.  

```python
N, X, M = map(int, input().split())

a = X
path = [a]  # path: 数列Ai
done = set([a])  # done: 既に登場したAiの項
while True:
    na = pow(a, 2, M)
    if na in done:
        s = path.index(na)  # 繰り返しが始まる箇所
        break
    else:
        path.append(na)
        done.add(na)
        a = na

if N < s + 1:  # N項目がループが始まる箇所よりも前の場合
    ans = sum(path[:N])
else:
    rest = N - s  # rest: ループに入った後の項目数
    x, y = divmod(rest, len(path) - s)  # x: ループを回る回数, y: 最後の1週に満たない項数

    ans = sum(path[:s])  # ループに入る前の和
    ans += sum(path[s:]) * x  # ループを繰り返す部分の和
    ans += sum(path[s: s + y])  # ループの最後の1週に満たない部分の和
print(ans)
```

## F - Simplified Reversi
時間終了後に自力ACできた.  

考え方は以下のツイートがわかりやすいと思う.

<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">アライグマ「F問題は、縦横それぞれ「クエリが来たら黒石が何個減るか」を配列で持ってみるのだ。更新にO(N)くらいかかりそうだけど、上の方・左の方はまとめて1つの変数に持っておくことにすれば、配列の更新は高々1回になって、全体でO(N)になるのだ！」 <a href="https://t.co/hXugXsMAHA">pic.twitter.com/hXugXsMAHA</a></p>&mdash; 競技プログラミングをするフレンズ (@kyopro_friends) <a href="https://twitter.com/kyopro_friends/status/1307315732812713986?ref_src=twsrc%5Etfw">September 19, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

リバーシ盤の左と上に書いてある数列をSeg木を使って管理する.
点更新, 区間最小値取得. 

```python
import sys


class SegmentTree():
    """
    update, get を提供するSegmentTree

    Attributes
    ----------
    __n : int
        葉の数。2 ^ i - 1
    __dot :
        Segment function
    __e: int
        単位元
    __node: list
        Segment Tree
    """
    def __init__(self, A, dot, e):
        """
        Parameters
        ----------
        A : list
            対象の配列
        dot :
            Segment function
        e : int
            単位元
        """
        n = 2 ** (len(A) - 1).bit_length()
        self.__n = n
        self.__dot = dot
        self.__e = e
        self.__node = [e] * (2 * n)
        for i in range(len(A)):
            self.__node[i + n] = A[i]
        for i in range(n - 1, 0, -1):
            self.__node[i] = self.__dot(self.__node[2 * i], self.__node[2 * i + 1])
    
    def update(self, i, c):
        i += self.__n
        node = self.__node
        node[i] = self.__dot(node[i], c)
        while i > 1:
            i //= 2
            node[i] = self.__dot(node[2 * i], node[2 * i + 1])

    def get(self, l, r):
        vl, vr = self.__e, self.__e
        l += self.__n
        r += self.__n
        while (l < r):
            if l & 1:
                vl = self.__dot(vl, self.__node[l])
                l += 1
            l //= 2
            if r & 1:
                r -= 1
                vr = self.__dot(vr, self.__node[r])
            r //= 2
        return self.__dot(vl, vr)


N, Q = map(int, input().split())
query = [tuple(map(int, sys.stdin.readline().split())) for _ in range(Q)]

# 演算子=min, 単位元=N-1 のSegmentTreeを作る.
# 縦方向(stH), 横方向(stW)の2つを用意する.
stH = SegmentTree([N - 1] * N, min, N - 1)
stW = SegmentTree([N - 1] * N, min, N - 1)

cnt = 0
for t, x in query:
    x -= 1  # xを0-indexに修正

    # tの値に応じて操作するSeg木を変える
    if t == 1:
        stA, stB = stW, stH
    else:
        stA, stB = stH, stW
    # このクエリによりいくつの黒石が置き換えられるかをカウントする
    a = stA.get(x, N)
    cnt += max(0, a - 1)
    # 石を置いていない方のSeg木を更新する
    stB.update(a, x)

print(pow(N - 2, 2) - cnt) # 最初の黒石の個数((N-2)^2個)から置き換えられた数(cnt)を引く
```
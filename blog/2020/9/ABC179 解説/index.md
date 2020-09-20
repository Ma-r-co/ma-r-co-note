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
これは実装が難しかった.  D問題でSeg木を使うのは初めてかも.  
$\mathcal{O}(n^2)$のDP解法はすぐに考えつくと思うが, これをどうやって計算量を減らすか.  

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
とりあえず計算量度外視でシミューレション実装をして, 計算量を減らすためにSeg木を使ったところACできた.  
しかし, 数式をイジっていたらたまたま計算量が減っただけなので, なぜこれで正解なのか理論的背景がわからなくなってしまった.  

とにかく解答を載せる.  
解説はTBA.

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

flagH = [N - 1] * N
flagW = [N - 1] * N

stH = SegmentTree([N - 1] * N, min, N - 1)
stW = SegmentTree([N - 1] * N, min, N - 1)

cnt = 0
for t, x in query:
    if t == 1:
        stX, stY = stW, stH
    else:
        stX, stY = stH, stW

    cnt += max(0, stX.get(x - 1, N) - 1)
    stY.update(stX.get(x - 1, N), x - 1)

print(pow(N - 2, 2) - cnt)
```
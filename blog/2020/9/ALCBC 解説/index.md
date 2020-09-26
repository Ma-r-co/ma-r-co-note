---
title: 【Python】ACL Beginner Contest 解説
date: 2020-09-26T00:00:00.000Z
description: ACL Beginner Contest のPythonによる解答・解説を載せます.
slug: ALCBC-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
keywords: Python
---


ALC Beginner Contestに参加しました. 結果は3完で撃沈...orz  

以下, A~D問題の解説および解答例です.

## A - Repeat ACL

```python
K = int(input())
print('ACL' * K)
```

## B - Integer Preference

```python
A, B, C, D = map(int, input().split())
ans = 'Yes' if B >= C and A <= D else 'No'
print(ans)
```

## C - Connect Cities
**連結成分の数 - 1** が答えとなる. 連結成分の数え方はUnion-Find木を用いる方法が簡単. 
僕はなぜかBFSを使って実装に無駄に時間を要した.. 

### 解法1: Union-Find
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
uf = UnionFind(N)
for _ in range(M):
    a, b = map(lambda x: int(x) - 1, sys.stdin.readline().split())
    uf.union(a, b)

# 連結成分数 - 1 が答え.
# 私のUnion-Find実装では, Parentが負の数のノードが親である. (親の数 = 連結成分数)
print(sum(p < 0 for p in uf.parents) - 1)
```

### 解法2: 全探索
BFSもしくはDFSで各ノードが所属する連結成分をマーキングして, 連結成分数を数えることができる.  
以下はBFSによる実装.

```python
import sys
from collections import deque


N, M = map(int, input().split())
edge = [[] for _ in range(N)]  # edge: 道路
for s in sys.stdin.readlines():
    a, b = map(lambda x: int(x) - 1, s.split())
    edge[a].append(b)
    edge[b].append(a)

path = [0] * N  # path: 0 -> 未探索, 1 -> 探索済
cnt = 0  # cnt: 連結成分数
for i in range(N):  # スタート地点をノード0 ~ N-1のなかの未探索ノードから決める.
    if path[i] == 0:  # 未探索の場合, BFSを開始.
        cnt += 1
        q = deque()
        path[i] = 1
        q.append(i)
        while q:
            p = q.popleft()
            for np in edge[p]:
                if path[np] == 0:
                    path[np] = 1
                    q.append(np)

print(cnt - 1)
```

## D - Flat Subsequence
コンテスト終了後にACできた.  
アルゴリズムはすぐにわかったが, それをSeg木に落とし込むところで手こずった.  

考え方は以下の通り.
 - 例題のケースを考える. $N = 10, K = 3, A = [1, 5, 4, 3, 8, 6, 9, 7, 2, 4]$
 - 仮にいま$A_2$(=5)にいるとすると, 移動先の候補は下記の**2つ**しかない. 
 - **[候補1: "5以上の項"]**
 $A_2$より右側に存在し$5 \leq A_i \leq 5+3$ を満たす$A_i$のうち**最も左側**に存在するもの. 今回の例で言うと$A_5$(=8)である. $A_6$(=6)にも移動可能ではあるが, その場合は$A_2 \rightarrow A_5 \rightarrow A_6$ という移動をした方が必ず数列$B$が長くなるため, **最も左側の項**に移動するのが常に最適となる.
 - **[候補2: "5未満の項"]** 
 候補1と同じ考え方により, $A_2$より右側に存在し$5 - 3 \leq A_i \lt 5$ を満たす$A_i$のうち**最も左側**に存在するものが移動先となり得る. 今回の例で言うと$A_3$(=4)である. 
 - 以上の**候補1**と**候補2**の算出は, Seg木を用いることで各項ごとに$\mathcal{O}(\log{(max(A))})$で求めることができる. 例) $seg.get(a, a + K)$ $\rightarrow$ $a \leq A_i \leq a + K$ を満たす$A_i$の中で$i$の最小値を返す. 
 - 各項ごとの移動先がわかれば, あとはDPにより$B$の最大長を求めることができる. 計算量は高々$2N$回である.

```python
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
        node[i] = c
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


N, K = map(int, input().split())
A = [int(input()) for _ in range(N)]
max_A = max(A)

st = SegmentTree([N] * (max_A + 1), min, N)  # 最小値を管理するSeg木
dp = [0] * (N + 1)  # dp[i] := i番目の項を始点にBを構成したときのBの長さの最大値. 0-index. dp[N] = 0.
for j, a in enumerate(reversed(A)):  # Aを右から見ていく
    i = N - 1 - j  # a = A_i (0-index)
    c1 = st.get(a, min(max_A + 1, a + K + 1))  # c1: 候補1(a以上の項) 
    dp[i] = max(dp[c1] + 1, dp[i])
    c2 = st.get(max(0, a - K), a)  # c2: 候補2(a未満の項)
    dp[i] = max(dp[c2] + 1, dp[i])
    st.update(a, i)  # Seg木を更新

print(max(dp))  # dp配列の最大値が答え.
```

## E - Replace Digits
TBA
(区間更新ができれば解けたはずだが, 遅延Seg木を持っていなかった..)

## F - Heights and Pairs
TBA

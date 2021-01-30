---
title: 【Python】ABC190 解説
date: 2021-01-30T00:00:00.000Z
description: AtCoder Beginner Contest 190(ABC190)に参加しました。結果は5完766位パフォーマンス1669. A~F問題の解説およびPython解答例を掲載します。
slug: abc-190-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC190に参加しました. 結果は$5$完$766$位パフォーマンス$1669$.  
全完したかった〜

以下, A~F問題の解説およびPython解答例です.


<adsense></adsense>



## A - Very Very Primitive Game
ここ最近のA問題のなかでは一番手こずった。  
条件の整理が苦手。。。

```python
A, B, C = map(int, input().split())
if A > B:
    ans = 0
elif A < B:
    ans = 1
else:
    ans = 1 ^ C
cnt = 'Takahashi' if ans == 0 else 'Aoki'
print(cnt)
```

## B - Magic 3
$N$種類の呪文のうちどれか一つが条件を満たせば良い。  
`any()`を使うとすっきりと書ける。

```python
N, S, D = map(int, input().split())
XY = [map(int, input().split()) for _ in range(N)]
ans = 'Yes' if any(x < S and y > D for x, y in XY) else 'No'
print(ans)
```

<adsense></adsense>

## C - Bowls and Dishes
C問題頻出の**bit全探索**。

```python
from itertools import product


N, M = map(int, input().split())
cond = [tuple(map(lambda x: int(x) - 1, input().split())) for _ in range(M)]
K = int(input())
P = [tuple(map(lambda x: int(x) - 1, input().split())) for _ in range(K)]

ans = 0
for bit in product(range(2), repeat=K):
    ball = [False] * N  # ball[x]: 皿xにボールが置かれているかどうか
    for i, b in enumerate(bit):
        x = P[i][b]
        ball[x] = True
    cnt = sum(ball[a] and ball[b] for a, b in cond)
    ans = max(ans, cnt)

print(ans)
```

## D - Staircase Sequences
等差数列の知識があると比較的楽に解ける問題。

- [等差数列の和の公式](https://www.kwansei.ac.jp/hs/z90010/sugakua/suuretu/tousasum/tousasum.htm)より、$\text{初項} a, \text{公差} d, \text{項数} n \text{の等差数列の和} S_n$ は以下のように表される。  
$S_n = \frac{n\{2a + (n - 1)d\}}{2}$
- よって,  
$\begin{aligned} S_n &= \frac{n\{2a + n - 1\}}{2} &= N \\ &\Leftrightarrow n\{2a + n - 1\} &= 2N \end{aligned}$
- したがって、$2N$の約数を求めれば $n$, $2a + n - 1$ がそれぞれ定まる。
- このとき, $2a + n - 1 = X$とおくと、 整数$a$が存在する条件は、  
$(X - n + 1) \% 2 == 0$  
である。




```python
def f1(n):
    '''
    n の約数をすべて求める
    '''
    divs = []
    for i in range(1, int(n ** 0.5) + 1):
        if n % i == 0:
            divs.append(i)
            j = n // i
            if i != j:
                divs.append(j)
    return divs


N = int(input())
divs = f1(2 * N)
cnt = 0
for n in divs:
    X = (2 * N) // n
    if (X - n + 1) % 2 == 0:
        cnt += 1
print(cnt)
```

<adsense></adsense>

## E - Magical Ornament
`メモ化再帰`で実装したところTLEが取りきれず時間切れ。。  
`Pypy`は再帰関数が遅いことは知っていたけれど、非再帰で実装できなかった。  

コンテスト終了後にいろいろ試したところ、メモの方法を`dict`から`list`に変えるだけで通った(!?)。  
もったいなかった。。今後のために覚えておこう。

> メモ化再帰ではメモに`dict`ではなく`list`を用いること！！

```python
import sys
from collections import deque
sys.setrecursionlimit(10 ** 6)


def dfs(v, S):
    '''
    現在頂点vにいて、残り頂点集合Sをすべて回るときの最短距離.
    初期値: dfs(v, 0) = 0
    '''
    global INF
    if dp[v][S] == -1:
        if S == 0:
            ret = 0
        else:
            ret = INF
            for nv in range(K):
                if (S >> nv) & 1:
                    cnt = dist[v][nv] + dfs(nv, S ^ (1 << nv))
                    ret = min(ret, cnt)
        dp[v][S] = ret
    return dp[v][S]


N, M = map(int, input().split())
cond = [tuple(map(lambda x: int(x) - 1, sys.stdin.readline().split())) for _ in range(M)]
edge = [[] for _ in range(N)]
for a, b in cond:
    edge[a].append(b)
    edge[b].append(a)
K = int(input())
C = list(map(lambda x: int(x) - 1, input().split()))

Cidx = {}  # Cidx[Ci]: 頂点Ci の配列C内でのindexを返す
for i, c in enumerate(C):
    Cidx[c] = i

# まずはCi<>Cj の2点間距離を全て求める。
# 各頂点からBFSを実施する
INF = float('inf')
dist = [[INF] * K for _ in range(K)]  # dist[i][j]: Ci<>Cjの距離
for i, c in enumerate(C):
    path = [-1] * N
    q = deque()
    q.append((0, c))
    while q:
        s, v = q.popleft()
        if path[v] == -1:
            path[v] = s
            if v in Cidx:
                dist[i][Cidx[v]] = dist[Cidx[v]][i] = s
            ns = s + 1
            for nv in edge[v]:
                q.append((ns, nv))

# 次にメモ化再帰によりC1,...,Ckをすべて周るときの最短距離を求める
# dfs(v, S): 頂点vにいて、残り頂点集合Sをすべて周るときの最短距離
# 初期値: dfs(v, 0) = 0
# 求める答えは dfs(v, (1 << K) - 1)のうちの最小値 + 1
dp = [[-1] * (1 << K) for _ in range(K)]
cnt = INF
for i in range(K):
    cnt = min(cnt, dfs(i, (1 << K) - 1))
ans = cnt + 1 if cnt < (1 << 64) else -1
print(ans)
```


<adsense></adsense>

## F - Shift and Inversions
`Binary Indexed Tree` を使って初期状態での転倒数を求めた。  
F問題のなかではかなりわかりやすい問題だったと思う。


```python
class BinaryIndexedTree():
    '''
    割愛
    1-indexed
    add(i, a): i番目の要素にaを足す
    get(i, j): [i, j]の総和を返す
    '''


N = int(input())
A = list(map(int, input().split()))
BIT = BinaryIndexedTree([0] * N)
switch = 0  # switch: 転倒数
for a in A:
    cnt = BIT.get(a + 1, N)
    switch += cnt
    BIT.add(a + 1, 1)

for k, a in enumerate(A):
    print(switch)
    low = a           # low: 転倒数の減少分
    high = N - 1 - a  # high: 転倒数の増加分
    switch += high - low
```

## まとめ
最近は方針が合っていても実装ができずTLEとなるケースが増えてきた。  
Python力が足りない。。

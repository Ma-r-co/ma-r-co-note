---
title: 【Python】ABC187 解説
date: 2021-01-02T00:00:00.000Z
description: AtCoder Beginner Contest 187(ABC187)に参加しました。結果は5完1010位パフォーマンス1462. A~F問題の解説およびPython解答例を掲載します。
slug: abc-187-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC187に参加しました。結果は5完1010位パフォーマンス1462。  
久しぶりに水パフォが出せました。

以下, A~F問題の解説およびPython解答例です.

## A - Large Digits
ワンライナーで。

```python
print(max(sum(map(int, list(s))) for s in input().split()))
```

## B - Gentle Pairs
全探索する。


```python
N = int(input())
P = [tuple(map(int, input().split())) for _ in range(N)]

cnt = 0
for i in range(N - 1):
    for j in range(i + 1, N):
        if abs(P[i][0] - P[j][0]) >= abs(P[i][1] - P[j][1]):
            cnt += 1
print(cnt)
```

<adsense></adsense>

## C - 1-SAT
"!"有りの集合 $A$ と"!"無しの集合 $B$ を用意して、$A \cap B$ が存在するかどうかで判定する。

```python
N = int(input())
S = [input() for _ in range(N)]
A = set()
B = set()
for s in S:
    if s[0] == '!':
        B.add(s[1:])
    else:
        A.add(s)
C = A & B
ans = 'satisfiable' if len(C) == 0 else list(C)[0]
print(ans)
```

## D - Choose Me
かなり時間をかけてしまった。反省。。

- もし演説が$0$箇所の場合,   
青木票:$\sum_{i}^{} A_i$  
高橋票:$0$  
となり、票数の差は $\sum_{i}^{} A_i$ である。
- ここで、町$k$で演説をすると, 青木票:$-A_k$, 高橋票:$+(A_k+B_k)$の増減となるため, 票数の差が$2A_k+B_k$縮まる。
- したがって, $2A_k + B_k$ が大きい街から貪欲に演説し, 元々の票数差$\sum_{i}^{} A_i$を上回るところを見つければ良い。

```python
import sys


N = int(input())
town = [tuple(map(int, sys.stdin.readline().split())) for _ in range(N)]

A = sum(t[0] for t in town)  # 演説0箇所の場合の青木票
town.sort(key=lambda x: 2 * x[0] + x[1], reverse=True)  # 2Ai+Bi の降順にソート 

T = 0  # 票数差の減少幅の累計
for i, (a, b) in enumerate(town):
    T += 2 * a + b  # i番目の街で演説すると 2a + b だけ票数差が縮まる
    if T > A:
        break
print(i + 1)
```

<adsense></adsense>

## E - Through Path
木における区間更新の問題。  
 - **区間[頂点$A$, 頂点$B$]の更新 $\Leftrightarrow$ 区間[根, 頂点$A$]の更新 + 区間[根, 頂点$B$]の更新**
と捉えると解ける問題が多い。

再帰関数により$DFS$を実装したら$TLE$となってしまった。  
公式解答にあるように`list.append()`, `list.pop()`を利用してスタックを自分で実装した方がいいのか。勉強になる。


以下は$BFS$で実装した解法。

```python
import sys
from collections import deque


N = int(input())
E = [tuple(map(lambda x: int(x) - 1, sys.stdin.readline().split())) for _ in range(N - 1)]
edge = [[] for _ in range(N)]
for a, b in E:
    edge[a].append(b)
    edge[b].append(a)
Q = int(input())
query = [tuple(map(int, sys.stdin.readline().split())) for _ in range(Q)]

parent = [-1] * N  # parent[i]: 頂点iの親
q = deque()
q.append(0)  # 頂点0を根としてBFSを行う
while q:
    v = q.popleft()
    for nv in edge[v]:
        if nv != parent[v]:  # nv親ではない => nvはvの子
            parent[nv] = v
            q.append(nv)

count = [0] * N  # count[i]: 頂点i自身および子孫に足す数の累計
for t, e, x in query:
    e -= 1
    a, b = E[e]
    if t == 2:  # クエリ2はa<>bを入れ替えることによりクエリ1と同じになる
        a, b = b, a

    if parent[b] == a:  # aが親のとき
        count[0] += x  # 根にxを足す
        count[b] -= x  # aの子孫(=b)からxを引く
    else:  # bが親のとき
        count[a] += x  # bの子孫(=a)にxを足す

ans = [0] * N
q = deque()
q.append((0, 0))  # (頂点, 親から降ってきた値)
while q:
    v, x = q.popleft()
    ans[v] = count[v] + x
    for nv in edge[v]:
        if nv != parent[v]:
            q.append((nv, ans[v]))

print(*ans, sep='\n')
```

<adsense></adsense>

## F - Close Group
解説AC。

**bitDP**の問題。  
計算量が$\mathcal{O}(3^{18}) \simeq  3.8 * 10^8$ なのでPython(Pypy)だとかなり厳しい。  
公式解答のbit演算の実装がめちゃくちゃ勉強になるのでぜひ一読を。  

特に、**集合$S$に対して、すべての真部分集合$\{T: T \subset S\}$を列挙する**方法はとても参考になる。
```python
# 集合Sに対して、すべての真部分集合Tを列挙する方法
T = S
while T:
    '''
    〜なんらかの処理〜
    '''
    T -= 1
    T &= S
```

以下解答。
```python
import sys


N, M = map(int, input().split())
edge = [0] * N  # edge[i]: 頂点iから辺がつながっている頂点の集合
for _ in range(M):
    a, b = map(int, sys.stdin.readline().split())
    a -= 1; b -= 1
    edge[a] |= (1 << b)
    edge[b] |= (1 << a)

INF = 0xff
dp = [INF] * (1 << N)
dp[0] = 1

# まず最初に、完全グラフとなる頂点集合Tを見つけて, dp[T] = 1 とする。
# ある集合jが完全グラフのとき, jのすべての頂点と辺がつながっている頂点iが存在すれば, (j | i)は完全グラフである
for i in range(N):
    for j in range(1 << N):
        if dp[j] == 1 and (edge[i] & j) == j:
            dp[j | (1 << i)] = 1

# 次に, すべての部分集合iについて、dp[i]を求める。
# iの部分集合jについて dp[j] + dp[i - j] の最小値がdp[i]である
for i in range(1 << N):
    j = i
    while j:
        if dp[i] > dp[j] + dp[i - j]:
            dp[i] = dp[j] + dp[i - j]
        j -= 1
        j &= i
print(dp[-1])
```

## まとめ
まあ実力相応の結果でした。  

---
title: 【Python】ARC107 解説
date: 2020-10-31T00:00:00.000Z
description: AtCoder Regular Contest 107(ARC107)のPythonによる解答・解説を載せます.
slug: arc-107-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ARC
keywords: Python
---

ARC107に参加しました. 結果はABC3完1312位パフォーマンス1259. 
不本意な結果..

以下, A~D問題の解説およびPython解答例です.

## A - Simple Math
公式解説の通り. 
わざわざ逆元を求めて計算したけど, この程度の大きさであれば直接2で割ってもよいのか...

```python
A, B, C = map(int, input().split())
MOD = 998244353

inv2 = pow(2, MOD - 2, MOD)

X = (1 + A) * A * inv2
Y = (1 + B) * B * inv2
Z = (1 + C) * C * inv2

ans = (X * Y * Z) % MOD
print(ans)
```

## B - Quadruple
めちゃくちゃ手こずった.
公式解説みたいに$f(N, K) = min(K - 1, 2N + 1 - K)$をスマートに導出できる人なんているんだろうか...

私の考え方は以下の通り.
- まず, $X = a + b$, $Y = c + d$とおくと,　条件は$X - Y = K \cdots \text{①}$, $2 \leq X \leq 2N\cdots \text{②}$, $2 \leq Y \leq 2N\cdots \text{③}$ となる.
- ここで①より, $X$が決まれば$Y$も決まるため, 各$X = 2, 3, \cdots, 2N$について, 答えを数え上げていけば良い.
- では, $a + b = X\cdots \text{④}$ を満たす整数$(a, b)$の組はいくつ存在するか？
- まず, $a$が満たすべき条件は $1 \leq a \leq N \cap 1 \leq a \leq X-1 \Leftrightarrow 1 \leq a \leq min(X-1, N) \cdots \text{⑤}$ である. 
- 同様にして, $b$が満たすべき条件は $1 \leq b \leq min(X - 1, N) \cap \text{④}$. つまり, $1 \leq X - a \leq min(X, N) \Leftrightarrow X - min(X - 1, N) \leq a \leq X - 1 \Leftrightarrow max(1, X - N) \leq a \leq X - 1 \cdots \text{⑥}$
- 結局, $\text{⑤} \cap \text{⑥} \Leftrightarrow max(1, X - N) \leq a \leq min(X-1, N)$の範囲に含まれる整数$a$の数が, $(a, b)$の組の個数となる. 
- $c + d = Y$を満たす整数$(c, d)$の組についても同様に求めることができる. 


```python
N, K = map(int, input().split())

cnt = 0
for X in range(2, 2 * N + 1):
    l = max(1, X - N)  # max(1, max(1, X - N))
    r = min(X - 1, N)  # min(min(X - 1, N), X - 1)
    a = max(0, r - l + 1)

    Y = X - K
    l = max(1, Y - N)
    r = min(Y - 1, N)
    b = max(0, r - l + 1)

    cnt += a * b

print(cnt)
```

## C - Shuffle Permutation
比較的わかりやすい問題だと感じた.  
公式解説のとおり, スワップ可能な行・列をそれぞれUnionFindによりグループ分けして, 各グループ内での並べ替え方をすべて掛け合わせる.


```python
def prepare(n):
    # 割愛
    # modFacts[i]:= i! % MOD
    # invs[i]:= pow(i!, MOD - 2, MOD)
    # return modFacts, invs


class UnionFind():
    # 割愛
    # union(i, j): ノードi, jをグループ化
    # parents[i]: i>=0のとき親ノード番号, i<0のとき自身が親のグループのノード個数.


N, K = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(N)]
MOD = 998244353

modFacts, invs = prepare(N)

ufH = UnionFind(N)  # ufH: 列に関するUnionFind木
for i in range(N - 1):
    for j in range(i + 1, N):
        if all(A[i][k] + A[j][k] <= K for k in range(N)):
            ufH.union(i, j)
ufW = UnionFind(N)  # ufW: 行に関するUnionFind木
for i in range(N - 1):
    for j in range(i + 1, N):
        if all(A[k][i] + A[k][j] <= K for k in range(N)):
            ufW.union(i, j)

varH = 1  # varH: 列の並べ替え方の個数
for v in ufH.parents:
    if v < 0:
        varH *= modFacts[-v]
        varH %= MOD

varW = 1　　# varW: 列の並べ替え方の個数
for v in ufW.parents:
    if v < 0:
        varW *= modFacts[-v]
        varW %= MOD

print((varH * varW) % MOD)
```

## D - Number of Multisets
解説AC.  
考え方としては**分割数**の典型.

```python
MOD = 998244353
N, K = map(int, input().split())
dp = [0] * (N + 2)  # dp配列を使い回す. dp[N + 1]は番兵.
dp[0] = 1

for i in range(1, N + 1):
    for k in range(N, -1, -1):
        # dp[k] = dp[k - 1] + dp[2 * k]
        dp[k] = dp[k - 1]
        if 2 * k <= N:
            dp[k] += dp[2 * k]
        dp[k] %= MOD
print(dp[K])
```

## E - Mex Mat
TBA

## F - Sum of Abs
TBA

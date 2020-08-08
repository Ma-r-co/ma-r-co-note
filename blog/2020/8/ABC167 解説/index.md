---
title: 【Python】ABC167 解説
date: 2020-08-08T00:00:00.000Z
description: AtCoder Beginner Contest 167(ABC167)のPythonによる解答・解説を載せます.
slug: abc-167-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC167の振り返りをします. 


## A - Registration
```python
S = input()
T = input()
ans = 'Yes' if S == T[:len(S)] else 'No'
print(ans)
```

## B - Easy Linear Programming
```python
A, B, C, K = map(int, input().split())

if K <= A:
    ans = K
elif A < K <= A + B:
    ans = A
elif A + B < K <= A + B + C:
    ans = A - (K - (A + B))
print(ans)
```


## C - Skill Up
**「$N$が15程度のときは全探索！」**と条件反射してもよいくらい.  
dfsで全探索を実装した.

```python
import sys
sys.setrecursionlimit(10 ** 6)


N, M, X = map(int, input().split())
C = [list(map(int, input().split())) for _ in range(N)]

# asum := (sum(Ci), sum(A1), sum(A2), ..., sum(Am))
def dfs(asum, b):
    global N, M, X
    rst = 10 ** 8
    if b == N:
        if all(asum[i] >= X for i in range(1, M + 1)):
            rst = asum[0]
    else:
        # b番目を買わない場合
        rst = min(rst, dfs(asum, b + 1))
        
        # b番目を買う場合
        asum2 = tuple(asum[i] + C[b][i] for i in range(M + 1))
        rst = min(rst, dfs(asum2, b + 1))

    return rst


rst = dfs(tuple([0] * (M + 1)), 0)
ans = rst if rst < 10 ** 8 else -1
print(ans)
```


## D - Teleporter
- まずは町1から出発してどの閉路に入るかを探す.
- 一度閉路に入ると、その中をグルグル回ることになるので、剰余の関係からK回目の到着地点を算出する.

```python
import sys
sys.setrecursionlimit(10 ** 6)


def dfs(v, s):
    global origin, cycle
    path[v] = s
    nv = A[v]
    if path[nv] >= 0:
        origin = nv
        cycle = (s + 1) - path[nv]
    else:
        dfs(nv, s + 1)


N, K = map(int, input().split())
A = list(map(lambda x: int(x) - 1, input().split()))
origin = 0
cycle = 0
path = [-1] * N
dfs(0, 0)

if K <= path[origin]:
    for i, s in enumerate(path):
        if s == K:
            print(i + 1)
            break
else:
    rest = K - path[origin]
    rest %= cycle
    for i, s in enumerate(path):
        if s == path[origin] + rest:
            print(i + 1)
            break
```

## E - Colorful Blocks
解説AC.

- 「同じ色で塗られている箇所がある」$\Leftrightarrow$ 「あるブロックが、自身の左隣と同じ色に塗られている」

```python
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


N, M, K = map(int, input().split())

MOD = 998244353
modFacts, invs = prepare(2 * N)
ans = 0
for k in range(K + 1):
    num = N - k
    cnt = 1
    if num >= 0:
        cnt *= modFacts[N - 1] * invs[N - 1 - (num - 1)] * invs[num - 1]
        cnt %= MOD
        cnt *= M * pow(M - 1, num - 1, MOD)
        cnt %= MOD
    ans += cnt
    ans %= MOD

print(ans)
```

## F - Range Set Query
解説AC. 
解説のPDFだけだと少しわかりにくいように思う. Youtube解説は非常にわかりやすい.  

- '('を$+1$, ')'を$−1$として, 各$S_i$の左から累積和を求め, **(最小値, 最終値)**という値を算出する. 以下、便宜上$(low, var)$と呼ぶ.
- 例えば, **())((((**であれば, $+1, -1, -1, +1, +1, +1, +1$ のため, $(low, var) = (-1, 3)$ である.
- ここで, $S_i$を結合した文字列が括弧列となる条件は2つ. ①**$var$の総和が$0$**, ②(左から順に見たとき)**$low$の累積和が常に$0$以上** である.

①を満たすかどうかは並び替えの順序に関係なく, すぐに計算できる.  
では, ②を満たすためにはどのように並べればよいだろうか？

- $S_i$を**グループL**:$var\ge 0$, **グループR**:$var<0$ に分ける.
- グループLについては, **$low$の降順(大きい順)**にソートするのが最適.
- グループRについては, グループLとは対称となる. つまり, 各文字列を**右から**見て, $(low, var)$を**再算出**して, ソートすると最適な順序になる. 
- 実はこれは再計算する必要はなく, $(low - var, 0 - var)$で求めることができる.  結局, **$low-var$の昇順(小さい順)**にソートすれば良い.



```python
from operator import itemgetter
from itertools import chain


N = int(input())
L = []
R = []
for i in range(N):
    S = input()
    low = 0
    var = 0

    for s in S:
        if s == '(':
            var += 1
        else:
            var -= 1
        low = min(low, var)
    
    if var >= 0:
        L.append((low, var))
    else:
        R.append((low, var))

L.sort(key=itemgetter(0), reverse=True)
R.sort(key=lambda x: x[0] - x[1])
pos = 0
for i, (low, var) in enumerate(chain(L, R)):
    if pos + low < 0:
        ans = 'No'
        break
    pos += var
else:
    ans = 'Yes' if pos == 0 else 'No'
print(ans)
```

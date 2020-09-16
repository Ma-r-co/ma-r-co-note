---
title: 【Python】ABC178 解説
date: 2020-09-12T00:00:00.000Z
description: AtCoder Beginner Contest 178(ABC178)のPythonによる解答・解説を載せます.
slug: abc-178-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC178は参加できず、バーチャル参加しました.  結果は5完50:25.   
全体的に易し目だったように思います. 

以下, A~F問題の解説および解答例です.


## A - Not
排他的論理和をとるだけ.  

```python
print(int(input()) ^ 1)
```

## B - Product Max
公式解説通り.

```python
a, b, c, d = map(int, input().split())
ans = -float('inf')
for x in (a, b):
    for y in (c, d):
        ans = max(ans, x * y)
print(ans)
```

## C - Ubiquity
C問題で組合せの問題が出るのは珍しいような...

```python
MOD = 10 ** 9 + 7
N = int(input())

Sall = pow(10, N, MOD)  # Sall: 全体
S0 = S9 = pow(9, N, MOD) # S0: Ai=0を含まない. S9: Ai=9を含まない.
S09 = pow(8, N, MOD) # S09: Ai=0,9を含まない.

ans = (Sall - (S0 + S9 - S09)) % MOD
print(ans)
```

## D - Redistribution

### 解法1: 場合の数

- 総計$S$,項数$k$で条件を満たす数列の個数の求め方を考える. (これはS個の石をk箇所に置く場合の数である)
- まず, すべての項に$3$ずつ割り振る. そして, 残り $S - 3k$個を重複を許して$k$項に割り振れば良い.
- 項数$1 \leq k \leq S // 3$についての合計が答えである. 

```python
MOD = 10 ** 9 + 7


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


def comb(n, r):
    global MOD, modFacts, invs
    return (modFacts[n] * invs[n - r] * invs[r]) % MOD


def perm(n, r):
    global MOD, modFacts, invs
    return (modFacts[n] * invs[n - r]) % MOD


S = int(input())
modFacts, invs = prepare(S)
ans = 0
for k in range(1, S // 3 + 1):  # 項数k (1 <= k <= S // 3)
    s = S - 3 * k  # 最初にすべての項を3にする. 残りs.
    cnt = comb(k - 1 + s, s)  # 残ったsをk個の項に配分する場合の数.
    ans += cnt
    ans %= MOD
print(ans)
```

### 解法2: DP (公式解説)
```python
MOD = 10 ** 9 + 7

S = int(input())
dp = [0] * (S + 1)
dp[0] = 1
for i in range(3, S + 1):
    if i >= 1:
        dp[i] += dp[i - 1]
    if i >= 3:
        dp[i] += dp[i - 3]
    dp[i] %= MOD
print(dp[S])
```


## E - Dist Max
ググったら解き方出てくるだろうなーと思ったら案の定出てきた. 
45°回転. 

```python
import sys
from operator import itemgetter

N = int(input())
V = set()
for s in sys.stdin.readlines():
    x, y = map(int, s.split())
    V.add((x + y, x - y))

# 座標変換後のx座標, y座標の最大/最小をそれぞれ求める.
# (計算効率は悪いがPythonicな感じがする(?)ので以下のやり方で.)
y_max = max(V, key=itemgetter(1))[1]
y_min = min(V, key=itemgetter(1))[1]
x_max = max(V, key=itemgetter(0))[0]
x_min = min(V, key=itemgetter(0))[0]

print(max(x_max - x_min, y_max - y_min))
```

## F - Contrast
解けそうで解けなかった. 

### 解法1
まず愚直解法.  考え方は以下.
- $A, B$に登場する整数を個数が多い順に保持する.
- 個数が最も多い整数$k$とその他の数でペアを作る. $k$がAに存在するならば, ペアとなる整数をBから適当に選ぶ(Aに存在しないならば, Aからペアの数を選ぶ).
- 上記で選んだ2つの整数について個数を減算して, 上記の処理を繰り返す.
- なお, 個数が$N$より多い場合はその時点で'No'を出力する.

実装がかなり大変.

```python
from collections import Counter
from heapq import heappush, heappop, heapreplace


N = int(input())
A = list(map(int, input().split()))
B = list(map(int, input().split()))

# 登場する整数の個数を数える.
AC = Counter(A)
BC = Counter(B)
S = AC + BC

# 個数の多い順にheapqに格納.
q = []
for k, v in S.items():
    heappush(q, (-v, k))

ans = []
while q:
    v, k = q[0]
    if v == 0:  # 残り個数0の場合は無視する.
        heappop(q)
    elif v != -S[k]:  # heapqで保持している個数が実際の残個数と異なる場合は, heapq内の当該項を修正.
        heapreplace(q, (-S[k], k))
    else:
        heapreplace(q, (v + 1, k))  # vが負の数のため, v + 1となることに注意.
        if -v > N:  # 整数の個数がNよりも多い場合は答えは'No'.
            print('No')
            exit()
        else:
            if AC[k] > 0:  # 最多の整数がAに存在する場合
                a = k
                for l in BC.keys():
                    if l != k:
                        b = l
                        break
            else: # 最多の整数がBに存在する場合
                b = k
                for l in AC.keys():
                    if l != k:
                        a = l
                        break
            ans.append((a, b))
            S[a] -= 1; S[b] -= 1
            AC[a] -= 1; BC[b] -= 1
            if AC[a] == 0:
                AC.pop(a)
            if BC[b] == 0:
                BC.pop(b)

print('Yes')
X = [b for a, b in sorted(ans)]
print(*X)
```

### 解法2
より簡素な愚直解法が以下.  
左の項から順に見ていって, 一致している場合は別の箇所とスワップするだけ.
- まず$i = 1, j = 1$とする.
- $A_i = B_i$ならば, $j$を順にインクリメントして, $A_i \neq B_j かつ A_j \neq B_i$となる$j$を見つけ$B_i$と$B_j$をスワップする.
- $A_i \neq B_i$ならば, $i$をインクリメントする.
- 上記を$i = N$となるまで繰り返す.

$\mathcal{O}(N^2)$くらいかかりそうであるが、間に合うのでもっと少ないのだろう.  
数学的裏付けはわからない...

```python
from collections import Counter

N = int(input())
A = list(map(int, input().split()))
B = list(map(int, input().split()))

# まず, 条件を満たすBの並び替え方が存在するか判定する.
AC = Counter(A)
BC = Counter(B)
if N < max((AC + BC).values()):
    print('No')
    exit()

i = 0
j = 0
while i < N:
    if A[i] == B[i]:  # Ai = Bi のとき
        while A[i] == B[j] or A[j] == B[i]:
            j = (j + 1) % N  # jをインクリメント. N-1を超える場合は0に戻る.
        B[i], B[j] = B[j], B[i] # BiとBjをスワップ
    i += 1

print('Yes')
print(*B)
```
---
title: 【Python】ABC180 解説
date: 2020-10-17T00:00:00.000Z
description: AtCoder Beginner Contest 180(ABC180)のPythonによる解答・解説を載せます.
slug: abc-180-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC180に参加しました.  結果は4完パフォーマンス1123 (撃沈!!).  
ここのところ低成績が続いており萎えます.. 


以下, A~E問題の解説およびPython解答例です.


## A - box
公式解説の通り.

```python
N, A, B = map(int, input().split())
print(N - A + B)
```

## B - Various distances
精度が心配な問題では`Decimal型`を使うとよい.  

```python
from decimal import Decimal
from math import sqrt


N = int(input())
X = list(map(Decimal, input().split()))

print(sum(abs(x) for x in X))
print(sqrt(sum(x ** 2 for x in X)))
print(max(abs(x) for x in X))

```

## C - Cream puff
$N$のすべての約数を求める問題.  

```python
def f1(n):
    divs = []
    for i in range(1, int(n ** 0.5) + 1):
        if n % i == 0:
            divs.append(i)
            j = n // i
            if i != j:
                divs.append(j)
    return divs


N = int(input())
divs = f1(N)
divs.sort()
print(*divs, sep='\n')
```

## D - Takahashi Unevolved
C問題で出題されそうな内容.  


```python
X, Y, A, B = map(int, input().split())

ans = 0

# A * X が X + B よりも小さい間はA倍を選ぶ
# A * X がY以上になってもいけない点に注意
while A * X <= X + B and A * X < Y:
    X *= A
    ans += 1

ans += (Y - 1 - X) // B
print(ans)
```


## E - Traveling Salesman among Aerial Cities
解けなかった... Difficulity 1200程度ってまじかー.  

最小全域木の類題って気づけるかどうか, という問題. 
（追記: 蟻本に載ってる巡回セールスマンの典型問題のようです。勉強不足。。）

考え方は以下の通り.

- 前提として, **各都市を2度以上訪れる必要はない**. 入力例2がミスリーディングなのだが, 途中で都市1に戻らないルートでも最短距離になる. 
- さて, ***現在地が都市2, 都市1,2,4を訪問済***の場合の最小コスト を$[2, \{1, 2, 4\}]$と表すとする.
- すると, $[3, \{1, 2, 3, 4\}]$は, 次の2つの値のうちの最小値となる. $[2, \{1, 2, 4\}] + dist(2, 3)$,  $[4, \{1, 2, 4\}] + dist(4, 3)$.  （なお, $[1, \{1, 2, 4\}]$はさきほどの前提により考慮不要であることに注意）
- この操作を$[1, \{1\}]$から始めて, $[i, \{1, 2, \dots, N\}](i = 2, \dots, N)$まで順に求める.
- そして最後に, $[i, \{1, 2, \dots, N\}] + dist(i, 1)$の最小値を求めばそれが答えとなる.  
- 状態の数が約$ (N-1)\cdot 2^{N-1}$, 各状態からの次の移動先は最大$N - 1$個. したがって, $\mathcal{O}((N - 1)^2\cdot 2^{N-1}) \simeq 10^7$ で間に合う.


実装もけっこう難しい.  
- 訪問済都市を表す集合をbit列で表現する: $\{1, 3, 5\} \rightarrow 2^1 + 2 ^ 3 + 2 ^ 5 = 10101$ 
- 配列に情報を保持する: $[i, bit] \rightarrow dp[i][bit]$

```python
from itertools import combinations


def dist(S, G):
    a, b, c = S
    p, q, r = G
    return abs(p - a) + abs(q - b) + max(0, r - c)


INF = float('inf')

N = int(input())
city = [tuple(map(int, input().split())) for _ in range(N)]

dp = [[INF] * (1 << N) for _ in range(N)]
dp[0][1] = 0  # 現在都市0で都市0のみに訪問済 = コスト0

for k in range(N - 1):  # (都市0以外で)k個の都市に訪問済
    for S in combinations(range(1, N), k):  # (都市0以外の)訪問済の都市の組み合せを全探索
        S = set(S)
        S.add(0)  # 都市0は常に訪問済

        bit = 0
        for s in S:
            bit |= (1 << s)  # bit列に変換
        
        for i in S:  # i: 現在の都市
            for j in [x for x in range(N) if x not in S]:  # j: 次に訪問する都市
                nbit = bit | (1 << j)  # nbit: 都市jに訪問後のbit列
                # dp[i][bit] --> dp[j][nbit] へと遷移する
                dp[j][nbit] = min(dp[j][nbit], dp[i][bit] + dist(city[i], city[j]))

# 全都市訪問済の状態から, 都市0へと戻ってくる. 最小値が答え.
print(min(dp[i][-1] + dist(city[i], city[0]) for i in range(1, N)))
```

## F - Unbranched
TBA
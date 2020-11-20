---
title: 【Python】ABC181 解説
date: 2020-11-01T00:00:00.000Z
description: AtCoder Regular Contest 181(ABC181)に参加しました。 結果はA~E5完384位パフォーマンス1756。久々のレートアップです。 A~F問題の解説およびPython解答例を掲載します.
slug: abc-181-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC181に参加しました. 結果はA~E5完$384$位パフォーマンス$1756$. 
久しぶりにレートアップしました.  

![ranking_abc181](ranking_abc181.png)

以下, A~F問題の解説およびPython解答例です.

## A - Heavy Rotation
公式解説の通り. 

```python
N = int(input())
ans = 'White' if N % 2 == 0 else 'Black'
print(ans)
```

## B - Trapezoid Sum
等差数列の和の公式を使用する.

- $S_n = \frac{n}{2} (a_1 + a_n)$  
*$a_1$:初項, $a_n$:末項, $n$:項数*

```python
N = int(input())
cnt = 0
for _ in range(N):
    A, B = map(int, input().split())
    n = B - A + 1  # n: 項数
    cnt += (A + B) * n // 2  # 等差数列の和の公式
print(cnt)
```

## C - Collinearity
中学数学に出てきそうな問題.  
考え方は以下の通り.
- 2点$(x_1, y_1), (x_2, y_2)$を通る直線は以下のように表される.  
$y - y_1 = \frac{y_2 - y_1}{x_2 - x_1} (x - y_1) \cdots ①$
- したがって, 直線①が点$(x_3, y_3)$を通る条件は以下の式が成り立つことである,  
$y_3 - y_1 = \frac{y_2 - y_1}{x_2 - x_1} (x_3 - y_1) \cdots ②$
- 実装上は, 分数をなくすために以下のように変形した式を用いる.  
$(x_2 - x_1)(y_3 - y_1) = (y_2 - y_1)(x_3 - y_1) \cdots ②'$

```python
N = int(input())
v = [tuple(map(int, input().split())) for _ in range(N)]

for i in range(N - 2):
    x1, y1 = v[i]
    for j in range(i + 1, N - 1):
        x2, y2 = v[j]
        for k in range(j + 1, N):
            x3, y3 = v[k]
            if (x2 - x1) * (y3 - y1) == (y2 - y1) * (x3 - x1):  # 式②'
                print('Yes')
                exit()

print('No')
```

## D - Hachi
下$3$桁が$8$の倍数となる数を作れるか？と言う問題.  
$0$が入っていないので考察が楽になっている.  


```python
from collections import Counter


S = list(map(int, list(input())))
C = Counter(S)

if len(S) == 1:
    ans = 'Yes' if S[0] % 8 == 0 else 'No'
elif len(S) == 2:
    T1 = S[0] * 10 + S[1]
    T2 = S[0] + S[1] * 10
    ans = 'Yes' if (T1 * T2) % 8 == 0 else 'No'
else:
    for i in range(100, 1000):
        if i % 8 == 0:
            t1 = i % 10
            t2 = (i // 10) % 10
            t3 = (i // 100) % 10
            T = Counter([t1, t2, t3])
            if C & T == T:  # TがCの部分集合となっているとき, Sからiを作ることができる.
                ans = 'Yes'
                break
    else:
        ans = 'No'
print(ans)
```

## E - Mex Mat
考察は比較的簡単だと思うが, 実装が難しい.  
添字の扱いに非常に混乱した.. 

考え方は公式解説の通り.  


```python
from bisect import bisect_left


N, M = map(int, input().split())
H = list(map(int, input().split()))
W = list(map(int, input().split()))

H.sort()
W.sort()

D0 = [0] * (N // 2)  # D0[i]: 0-1, 2-3, 4-5,..., の差分
D1 = [0] * (N // 2)  # D1[i]:   1-2, 3-4, 5-6,...,の差分
for i in range(N // 2):
    j = i * 2
    D0[i] = H[j + 1] - H[j]
    D1[i] = H[j + 2] - H[j + 1]

S0 = [0] * (N // 2 + 1) # S0: D0の累積和
S1 = [0] * (N // 2 + 1) # S1: D1の累積和
for i in range(N // 2):
    S0[i + 1] = S0[i] + D0[i]
    S1[i + 1] = S1[i] + D1[i]

ans = float('inf')
for w in W:
    i = bisect_left(H, w)  # i: wを挿入する位置
    i -= i % 2  # iが偶数->i+1とペア, iが奇数->i-1とペアとなる. 後の計算を簡略化するためiを偶数とする.
    cnt1 = S0[i // 2]          # cnt1: 0-1, 2-3,...,(i-2)-(i-1)のペアの和
    cnt2 = S1[-1] - S1[i // 2] # cnt2: (i+1)-(i+2), ..., (N-1)-Nのペアの和
    cnt3 = abs(H[i] - w)       # cnt3: w-iのペアの和 
    cnt = cnt1 + cnt2 + cnt3
    ans = min(ans, cnt)
print(ans)
```

## F - Silver Woods
解説AC.  
考察が難しく、実装が簡単な問題.  


以下、$\mathcal{O}(N^4)$解法.  pypyであれば十分に通る.  
二分探索を使うことで$\mathcal{O}(N^2log(N^2))$となる. 
```python
from math import sqrt


class UnionFind():
    # 割愛
    # find(x): xの親のノード番号を返す
    # union(x, y): xのブループとyのグループを統合する


N = int(input())
P = [tuple(map(int, input().split())) for _ in range(N)]

dist = [[0] * (N + 2) for _ in range(N + 2)]  # dist[i][j]: 点iと点jの距離
dist[N][N + 1] = dist[N + 1][N] = 200　　# Nをy=100の直線, N+1をy=-100の直線としている.
for i in range(N):
    x, y = P[i]
    dist[i][N] = abs(100 - y)
    dist[i][N + 1] = abs(-100 - y)
for i in range(N - 1):
    for j in range(i + 1, N):
        x1, y1 = P[i]
        x2, y2 = P[j]
        dist[i][j] = sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

R = []  # R: すべてのdist[i][j]. この中に答えがある. 
for i in range(N + 1):
    for j in range(i + 1, N + 2):
        R.append(dist[i][j] / 2)
R.sort(reverse=True)

for r in R:  # Rを大きい順に探索. 最初に上下の直線がつながらなかったrが答え. 
    uf = UnionFind(N + 2)
    for i in range(N + 1):
        for j in range(i + 1, N + 2):
            if dist[i][j] < 2 * r:
                uf.union(i, j)
    if uf.find(N) != uf.find(N + 1):  # N と N+1 がつながっていない場合、それが答えとなる.
        ans = r
        break

print(ans)
```

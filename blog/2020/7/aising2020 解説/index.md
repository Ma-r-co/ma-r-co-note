---
title: 【Python】エイシング プログラミング コンテスト 2020 解説
date: 2020-07-11T00:00:00.000Z
description: Aising2020のPython解答・解説を載せます。
slug: aising-2020-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - Aising
keywords: Python
---


リアルタイムでは参加できなかったので, バチャコンで参加. 結果はぎりぎり4完. コンテストであれば1400位くらいの成績でしょうか.    
Pythonでの解答・解説を載せます.  

疑問点・不明点など, ページ最下部のお問合せもしくはTwitterからメッセージいただければ回答いたします.  

## A - Number of Multiples
全探索してもいいし, 一発で求めることも可能.  

```python
L, R, d = map(int, input().split())
print(R // d - L // d + (L % d == 0))  # Lがdの倍数のケースを考慮
```


## B - An Odd Problem
下記の性質を利用する.  

- マスの番号とマスに書かれた整数が**ともに**奇数 $\Leftrightarrow$ マスの番号 * マス書かれた整数 が奇数

```python
N = int(input())
A = map(int, input().split())
cnt = 0
for i, a in enumerate(A):
    if ((i + 1) * a) % 2:
        cnt += 1
print(cnt)
```

Pythonicに書くなら、リスト内包表記を使ってこんな感じか.  
```python
N = int(input())
A = map(int, input().split())
print(sum(((i + 1) * a) % 2 for i, a in enumerate(A)))
```

## C - XYZ Triplets
$1\leq x, y, z\leq \sqrt{N}$ の範囲で全探索する.  

僕の回答では若干遠回りして計算量を減らしている.  
(こんなことをしなくてもACできるのでやらないほうがよい.)

$x, y, z$の対称性に注目して, $x\leq y\leq z$の条件で探索する.  


```python
from math import sqrt


# x, y, zの組合せ数を算出する
# 例えば (x, y, z) = (1, 1, 3)だったら, 3通りのバリエーションが存在する.
# (1, 1, 3), (1, 3, 1), (3, 1, 1)
def check(i, j, k):
    cnt = set([i, j, k])
    if len(cnt) == 1:
        return 1
    if len(cnt) == 2:
        return 3
    if len(cnt) == 3:
        return 6


N = int(input())
ans = [0] * N

R = int(sqrt(N))
for x in range(1, R + 1):
    for y in range(x, R + 1):
        for z in range(y, R + 1):
            f = (x ** 2) + (y ** 2) + (z ** 2) + (x * y) + (y * z) + (z * x)
            if f <= N:
                ans[f - 1] += check(x, y, z)
print(*ans, sep='\n')
```

## D - Anything Goes to Zero
ここ最近のDの中では一番難しかった. 

この問題の解法は、大雑把に言えば以下の2つのパートに別れる.  
1. $X = 2^{200000}$ (10進表記)のとき, $popcount(X)$を求めよ.
2. $X = 100000$ (10進表記)のとき, $f(X)$を求めよ.  

$1, 2$で本質的には同じ関数の値を算出するにも関わらず、両者で異なるアルゴリズムが求められる. これが難しさの主な要因だろう.  

まず1について.  

-  $X$がとてつもなく大きいため, 単純な割り算すらできない.  
-  そこで, $X = x_0*2^0 + x_1*2^1 + x_2 * 2^2+\cdots+x_{2^{200000}}*2^{200000}$ に注目して, $popcount(X)$を算出する.  ($x_i$は2進表示での下位$i$番目の数 $0 or 1$ )
- $1$の個数を$e$とすると, $popcount(X) = X \bmod e = (x_0*2^0) \bmod e + (x_1*2^1) \bmod e+ (x_2 * 2^2) \bmod e + \cdots$ となる. これは$\mathcal{O}(N)$で求められる.
- この考え方を拡張して, $popcount(X_1), popcount(X_2), \dots$を求めるために, $X \bmod {(e-1)}$, $X \bmod {(e+1)}$ を事前に算出しておく. (累積和と似た考え方) 

2について.
 - 定義通りに算出すればOK.
 - メモ化再帰を使うとさらに高速に.  

```python
from collections import Counter
import sys
sys.setrecursionlimit(10 ** 6)


# 解法パート2
def dfs(n):
    if memo[n] >= 0:
        rst = memo[n]
    else:
        tmp = n
        one = 0
        while tmp > 0:
            one += tmp & 1
            tmp >>= 1
        m = n % one
        rst = 1 if m == 0 else 1 + dfs(m)
        memo[n] = rst
    return rst


N = int(input())
X = list(map(int, list(input())))
one = Counter(X)[1]

# 解法パート1の前処理.
# Xがオール0のとき, 1が一つしか含まれないとき、を場合分けする
if one > 1:
    Sm = 0
    mm = one - 1
    tm = 1
    for i in range(N - 1, -1, -1):
        tm %= mm
        if X[i] == 1:
            Sm += tm
            Sm %= mm
        tm *= 2

Sp = 0
mp = one + 1
tp = 1
for i in range(N - 1, -1, -1):
    tp %= mp
    if X[i] == 1:
        Sp += tp
        Sp %= mp
    tp *= 2


memo = [-1] * (2 * (10 ** 5) + 10)
memo[0] = 0


# f(Xi)を求めていく処理
# 解法パート1とパート2を順に適用する
for i in range(N):
    # 解法パート1
    if X[i] == 0:
        m = (Sp + pow(2, N - 1 - i, mp)) % mp
    elif one > 1:
        m = (Sm - pow(2, N - 1 - i, mm)) % mm
    else:  # X[i] == 1 かつ 全体で1が一つしかない 場合 は必ず0になる
        print(0)
        continue
    cnt = 1

    # 解法パート2
    cnt += dfs(m)
    print(cnt)
```

## E - Camel Train

考察の難易度は低いが, 時間内に解くとなるとかなり難しそう.


考え方は以下の通り. 想定解答とは逆の考え方(点数を極力減らさない並べ方)をした.

まず、ラクダを3つのグループに分ける. 1: $L > R$, 2: $L < R$, 3: $L == R$.  
グループ3はどこに配置しても答えは変わらないため考察不要.  
以下、グループ1について考察する. 
- グループ1のラクダは極力左側に配置してあげると点数が高くなる. 最大で $\sum_{i} L_i$となる可能性があるが, 実際は$K_i$より右側に配置されたラクダの分、点数が $L_i - R_i$ だけ小さくなる.  
- では、どのような場合に$K_i$より右側に配置されるラクダが存在するのか？
- 例えば、{$K_i = 1$のラクダが$2$頭}の場合、どちらか1頭は$K_i$より右側に配置される. {$K_i=1$ が $2$頭, $K_i=2$ が $1$頭}の場合は**3頭中の1頭**, {$K_i=1$ が $2$頭, $K_i=2$ が $2$頭}の場合は**4頭中の2頭**, etc...
- つまり, $K_i$以下のラクダが$n$頭存在する場合, $n - i$頭は右側に配置されるのである.  
- では次に、どのラクダを右側に配置するべきか？
- これは点数の減少幅がもっとも小さいラクダ、すなわち $L_i - R_i$ が小さいラクダを右側に配置すべきである.  
- グループ2についても同様に, 極力右側に配置して, どのラクダが左側に溢れてしまうかを考える.  


```python
import sys
from heapq import heappop, heappush


T = int(input())
for t in range(T):
    N = int(input())
    left, right = [], []  # left: グループ1, right: グループ2
    ans = 0
    for i in range(N):
        K, L, R = map(int, sys.stdin.readline().split())
        if L > R:  # グループ1
            ans += L
            left.append((K, L - R))
        elif L < R:  # グループ2
            ans += R
            right.append((K, R - L))
        else:  # グループ3
            ans += L
    # グループ1について計算
    pool = []  # Kiより左側に配置されるラクダの集合. L-Rの小さい順に格納される.
    left.sort()  #Kiの順にソート
    cur = 0
    pos = 1  # 左からpos番目以下のラクダについて計算
    while cur < len(left):
        # Ki <= pos のラクダをすべてpoolに格納する 
        while cur < len(left) and left[cur][0] == pos:
            k, d = left[cur]
            heappush(pool, d)
            cur += 1

        # pool内のラクダがpos頭を超えている場合, 一部のラクダは右側に配置される.　その分だけ答えが減る.
        while len(pool) > pos:
            d = heappop(pool)
            ans -= d  # 答えがLi-Riだけ小さくなる
        pos += 1
            
    # グループ2について計算
    pool = []
    pos = N
    right.sort(reverse=True)
    cur = 0
    while cur < len(right):
        while cur < len(right) and right[cur][0] == pos:
            k, d = right[cur]
            heappush(pool, d)
            cur += 1
        while len(pool) > N - pos:
            d = heappop(pool)
            ans -= d
        pos -= 1

    print(ans)
```

## F - Two Snuke
TBA
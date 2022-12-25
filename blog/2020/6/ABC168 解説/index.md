---
title: 【Python】ABC168 解説
date: 2020-06-26T00:00:00.000Z
description: AtCoder Beginner Contest 168(ABC168)をPythonで解答・解説します.
slug: abc-168-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC168を回顧します.  
4完703位でした. 早解きに助けられました.


## A - ∴ (Therefore)
Aにしては難しい方では？  
A〜C問題では, 如何にミスを減らせるか, コーナーケースに足を掬われないかが重要.  
問題文の流れに沿って素直に実装する.  
```python
N = int(input())
n = N % 10

if n in [2, 4, 5, 7, 9]:
    ans = 'hon'
elif n in [0, 1, 6, 8]:
    ans = 'pon'
else:
    ans = 'bon'

print(ans)
```

## B - ... (Triple Dots)
String型のスライスを利用.
```python
K = int(input())
S = input()

N = len(S)

if N <= K:
    print(S)
else:
    print(S[:K] + '...')
```

## C - : (Colon)
想定解では余弦定理を使うらしいが, まったく思いつかなかった.  
というか存在を忘れていた. まじで10年ぶりに聞いた気がする.

[平面座標の三角関数表示](http://www.core.kochi-tech.ac.jp/m_inoue/work/pdf/2004/nyumon04/39.pdf)を利用して座標を求め, 2点間の距離を求めた.  

数Ⅱを学習した人にとっては楽勝だろう.  


```python
from math import sin, cos, pi, sqrt


A, B, H, M = map(int, input().split())

# 動径を求める. 12時(π/2) スタートかつマイナス方向に動くことに注意.
x = pi / 2 - 2 * pi * M / 60
y = pi / 2 - 2 * pi * (60 * H + M) / 720

# 短針・長針の先端の座標を求める.
x1, y1 = (B * cos(x), B * sin(x))
x2, y2 = (A * cos(y), A * sin(y))

# 2点間の距離を求める.  
l = sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
print(l)
```

## D - .. (Double Dots)
Dijkstra法の典型問題.  
ダイクストラ＋最短経路の復元 という題材だが, 最短経路復元は[Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%80%E3%82%A4%E3%82%AF%E3%82%B9%E3%83%88%E3%83%A9%E6%B3%95#%E6%93%AC%E4%BC%BC%E3%82%B3%E3%83%BC%E3%83%89)にも載っているくらい典型中の典型. アルゴリズムの一部と言ってもよいので覚えておこう.  

ちなみに, Pythonで最短経路問題を解く際は, たいていの場合DijkstraよりもBFSの方が速い.  
おそらくheapqのオーバーヘッドがかなり大きいのだと思われる. 

ちょっと問題文がひっかけになっていて, 'Yes' or 'No'を出力することになっているけど, 下記の制約により絶対に'Yes'になる. 'No'のケースは存在し得ない.

> どの$2$部屋間も、通路をいくつか通って行き来できます。


```python
import sys
from collections import deque


N, M = map(int, input().split())
edge = [set() for _ in range(N)]
for _ in range(M):
    a, b = map(int, sys.stdin.readline().split())
    a -= 1; b -= 1
    edge[a].add(b)
    edge[b].add(a)

INF = 10 ** 8
path = [INF] * N
prev = [0] * N

# BFSで解く.
q = deque()
path[0] = 0
q.append((0, 0))

while q:
    v, s = q.popleft()
    ns = s + 1
    for nv in edge[v]:
        if path[nv] > ns:
            path[nv] = ns
            prev[nv] = v
            q.append((nv, ns))

print('Yes')  # 絶対に'Yes'になる
for i in range(N - 1):
    print(prev[i + 1] + 1)
```

## E - ∙ (Bullet)
$A_i:B_i = B_j:A_j\Leftrightarrow A_i\cdot A_j - B_i\cdot B_j=0$  
という公式を思い出した. この問題こそ「: (Colon)」が相応しい.  

コンテスト中には解けず, 解説AC.  
実装はかなり難しい.

基本的な方針は,
- $A_i$, $B_i$ の([比], 符号)というタプルを管理する.
- [比]は大きく4つのグループに別れる: [0, 0], [0, b], [a, 0], [a, b]
- [0, 0]は, 符号に関係なく, 1匹単独でしか選べない.
- [0, b]と[a, 0]は, 符号に関係なく, 一緒には選べない.
- ([a, b], +)と([b, a], -)は一緒には選べない.


```python
from collections import defaultdict
from math import gcd
import sys


MOD = 10 ** 9 + 7
N = int(input())

# 各イワシをグループ分けする
sar = defaultdict(int)
zero = 0
for s in sys.stdin.readlines():
    A, B = map(int, s.split())
    if (A, B) == (0, 0):
        zero += 1
    else:
        a = abs(A)
        b = abs(B)
        x = gcd(a, b)
        if a == 0:
            # 便宜上, 符号を'-'(=1)とする
            # なお, 必ず(0, 1, 1)となるため, 下記の計算(b // x)は実は不要.
            sar[(0, b // x, 1)] += 1
        elif b == 0:
            # 便宜上, 符号を'+'(=0)とする
            # なお, 必ず(1, 0, 1)となるため, 下記の計算(a // x)は実は不要.
            sar[(a // x, 0, 0)] += 1
        else:
            # 符号'+' = 0, '-' = 1
            sar[(a // x, b // x, int((A >= 0) ^ (B >= 0)))] += 1

ans = 1
done = set()
for k in list(sar.keys()):
    a, b, c = k
    if (a, b, c) not in done:
        cnt = pow(2, sar[(a, b, c)], MOD) + pow(2, sar[(b, a, c ^ 1)], MOD) - 1  # -1を忘れないこと
        ans *= cnt
        ans %= MOD
        done.add((a, b, c))
        done.add((b, a, c ^ 1))

ans -= 1  # すべて0匹選んだケースを除く
ans += zero # [0, 0]の鰯

print(ans % MOD)
```

## F - . (Single Dot)
解説はmaspyさんのHPを参照.  
[[AtCoder 参加感想] 2020/05/18:ABC 168](https://maspypy.com/atcoder-%e5%8f%82%e5%8a%a0%e6%84%9f%e6%83%b3-2020-05-18abc-168)

maspyさんが解けてないんだから相当難しいということだろう. さすが橙色diff.

方針はすぐに理解できたが, 実装がめちゃくちゃ難しかった.  
Pythonの速度ではかなり厳しい. 細かい高速化を施してやっとACできた.  

めっちゃ頑張った結果, pypy3で2502ms!! メモリ353MB!!  
仮に答えを知っていたとしても, コンテスト中にACするのは無理だったろうな.

```python
# 普段はmainで囲うことはないんだけど, あまりにも時間制約が厳しいので,,,
def main():
    import sys
    readline = sys.stdin.readline
    # readlines = sys.stdin.readlines
    from collections import deque
    from bisect import bisect_left

    N, M = map(int, input().split())
    tate = []
    yoko = []
    X = set()
    Y = set()
    for _ in range(N):
        A, B, C = map(int, readline().split())
        X.add(A)
        X.add(B)
        Y.add(C)
        tate.append((C, A, B))
    for _ in range(M):
        D, E, F = map(int, readline().split())
        X.add(D)
        Y.add(E)
        Y.add(F)
        yoko.append((D, E, F))

    # 座標圧縮. X軸方向にH個, Y軸方向にW個の座標が存在.
    X = sorted(list(X))
    Y = sorted(list(Y))
    H = len(X)
    W = len(Y)

    # (i, j)が長方形セル(X[i], Y[j]) ~ (X[i + 1], Y[i + 1])を表すとする.
    # あるセルから隣のセルに移動可能かどうかを求める.(可能:1, 不可能:0)
    # 当初は4方向に対応してwall[H][W][4]としていたがこれだとTLE&MLEでどちらもアウト.
    # よって, ビット列で情報を持つことにした. '0000' → '左下右上'.
    wall = [[15] * W for _ in range(H)]
    for c, a, b in tate:
        ia = bisect_left(X, a)
        ib = bisect_left(X, b)
        jc = bisect_left(Y, c)

        # ia番目からib番目のセルでは, jc - 1 <-> jc のY軸方向(左右)への移動が不可.
        for i in range(ia, ib):
            wall[i][jc - 1] &= 15 - (1 << 1)
            wall[i][jc] &= 15 - (1 << 3)

    for d, e, f in yoko:
        id = bisect_left(X, d)
        je = bisect_left(Y, e)
        jf = bisect_left(Y, f)

        # je番目からjb番目のセルでは, id - 1 <-> id のX軸方向(上下)への移動が不可.
        for j in range(je, jf):
            wall[id - 1][j] &= 15 - (1 << 2)
            wall[id][j] &= 15 - (1 << 0)

    # スタート地点の座標の求め方が既に難しい.
    q = deque()
    x0 = bisect_left(X, 0) - (0 not in X)
    y0 = bisect_left(Y, 0) - (0 not in Y)
    # スタート地点が右端or下端の場合はINFとなる.
    if x0 == H - 1 or y0 == W - 1:
        print('INF')
        exit()

    # 訪問済かどうかをpathで管理する. (True: 未訪問, False: 訪問済)
    # 当初はpath[H][W]としていたが、更なる高速化のため1次元配列として持つ.
    path = [True] * (W * H)
    path[x0 * W + y0] = False
    q.append((x0, y0))
    direction = ((-1, 0), (0, 1), (1, 0), (0, -1))  # 0:上, 1:右, 2:下, 3:左
    cnt = 0
    while q:
        x, y = q.popleft()
        cnt += (X[x + 1] - X[x]) * (Y[y + 1] - Y[y])
        for i, (dx, dy) in enumerate(direction):
            # 現在地から方向iに移動可能な場合
            if wall[x][y] & (1 << i):
                nx = x + dx
                ny = y + dy
                # 範囲外に到達してしまう場合はINF.
                if 0 <= nx < H - 1 and 0 <= ny < W - 1:
                    if path[nx * W + ny]:
                        path[nx * W + ny] = False
                        q.append((nx, ny))
                else:
                    print('INF')
                    exit()
    print(cnt)


if __name__ == "__main__":
    main()
```

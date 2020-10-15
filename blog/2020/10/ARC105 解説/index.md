---
title: 【Python】ARC105 解説
date: 2020-10-11T00:00:00.000Z
description: AtCoder Regular Contest 105(ARC105)のPythonによる解答・解説を載せます.
slug: arc-105-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ARC
keywords: Python
---

ARC105はリアルタイム参加できず、バーチャル参加しました.  結果はABD3完108:21.   
もし出ていたなら450位パフォーマンス1800（過去最高!）くらいでしょうか.  

以下, A~D問題の解説およびPython解答例です.

## A - Fourtune Cookies
各クッキーを 食べる/食べない の$2^4$通りを全探索する.  

実装はbit探索で. `itertools.product()`を使用すると楽.  

```python
from itertools import product

C = list(map(int, input().split()))
S = sum(C)
for bit in product(range(2), repeat=4):
    eat = sum(C[i] * bit[i] for i in range(4))
    if S == 2 * eat:
        print('Yes')
        exit()
print('No')
```

## B - MAX-=min
gcdを求めるだけ.  

```python
from math import gcd


N = int(input())
A = list(map(int, input().split()))

cnt = 0
for a in A:
    cnt = gcd(cnt, a)

print(cnt)
```

## C - Camels and Bridge
解説AC.  
これは考察も実装も難しい...  


```python
import sys
from itertools import permutations, accumulate
from bisect import bisect_left


N, M = map(int, input().split())
W = list(map(int, input().split()))
P = [tuple(map(int, sys.stdin.readline().split())) for _ in range(M)]
INF = float('inf')

# 前提条件: 対荷重viの最小値 >= ラクダ体重wiの最大値
if max(W) > min(v for _, v in P):
    print(-1)
    exit()

# パーツのうち「自分より"短い かつ 対荷重が大きい"パーツが存在しないもの」を抽出する.
# まずパーツを長さliの昇順にソートして, 右側のパーツから条件を満たすものを順に探していく.
P.sort(key=lambda x: (x[0], -x[1]))
cur = INF
bridge_l = []  # 条件を満たすパーツの長さliの配列
bridge_v = []  # 条件を満たすパーツの対荷重viの配列
for l, v in reversed(P):
    if v < cur:
        bridge_l.append(l)
        bridge_v.append(v)
        cur = v
bridge_l.append(0)  # 番兵として最後尾に0を追加
bridge_v.append(0)  # 番兵として最後尾に0を追加  
bridge_l.reverse()
bridge_v.reverse()

ans = INF
for order in permutations(W):
    H = list(accumulate(order)) + [0]  # H: ラクダ隊列の先頭からの累積和. 計算の都合上, N+1項目を0としていることに注意.
    pos = [0] * N  # pos: 各ラクダの座標. 先頭が原点0.
    for i in range(1, N): # i: i頭目のラクダ(0-index). 前方から貪欲に決めていく. 
        for j in range(i): # j: i頭目ラクダの前方のラクダ.
            w = H[i] - H[j - 1]  # w: j ~ i頭目ラクダの体重の合計
            idx = bisect_left(bridge_v, w)  # 重さwに耐えられる最短の距離間隔を求める.
            pos[i] = max(pos[i], pos[j] + bridge_l[idx - 1])
    ans = min(ans, pos[N - 1])

print(ans)
```

## D - Let's Play Nim
[ABC172-F](https://marco-note.net/abc-172-work-log/#f---unfair-nim)の経験が活かされた.  

まず前提として, Nimというゲームは初期状態でどちらのプレイヤーが勝つか決まっている.  
>  初期状態の各山の石の数のxorをとり、それが0で無ければ先手必勝、0であれば後手必勝です
> <cite> [千葉大学電子計算機研究会（CCS）](https://densanken.com/wiki/index.php?Nim)</cite>

で, 今回の問題では2つのフェイズに別れてゲームが進行するが, 後半フェイズはNimである.  
1. コインを袋から皿に移す
2. 皿からコインを取る ($\rightarrow$ これはまさにNimである)

したがって, フェイズ2の開始時点で勝者は決まっている.  
この考え方をもう少し深堀りすると解法が見えてくる.  
- フェイズ2の開始時点で, **各皿のコイン枚数の$xor$を$0$にできるか？**  これは直感的に難しそうなことがわかる. 例えば$N = 1$だと不可能だし, $N = 2$だったら2つの袋が同じ枚数でないと実現できない. 
- そのため, フェイズ2の開始時点では(ほとんどの場合に)$xor$ != $0$, すなわち手番を持っている方が勝つ, ということが言えそう. $N$が偶数 $\rightarrow$ $First$, $N$が奇数 $\rightarrow$ $Second$ である.
- では, フェイズ2の開始時点で$xor$を$0$にすることは可能だろうか? 
- 結論を言うと, **すべての袋について, 同じ枚数入りのペアとなる袋が存在すれば可能**である. 後手側が常に先手の動きを真似すれば, 先手側がどのような動いたとしても$xor$の状態を作り出すことができる. ex) 先手が2枚入の袋を新しい皿に移す $\rightarrow$ 後手は2枚入の袋を別の新しい皿に移す

実装はとても簡単.

```python
from collections import Counter


T = int(input())
for _ in range(T):
    N = int(input())
    A = list(map(int, input().split()))

    if N % 2 == 1:
        ans = 'Second'
    else:
        C = Counter(A)
        if all(v % 2 == 0 for v in C.values()):
            ans = 'Second'
        else:
            ans = 'First'
    print(ans)
```

## E - Keep Graph Disconnected
TBA

## F - Lights Out on Connected Graph
TBA

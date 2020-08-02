---
title: 【Python】ABC174 解説
date: 2020-08-02T00:00:00.000Z
description: AtCoder Beginner Contest 174(ABC174)に参加しました. 結果は5完1318thでパフォーマンス1417. Pythonによる解答・解説を載せます.
slug: abc-174-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC174に参加しました. 
結果は5完1318thでパフォーマンス1417... 実力相応かなと..

C問題が難しかった一方で、DとEは易化傾向だったと感じます.

## A - Air Conditioner
```python
ans = 'Yes' if int(input()) >= 30 else 'No'
print(ans)
```

## B - Distance
B問題で$10^5$オーダーは珍しい.

```python
import sys

N, D = map(int, input().split())
cnt = 0
for s in sys.stdin.readlines():
    x, y = map(int, s.split())
    d = pow(x, 2) + pow(y, 2)
    cnt += (d <= pow(D, 2))
print(cnt)
```


## C - Repsept
ここ最近のC問題の中では一番難しかったような.

考え方は以下の通り.
- $7777....7=7*10^0 + 7*10^1 + 7*10^2 + \cdots + 7*10^n$ であることを利用する.
- $a_0 = 7 * 10^0$, $a_1 = 7*10^0 + 7*10^1$, ...とすると, $a_i = a_{i-1} + 7 * 10^i$ が成り立つ.  
- ここで, $a_i \bmod K = (a_{i-1}) \bmod K + (7 * 10^i)\bmod K$ が成り立つことを利用して, $a_0, a_1, a_2, a_3,\dots$を順番に計算し, 初めて$a_i \bmod K = 0$となる$i$が答えである.
- なお, $K$と$10$が互いに素でない場合は答えが存在しない。すなわち$-1$である.  (さらっと書いたが, この条件に辿り着くのがこの問題の一番の難所だと思う)


```python
K = int(input())

if K % 2 == 0 or K % 5 == 0:
    print(-1)
    exit()

i = 0
ai = 0
while True:
    ai += 7 * pow(10, i, K)  # ここは繰返し2乗法で求める. Pythonであればpow関数が使える.
    ai %= K
    i += 1
    if ai == 0: 
        break
print(i)
```

pow関数の部分は, $b_0 = 7 \bmod K,  b_i = (b_{i - 1} * 10)\bmod K$ を利用することでもっと速くすることができる.

## D - Alter Altar
公式解答とは若干異なる考え方を用いた.  
厳密な証明はしていないので悪しからず...

- $N=8, WRRWWWRR$ を例にして考える.
- まず, 最終的にどのような並びになっているか考えてみよう. 候補は$WWWWWWWW$, $RWWWWWWW$, $RRWWWWWW$, $\cdots$. つまり, どのような最終状態にせよ, 左にR、右にWが合計8つ並ぶことがわかる. 
- ここで, 最終状態→最初の状態への操作を考える. (最初→最後, 最後→最初 どちらも最小操作回数は同じになることが直感的にわかるはず)
- **パターン1: Rの数が最初と同じ場合**. つまり$RRRRWWWW$ → $WRRWWWRR$ の場合である. この遷移では左4つのRと右4つのWを適切に交換するだけでよく, 元々左にRが4個あったものが遷移後は2個しかないことより(4−2)回の交換を行えばよい.  
- では, **パターン2: Rの数が最初と違う場合**はどうなるか？ パターン1と比べて交換回数は減るかもしれないが, 石の色を変える操作が必要になる. これも直感的説明で申し訳ないが, 交換回数が1回減ったとしても, それに伴い石の色を変える回数が少なくとも1回は増えるはずだ.
- つまり, パターン1よりも操作回数を減らすことはできない. したがってこの問題は, パターン1のみを考えればよく,  「パターン1の遷移に何回の交換操作が必要か?」という単純な問題に帰着される.  


```python
N = int(input())
C = input()

R = C.count('R')  # 赤の個数
W = C.count('W')  # 白の個数
cnt = 0
for i in range(R):
    if C[i] == 'R':
        cnt += 1
print(R - cnt)
```

## E - Logs
公式解答通り.  
発想一発勝負の問題かな.

```python
N, K = map(int, input().split())
A = list(map(int, input().split()))


# (ng, ok] - Minimum
# ok が 最終的な答え
ok = max(A)
ng = 0
while abs(ok - ng) > 1:
    x = (ok + ng) // 2

    cnt = 0  # カット回数の合計
    for a in A:
        n = (a + x - 1) // x  # a/x の少数切上げ
        cnt += n - 1

    if cnt <= K:
        ok = x
    else:
        ng = x

print(ok)
```

## F - Range Set Query
TBA

公式解答を見てSegment木で実装してみたがTLEになってしまった...
これまで「BITだとAC, Seg木だとTLE」という問題には出会ったことがないのでこれが初めてのケースかも.
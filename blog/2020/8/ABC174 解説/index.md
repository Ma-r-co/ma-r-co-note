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
- $a_0 = 7 * 10^0$, $a_1 = 7*10^0 + 7*10^1$, ...とすると, $a_i = a_{i-1} * 10 + 7$ が成り立つ.  
- ここで, $a_i \bmod K = (a_{i-1} * 10) \bmod K + 7\bmod K$ が成り立つことを利用して, $a_0, a_1, a_2, a_3,\dots$を順番に計算し, 初めて$a_i \bmod K = 0$となる$i$が答えである.
- なお, $K$と$10$が互いに素でない場合は答えが存在しない。すなわち$-1$である.  (さらっと書いたが, この条件に辿り着くのがこの問題の一番の難所だと思う)


```python
K = int(input())

if K % 2 == 0 or K % 5 == 0:
    print(-1)
    exit()

i = 0
ai = 0
while True:
    ai = (ai * 10 + 7) % K
    i += 1
    if ai == 0:
        break
print(i)
```


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
公式解答を見てSegment木で実装してみたがTLEになってしまった...
今まで「BITだとAC, Seg木だとTLE」となる問題に出会ったことがないので, これが初めてのケースかも.

細かい高速化を重ねてようやくACすることができた.. pypyを使って約1500ms.

```python
import sys


class BinaryIndexedTree():
    '''
    1-indexed
    '''
    def __init__(self, A):
        self.__n = len(A)
        self.__node = [0] * (self.__n + 1)
        self.__data = [0] * (self.__n + 1)

        S = [0] * (self.__n + 1)
        for i in range(self.__n):
            S[i + 1] = S[i] + A[i]

        for i in range(1, self.__n + 1):
            self.__data[i] = A[i - 1]
            self.__node[i] = S[i] - S[i - (i & -i)]

    def add(self, i, v):
        self.__data[i] += v
        while i <= self.__n:
            self.__node[i] += v
            i += i & -i

    def sum(self, i):
        ''' [1, i]の和
        '''
        rst = 0
        while i > 0:
            rst += self.__node[i]
            i -= i & -i
        return rst
    
    def get(self, i, j):
        '''[i, j]の和
        '''
        if i == j:
            return self.__data[i]
        else:
            return self.sum(j) - self.sum(i - 1)


def main():
    N, Q = map(int, input().split())
    C = list(map(int, input().split()))

    P = [[] for _ in range(N)]
    for i, c in enumerate(C):
        P[c - 1].append(i)

    right = [0] * N
    for p in P:
        if len(p):
            right[p.pop()] = 1
    BIT = BinaryIndexedTree(right)

    query = [[] for _ in range(N)]
    for i in range(Q):
        l, r = map(int, sys.stdin.readline().split())
        query[r - 1].append((l - 1, i))

    ans = [None] * Q

    cur = N - 1
    for r, q in enumerate(reversed(query)):
        r = (N - 1) - r
        while q:
            l, i = q.pop()
            while r < cur:
                c = C[cur] - 1
                p = P[c]
                if len(p):
                    BIT.add(p.pop() + 1, 1)  # BITは1-indexedなので添字を調整
                cur -= 1
            ans[i] = BIT.get(l + 1, r + 1) # BITは1-indexedなので添字を調整

    print(*ans, sep='\n')


if __name__ == '__main__':
    main()
```

これは難しい..
解き方がわかってても本番中にACするのは不可能だな...
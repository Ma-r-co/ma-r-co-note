---
title: 【Python】HHKB プログラミングコンテスト 2020 解説
date: 2020-10-10T00:00:00.000Z
description: HKB プログラミングコンテスト 2020 のPythonによる解答・解説を載せます.
slug: hhkb2020-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
keywords: Python
---


HHKB プログラミングコンテスト 2020 にバーチャル参加しました。
結果は, A,B,C,Eの4完でした.

以下, A~E問題の解説および解答例です.

## A - Keyboard
`upper()`を使うと簡単.

```python
S = input()
T = input()
ans = T.upper() if S == 'Y' else T
print(ans)
```

## B - Futon
B問題でgridを扱う問題が出題されるのは珍しい気がする.  
grid上を全探索する.

```python
H, W = map(int, input().split())
# H行目, W列目に番兵(#)を追加する
grid = [list(input()) + ['#'] for _ in range(H)]
grid.append(['#'] * (W + 1))

cnt = 0
for i in range(H):
    for j in range(W):
        cnt += (grid[i][j] == '.' and grid[i + 1][j] == '.')
        cnt += (grid[i][j] == '.' and grid[i][j + 1] == '.')
print(cnt)
```

## C - Neq Min
公式解説と同じ方針.  
ある整数の登場(1)・未登場(0)を管理する配列を用意して, 配列を小さい方から順に探索して最初に未登場(0)となっている整数が答えである.  
毎回0から探索すると計算量が$\mathcal{O}(N^2)$となってしまうため, 答えが単調増加となる特徴を利用して前回の答えを記憶しておくことで計算量を減らす. 


```python
N = int(input())
P = list(map(int, input().split()))

memo = [0] * (200000 + 2)  # 整数の登場(1)・未登場(1)を管理する配列.
cur = 0  # 現在の答え. 0から単調増加する.

for p in P:
    memo[p] = 1
    while memo[cur] == 1:
        cur += 1
    print(cur)
```

## D - Squares
解説AC.  
うーん、解けそうで解けなかった. 

```python
import sys

MOD = 10 ** 9 + 7

T = int(input())
for _ in range(T):
    N, A, B = map(int, sys.stdin.readline().split())
    # X4
    if N - A - B < 0:
        X4 = 0
    else:
        X4 = ((N - A - B + 2) * (N - A - B + 1)) // 2
        X4 %= MOD
    
    # X3
    X3 = 2 * X4

    # X2
    X2 = (N - A + 1) * (N - B + 1) - X3
    X2 %= MOD

    # X1
    X1 = pow(X2, 2, MOD)

    # X0
    X0 = (pow(N - A + 1, 2, MOD) * pow(N - B + 1, 2, MOD)) % MOD
    
    ans = X0 - X1
    print(ans % MOD)
```

## E - Lamps
公式解説と同じ方針.  

実装時に悩んだのが「あるマスから上下左右方向にいくつ空マスが連続するか」を数える部分.  
DFSとかいろいろ考えて効率よく求めようとしたけど, 結局は愚直に1方向ずつ順に求める方法に落ち着いた. 

```python
H, W = map(int, input().split())
S = [input() for _ in range(H)]
MOD = 10 ** 9 + 7

# K: 空マスの個数
K = sum(S[i][j] == '.' for i in range(H) for j in range(W))

# Dx: あるマスから上下左右方向に連続する空マスの個数.
# Du Dr Dd Dl : 上 右 下 左
Du = [[0] * W for _ in range(H)]
Dr = [[0] * W for _ in range(H)]
Dd = [[0] * W for _ in range(H)]
Dl = [[0] * W for _ in range(H)]

# Dl, Dr を計算する
for i in range(H):
    Dl[i][0] = 0
    for j in range(W - 1):
        if S[i][j] == '.' and S[i][j + 1] == '.':
            Dl[i][j + 1] = Dl[i][j] + 1
    Dr[i][W - 1] = 0
    for j in range(W - 1, 0, -1):
        if S[i][j] == '.' and S[i][j - 1] == '.':
            Dr[i][j - 1] = Dr[i][j] + 1

# Du, Dd を計算する
for j in range(W):
    Du[0][j] = 0
    for i in range(H - 1):
        if S[i][j] == '.' and S[i + 1][j] == '.':
            Du[i + 1][j] = Du[i][j] + 1
    Dd[H - 1][j] = 0
    for i in range(H - 1, 0, -1):
        if S[i][j] == '.' and S[i - 1][j] == '.':
            Dd[i - 1][j] = Dd[i][j] + 1

# 2の累乗を事前計算しておくことで計算量を減らす.
# (これをやらなくても計算量上は間に合うはず(O(NlogN))なのだが, 
# これをやっておかないとTLEとなってしまう)
two = [0] * (K + 1)
two[0] = 1
for k in range(K):
    two[k + 1] = (two[k] * 2) % MOD

cnt = 0
D = [Du, Dr, Dd, Dl]
for i in range(H):
    for j in range(W):
        if S[i][j] == '.':
            k = sum(Dx[i][j] for Dx in D)  # k: マス(i,j)から上下左右方向に連続する空マスの個数
            T = K - 1 - k  # T: マス(i, j)を照らさない照明の置ける空マスの個数
            cnt += two[T]  # ここで pow(2, T, MOD) を使うとTLEとなってしまう.
            cnt %= MOD

ans = two[K] * K - cnt
print(ans % MOD)
```

## F - Random Max
TBA

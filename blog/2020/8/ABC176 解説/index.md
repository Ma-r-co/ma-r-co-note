---
title: 【Python】ABC176 解説
date: 2020-08-22T00:00:00.000Z
description: AtCoder Beginner Contest 176(ABC176)のPythonによる解答・解説を載せます.
slug: abc-176-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---


ABC176はリアルタイムでは参加できず.  
バチャでやってみましたが4完2WAで撃沈. (参加しなくて良かったー)

以下, A~F問題の解説および解答例です. [2020/08/25- F問題を更新しました]

## A - Takoyaki
`math.ceil(a / b)`の代わりに `(a + b - 1) // b` を用いるのは頻出テク.  
```python
N, X, T = map(int, input().split())
print(((N + X - 1) // X) * T)
```

## B - Multiple of 9

```python
N = input()
cnt = 0
for s in N:
    cnt += int(s)
    cnt %= 9
ans = 'Yes' if cnt % 9 == 0 else 'No'
print(ans)
```

## C - Step
最近のC問題と比較すると易化傾向.

```python
N = int(input())
A = list(map(int, input().split()))

height = A[0]
cnt = 0
for a in A:
    if a < height:
        cnt += (height - a)
    else:
        height = a
print(cnt)
```

## D - Wizard in Maze
01BFSの典型問題.  
公式解説にある下記の注意点については, 考慮しなかったがACできた.
> ただし、コスト1で追加された頂点がその後コスト0の移動のみで追加された際、2回同じ頂点が追加されることになるため、その点の実装に注意してください。  


```python
from collections import deque


H, W = map(int, input().split())
Ch, Cw = map(lambda x: int(x) - 1, input().split())
Dh, Dw = map(lambda x: int(x) - 1, input().split())
maze = [input() for _ in range(H)]

INF = 10 ** 12
path = [[INF] * W for _ in range(H)]  # path: 各マスへの移動コスト

# walk:移動A, warp:移動B
walk = [(0, 1), (0, -1), (-1, 0), (1, 0)]
warp = [(i, j) for i in range(-2, 3) for j in range(-2, 3) if (i, j) not in [(0, 0)] + walk]

q = deque()
path[Ch][Cw] = 0
q.append((Ch, Cw, 0))

while q:
    x, y, s = q.popleft()
    for dx, dy in walk:  # 移動A
        nx = x + dx
        ny = y + dy
        if 0 <= nx < H and 0 <= ny < W and maze[nx][ny] == '.' and path[nx][ny] > s:
            path[nx][ny] = s
            q.appendleft((nx, ny, s))  # 移動Aの場合はコスト0. キューの先頭に追加する.
    for dx, dy in warp:  # 移動B
        nx = x + dx
        ny = y + dy
        if 0 <= nx < H and 0 <= ny < W and maze[nx][ny] == '.' and path[nx][ny] > s + 1:
            path[nx][ny] = s + 1
            q.append((nx, ny, s + 1))  # 移動Bの場合はコスト1. キューの最後尾に追加する.
    
ans = path[Dh][Dw] if path[Dh][Dw] < INF else '-1'
print(ans)
```

## E - Bomber
解説AC.  
かなり難しく感じたが, DifficultyはDよりも低いのか..  

「ループが$M$回未満」 or 「ループは$10^{10}$回だが, $M + 1$回目で必ず答えが見つかる」. したがって, $\mathcal{O}(M)$.  
この発想は初めて見た気がする. 勉強不足である.  


```python
import sys


H, W, M = map(int, input().split())
bomb = [tuple(map(lambda x: int(x) - 1, s.split())) for s in sys.stdin.readlines()]
X = [0] * H  # X:各行の爆破対象の個数
Y = [0] * W  # Y:各列の爆破対象の個数
for h, w in bomb:
    X[h] += 1
    Y[w] += 1
maxX = max(X)
maxY = max(Y)

R = [h for h, x in enumerate(X) if x == maxX]  # R:爆破対象の数が最大となる行の番号
C = [w for w, y in enumerate(Y) if y == maxY]  # C:爆破対象の数が最大となる列の番号

bomb = set(bomb)
for r in R:
    for c in C:
        if (r, c) not in bomb:
            # (r, c)に爆破対象が存在しないとき, maxX + maxY が答えとなることが確定するため, 
            # 即座に探索を終了する. これによりループの回数は最大でもM+1回となる.
            print(maxX + maxY)
            exit()
print(maxX + maxY - 1)
```

## F - Brave CHAIN
解説AC.  
公式解説動画をほぼ写経しただけ.  

pypy3で1997ms!! (2回実行して2回とも通ったので, まぐれではないはず)

```python
from collections import deque


def upd(a, b, v):
    global N  # N の代わりに −1 を使用しても結果は同じだが, -1 だとなぜかTLEとなる. 
    dp[a][b] = max(dp[a][b], v)
    dp[b][a] = max(dp[b][a], v)
    dp[N][a] = max(dp[N][a], v)
    dp[N][b] = max(dp[N][b], v)
    dp[a][N] = max(dp[a][N], v)
    dp[b][N] = max(dp[b][N], v)
    dp[N][N] = max(dp[N][N], v)


N = int(input())
A = list(map(lambda x: int(x) - 1, input().split()))

INF = 1 << 32
dp = [[-INF] * (N + 1) for _ in range(N + 1)]
upd(A[0], A[1], 0)
base = 0

for i in range(2, 3 * N - 1, 3):
    x, y, z = A[i], A[i + 1], A[i + 2]
    if x == y == z:  # x, y, z 3文字すべて等しいとき
        base += 1
    else:
        q = deque()
        for _ in range(3):
            # a, b, x, y, z のうち, b, y, z を消すとき
            for k in range(N):
                v = dp[k][N]
                if y == z:
                    v = max(v, dp[k][y] + 1)
                q.append((k, x, v))
            # a, b, x, y, z のうち, a, b, z を消すとき
            v = max(dp[z][z] + 1, dp[N][N])
            q.append((x, y, v))
            # x, y, z をローテート
            x, y, z = z, x, y
        while q:
            a, b, v = q.popleft()
            upd(a, b, v)

l = A[-1]
ans = max(dp[N][N], dp[l][l] + 1)
print(ans + base)
```
---
title: 【Python】AtCoder - Introduction to Heuristics Contest 解説
date: 2020-06-28T00:00:00.000Z
description: 初めてのHeuristics Contestに参加しました. 結果はB問題しか解けず... Pythonによる参考解答・解説を載せます.
slug: introduction-to-heuristics-contest-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - HeuristicsContest
keywords: Python
---


Introduction to Heuristics Contestに参加しました. 結果はB問題しか解けず...1399位でした.
Pythonによる参考解答・解説を載せます.

初めて挑むHeuristics Contestでしたが難しかったです. 
サンプルが少なくバグに気づけない, 最初に曖昧な設計をしたせいで後半になるにつれエンハンスが難しくなるなど...  
単体テストを自動化するなどしてうまく開発していかないと厳しいですね.


## A - AtCoder Contest Scheduling
B問題の最後に説明のある貪欲法での解答.  
これで62634806点獲得できるはず.

```python
D = int(input())
C = list(map(int, input().split()))
S = [tuple(map(int, input().split())) for _ in range(D)]
Z = 26

last = [-1] * Z
T = []
for d in range(D):
    maxScore = -float('inf')
    cand = 0
    for i in range(26):
        tmp = last[i]
        last[i] = d
        up = S[d][i]
        down = sum(C[j] * (d - last[j]) for j in range(Z))
        score = up - down
        if maxScore < score:  # ここの比較を"<="にするかどうかで得点が変わりそう...試していないが..
            cand = i
            maxScore = score
        last[i] = tmp
    last[cand] = d
    T.append(cand + 1)
print(*T, sep='\n')
```

## B - Scoring
素直に実装.  

```python
D = int(input())
C = list(map(int, input().split()))
S = [tuple(map(int, input().split())) for _ in range(D)]
T = [int(input()) - 1 for _ in range(D)]
Z = 26

last = [-1] * Z
cnt = 0
for d, t in enumerate(T):
    last[t] = d
    up = S[d][t]
    down = sum(C[i] * (d - last[i]) for i in range(Z))
    cnt += up - down
    print(cnt)
```

<adsense></adsense>

## C - Incremental Scoring
コンテスト中にバグが取りきれなかった.  
後で気づいたのだが, $c_i$に$0$が存在するときに条件分けが不正になるバグであった. サンプルが少ないためこういったバグに気づけないのがつらい.  

方針としては, 
- **$last[d][i]$ではなく$last[i][d]$ともつ.** 各コンテスト$i$について長さ$D$の配列を持つイメージ. こうすることで, 変更のあったコンテストだけにフォーカスして得点を計算しやすくなる. 高速化にも寄与.  
- **得点を計算する際は, 日付ごとではなく各コンテストiごとに求める**. コンテスト1について1日目, 2日目, 3日目,...の得点, コンテスト2について1日目, 2日目, 3日目,...の得点、という要領で求めていく. (下記の解答では$calculate\_score()$という関数で実装している)  
- こうすることで, ある日付のコンテストが$p\rightarrow q$に変更になった場合, $last[p]$と$last[q]$を更新($\mathcal{O}(2D)$)したあと, $calculate\_score()$により$p,q$それぞれの全日程のスコアを再計算すれば良い($\mathcal{O}(2D)$) . つまり, １つのクエリにつき$\mathcal{O}(4D)$の計算量となる.


```python
import sys
from bisect import bisect_right


def calculate_score(c):
    global D, last, S
    rst = 0
    _last = last[c]
    for d in range(1, D + 1):
        down = C[c] * (d - _last[d])
        up = S[d][c] if _last[d] == d else 0
        rst += up - down
    return rst


Z = 26
D = int(input())
C = list(map(int, input().split()))

S = [tuple([0] * Z)] + [tuple(map(int, input().split())) for _ in range(D)]
T = [None] + [int(input()) - 1 for _ in range(D)] # 

M = int(input())
Q = [tuple(map(lambda x: int(x) - 1, s.split())) for s in sys.stdin.readlines()]


last = [[0] * (D + 1) for _ in range(Z)]  # last[i][d]
V = [0] * Z  # 各コンテストiごとの得点を保管しておく

# 初期状態でのlastを求める
for d in range(1, D + 1):
    t = T[d]
    for i in range(Z):
        last[i][d] = last[i][d - 1]
    last[t][d] = d
# 各コンテストiごとに得点を求める
for i in range(Z):
    V[i] = calculate_score(i)

# 初期状態での得点
score = sum(V)

for d, q in Q:
    d += 1  # Qだけ0-indexなので補正
    p = T[d]

    # d日目の開催が p -> q に変わる
    # まず, last[p]を更新する. 更新箇所はd日目 ~ 次の開催日直前
    e = bisect_right(last[p], d)
    for j in range(d, e):
        last[p][j] = last[p][j - 1]

    # 次に, last[q]を更新する. 更新箇所はd日目 ~ 次の開催日直前
    old = last[q][d]
    e = bisect_right(last[q], old)
    for j in range(d, e):
        last[q][j] = d

    # まず, 変更前のp, qの値を引く
    score -= V[p] + V[q]

    # 変更後のp, qの値を計算し, 全体に足す
    V[p] = calculate_score(p)
    V[q] = calculate_score(q)
    score += V[p] + V[q]
    print(score)

    # Tを更新
    T[d] = q
```

最悪計算量は$\mathcal{O}(4DM)$ ~ $10^8$になるので, 意地悪な問題だと間に合わないかもしれない.  
結局, $last$の更新と得点計算の部分$\mathcal{O}(4D)$を改善するしかない.  

$last$を順序付Setで持てば$\mathcal{O}(4logD)$になるので50倍ほど改善するが, 残念ながらPythonには無い...  
本問の場合はSeg木で代用できると思うが, 複雑化と高速化のトレードオフだと感じる. この辺の判断がこのコンテストの醍醐味の一つなのかも.  

## まとめ
僕のレベルでは「得点できたらラッキー」くらいの感じだな.

---
title: 【Python】AtCoder Beginner Contest 170 参加記録, Python解答
date: 2020-06-14T00:00:00.000Z
description: AtCoder Beginner Contest 170(ABC170)に参加した. 結果は4完1506thでパフォーマンス1341. Pythonによる解答を載せます.
slug: abc-170-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC170に参加しました. 
結果は4完1506thでパフォーマンス1341. うーん、5完したかった... 


## A - Five Variables
```python
X = list(map(int, input().split()))
print(X.index(0) + 1)
```

今回は問題にならないが、indexメソッドは対象の値が見つからないときに例外(ValueError)を返すため要注意.

> `s.index`は`x`が`s`中に見つからないとき`ValueError`を送出します。
> <cite>[Python 3.8.3 ドキュメント](https://docs.python.org/ja/3/library/stdtypes.html#sequence-types-list-tuple-range)</cite>

## B - Crane and Turtle
鶴亀算.  
鶴が$a$匹, 亀が$b$匹いるとして, 以下の連立方程式を満たす0以上の整数の組み$(a, b)$が存在するか? という問題.

$a + b = X$  
$2a + 4b = Y$

```python
X, Y = map(int, input().split())

# aについて全探索する
for a in range(X + 1):
    b = X - a
    if b >= 0 and 2 * a + 4 * b == Y:
        ans = 'Yes'
        break
else:
    ans = 'No'
print(ans)

```

## C - Forbidden List
コンテスト中はfor文で全探索したが, maspyさんの解法が素晴らしかったので, この方法で解き直す.

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">python の min() は、順序比較のためのキーを指定できて、abs(x-X) が最小のもののうち x が最小のものをとるとかはこんな感じで書いたりできます。<a href="https://t.co/du0w3JwTkh">https://t.co/du0w3JwTkh</a><a href="https://t.co/BHUqFBikMx">https://t.co/BHUqFBikMx</a> <a href="https://t.co/sxwpYBK34d">pic.twitter.com/sxwpYBK34d</a></p>&mdash; maspy (@maspy_stars) <a href="https://twitter.com/maspy_stars/status/1272177884740743169?ref_src=twsrc%5Etfw">June 14, 2020</a></blockquote>


解答はこんな感じか.
```python
X, N = map(int, input().split())
P = list(map(int, input().split()))

Q = [q for q in range(-1, 102) if q not in P]  # -1以上101以下整数のうちPに存在しないもの
ans = min(Q, key=lambda q: (abs(q - X), q))  # maspyさん解法
print(ans)
```

## D - Not Divisible
解法がなかなか思いつかず, 最近のABC-Dのなかでは一番苦戦した.  
$1\leq A_i\leq 10^6$と$A_i$が大きくないため, エラトステネスの篩の考え方が適用できる.

制約事項から問題のヒントが得られることが多い.  
通常こういう類の問題であれば$A_i$は$10^9$くらいが普通. 普通の値じゃないということは, そこに手がかりがあるはず.


pypyでないとTLEになります.
```python
from collections import Counter

N = int(input())
A = list(map(int, input().split()))
M = 10 ** 6

# Aiの重複を見つけるためにCounterを利用する
# keyが重複を排除した数列になっている
B = Counter(A)
Key = list(B.keys())
Key.sort()

table = [1] * (M + 1)  # これが篩
cnt = 0
for k in Key:
    # 値が重複していない and 篩が1 のときcntを+1する
    if B[k] == 1 and table[k] == 1:
        cnt += 1
    
    # kの倍数の篩をすべて0にする
    for i in range(M):
        if k * i > M:
            break
        else:
            table[k * i] = 0
print(cnt)
```

## E - Smart Infants
コンテスト中には解けなかった.  
方針は合っていたが, バグが取りきれず.

想定解法では**順序付きセット**(`C++`の`multiset`)を使うとなっていたが, 残念ながら`Python`にはそんな便利なものは存在しない.

2種類のheapqを用意して対応する.
1. **幼稚園キュー**: 各幼稚園ごとに幼児をレートの**大きい順**に並べたheapq (合計$2*10^5$本)
2. **最強幼児キュー**: 最強幼児をレートの**小さい順**に並べたheapq (1本)


そして, 各転園ごとに以下の処理を回す.
1. 移動元の幼稚園キューを更新
2. 移動先の幼稚園キューを更新
3. 最強幼児キューから最小値を求める

```python
# pypy3でないとTLEになる
import sys
from heapq import heappop, heappush


N, Q = map(int, input().split())
M = 2 * (10 ** 5)  # 幼稚園の数

belong = [None] * N  # 幼児iの所属先の幼稚園
rate = [None] * N  # 幼児iのレート
Nur = [[] for _ in range(M)]  # 幼稚園キュー. (レート[降順], 幼児)
for c in range(N):
    A, B = map(int, sys.stdin.readline().split())
    B -= 1
    belong[c] = B
    rate[c] = A
    heappush(Nur[B], (-A, c))

q = []  # 最強園児の順序付きキュー.(レート[昇順], 幼児, 園)
for i in range(M):
    if Nur[i]:
        A, c = Nur[i][0]
        heappush(q, (-A, c, i))

for s in sys.stdin.readlines():
    C, D = map(int, s.split())
    C -= 1; D -= 1

    pd = belong[C]  # 移動元の幼稚園
    belong[C] = D  # 当該幼児のbelongを更新
    
    # 移動元の幼稚園キューを更新
    while Nur[pd]:
        A, c = Nur[pd][0]
        # キューの先頭の幼児が既に存在しないとき取り除く.
        # 存在するとき, 最強幼児キューへ追加.
        if belong[c] != pd:
            heappop(Nur[pd])
        else:
            heappush(q, (-A, c, pd))
            break

    # 移動先の幼稚園キューを更新
    heappush(Nur[D], (-rate[C], C))  # 対象の幼児を追加
    while Nur[D]:
        A, c = Nur[D][0]
        # キューの先頭の幼児が既に存在しないとき取り除く.
        # 存在するとき, 最強幼児キューへ追加.
        if belong[c] != D:  
            heappop(Nur[D])
        else:
            heappush(q, (-A, c, D))
            break
    
    while q:
        A, c, d = q[0]
        # キューの先頭の幼児が既に去っている or 所属する幼稚園キューの先頭では無い とき取り除く.
        # そうではないとき、これが答えとなるためprintする.
        if belong[c] != d or Nur[d][0][1] != c:
            heappop(q)
        else:
            print(A)
            break
```

## F - Pond Skater
To be updated...
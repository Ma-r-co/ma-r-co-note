---
title: 【Python】ABC189 解説
date: 2021-01-23T00:00:00.000Z
description: AtCoder Beginner Contest 189(ABC189)に参加しました。結果は3完2930位パフォーマンス942. A~F問題の解説およびPython解答例を掲載します。
slug: abc-189-work-log
tags: 
  - Python
  - 競プロ
  - AtCoder
  - ABC
keywords: Python
---

ABC189に参加しました. 結果は$3$完$2930$位パフォーマンス$942$....  
泣きたい

以下, A~F問題の解説およびPython解答例です.

*2021/01/24 F問題の解説を追加*

## A - Slot
`set`の大きさで判定する。


```python
C = set(input())
ans = 'Won' if len(C) == 1 else 'Lost'
print(ans)
```

## B - Alcoholic
小数の扱いに注意。  
全体に$100$をかけて整数の範囲で判定できるようにする。


```python
N, X = map(int, input().split())
IN = [tuple(map(int, input().split())) for _ in range(N)]
x = 0
for i, (v, p) in enumerate(IN):
    x += v * p
    if x > 100 * X:
        ans = i + 1
        break
else:
    ans = -1
print(ans)
```

<adsense></adsense>

## C - Mandarin Orange
解けなかった。。泣きたい。  
$\mathcal{O}(10^8)$ は間に合わないと勘違いしてた。  

```python
N = int(input())
A = list(map(int, input().split()))
INF = float('inf')
ans = 0
for l in range(N):
    m = INF
    for r in range(l, N):
        m = min(m, A[r])
        cnt = (r - l + 1) * m
        ans = max(ans, cnt)
print(ans)
```

## D - Logical Expression
`メモ化再帰`で解いた。

- $dp(i, j)$: $y_i = j\text{となる}x\text{の組}(x_0,\dots,x_i)\text{の個数}$とする。 $j=0 \text{or} 1$である。
- 求めたい答えは$dp(N, 1)$である。また, 初期条件は$dp(0, 0) = dp(0, 1) = 1$ である。
- $dp(i, j) = k_0 * dp(i - 1, 0) + k_1 * dp(i - 1, 1)$  
と表すことができ, $S_{i - 1}$と$j$の値に応じて係数$k_0, k_1$を求めればよい。
- 例えば, $S_{i - 1} = \text{'OR'}, j = 1$のときは,  
$y_{i-1} = 0 \text{のとき} \rightarrow y_{i-1} \text{or} x_i = 1$となる$x_i$は$1$通り  
$y_{i-1} = 1 \text{のとき} \rightarrow y_{i-1} \text{or} x_i = 1$となる$x_i$は$2$通り  
よって, $k_0 = 1, k_1 = 2$である。


```python
import sys
sys.setrecursionlimit(10 ** 6)


def dfs(i, j):
    global N
    if (i, j) not in memo:
        if i == 0:
            ret = 1
        else:
            zero, one = dfs(i - 1, 0), dfs(i - 1, 1)
            if j == 0:
                if P[i - 1] == 'AND':
                    ret = one + 2 * zero
                else:
                    ret = zero
            else:
                if P[i - 1] == 'AND':
                    ret = one
                else:
                    ret = 2 * one + zero
        memo[(i, j)] = ret
    return memo[(i, j)]


N = int(input())
P = [input() for _ in range(N)]
memo = {}
ans = dfs(N, 1)
print(ans)
```

<adsense></adsense>

## E - Rotate and Flip
行列計算があったので`Numpy`を使って実装したら4問ほど$TLE$...  
`Pypy`に書き直す時間はなく撃沈。もったいなかった...  
次の機会に向けて行列まわりのライブラリを作っておこうかな

- 各操作は以下のように行列で表すことができる。  
操作$1$: $\begin{pmatrix}0&1&0 \\ -1&0&0 \\ 0&0&1 \end{pmatrix}$, 
操作$2$: $\begin{pmatrix}0&-1&0 \\ 1&0&0 \\ 0&0&1 \end{pmatrix}$  
操作$3$: $\begin{pmatrix}-1&0&2p \\ 0&1&0 \\ 0&0&1 \end{pmatrix}$, 
操作$4$: $\begin{pmatrix}1&0&0 \\ 0&-1&2p \\ 0&0&1 \end{pmatrix}$
- $T_i: i\text{回目までの操作を表す行列}$とする。  
$T_{i} = op_i \cdot T_{i - 1}$  
により$T_i$を事前計算しておく。
- すると点$(x, y)$の$i$回目の操作後の座標$(x_i, y_i)$は以下の式により求められる。  
$\begin{pmatrix}x_i \\ y_i \\ 1 \end{pmatrix} = T_i \cdot \begin{pmatrix}x \\ y \\ 1 \end{pmatrix}$


```python
import sys


def mul(S, sizeS, T, sizeT):
    ''' 行列積 S @ T を計算する
    S, T: 1次元行列
    sizeS, sizeT: [row数, col数]

    Sc == Tr 必須

    Returns: [Sr, Tc]の1次元行列
    '''
    Sr, Sc, Tr, Tc = *sizeS, *sizeT
    N = Sr * Tc
    ret = [0] * (N)
    for i in range(N):
        x, y = divmod(i, Tc)
        L = S[Sc * x: Sc * (x + 1)]
        R = [T[Tc * j + y] for j in range(Tr)]
        tmp = sum(a * b for a, b in zip(L, R))
        ret[i] = tmp
    return ret


N = int(input())
P = [list(map(int, sys.stdin.readline().split())) for _ in range(N)]
M = int(input())
OP = [tuple(map(int, sys.stdin.readline().split())) for _ in range(M)]
Q = int(input())
query = [tuple(map(int, sys.stdin.readline().split())) for _ in range(Q)]

op1 = [0, 1, 0, -1, 0, 0, 0, 0, 1]
op2 = [0, -1, 0, 1, 0, 0, 0, 0, 1]
op3 = [-1, 0, 0, 0, 1, 0, 0, 0, 1]  # op3[2]に2pが入る
op4 = [1, 0, 0, 0, -1, 0, 0, 0, 1]  # op4[5]に2pが入る

three = (3, 3)
one = (3, 1)
T = [None] * (M + 1)
T[0] = [1, 0, 0, 0, 1, 0, 0, 0, 1]
for i, op in enumerate(OP):
    j = op[0]
    if j == 1:
        S = op1
    elif j == 2:
        S = op2
    elif j == 3:
        S = op3
        S[2] = 2 * op[1]
    else:
        S = op4
        S[5] = 2 * op[1]
    T[i + 1] = mul(S, three, T[i], three)

for a, b in query:
    b -= 1
    z = P[b] + [1]
    tmp = mul(T[a], three, z, one)
    print(tmp[0], tmp[1])
```


<adsense></adsense>

## F - Sugoroku2
解説AC。

考え方は以下の通り。
- $dp[i]: i\text{マス目からスタートした時のルーレットを回す回数の期待値}$ とおく。
- 遷移は以下の式で表すことができる。  
$dp[N] = 0$  
$dp[i] = \begin{cases} \sum_{j=1}^M \frac{dp[i + j]}{M} + 1 & (\text{通常マス}) & \cdots \text{①} \\ dp[0] & (\text{振り出しマス}) & \cdots \text{②} \end{cases} $
- ここで、$dp[0]$を求めるのに$dp[0]$の値が必要、という状態になり自己循環に陥ってしまう。
- そこで、$dp[0] = x$ と置くと計算ができる。これは$\text{①}$の式が必ず$ax + b$ という$1$次式の形となるため、最終的に以下の方程式を解けばよいからである。  
$\begin{aligned} & dp[0] &= ax + b \\ \Leftrightarrow & x &= ax + b \\ \Leftrightarrow & x &= \frac{b}{1 - a} \end{aligned}$
- 「$x$と置く」って、どうやってコーディングするの？と疑問をもつかもしれないが、Pythonであれば$ax + b$の$a, b$をプロパティにもつクラスを作ればよい。  
$ (a_1x + b_1) + (a_2x + b_2) \rightarrow　(a_1, b_1) + (a_2, b_2) = (a_1 + a_2, b_1 + b_2)  $


```python
class f():
    '''
    ax + b を表すクラス
    和・差およびスカラー除算を定義する
    '''
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def __add__(self, other):
        return f(self.a + other.a, self.b + other.b)

    def __sub__(self, other):
        return f(self.a - other.a, self.b - other.b)
    
    def __truediv__(self, value):
        return f(self.a / value, self.b / value)


N, M, K = map(int, input().split())
A = [0] * (N + 1)
for a in map(int, input().split()):
    A[a] = 1

x = f(1, 0)     # 1 * x + 0
zero = f(0, 0)  # 0 * x + 0
one = f(0, 1)   # 0 * x + 1
dp = [zero] * (N + M + 1)
S = zero  # dp[i] + dp[i + 1] + ... + dp[i + M] の累積和
for i in range(N - 1, -1, -1):
    if A[i]:
        dp[i] = x
    else:
        dp[i] = S / M + one
    S += dp[i]
    S -= dp[i + M]

a, b = dp[0].a, dp[0].b
if a + pow(10, -6) > 1:  # a == 1 のときはゴール不可。誤差を考慮して不等式で実装する。
    print(-1)
else:
    print(b / (1 - a))
```

## まとめ
マジで落ち込む。。。

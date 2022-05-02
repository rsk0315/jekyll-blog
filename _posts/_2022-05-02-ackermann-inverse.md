---
title: \\(\\alpha(n)\\) や \\(\\alpha(m, n)\\) のお勉強
layout: post
date:   2022-05-02
author: rsk0315
---

See <https://www.gabrielnivasch.org/fun/inverse-ackermann>.
    
## あまくだり

まず、inverse Ackermann hierarchy というのを定義する。これは、関数の列で、$\\langle\\alpha\_1(n), \\alpha\_2(n), \\dots\\rangle$ である。

$\\alpha\_1(n) = \\ceil{n/2}$ で定義する。
$\\alpha\_k(n)$ は、「$\\alpha\_{k-1}$ を $n$ に適用して $1$ にするまでの回数」と定義する。すなわち、

\\[
\\alpha\_k(n) = \\begin{cases}
0, & \\text{if }n = 1; \\ \\\ %
1 + \\alpha\_k(\\alpha\_{k-1}(n)), & \\text{otherwise}.
\\end{cases}
\\]

このとき、$\\alpha\_2(n) = \\ceil{\\log\_2(n)}$ である。

### 主張たち

いくつかの性質を示す。

**Lemma 1**: $k\\ge 1 \\implies \\alpha\_k(2) = 1$.

**Proof**: $k$ に関する帰納法で示す。
まず、$\\alpha\_1(2) = 1$ である。
定義から、
\\[
\\begin{aligned}
\\alpha\_k(2) &= 1 + \\alpha\_k(\\alpha\_{k-1}(2)) \\ \\\ %
&= 1 + \\alpha\_k(1) \\ \\\ %
&= 1. \\quad\\qed
\\end{aligned}
\\]

**Lemma 2**: $k\\ge 1 \\implies \\alpha\_k(3) = \\alpha\_k(4) = 2$.

**Proof**: $k$ に関する帰納法で示す。
まず、$\\alpha\_1(3) = \\alpha\_1(4) = 2$ である。
定義と Lemma 1 から、
\\[
\\begin{aligned}
\\alpha\_k(3) &= 1 + \\alpha\_k(\\alpha\_{k-1}(3)) \\ \\\ %
&= 1 + \\alpha\_k(2) \\ \\\ %
&= 2.
\\end{aligned}
\\]
$\\alpha\_k(4) = 2$ についても同様。$\\qed$

**Lemma 3**: $k\\ge 1 \\implies \\alpha\_k(5) = \\alpha\_k(6) = 3$.

**Proof**: $k$ に関する帰納法で示す。
まず、$\\alpha\_1(5) = \\alpha\_1(6) = 3$ である。
定義と Lemma 2 から、
\\[
\\begin{aligned}
\\alpha\_k(5) &= 1 + \\alpha\_k(\\alpha\_{k-1}(5)) \\ \\\ %
&= 1 + \\alpha\_k(3) \\ \\\ %
&= 1 + 2 \\ \\\ %
&= 3.
\\end{aligned}
\\]
$\\alpha\_k(6) = 3$ についても同様。$\\qed$

**Claim 4**: $n\\ge 4 \\implies \\alpha\_k(n)\\le n-2$.

**Proof**: $(k, n)$ に関する帰納法で示す。$k=1$ のときは明らかなので、以下 $k\\ge 2$ とする。
$4\\le n\\le 6$ のとき、Lemma 2, 3 より成り立つ。
$(k, n)$ より辞書順が小さいものについて成り立つとすると、
\\[
\\begin{aligned}
\\alpha\_k(n) &= 1 + \\alpha\_k(\\alpha\_{k-1}(n)) \\ \\\ %
&\\le 1 + \\alpha\_k(n-2) \\ \\\ %
&\\le 1 + (n - 4) \\ \\\ %
&\\lt n - 2. \\quad\\qed
\\end{aligned}
\\]

**Claim 5**: ${}^\\forall (n, k): \\alpha\_{k+1}(n)\\le\\alpha\_k(n)$.
さらに、$k\\ge 2$ のとき $\\alpha\_{k+1}(n)\\lt\\alpha\_k(n)\\iff \\alpha\_k(n)\\ge 4$.

**Proof**: $\\alpha\_k(n)\\le 3$ については Lemma 1--3 と同様に成り立つ。
$\\alpha\_k(n)\\ge 4$ について、
\\[
\\begin{aligned}
\\alpha\_{k+1}(n) &= 1 + \\alpha\_{k+1}(\\alpha\_k(n)) \\ \\\ %
&\\le 1 + \\alpha\_k(n)-2 \\ \\\ %
&\\lt \\alpha\_k(n). \\quad\\qed
\\end{aligned}
\\]

$\\alpha\_1(1) = 1$ なので、strict の方は $k = 1$ のときは成り立っていないことに注意。

**Corollary 6**: $k\\ge 2\\implies\\alpha\_k(n) = o(n)$.

**Proof**: $\\alpha\_2(n) = \\ceil{\\log\_2(n)} = o(n)$ なので、Claim 5 より従う。$\\qed$

**Claim 7**: $k\\ge 1\\implies\\alpha\_{k+1}(n) = o(\\alpha\_k(n))$.

**Proof**: $k\\ge 2\\implies\\alpha\_k(n)=o(n)$ より、
\\[
\\begin{aligned}
\\alpha\_{k+1}(n) &= 1 + \\alpha\_{k+1}(\\alpha\_k(n)) \\ \\\ %
&= o(\\alpha\_k(n)). \\quad\\qed
\\end{aligned}
\\]

**Claim 8**: 任意の固定された $k$, $r$ に対して $\\alpha\_{k+1}(n) = o(\\alpha\_k^{(r)}(n))$.

**Proof**: 十分大きい $n$ に対して
\\[
\\begin{aligned}
\\alpha\_{k+1}(n) &= r + \\alpha\_{k+1}(\\alpha\_k^{(r)}(n)) \\ \\\ %
&= o(\\alpha\_k^{(r)}(n)). \\quad\\qed
\\end{aligned}
\\]

### $\\alpha(n)$

Claim 5 より、$\\alpha\_1(n), \\alpha\_2(n), \\alpha\_3(n), \\dots$ の列は $3$ になるまで狭義単調減少する。
たとえば、$n = 9876!$ とすると、その列は $3.06\\times 10^{35163}, 116812, 6, 4, 3, 3, \\dots$ となる。

$\\alpha(n)$ は、$\\alpha\_k(n)\\le 3$ なる最小の $k$ として定義する。すなわち、
\\[
\\alpha(n) = \\min\\,\\{k:\\alpha\_k(n)\\le 3\\}
\\]
である。上記の例でいえば、$\\alpha(9876!) = 5$ となる。

**Claim 9**: 任意の固定された $k$ に対して $\\alpha(n) = o(\\alpha\_k(n))$ である。

**Proof**: $m = \\alpha\_{k+1}(n)$ とする。

\\[
\\alpha\_{k+1}(n), \\alpha\_{k+2}(n), \\dots, \\alpha\_{k+(m-2)}(n)
\\]
なる列を考える。
このとき、単調減少性より $\\alpha\_{k+(m-2)} \\le 3$ である。
よって、
\\[
\\begin{aligned}
\\alpha(n) &\\le k+m-2 \\ \\\ %
&\\le \\alpha\_{k+1}(n) + O(1) \\ \\\ %
&= o(\\alpha\_k(n)). \\quad\\qed
\\end{aligned}
\\]

### $\\alpha(m, n)$

2 変数のバージョンを次のように定義する（唐突）。
\\[
\\alpha(m, n) = \\min\\,\\{k: \\alpha\_k(n)\\le 3+m/n\\}.
\\]

これは、たとえば次の性質を満たす。

- 任意の $m, n$ に対して $\\alpha(m, n)\\le \\alpha(n)$
- $m$ に対して $\\alpha(m, n)$ は単調減少する
- $m = n\\alpha\_k(n) \\implies \\alpha(m, n)\\le k$
    - 特に、$m \\ge n\\ceil{\\log\_2(n)}$ ならば $\\alpha(m, n) \\le 2$
    - $m = \\Omega(n\\log(n))$ ならば $\\alpha(m, n) = O(1)$

最後の性質によって decremental neighbor query が $\\langle O(n), O(1)\\rangle$
(amortized) で解ける。


## あまくだらない

はっきりしていなさそうな部分を挙げる。

- $\\alpha(n)$ は $f(n) = A(n, n)$ の逆関数になっている？
- $\\alpha(m, n)$ の $m/n$ はどこから出てきたの？
- union-find の計算量に $\\alpha(m, n)$ はどう関係するの？
    - shifting lemma みたいなのを書く
- (optional) $\\alpha(n)$ が計算量に出てくる別のデータ構造はあるの？

### Ackermann 関数

Ackermann 関数は次のように定義される。

\\[
\\begin{aligned}
A(0, n) &= n + 1; \\ \\\ %
A(m + 1, 0) &= A(m, 1); \\ \\\ %
A(m + 1, n + 1) &= A(m, A(m + 1, n)).
\\end{aligned}
\\]

### 📝

$A(i, j)$ と $\\alpha\_i(j)$ の関係を調べて帰納法を回す？
\\[
\\alpha(m, n) = \\min\\,\\{i\\ge 1:A(i,\\floor{m/n})\\ge \\log\_2(n)\\}
\\]
というのが載っている。

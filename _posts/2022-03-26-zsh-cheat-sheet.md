---
title: Z shell のチートシート
layout: post
date:   2022-03-26 20:55:34+09:00
modified_date: 2022-04-03 16:06:22+09:00
author: rsk0315
---

Zsh 魔法すぎ。man を眺めたり例を書いたりしながらメモを残していきます。

## 展開・置換

`zshexpn` を見よう。

以下の順で行われる。

- 履歴展開
- エイリアス展開
- (左から右に読みながら以下 5 つを同時に行う)
    - プロセス置換
    - 変数展開
    - コマンド置換
    - 算術展開
    - 波括弧展開
- (quote されていない `\` `'` `"` の除去)
- ファイル名展開
- ファイル名生成 (_globbing_)

### 履歴展開 (History expansion)

変数 `histchars` の 1 文字目 (default: `!`) で始まる。
コマンドラインの `"..."` も含めたどこでも行われるが、`'...'` `$'...'` は除く。
以下の形式で行われる。

> `!` \[*event-designator*\] \[*word-designator*\] \[`:` *modifier*\]...

*event-designator* と *word-designator* の双方が省略された場合は行われない。

*event-designator* が省略された場合、デフォルトでは、その行で直前に行われた履歴展開のものが使用される。
行の最初だった場合や、`CSH_JUNKIE_HISTORY` が set されている場合は直前のコマンドを指す。

また、`!` の直後が空白、改行、`=`、`(` のいずれかだった場合は対象外となる。

履歴展開が起きた後は、実行される前に展開内容が出力される (cf. `set -o histverify`)。

#### Event designators

```terminal
% : foo
% !!  # 直前のコマンドを指す。
: foo  # 直前のコマンドを指す。
```

その行のコメントも echo back されるが、以降は簡潔さのために省いて例示する。

```terminal
% : foo
% history -1
57142  : foo
% !57142  # その番号の行を指す。
: foo
```

```terminal
% : foo
% : bar
% !-2  #  その数だけ上の行を指す。
: foo
```

```terminal
% true
% :
% !t  # その文字列で始まる直近の行を指す。
true
```

```terminal
% true
% :
% !?r?  # その文字列を含む直近の行を指す。
true
% !?u  # 後ろに modifier などが続かなければ ? は省略可能。
true
```

`\` `'` `?` などを _str_ に含めようとすると混乱する。リテラルとして検索されるっぽい。

```terminal
% : a!#b  # 現在の行の直前までを指す。
: a: ab
% : !#!#!#!#!#  # 指数的に増えちゃう。
: : : : : : : : : : : : : : : : : : : : : : : : : : : : : : : :
```

```terminal
% : a
% : b
% !{?a?}0  # 隣り合う文字との区切りを示す。必要なときに使えばいい。
: a0
```

```terminal
% : foo
% !^ !" !!  # !" は除去され、それ以降の履歴展開は行われない。
: : foo  \!\!
```

#### Word designators

```terminal
% : foo
% !!0 bar  # 最初の単語（コマンド）を指す。
: bar
```

```terminal
% : foo bar baz
% echo !!2  # それ番目の引数を指す。
: bar
% : echo 1; : echo 2
% !!5 !!2 !!3  # やや直感に反する。
echo 1 ;
1
% :
% !!1  # だめっぽい。
zsh: no such word in event
```

```terminal
% : foo bar baz
% : !!^  # 最初の引数。1 と同じ。
: foo
```

```terminal
% : foo bar baz
% : !!$  # 最後の引数。
: baz
% : baz
% : foo; : bar; : !!$
: foo; : bar; : baz
% : foo; : bar; echo $_  # $_ は直前に実行された最後の引数なので違いに注意。
bar
```

```terminal
% : !%  # だめ。
zsh: % with no previous word matched
% : foo bar baz qux
% : !?ba?%  # ?str の検索でマッチした部分を指す。
: bar
% : !%  # 一度使うといいらしい。
: bar
```

```terminal
% : foo bar baz qux quux
% : !!2-4  # その範囲の引数を指す。
: bar baz qux
% : !?q?-3  # 始端のデフォルトは 0。
: : bar baz qux
% : !?uu?2-  # 終端を省略した場合、$ は含まない。
: bar baz qux
% : !!-  # 両方省略することもできる。
: : bar baz
% !?uu?3-2  # だめっぽい。
zsh: no such word in event
```

```terminal
% : foo bar baz
% : !!*
: foo bar baz
% :
% : !!*  # だめっぽい。
zsh: no such word in event
```

```terminal
% : foo bar baz
% : !!2*  # x* は x-$ と等価。
: bar baz
```

#### Modifiers

特記がない限りファイル名生成と変数展開でも同じものが使えるとのこと。

```terminal
% : .././foo/./bar
% : !?bar?%:a  # カレントディレクトリを補って絶対パスにする。
: /Users/foo/bar
```

cf. `CHASE_DOTS` `CHASE_LINKS`。

```terminal
% : .././foo/./bar
% : !?bar?%:A  # a による補完をした後 realpath(3) でリンクの解決をする。
: /Users/foo/bar
```

`realpath(3)` がないシステムでは `a` と同じらしい。要調査。cf. `P` modifier。

```terminal
% : ls foo
% : !^:c  # コマンド名を PATH に従って補完する。
: /bin/ls
% : !?foo?:c  # 見つからないとだめ。
zsh: modifier failed: c
```

```terminal
% : foo.c d/.bar baz
% : !^:e !!2:e  # . 以降の部分のみを残す。r の逆。
: c bar
% : !?z?%:e  # . がないとだめ。
zsh: modifier failed: e
```

```terminal
% : //a//b/./../c d/e
% : !^:h  # ディレクトリ名を残す (`dirname`)。*h*ead らしい。
: //a//b/./..
% # その個数だけ取れる。連続する / は一つ扱い。
% : !?c?%:h1 !%:h2 !%:h3 !%:h4 !%:h5 !%:h6 !%:h7
: / //a //a//b //a//b/. //a//b/./.. //a//b/./../c //a//b/./../c
% : !?d?%:h1 !%:h2  # 絶対パスとの違いに注意。
: d d/e
% : !?c?%:h100 !?e?%:h100  # 多くても平気。
: //a//b/./../c d/e 
% : !?c?%:h0  # h0 は h と同じそう。
: //a//b/./..
% : a
% : !^:h1 !^:h100
: a a
% : !^:h  # / がないとき 0 はだめみたい。
zsh: modifier failed: h
```

変数展開で使うとき、`$var:h2` は `${var:h}2` と解釈されるので注意。

```terminal
% : FOO
% : !^:l  # *l*owercase にする。
: foo
```

```terminal
% : foo bar
% echo !!*:p  # 展開内容を出力はするが実行はしない。
echo foo bar
% echo !!*:p !!  # 一箇所でもそうすれば実行されなさそう。
echo foo bar echo foo bar
```

履歴展開でのみ使える。

```terminal
% : .././foo/./bar
% : !^:P  # カレントディレクトリを補って絶対パスにする。
: /Users/foo/bar
```

結果には `.` や `..` は含まれない。`realpath(3)` と違い、存在しない末尾の要素は許容・保持されるらしい。手元環境で `realpath` が動いていなさそうなのでよくわからず。

```terminal
% echo 'a."\'\' 
a."\'
% echo !^ !^:q  # quote する。
echo 'a."\'\' ''\''a."\'\''\'\'''
a."\' 'a."\'\'
```

```terminal
% echo ''\''a."\'\''\'\'''
'a."\'\'
% echo !^ !^:Q  # 一段階 unquote する。
echo ''\''a."\'\''\'\''' 'a."\'\'
'a."\'\' a."\'
```

```terminal
% : foo.c d/.bar baz
% : !!1:r !!2:r  # . 以前の部分のみを残す。e の逆。
: foo d/
% !?z?%:r  # . がないとだめ。
zsh: modifier failed: r
```

```terminal
% : foo bar baz
% : !^:s//_/
zsh: no previous substitution
% : !*:s/b/m/  # s/l/r/ で l を r に置換。
: foo mar baz
% : !?f?^:s/o/rom t/  # 空白で中断されないので注意。
: from to
% # / の終端を省略した場合コメントも書けない。なので分けている。
% # :s/l/r/:G や :gs/l/r/ で最左マッチ以外も置換できる。
% # l を省略すると直前と同じものが使われる。/ の部分は任意の文字を使える。
% : !?bar?*:s/b/m/:G !*:gs##m
: foo mar maz foo mar maz
```

`!?f?^:s/o/rom t/` に関しては、syntax highlighting 側が正しくない。そのうち気が向いたら直すかも。

```terminal
% : fooooo
% : !^:s/o/x/
: fxoooo
% : !^:&  # & で同じ置換を繰り返す。
: fxxooo
% : !^:g&
: fxxxxx
% : !?fo?:&  # !?str? の検索を使うと、その部分が置換される？
: xoooo
% : !?fo?:s//x/  # s//repl/ の場合もそうなるっぽい。
: xoooo
% : foo foo
```

```terminal
% : fooo
% ^l^r は !!:s^l^r を表す。
% ^o^x
fxoo
% ^o^x^:G
fxxx
```

`^` は実際には `histchars` の 2 文字目が使われる。

```terminal
% : //a//b/./../c d/e
% : !^:t  # ファイル名を残す (`basename`)。*t*ail らしい。
: c
% # その個数だけ取れる。連続する / は一つ扱い。
% : !?//a?%:t1 !%:t2 !%:t3 !%:t4 !%:t5 !?d?%:t1
: : c ../c ./../c b/./../c a//b/./../c e
% : !?//a?%:t6  # 多いとだめみたい。
zsh: modifier failed: t
% : !?//a?%:t0  # t0 は t1 と同じ。
: c
% : a
% : !^:h1 !^:h100
: a a
% : !^:h  # / がないとき 0 はだめみたい。
zsh: modifier failed: h
```

```terminal
% : foo
% : !^:u  # *u*ppercase にする。
: FOO
```

```terminal
% : 'foo bar baz'
% : !^:q / !^:x  # q と似ているが、x は空白で区切る。
: ''\''foo bar baz'\''' / ''\''foo' 'bar' 'baz'\'''
```

```terminal
% touch example.c sample.c
% print -r -- *.c(#q:s/#%(#b)s(*).c/'S${match[1]}.C'/)
example.c sample.c
% set -o HIST_SUBST_PATTERN
% : print -r -- *.c(#q:s/#%(#b)s(*).c/'S${match[1]}.C'/)
Sample.C example.c
```

`HIST_SUBST_PATTERN` によって `s/l/r/` の `l` にパターンを使える。`#` `%` `(#b)` はそれぞれ「前方一致」「後方一致」「後方参照有効化」。後方参照は `${match[1]}` などでできる。`(#q)` は後述。この項目自体 globbing に移した方がよさそう。

```terminal
% foo='aaa aaa,aaa'
% echo ${foo:fs/a/b}  # 変化しなくなるまで繰り返す。fix point？
bbb bbb,bbb
% echo ${foo:F:4:s/a/b}  # F:expr: で expr 回繰り返す。
bbb baa,aaa
% echo ${foo:ws/a/b}  # 単語ごとに適用する。
baa baa,aaa
% echo ${foo:W:,:s/a/b}  # W:sep: で sep を区切り文字にする。
baa aaa,baa
```

これらは履歴展開では使えない。変数展開のところに移すかも。`:` には任意の文字が使えるが、`(` `[` `{` を使った場合はそれぞれ `)` `]` `}` で終端になる。

### プロセス置換 (Process substitution)

次の形式で行われる。

> - `<(`_list_`)`
> - `>(`_list_`)`
> - `=(`_list_`)`

システムが `/dev/fd` の機構をサポートしている場合、対応する file descriptor に置換される。

`<()` `>()` の形式が使われた場合、_list_ の内容をサブプロセスとして実行する。
`>()` であれば該当のファイルが _list_ の入力に、`<()` であれば該当のファイルが _list_ の出力になる。

```terminal
% cat << '' > foo
a	1
b	2
c	3

% cat << '' > bar
A	_	10
B	_	100
C	_	1000

% paste <(cut -f1 foo) <(cut -f3 bar)
a	10
b	100
c	1000
% paste <(cur -f1 foo) <(cut -f3 bar) | tee >(head -1) >(tail -1) >/dev/null
a	10
c	1000
```

`=()` を使った場合、代わりに一時ファイルを用いる。

```terminal
% () { print File $1:; cat $1 } =(print This be the verse)
File /tmp/zshyuX1sP:
This be the verse
% ls File /tmp/zshyuX1sP
ls: cannot access '/tmp/zshyuX1sP': No such file or directory
```

### 変数展開 (Parameter expansion)

`$` で始まる。

`SH_WORD_SPLIT` (default: off) が on でない限り、他のシェルと異なり空白での単語分割は行われないので注意が必要。

```terminal
% array=(foo '' baz) str='foo  bar'
% p() { echo $1, $2, $3. }
% set +o SH_WORD_SPLIT  # off
% p $array; p ${array[@]}; p ${array[*]}; p $str
foo, baz, .
foo, baz, .
foo, baz, .
foo  bar, , .
% p "$array"; p "${array[@]}"; p "${array[*]}"; p "$str"
foo  baz, , .
foo, , baz.
foo  baz, , .
foo  bar, , .
% set -o SH_WORD_SPLIT  # on
% p $array; p ${array[@]}; p ${array[*]}; p $str
foo, baz, .
foo, baz, .
foo, baz, .
foo, bar, .
% p "$array"; p "${array[@]}"; p "${array[*]}"; p "$str"
foo baz, , .
foo, , baz.
foo baz, , .
foo bar, , .
```

履歴展開の `:`_modifier_ と同様に、`${i:s/foo/bar/}` のように書ける。

```terminal
% # この辺にまとめて例を書く。
```

```terminal
% foo=hello foo1=world
% echo $foo $foo1 ${foo}1  # [_0-9A-Za-z] が続くときは ${name} の形式で区切る。
hello world hello1
```

より複雑な形式の置換を行うときは多くの場合 `{}` が必須となる。ただし、`KSH_ARRAY` が off のときは以下のものは `{}` がなくてもよい。

- 一つの subscript
- _name_ の後の `:`_modifiers
- _name_ の前の `^` `=` `~` `#` `+`

<!-- たぶん例があるとよい。 -->

_name_ が array の場合は `KSH_ARRAYS` によって挙動が変わるっぽい (todo)。cf. flags `=`, `s:`_string_`:`。

```terminal
% unset foo; bar= baz=some
echo ${+foo} ${+bar} ${+baz}  # set されているとき 1、そうでないとき 0。
0 1 1
```

```terminal
% unset foo; bar= baz=some
% echo "'${foo-d}' '${bar-d}' '${baz-d}'"  # unset のときのデフォルト値。
'd' '' 'some'
% echo "'${foo:-d}' '${bar:-d}' '${baz:-d}' '${:-d}'"
'd' 'd' 'some' 'd'
```

`${:-}` の場合は _name_ は省略できる。`:` をつけると空文字列のときもデフォルト値を使う。

```terminal
% unset foo; bar= baz=some
% echo "'${foo+d}' '${bar+d}' '${baz+d}'"  # set されているときのみ置換する。
'' 'd' 'd'
% echo "'${foo:+d}' '${bar:+d}' '${baz:+d}' '${:+d}'"
'' '' 'd' ''
% opt1=foo; unset opt2
% echo ${opt1:+--opt1=$opt1} ${opt2:+--opt2=$opt2}  # 使えそうな例。
--opt1=foo
```

```terminal
% unset foo; bar= baz=some
% echo "$foo,$bar,$baz; ${foo=1},${bar=1},${baz=1}; $foo,$bar,$baz"
,,some; 1,,some; 1,,some
% unset foo; bar= baz=some
% echo "$foo,$bar,$baz; ${foo:=1},${bar:=1},${baz:=1}; $foo,$bar,$baz"
,,some; 1,1,some; 1,1,some
% unset foo; bar= baz=some
% echo "$foo,$bar,$baz; ${foo::=1},${bar::=1},${baz::=1}; $foo,$bar,$baz"
,,some; 1,1,1; 1,1,1
```

`=` で unset に代入。`:=` で unset/null に代入。`::=` で常に代入。`-` `:-` と違い更新されることに注意。

```terminal
% unset foo; bar= baz=some
% echo ${baz?ok}; echo ${bar?null}; echo ${foo?unset}
some

zsh: foo: unset
% echo ${baz:?ok}; echo ${bar:?null}; echo ${foo:?unset}
some
zsh: bar: null
```

_name_ が unset のとき _word_ を表示して中断する。`:?` で空文字列も対象になるのは他と同じ。

```terminal
% foo=a/b/c.d.e
% echo ${foo#*/} ${foo##*/}
b/c.d.e c.d.e
% bar='###_'
% echo ${bar#*\#} ${bar##*'#'} ${bar##'*#'}
##_ _ ###_
```

パターンにマッチする prefix を取り除く。`\` や `'` で quote できる。`*` を意図せず quote しないように注意。

```terminal
% array=(foo foo)
% echo "${array%oo}", "${array[@]%oo}", "${array[*]%oo}"
foo f, f f, foo f
% echo ${array%oo}, ${array[@]%oo}, ${array[*]%oo}
f f, f f, f f
```

array に対しては、quote されていない場合、または `[@]` を使った場合、各要素に対して置換が行われる。

```terminal
% foo=a/b/c.d.e
% echo ${foo%.*} ${foo%%.*}
a/b/c.d a/b/c
```

パターンにマッチする suffix を取り除く。

```terminal
% a=foo b=bar
% echo ${a:#*o}, ${b:#*o}, ${(M)b:#b*}
, bar, bar
% array=(foo bar baz)
% echo ${array:#b*}, ${(M)array:#b*}
foo, bar baz
```

パターンにマッチするとき無に置換する。`(M)` で逆になる。

```terminal
% a=(1 4 6 2 8 4 3 3); b=(2 3 5 7)
% echo ${a:|b}
1 4 6 8 4
% echo ${a:*b}
2 3 3
```

`${`_name_`:|`_arrayName_`}` で、_name_ のうち _arrayName_ に含まれるものを除去する。`:*` では含まれないものを除去する。

```terminal
% a=(1 2 3 4 5) b=(x y z) c=_
% echo ${a:^b}, ${a:^^b}, ${b:^c}, ${b:^^c}
1 x 2 y 3 z, 1 x 2 y 3 z 4 x 5 y, 1 _, 1 _ 2 _
```

array を zip する。`:^` では短い方の長さに合わせられ、`:^^` では長い方の長さに合わせられる。
scalar を使うと、長さ 1 の配列のように振る舞う。

todo

- `${`_name_`:`_offset_`}`
- `${`_name_`:`_offset_`:`_length_`}`
- `${`_name_`/`_pattern_`/`_repl_`}`
- `${`_name_`//`_pattern_`/`_repl_`}`
- `${`_name_`:/`_pattern_`/`_repl_`}`
- `${#`_spec_`}`
- `${^`_spec_`}`
- `${=`_spec_`}`
- `${~`_spec_`}`

#### Parameter expansion flags

- `#`
- `%`
- `@`
- `A`
- `a`
- `b`
- `c`
- `C`
- `D`
- `e`
- `f`
- `g:`_opts_`:`
- `i`
- `k`
- `L`
- `n`
- `o`
- `O`
- `P`
- `q`
- `Q`
- `t`
- `u`
- `U`
- `v`
- `V`
- `w`
- `X`
- `z`
- `0`

- `p`
- `~`
- `j:`_string_`:`
- `l:`_expr_`::`_string1_`::`_string2_`:`
- `m`
- `r:`_expr_`::`_string1_`::`_string2_`:`
- `s:`_string_`:`
- `Z:`_opts_`:`
- `_:`_flags_`:`

- `S`
- `I:`_expr_`:`
- `B`
- `E`
- `M`
- `N`
- `R`

#### Rules

1. Nested substitution
1. Internal parameter flags
1. Parameter subscripting
1. Parameter name replacement
1. Double-quoted joining
1. Nested subscripting
1. Modifiers
1. Character evaluation
1. Length
1. Forced joining
1. Simple word splitting
1. Case modification
1. Escape sequence replacement
1. Quote application
1. Directory naming
1. Visibility enhancement
1. Lexical word splitting
1. Uniqueness
1. Ordering
1. `RC_EXPAND_PARAM`
1. Re-evaluation
1. Padding
1. Semantic joining
1. Empty argument removal
1. Nested parameter name replacement

### Command substitution

- `$(`...`)`
- `$(<`...`)`

### Arithmetic expansion

- `$[`_exp_`]`
- `$((`_exp_`))`

### Brace expansion

- _foo_`{`_xx_`,`_yy_`,`_zz_`}`_bar_
- `{`_n1_`..`_n2_`}`
- `{`_n1_`..`_n2_`..`_n3_`}`
- `{`_c1_`..`_c2_`}` 
- cf. `BRACE_CCL`

### Filename expansion

- `~`
- `~0` `~+` `~-`, cf. `PUSHD_MINUS`

#### Dynamic named directories

#### Static named directories

#### `=` expansion

cf. `EQUALS` `MAGIC_EQUAL_SUBST`

### Filename generation

- `*` `(` `|` `<` `[` `?`, cf. `GLOB`
- `^` `#`, cf. `EXTENDED_GLOB`

#### Glob operators

- `*`
- `?`
- `[`...`]`
    - `[:alnum:]`
    - `[:alpha:]`
    - `[:ascii:]`
    - `[:blank:]`
    - `[:cntrl:]`
    - `[:digit:]`
    - `[:graph:]`
    - `[:lower:]`
    - `[:print:]`
    - `[:punct:]`
    - `[:space:]`
    - `[:upper:]`
    - `[:xdigit:]`
    - `[:IDENT:]`
    - `[:IFS:]`
    - `[:IFSSPACE:]`
    - `[:INCOMPLETE:]`
    - `[:INVALID:]`
    - `[:WORD:]`
- `[^`...`]`, `[!`...`]`
- `<`[_x_]`-`[_y_]`>`
- `(`...`)`
- _x_`|`_y_
- `^`_x_
- _x_`~`_y_
- _x_`#`
- _x_`##`

#### ksh-like Glob operators

- `@(`...`)`
- `*(`...`)`
- `+(`...`)`
- `?(`...`)`
- `!(`...`)`

#### Globbing flags

- `i`
- `l`
- `I`
- `b`
- `B`
- `c`_N_`,`_M_
- `m`
- `M`
- `a`_num_
- `s`, `e`
- `q`
- `u`
- `U`

#### Approximate matching

#### Recursive globbing

#### Glob qualifiers

- `/`
- `F`
- `.`
- `@`
- `=`
- `p`
- `*`
- `%`
- `%b`
- `%c`
- `r`
- `w`
- `x`
- `A`
- `I`
- `E`
- `R`
- `W`
- `X`
- `s`
- `S`
- `t`
- `f`_spec_
- `e`_string_
- `+`_cmd_
- `d`_dev_
- `l`[`-`\|`+`]_ct_
- `U`
- `G`
- `u`_id_
- `g`_id_
- `a`[`Mwhms`][`-`\|`+`]_n_
- `m`[`Mwhms`][`-`\|`+`]_n_
- `c`[`Mwhms`][`-`\|`+`]_n_
- `L`[`+`\|`-`]_n_
- `^`
- `-`
- `M`
- `T`
- `N`
- `D`
- `n`
- `Y`_n_
- `o`_c_
- `O`_c_
- `[`_beg_[`,`_end_]`]`
- `P`_string_


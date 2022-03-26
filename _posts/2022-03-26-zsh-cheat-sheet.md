---
title: Z shell のチートシート
layout: post
date:   2022-03-26 20:55:34+09:00
modified_date: 
author: rsk0315
image: /assets/images/diff-algo.png
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

> `!` \[*event-designator*\] \[*word-designator*\] \[`:` *modifiers*\]...

*event-designator* と *word-designator* の双方が省略された場合は行われない。

*event-designator* が省略された場合、デフォルトでは、その行で直前に行われた履歴展開のものが使用される。
行の最初だった場合や、`CSH_JUNKIE_HISTORY` が set されている場合は直前のコマンドを指す。

また、`!` の直後が空白、改行、`=`、`(` のいずれかだった場合は対象外となる。

履歴展開が起きた後は、実行される前に展開内容が出力される (cf. `set -o histverify`)。

#### Event designators

```terminal
% echo 1
% !!  # 直前のコマンドを指す。
echo 1
1
```

```terminal
% echo foo
% history -1
57142  echo foo
% !57142  # その番号の行を指す。
echo foo
foo
```

```terminal
% echo foo
% echo bar
% !-2  #  その数だけ上の行を指す。
echo foo
foo
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
```

`\` `'` `?` などを _str_ に含めようとすると混乱する。リテラルとして検索されるっぽい。

```terminal
% echo a!#b  # 現在の行の直前までを指す。
echo aecho ab
aecho ab
% echo !#!#!#!#  # 指数的に増えちゃう。
echo echo echo echo echo echo echo echo echo echo echo echo echo echo echo echo 
echo echo echo echo echo echo echo echo echo echo echo echo echo echo echo
```

```terminal
% echo a
a
% echo b
b
% !{?a?}0  # 隣り合う文字との区切りを示す。必要なときに使えばいい。
echo a0
```

#### Word designators

```terminal
% echo foo
foo
% !!0 bar  # 最初の単語（コマンド）を指す。
echo bar
bar
```

```terminal
% echo foo bar baz
foo bar baz
% echo !!2  # それ番目の引数を指す。
echo bar
bar
% echo 1; echo 2
1
2
% !!3 !!4 !!2  # やや直感に反する。
echo 2 ;
2
% echo
% !!1  # だめっぽい。
zsh: no such word in event
```

```terminal
% echo foo bar baz
foo bar baz
% echo !!^  # 最初の引数。1 と同じ。
echo foo
foo
```

```terminal
echo foo bar baz
foo bar baz
% echo !!$  # 最後の引数。
echo baz
baz
% echo baz
baz
% echo foo; echo bar; echo !!$
echo foo; echo bar; echo baz
foo
bar
baz
% echo foo; echo bar; echo $_  # $_ は直前に実行された最後の引数なので違いに注意。
foo
bar
bar
```

```terminal
% echo foo bar baz qux
foo bar baz qux
% echo !?ba?%  # ?str の検索でマッチした部分を指す。
echo bar
bar
```

```terminal
% echo foo bar baz qux quux
foo bar baz qux quux
% echo !!2-4  # その範囲の引数を指す。
echo bar baz qux
bar baz
% echo !?q?-3  # 始端のデフォルトは 0。
echo echo bar baz qux
echo bar baz qux
% echo !?uu?2-  # 終端を省略した場合、$ は含まない。
echo bar baz qux
bar baz qux
% echo !!-  # 両方省略することもできる。
echo echo bar baz
echo bar baz
% !?uu?3-2  # だめっぽい。
zsh: no such word in event
```

```terminal
% echo foo bar baz
foo bar baz
% echo !!*
echo foo bar baz
foo bar baz
% echo
% echo !!*  # だめっぽい。
zsh: no such word in event
```

```terminal
% echo foo bar baz
foo bar baz
% echo !!2*  # x* は x-$ と等価。
echo bar baz
bar baz
```

#### Modifiers

特記がない限りファイル名生成と変数展開でも同じものが使えるとのこと。


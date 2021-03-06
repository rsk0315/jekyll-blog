export default function(hljs) {
    const regex = hljs.regex;
    const VAR = {};
    const BRACED_VAR = {
        begin: /\$\{/,
        end: /\}/,
        contains: [
            'self',
            {
                begin: /:-/,
                contains: [ VAR ],
            } // default values
        ]
    };
    Object.assign(VAR, {
        className: 'variable',
        variants: [
            {
                begin: regex.concat(
                    /\$[\w\d#@][\w\d_]*/, `(?![\\w\\d])(?![$])`
                )
            },
            BRACED_VAR,
        ]
    });
    const SUBST = {
        className: 'subst',
        begin: /\$\(/,
        end: /\)/,
        contains: [ hljs.BACKSLASH_ESCAPE ],
    };
    const HERE_DOC = {
        // begin: /(?<![<])<<-?\s*(?=\w+)/,
        begin: /(?:^|[^<])<<-?\s*(?=\w+)/,
        starts: {
            contains: [
                hljs.END_SAME_AS_BEGIN({
                    begin: /(\w+)/,
                    end: /(\w+)/,
                    className: 'string',
                }),
            ],
        }
    };
    const QUOTE_STRING = {
        className: 'string',
        begin: /"/,
        end: /"/,
        contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR,
            SUBST,
        ],
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
        className: '',
        begin: /\\"/,
    };
    const APOS_STRING = {
        className: 'string',
        begin: /'/,
        end: /'/,
    };
    const ARITHMETIC = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [
            {
                begin: /\d+#[0-9a-f]+/,
                className: 'number',
            },
            hljs.NUMBER_MODE,
            VAR
        ],
    };
    const KNOWN_SHEBANG = hljs.SHEBANG({
        binary: '(zsh)',
        relevance: 0,
    });
    const FUNCTION = {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [
            hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ }),
        ],
        relevance: 0,
    };
    const PRECOMMAND_MODIFIERS = [
        '-',
        'builtin',
        'command',
        'exec',
        'nocorrect',
        'noglob',
    ];
    const KEYWORDS = [
        'always',
    ];
    const RESERVED_WORDS = [
        'do',
        'done',
        'esac',
        'then',
        'elif',
        'else',
        'fi',
        'for',
        'case',
        'if',
        'while',
        'function',
        'repeat',
        'time',
        'until',
        'select',
        'coproc',
        'foreach',
        'end',
        '!',
        '[[',
        ']]',
        // '{',
        // '}',
        'declare',
        'export',
        'float',
        'integer',
        'local',
        'readonly',
        'typeset',
    ];
    const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
    const ZSH_BUILT_INS = [
        // man zshbuiltins | grep -E '^.{7}[^ ]' | cut -f8 -d\  | awk '/-$/,0' \
        //     | sed 's/.*/        "&",/; s/.\x08//g' | sort -u
        "-",
        ".",
        ":",
        "[", "]",
        "alias",
        "autoload",
        "bg",
        "bindkey",
        "break",
        "builtin",
        "bye",
        "cap",
        "cd",
        "chdir",
        "clone",
        "command",
        "comparguments",
        "compcall",
        "compctl",
        "compdescribe",
        "compfiles",
        "compgroups",
        "compquote",
        "comptags",
        "comptry",
        "compvalues",
        "continue",
        "declare",
        "dirs",
        "disable",
        "disown",
        "echo",
        "echotc",
        "echoti",
        "emulate",
        "enable",
        "eval",
        "exec",
        "exit",
        "export",
        "false",
        "fc",
        "fg",
        "float",
        "functions",
        "getcap",
        "getln",
        "getopts",
        "hash",
        "history",
        "integer",
        "job",
        "jobs",
        "kill",
        "let",
        "limit",
        "local",
        "log",
        "logout",
        "noglob",
        "popd",
        "print",
        "printf",
        "pushd",
        "pushln",
        "pwd",
        "r",
        "read",
        "readonly",
        "rehash",
        "return",
        "sched",
        "set",
        "setcap",
        "setopt",
        "shift",
        "source",
        "stat",
        "suspend",
        "test",
        "times",
        "trap",
        "true",
        "ttyctl",
        "type",
        "typeset",
        "ulimit",
        "umask",
        "unalias",
        "unfunction",
        "unhash",
        "unlimit",
        "unset",
        "unsetopt",
        "vared",
        "wait",
        "whence",
        "where",
        "which",
        "zcompile",
        "zformat",
        "zftp",
        "zle",
        "zmodload",
        "zparseopts",
        "zprof",
        "zpty",
        "zregexparse",
        "zsocket",
        "zstyle",
        "ztcp",
    ];
    const GNU_CORE_UTILS = [
        "chcon",
        "chgrp",
        "chown",
        "chmod",
        "cp",
        "dd",
        "df",
        "dir",
        "dircolors",
        "ln",
        "ls",
        "mkdir",
        "mkfifo",
        "mknod",
        "mktemp",
        "mv",
        "realpath",
        "rm",
        "rmdir",
        "shred",
        "sync",
        "touch",
        "truncate",
        "vdir",
        "b2sum",
        "base32",
        "base64",
        "cat",
        "cksum",
        "comm",
        "csplit",
        "cut",
        "expand",
        "fmt",
        "fold",
        "head",
        "join",
        "md5sum",
        "nl",
        "numfmt",
        "od",
        "paste",
        "ptx",
        "pr",
        "sha1sum",
        "sha224sum",
        "sha256sum",
        "sha384sum",
        "sha512sum",
        "shuf",
        "sort",
        "split",
        "sum",
        "tac",
        "tail",
        "tr",
        "tsort",
        "unexpand",
        "uniq",
        "wc",
        "arch",
        "basename",
        "chroot",
        "date",
        "dirname",
        "du",
        "echo",
        "env",
        "expr",
        "factor",
        "false",
        "groups",
        "hostid",
        "id",
        "link",
        "logname",
        "nice",
        "nohup",
        "nproc",
        "pathchk",
        "pinky",
        "printenv",
        "printf",
        "pwd",
        "readlink",
        "runcon",
        "seq",
        "sleep",
        "stat",
        "stdbuf",
        "stty",
        "tee",
        "test",
        "timeout",
        "true",
        "tty",
        "uname",
        "unlink",
        "uptime",
        "users",
        "who",
        "whoami",
        "yes"
    ];
    const MISC_COMMANDS = [
        'diff',
        'grep',
        'less',
        'sed',

        'emacs',
        'vim',
        'view',
        'ed',
        'ex',

        'exa',
        'bat',
        'delta',
        'rg',

        'bash',
        'python',
        'pip',
        'zsh',
    ];
    const HISTORY = {
        className: 'keyword',
        begin: /!\S+/,
    };

    return {
        name: 'Zsh',
        aliases: [ 'zsh' ],
        keywords: {
            $pattern: /\b[a-z][a-z0-9._-]+\b|[{}();|&<>]/,
            keyword: [
                ...KEYWORDS,
                ...RESERVED_WORDS,
            ],
            literal: [],
            built_in: [
                ...ZSH_BUILT_INS,
                ...GNU_CORE_UTILS,
                ...MISC_COMMANDS,
            ],
        },
        contains: [
            KNOWN_SHEBANG,
            hljs.SHEBANG(),
            FUNCTION,
            ARITHMETIC,
            // hljs.HASH_COMMENT_MODE,
            // hljs.COMMENT(/(?<=\s)#/, /\n/),
            hljs.COMMENT(/\s#/, /\n/),
            hljs.COMMENT(/^#/, /\n/),
            HERE_DOC,
            PATH_MODE,
            QUOTE_STRING,
            ESCAPED_QUOTE,
            APOS_STRING,
            VAR,
            HISTORY,
        ],
    };
}

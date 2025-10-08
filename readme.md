```text
        .
       ":"
     ___:____     |"\/"|
   ,'        `.    \  /
   |  O        \___/  |
 ~^~^~^~^~^~^~^~^~^~^~^~^~
```

# A Minimal Adaptor for Creating VSCode Themes

Orca is a lightweight and minimal toolkit designed to simplify the process of building Visual Studio Code themes.

It is exhaustively typed to provide strong type safety and autocompletion throughout your theme development experience.


## Requirements

* bun or Node.js (Runtime Environment)
* vsce (Visual Studio Code Extension Manager)
* code (VSCode CLI tool)

### Important

Orca must be executed from a clean, writable directory where it can create and manage `package.json` and `.vsix` files safely.


## Quick Start

The following example demonstrates how to build a theme, generate a .vsix package in the program's entry directory, install the theme into VSCode using the code CLI, uninstall it, and finally unwrap the operation result.

If successful, this will produce a package named `hello-world-0.1.0.vsix`.

```ts
import * as pt from "path";
import * as vs from "..";

vs.build(b => {
    b.metadata({
        "version": "0.1.0",
        "license": "MIT"
    });

    b.tokenSemantic({
        "function": "#FFFFFF"
    });

    b.token({
        "scope": [
            "comment",
            "comment.block",
            "comment.block.documentation",
            "comment.block.documentation.cpp"
        ],
        "settings": {
            "foreground": "#FFFFFF"
        }
    });

    return {
        "publisher": "hello-lab",
        "name": "hello-world",
        "type": "dark",
        "root": pt.join(__dirname, "/") as vs.Dir
    };
})
.and<vs.Extension>(ext => ext.install())
.and<vs.Extension>(ext => ext.uninstall())
.unwrap();
```
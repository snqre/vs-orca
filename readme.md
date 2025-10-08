```text
        .
       ":"
     ___:____     |"\/"|
   ,'        `.    \  /
   |  O        \___/  |
 ~^~^~^~^~^~^~^~^~^~^~^~^~
```

# Orca is a very minimal adaptor for creating vscode themes.


## Required

* `bun` or `nodejs`
* `vsce`
* `code`

Orca must run from a blank writable directory where `package.json` and `.vsix` can be written to.


## Quick Start

The example below will build a theme and place the `.vsix` at the entry directory of the program. Then it will install the `orca-1.0.0.vsix` on `vscode` using the `code` cli tool, uninstall the theme, and finally `unwrap` the outcome of the operation. If everything goes well, you should have a `orca-1.0.0.vsix` build.

### Note
Your `root` should be in an empty directory.

```ts
import * as pt from "path";
import * as vs from "vs-orca";

const nowNum: number = Date.now();
const now: bigint = BigInt(nowNum);
const themeVersion: vs.Version = `0.1.${now}`;
const themeRoot: vs.Dir = pt.join(__dirname, "/theme/") as vs.Dir;
const theme: vs.Theme = vs.Theme(themeRoot);
const themeName: string = "orca-nord";
const themeConf: vs.Conf = {
  "version": themeVersion,
  "publisher": "orca",
  "theme": {
    "name": themeName,
    "type": "dark",
    "colors": {
      "editor.foreground": "#88b3b1",
      "editor.background": "#212121"
    },
    "semanticHighlighting": true,
    "semanticTokenColors": {
      "keyword": "#88b3b1"    
    },
    "tokenColors": [{
      "scope": [
        "string"
      ],
      "settings": {
        "foreground": "#97af83"
      }
    }, {
      "scope": [
        "constant",
        "constant.character",
        "constant.language.infinity",
        "module",
        "keyword",
        "keyword.operator",
        "operator",
        "variable", 
        "variable.constant",
        "meta.function",
        "meta.function-call",
        "meta.type",
        "punctuation"
      ],
      "settings": {
          "foreground": "#88b3b1"
      }
    }]
  }
};

theme.build(themeConf)
  .and(() => theme.installConf(themeConf))
  .and(() => theme.uninstallConf(themeConf))
  .unwrap();
```
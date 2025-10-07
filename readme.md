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

```ts
import * as orca from "vs-orca";

const theme: orca.Theme = orca.Theme("/theme/");

theme.build({
    "engine": ">=1.80.0",
    "version": "0.1.0",
    "theme": {
        "name": "orca",
        "type": "dark",
        "semanticHighlighting": true,
        "semanticTokenColors": {
            "function": "#FFFFFF"
        }
    }
})
.and(() => orca.install("orca", "0.1.0"))
.and(() => orca.uninstall("orca"))
.unwrap();
```
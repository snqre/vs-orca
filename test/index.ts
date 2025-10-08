import * as pt from "path";
import * as vs from "..";

vs.build(b => {
    b.metadata({
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
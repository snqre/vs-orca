import * as vs_orca from "..";

const themeConf: vs_orca.Conf = {
    "description": "",
    "displayName": "Vs Orca Debug",
    "publisher": "debug",
    "license": "Unlicense",
    "version": "0.1.0",
    "theme": {
        "name": "vs-orca",
        "type": "dark",
        "colors": {
            "editor.foreground": "#121212",
            "editor.background": "#121212"
        }
    }
};

const themeRoot: vs_orca.Dir = __dirname as vs_orca.Dir;
const theme: vs_orca.Theme = vs_orca.Theme(themeRoot);

theme
    .build(themeConf)
    .and(() => theme.installConf(themeConf))
    .unwrap();
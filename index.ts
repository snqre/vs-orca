//
// License: Apache-2.0
//

//
//        .
//       ":"
//     ___:____     |"\/"|
//   ,'        `.    \  /
//   |  O        \___/  |
// ~^~^~^~^~^~^~^~^~^~^~^~^~
//

import * as fs from "fs";
import * as pt from "path";
import * as cp from "child_process";


// MARK: Result

export type OnSuccess<A, B> = (x: A) => Result<B>;

export type Result<T> = Ok<T> | Err<Error>;

export type Error =
    | Unknown
    | "ERR_ROOT_DOES_NOT_EXIST"
    | "ERR_PACKAGE_CONF_OVERRIDE"
    | "ERR_MISSING_CONF_NAME"
    | "ERR_MISSING_DEPENDENCY_VSCE"
    | "ERR_MISSING_DEPENDENCY_CODE";

type Ok<A> = {
    ok: true,
    err: false,
    unwrap(): A,
    and<B>(onSuccess: OnSuccess<A, B>): Result<B>
};

function Ok<A>(x_: A): Ok<A> {
    /** @constructor */ {
        const ok: true = true;
        const err: false = false;
        return { ok, err, unwrap, and };
    }

    function unwrap(): A {
        return x_;
    }

    function and<B>(onSuccess: OnSuccess<A, B>): Result<B> {
        return onSuccess(x_);
    }
}

type Err<_A> = {
    ok: false,
    err: true,
    unwrap(): never,
    and<B>(_: unknown): Result<B>
};

function Err<T>(x_: T): Err<T> {
    /** @constructor */ {
        const ok: false = false;
        const err: true = true;
        return { ok, err, unwrap, and };
    }

    function unwrap(): never {
        if (
            typeof x_ !== "undefined"
            && typeof x_ === "object"
            && x_ !== null
            && "peak" in x_
            && typeof x_.peak === "function" 
        ) {
            throw x_.peak();
        }
        if (typeof x_ === "string") {
            throw Error(x_);
        }
        throw x_;
    }

    function and<B>(_: unknown): Result<B> {
        return Err<T>(x_);
    }
}

export type Unknown = {
    peak(): unknown;
}

function Unknown(x_: unknown): Unknown {
    /** @constructor */ {
        return { peak };
    }

    function peak(): unknown {
        return x_;
    }
}

type OnUnsafeOperation<T> = () => T;

function wrapUnsafeOperation<T>(onUnsafeOperation: OnUnsafeOperation<T>): Result<T> {
    try {
        return Ok<T>(onUnsafeOperation());
    } catch (e) {
        return Err<Error>(Unknown(e));
    }
}


// MARK: Common

export type Color = `#${string}`;

export type SemverVersion = `${SemverSymbol}${Version}`;
export type SemverSymbol =
    | "^"
    | "~"
    | ">="
    | "<="
    | ">"
    | "<"
    | "=";

export type Version = `${bigint}.${bigint}.${bigint}`;

export type JsonPath = Path & `${string}.json`;

export type Dir =
    | `/`
    | `/${string}/`

export type Path = 
    |   `/${string}.${PathExtension}`
    |  `./${string}.${PathExtension}`
    | `../${string}.${PathExtension}`;

export type PathExtension =
    | "ts"
    | "js"
    | "mjs"
    | "cjs"
    | "json";

export type Url = 
    | `http://${string}` 
    | `https://${string}`;

export type License =
    | "MIT"
    | "Apache-2.0"
    | "GPL-3.0"
    | "GPL-3-Clause"
    | "GPL-2.0"
    | "GPL-2-Clause"
    | "LGPL-3.0"
    | "AGPL-3.0"
    | "MPL-2.0"
    | "CDDL-1.0"
    | "EPL-2.0"
    | "Unlicense"
    | "ISC"
    | "CCO-1.0"
    | "Artistic-2.0"
    | "Zlib"
    | "NCSA"
    | "OSL-3.0"
    | "AFL-3.0"
    | "WTFPL"
    | "BSL-1.0";

export type FontStyle = "bold" | "italic" | "underline";


// MARK: Package

export type PackageConf = {
    "name"?: string,
    "type"?: PackageConfType,
    "description"?: string,
    "displayName"?: string,
    "publisher"?: string,
    "categories"?: Array<PackageConfCategory>,
    "keywords"?: Array<string>,
    "version"?: Version,
    "license"?: License,
    "author"?: string,
    "contributes"?: {
        "themes"?: Array<{
            "label": string,
            "path": JsonPath,
            "uiTheme": PackageConfUiTheme
        }>
    },
    "main"?: Path,
    "module"?: Path,
    "scripts"?: Record<string, string>,
    "engines"?: Partial<Record<PackageConfEngine, SemverVersion | Version>>,
    "dependencies"?: Record<string, SemverVersion | Version>,
    "devDependencies"?: Record<string, SemverVersion | Version>,
    "peerDependencies"?: Record<string, SemverVersion>
};

export type PackageConfUiTheme = "vs" | "vs-dark" | "hc-black" | "hc-light";

export type PackageConfCategory =
    | "Programming Languages"
    | "Snippets"
    | "Linters"
    | "Themes"
    | "Debuggers"
    | "Keymaps"
    | "Formatters"
    | "Testers"
    | "Other";

export type PackageConfType = "commonjs" | "module";

export type PackageConfEngine = 
    | "node"
    | "npm"
    | "yarn"
    | "pnpm"
    | "bun"
    | "npx"
    | "corepack"
    | "deno"
    | "volta"
    | "vscode"
    | "electron"
    | "nw"
    | "chrome"
    | "firefox"
    | "safari"
    | "edge"
    | "opera"
    | "node-gyp"
    | "webpack"
    | "tsc"
    | "elint"
    | "prettier"
    | "babel"
    | "rollup"
    | "vite"
    | "parcel"
    | "jest"
    | "mocha"
    | "cypress"
    | "playwright"
    | "puppeteer";


// MARK: Text Mate

export type TokenColorConf = {
    "name"?: string,
    "scope": Array<TextMateScope>,
    "settings": TextMateConf
};

export type TextMateConf = {
    "foreground"?: Color,
    "background"?: Color,
    "fontStyle"?: FontStyle
};

export type TextMateScope =
    | TextMateMarkup 
    | TextMateSource
    | TextMateOperator
    | TextMateStorage
    | TextMateVariable
    | TextMatePunctuation
    | TextMateProperty
    | TextMateConstant
    | TextMateString
    | TextMateNamespace
    | TextMateModule
    | TextMateComment
    | TextMateKeyword
    | TextMateSupport
    | TextMateEntity
    | TextMateMeta;

export type TextMateText =
    | "text"
    | "text.plain"
    | "text.html.basic"
    | "text.xml"
    | "text.xml.markup"
    | "text.xml.processing"
    | "text.html.markdown"
    | "text.markdown"
    | "text.source"
    | "text.whitespace"
    | "text.todo"
    | "text.note"
    | "text.warning"
    | "text.error"
    | "text.diff"
    | "text.diff.header"
    | "text.diff.addition"
    | "text.diff.deletion"
    | "text.comment"
    | "text.raw"
    | "text.literal"
    | "text.quoted"
    | "text.quoted.double"
    | "text.quoted.single"
    | "text.quoted.triple"
    | "text.underline"
    | "text.bold"
    | "text.italic";

export type TextMateMarkup =
    | "markup"
    | "markup.bold"
    | "markup.italic"
    | "markup.underline"
    | "markup.strikethrough"
    | "markup.heading"
    | "markup.heading.markdown"
    | "markup.heading.setext"
    | "markup.heading.atx"
    | "markup.quote"
    | "markup.quote.markdown"
    | "markup.list"
    | "markup.list.numbered"
    | "markup.list.unnumbered"
    | "markup.list.item"
    | "markup.list.item.numbered"
    | "markup.list.item.unnumbered"
    | "markup.list.label"
    | "markup.list.term"
    | "markup.list.definition"
    | "markup.separator"
    | "markup.separator.markdown"
    | "markup.code"
    | "markup.inline.raw"
    | "markup.raw.block"
    | "markup.raw.inline"
    | "markup.raw"
    | "markup.link"
    | "markup.link.inline"
    | "markup.link.reference"
    | "markup.link.title"
    | "markup.link.description"
    | "markup.link.label"
    | "markup.image"
    | "markup.image.inline"
    | "markup.image.reference"
    | "markup.attribute"
    | "markup.attribute.name"
    | "markup.attribute.value"
    | "markup.tag"
    | "markup.tag.name"
    | "markup.tag.inline"
    | "markup.tag.block"
    | "markup.tag.selfclosing"
    | "markup.comment"
    | "markup.comment.block"
    | "markup.comment.line"
    | "markup.processing"
    | "markup.doctype"
    | "markup.entity"
    | "markup.entity.name"
    | "markup.bold.strong"
    | "markup.emphasis"
    | "markup.inserted"
    | "markup.deleted"
    | "markup.changed";

export type TextMateSource =
    | "source"
    | "source.js"
    | "source.jsx"
    | "source.ts"
    | "source.tsx"
    | "source.json"
    | "source.css"
    | "source.scss"
    | "source.less"
    | "source.html"
    | "source.xml"
    | "source.yaml"
    | "source.python"
    | "source.ruby"
    | "source.php"
    | "source.java"
    | "source.kotlin"
    | "source.go"
    | "source.cpp"
    | "source.c"
    | "source.objc"
    | "source.shell"
    | "source.bash"
    | "source.zsh"
    | "source.lua"
    | "source.rust"
    | "source.perl"
    | "source.scala"
    | "source.sql"
    | "source.toml"
    | "source.ini"
    | "source.makefile"
    | "source.dockerfile"
    | "source.gradle"
    | "source.cmake"
    | "source.elisp"
    | "source.lisp"
    | "source.clojure"
    | "source.haskell"
    | "source.erlang"
    | "source.swift"
    | "source.dart"
    | "source.markdown"
    | "source.tex"
    | "source.latex"
    | "source.vue"
    | "source.angular"
    | "source.svelte";

export type TextMateOperator =
    | "operator"
    | "operator.assignment"
    | "operator.arithmetic"
    | "operator.logical"
    | "operator.comparison"
    | "operator.bitwise"
    | "operator.ternary"
    | "operator.increment"
    | "operator.decrement"
    | "operator.spread"
    | "operator.ellipsis";

export type TextMateStorage =
    | "storage"
    | "storage.type"
    | "storage.type.class"
    | "storage.type.enum"
    | "storage.type.interface"
    | "storage.type.struct"
    | "storage.type.function"
    | "storage.type.module"
    | "storage.type.namespace"
    | "storage.type.primitive"
    | "storage.type.parameter"
    | "storage.type.variable"
    | "storage.modifier"
    | "storage.modifier.async"
    | "storage.modifier.static"
    | "storage.modifier.export"
    | "storage.modifier.default"
    | "storage.modifier.const"
    | "storage.modifier.let"
    | "storage.modifier.readonly"
    | "storage.modifier.public"
    | "storage.modifier.private"
    | "storage.modifier.protected"
    | "storage.modifier.abstract"
    | "storage.modifier.override"
    | "storage.modifier.sealed"
    | "storage.modifier.extern";

export type TextMateVariable =
    | "variable"
    | "variable.language"
    | "variable.parameter"
    | "variable.parameter.function"
    | "variable.parameter.method"
    | "variable.parameter.class"
    | "variable.other"
    | "variable.other.readwrite"
    | "variable.other.constant"
    | "variable.other.property"
    | "variable.other.property.static"
    | "variable.other.attribute-name"
    | "variable.other.global"
    | "variable.other.enclosing"
    | "variable.other.static"
    | "variable.static"
    | "variable.readonly"
    | "variable.constant";

export type TextMatePunctuation =
    | "punctuation"
    | "punctuation.definition"
    | "punctuation.definition.comment"
    | "punctuation.definition.string"
    | "punctuation.definition.variable"
    | "punctuation.definition.parameters"
    | "punctuation.definition.tag"
    | "punctuation.definition.block"
    | "punctuation.separator"
    | "punctuation.separator.key-value"
    | "punctuation.separator.dictionary.key-value"
    | "punctuation.separator.comma"
    | "punctuation.separator.period"
    | "punctuation.separator.continuation"
    | "punctuation.bracket"
    | "punctuation.bracket.round"
    | "punctuation.bracket.square"
    | "punctuation.bracket.curly"
    | "punctuation.accessor"
    | "punctuation.section"
    | "punctuation.section.embedded"
    | "punctuation.terminator"
    | "punctuation.terminator.statement"
    | "punctuation.terminator.expression";

export type TextMateProperty =
    | "property"
    | "property.accessor"
    | "property.definition"
    | "property.reference"
    | "property.other"
    | "property.readonly"
    | "property.static"
    | "property.instance"
    | "property.constant"
    | "property.declaration"
    | "property.annotation"
    | "property.parameter"
    | "property.mutator";

export type TextMateConstant =
    | "constant"
    | "constant.numeric"
    | "constant.numeric.integer"
    | "constant.numeric.float"
    | "constant.numeric.hex"
    | "constant.numeric.octal"
    | "constant.numeric.binary"
    | "constant.numeric.decimal"
    | "constant.character"
    | "constant.character.escape"
    | "constant.character.escape.newline"
    | "constant.character.escape.quote"
    | "constant.character.escape.backslash"
    | "constant.character.escape.unicode"
    | "constant.character.escape.hex"
    | "constant.character.escape.octal"
    | "constant.character.entity"
    | "constant.language"
    | "constant.language.boolean"
    | "constant.language.null"
    | "constant.language.undefined"
    | "constant.language.nan"
    | "constant.language.infinity"
    | "constant.other"
    | "constant.other.symbol"
    | "constant.other.color";

export type TextMateString =
    | "string"
    | "string.quoted"
    | "string.quoted.single"
    | "string.quoted.double"
    | "string.quoted.triple"
    | "string.quoted.other"
    | "string.quoted.raw"
    | "string.quoted.template"
    | "string.quoted.heredoc"
    | "string.template"
    | "string.interpolated"
    | "string.interpolated.double"
    | "string.interpolated.single"
    | "string.interpolated.template"
    | "string.interpolated.braced"
    | "string.regexp"
    | "string.regexp.class"
    | "string.regexp.group"
    | "string.regexp.character-class"
    | "string.regexp.quantifier"
    | "string.regexp.anchor"
    | "string.regexp.named-group"
    | "string.regexp.back-reference"
    | "string.regexp.escape"
    | "string.regexp.comment"
    | "string.unquoted"
    | "string.unquoted.heredoc"
    | "string.unquoted.embedded"
    | "string.escape"
    | "string.escape.sequence"
    | "string.invalid"
    | "string.other";

export type TextMateNamespace =
    | "namespace"
    | "namespace.identifier"
    | "namespace.definition"
    | "namespace.reference"
    | "namespace.modifier"
    | "namespace.alias";

export type TextMateModule =
    | "module"
    | "module.identifier"
    | "module.definition"
    | "module.reference";

export type TextMateComment =
    | "comment"
    | "comment.line"
    | "comment.line.double-slash"
    | "comment.line.number-sign"
    | "comment.line.double-dash"
    | "comment.line.percentage"
    | "comment.line.semicolon"
    | "comment.line.character"
    | "comment.block"
    | "comment.block.documentation"
    | "comment.block.documentation.java"
    | "comment.block.documentation.ts"
    | "comment.block.documentation.cpp"
    | "comment.documentation"
    | "comment.documentation.section"
    | "comment.documentation.keyword"
    | "comment.documentation.parameter"
    | "comment.documentation.throws"
    | "comment.documentation.value"
    | "comment.todo"
    | "comment.fixme"
    | "comment.note";

export type TextMateKeyword =
    | "keyword"
    | "keyword.control"
    | "keyword.control.conditional"
    | "keyword.control.loop"
    | "keyword.control.import"
    | "keyword.control.export"
    | "keyword.control.from"
    | "keyword.control.as"
    | "keyword.control.flow"
    | "keyword.control.try"
    | "keyword.control.switch"
    | "keyword.control.case"
    | "keyword.control.return"
    | "keyword.control.while"
    | "keyword.control.for"
    | "keyword.control.if"
    | "keyword.control.else"
    | "keyword.control.break"
    | "keyword.control.continue"
    | "keyword.control.throw"
    | "keyword.control.catch"
    | "keyword.control.finally"
    | "keyword.control.with"
    | "keyword.declaration"
    | "keyword.operator"
    | "keyword.operator.assignment"
    | "keyword.operator.arithmetic"
    | "keyword.operator.logical"
    | "keyword.operator.bitwise"
    | "keyword.operator.comparison"
    | "keyword.operator.ternary"
    | "keyword.operator.delete"
    | "keyword.operator.typeof"
    | "keyword.operator.instanceof"
    | "keyword.operator.spread"
    | "keyword.operator.in"
    | "keyword.operator.of"
    | "keyword.operator.await"
    | "keyword.other"
    | "keyword.other.using"
    | "keyword.other.fn"
    | "keyword.other.this"
    | "keyword.other.super"
    | "keyword.other.debugger"
    | "keyword.other.interface"
    | "keyword.other.enum"
    | "keyword.other.implements"
    | "keyword.other.new"
    | "keyword.other.type"
    | "keyword.other.namespace"
    | "keyword.other.module";

export type TextMateSupport =
    | "support"
    | "support.type"
    | "support.type.builtin"
    | "support.type.property"
    | "support.class"
    | "support.class.builtin"
    | "support.class.component"
    | "support.function"
    | "support.function.builtin"
    | "support.function.macro"
    | "support.constant"
    | "support.constant.builtin"
    | "support.constant.macro"
    | "support.variable"
    | "support.variable.property"
    | "support.variable.dom"
    | "support.other.property-name"
    | "support.other.method";

export type TextMateEntity =
    | "entity"
    | "entity.name"
    | "entity.name.class"
    | "entity.name.struct"
    | "entity.name.enum"
    | "entity.name.enum-member"
    | "entity.name.function"
    | "entity.name.function.member"
    | "entity.name.type"
    | "entity.name.type.parameter"
    | "entity.name.namespace"
    | "entity.name.module"
    | "entity.name.tag"
    | "entity.name.label"
    | "entity.name.decorator"
    | "entity.name.attribute"
    | "entity.other"
    | "entity.other.attribute-name"
    | "entity.other.inherited-class"
    | "entity.other.readwrite"
    | "entity.other.constant"
    | "entity.other.property"
    | "entity.other.event"
    | "entity.other.key"
    | "entity.other.inherited-interface"
    | "entity.other.inherited-protocol"
    | "entity.other.inherited-trait"
    | "entity.other.method"
    | "entity.other.type"
    | "entity.other.class"
    | "entity.other.namespace"
    | "entity.other.variable"
    | "entity.other.function"
    | "entity.other.keyword"
    | "entity.other.operator"
    | "entity.other.modifier"
    | "entity.other.directive"
    | "entity.other.annotation"
    | "entity.other.parameter"
    | "entity.other.local"
    | "entity.other.global"
    | "entity.other.constant.numeric"
    | "entity.other.constant.language"
    | "entity.other.constant.character"
    | "entity.other.symbol";   

export type TextMateMeta =
    | "meta"
    | "meta.function"
    | "meta.function-call"
    | "meta.function.parameters"
    | "meta.function.return-type"
    | "meta.method"
    | "meta.class"
    | "meta.struct"
    | "meta.structure"
    | "meta.structure.dictionary"
    | "meta.structure.list"
    | "meta.structure.tuple"
    | "meta.enum"
    | "meta.interface"
    | "meta.impl"
    | "meta.type"
    | "meta.module"
    | "meta.module.definition"
    | "meta.module.reference"
    | "meta.namespace"
    | "meta.namespace.body"
    | "meta.import"
    | "meta.export"
    | "meta.block"
    | "meta.block.braces"
    | "meta.group"
    | "meta.parens"
    | "meta.brace"
    | "meta.preprocessor"
    | "meta.annotation"
    | "meta.annotation.identifier"
    | "meta.annotation.parameters"
    | "meta.embedded"
    | "meta.embedded.block"
    | "meta.interpolation"
    | "meta.tag"
    | "meta.tag.inline"
    | "meta.tag.block"
    | "meta.path"
    | "meta.statement"
    | "meta.expression"
    | "meta.if"
    | "meta.else"
    | "meta.for"
    | "meta.while"
    | "meta.catch"
    | "meta.try"
    | "meta.switch"
    | "meta.return"
    | "meta.throw"
    | "meta.sentences"
    | "meta.diff"
    | "meta.diff.header"
    | "meta.diff.range"
    | "meta.diff.addition"
    | "meta.diff.deletion";


// MARK: Semantic

export type SemanticTokenConf = Partial<Record<SemanticToken | SemanticTokenWithModifier, Color>>;

export type SemanticTokenWithModifier = `${SemanticToken}.${SemanticTokenModifier}`;

export type SemanticTokenModifier =
    | "declaration"
    | "definition"
    | "readonly"
    | "static"
    | "deprecated"
    | "abstract"
    | "async"
    | "modification"
    | "documentation"
    | "defaultLibrary";

export type SemanticToken =
    | "namespace"
    | "namespace.reference"
    | "type"
    | "type.reference"
    | "typeParameter"
    | "typeParameter.reference"
    | "class"
    | "class.reference"
    | "enum"
    | "enumMember"
    | "enumMember.reference"
    | "interface"
    | "struct"
    | "parameter"
    | "parameter.reference"
    | "variable"
    | "variable.readonly"
    | "variable.static"
    | "variable.constant"
    | "variable.other"
    | "property"
    | "property.reference"
    | "event"
    | "function"
    | "function.reference"
    | "function.static"
    | "method"
    | "method.reference"
    | "macro"
    | "keyword"
    | "modifier"
    | "comment"
    | "string"
    | "number"
    | "regexp"
    | "operator"
    | "label"
    | "text"
    | "boolean"
    | "null"
    | "decorator"
    | "decorator.reference";


// MARK: Editor

export type EditorColorConf = Partial<Record<EditorProperty, Color>>;

export type EditorProperty =
    | "activityBar.background"
    | "activityBar.border"
    | "activityBar.foreground"
    | "activityBarBadge.background"
    | "activityBarBadge.foreground"
    | "badge.background"
    | "badge.foreground"
    | "breadcrumbs.background"
    | "breadcrumbs.focusedBackground"
    | "breadcrumbs.foreground"
    | "breadcrumbs.focusedForeground"
    | "breadcrumbs.activeSelectionForeground"
    | "breadcrumbsPicker.background"
    | "button.background"
    | "button.foreground"
    | "button.hoverBackground"
    | "checkbox.background"
    | "checkbox.border"
    | "debugExceptionWidget.background"
    | "debugExceptionWidget.border"
    | "debugToolBar.background"
    | "debugToolBar.border"
    | "descriptionForeground"
    | "diffEditor.border"
    | "diffEditor.insertedTextBackground"
    | "diffEditor.removedTextBackground"
    | "dropdown.background"
    | "dropdown.border"
    | "dropdown.foreground"
    | "editor.background"
    | "editor.findMatchBackground"
    | "editor.findMatchHighlightBackground"
    | "editor.findRangeHighlightBackground"
    | "editor.focusedStackFrameHighlightBackground"
    | "editor.foreground"
    | "editor.hoverHighlightBackground"
    | "editor.inactiveSelectionBackground"
    | "editor.lineHighlightBackground"
    | "editor.lineHighlightBorder"
    | "editor.rangeHighlightBackground"
    | "editor.selectionBackground"
    | "editor.selectionHighlightBackground"
    | "editor.selectionHighlightBorder"
    | "editor.wordHighlightBackground"
    | "editor.wordHighlightStrongBackground"
    | "editorBracketMatch.background"
    | "editorBracketMatch.border"
    | "editorCodeLens.foreground"
    | "editorCursor.foreground"
    | "editorError.foreground"
    | "editorGroup.background"
    | "editorGroup.border"
    | "editorGroup.dropBackground"
    | "editorGroupHeader.noTabsBackground"
    | "editorGroupHeader.tabsBackground"
    | "editorGutter.background"
    | "editorGutter.commentRangeForeground"
    | "editorHint.foreground"
    | "editorHoverWidget.background"
    | "editorHoverWidget.border"
    | "editorIndentGuide.background"
    | "editorIndentGuide.activeBackground"
    | "editorLineNumber.foreground"
    | "editorLineNumber.activeForeground"
    | "editorLink.activeForeground"
    | "editorMarkerNavigation.background"
    | "editorOverviewRuler.border"
    | "editorOverviewRuler.currentContentForeground"
    | "editorOverviewRuler.incomingContentForeground"
    | "editorOverviewRuler.selectionContentForeground"
    | "editorOverviewRuler.modifiedForeground"
    | "editorOverviewRuler.addedForeground"
    | "editorOverviewRuler.deletedForeground"
    | "editorRuler.foreground"
    | "editorSuggestWidget.background"
    | "editorSuggestWidget.border"
    | "editorSuggestWidget.foreground"
    | "editorSuggestWidget.highlightForeground"
    | "editorSuggestWidget.selectedBackground"
    | "editorWarning.foreground"
    | "editorWhitespace.foreground"
    | "editorWidget.background"
    | "editorWidget.border"
    | "errorForeground"
    | "focusBorder"
    | "foreground"
    | "gitDecoration.addedResourceForeground"
    | "gitDecoration.conflictingResourceForeground"
    | "gitDecoration.deletedResourceForeground"
    | "gitDecoration.ignoredResourceForeground"
    | "gitDecoration.modifiedResourceForeground"
    | "gitDecoration.submoduleResourceForeground"
    | "gitDecoration.untrackedResourceForeground"
    | "input.background"
    | "input.border"
    | "input.foreground"
    | "input.placeholderForeground"
    | "inputOption.activeBorder"
    | "inputValidation.errorBackground"
    | "inputValidation.errorBorder"
    | "inputValidation.infoBackground"
    | "inputValidation.infoBorder"
    | "inputValidation.warningBackground"
    | "inputValidation.warningBorder"
    | "list.activeSelectionBackground"
    | "list.activeSelectionForeground"
    | "list.dropBackground"
    | "list.focusBackground"
    | "list.highlightForeground"
    | "list.hoverBackground"
    | "list.inactiveSelectionBackground"
    | "list.inactiveSelectionForeground"
    | "list.invalidItemForeground"
    | "list.warningForeground"
    | "listFilterWidget.background"
    | "listFilterWidget.noMatchesOutline"
    | "listFilterWidget.outline"
    | "menu.background"
    | "menu.border"
    | "menu.foreground"
    | "menu.selectionBackground"
    | "menu.selectionForeground"
    | "menu.separatorBackground"
    | "merge.border"
    | "merge.currentHeaderBackground"
    | "merge.currentContentBackground"
    | "merge.incomingHeaderBackground"
    | "merge.incomingContentBackground"
    | "minimap.errorHighlight"
    | "minimap.findMatchHighlight"
    | "minimap.selectionHighlight"
    | "minimap.warningHighlight"
    | "minimap.background"
    | "minimapSlider.activeBackground"
    | "minimapSlider.background"
    | "minimapSlider.hoverBackground"
    | "modalDialog.background"
    | "modalDialog.foreground"
    | "modalDialog.border"
    | "notifications.background"
    | "notifications.foreground"
    | "notifications.errorBackground"
    | "notifications.errorForeground"
    | "notifications.infoBackground"
    | "notifications.infoForeground"
    | "notifications.warningBackground"
    | "notifications.warningForeground"
    | "panel.background"
    | "panel.border"
    | "panelTitle.activeBorder"
    | "panelTitle.activeForeground"
    | "panelTitle.inactiveForeground"
    | "peekView.border"
    | "peekViewEditor.background"
    | "peekViewEditorGutter.background"
    | "peekViewEditor.matchHighlightBackground"
    | "peekViewResult.background"
    | "peekViewResult.fileForeground"
    | "peekViewResult.lineForeground"
    | "peekViewResult.matchHighlightBackground"
    | "peekViewTitle.background"
    | "peekViewTitleDescription.foreground"
    | "peekViewTitleLabel.foreground"
    | "pickerGroup.foreground"
    | "pickerGroup.border"
    | "quickInput.background"
    | "quickInput.foreground"
    | "quickInputTitle.background"
    | "quickInputTitle.foreground"
    | "scrollbar.shadow"
    | "scrollbarSlider.activeBackground"
    | "scrollbarSlider.background"
    | "scrollbarSlider.hoverBackground"
    | "scrollbarSlider.verticalScrollbarSize"
    | "scrollbarSlider.horizontalScrollbarSize"
    | "selection.background"
    | "statusBar.background"
    | "statusBar.foreground"
    | "statusBar.debuggingBackground"
    | "statusBar.debuggingForeground"
    | "statusBar.noFolderBackground"
    | "statusBar.noFolderForeground"
    | "statusBarItem.activeBackground"
    | "statusBarItem.hoverBackground"
    | "tab.activeBackground"
    | "tab.activeForeground"
    | "tab.border"
    | "tab.inactiveBackground"
    | "tab.inactiveForeground"
    | "tab.hoverBackground"
    | "tab.unfocusedHoverBackground"
    | "textBlockQuote.background"
    | "textBlockQuote.border"
    | "textCodeBlock.background"
    | "textLink.activeForeground"
    | "textLink.foreground"
    | "textPreformat.foreground"
    | "textSeparator.foreground"
    | "titleBar.activeBackground"
    | "titleBar.activeForeground"
    | "titleBar.inactiveBackground"
    | "titleBar.inactiveForeground"
    | "tree.indentGuidesStroke"
    | "warningForeground"
    | "widget.shadow"
    | "debugToolBar.background"
    | "debugToolBar.border"
    | "panel.dropBackground"
    | "terminal.background"
    | "terminal.foreground"
    | "terminal.ansiBlack"
    | "terminal.ansiBlue"
    | "terminal.ansiBrightBlack"
    | "terminal.ansiBrightBlue"
    | "terminal.ansiBrightCyan"
    | "terminal.ansiBrightGreen"
    | "terminal.ansiBrightMagenta"
    | "terminal.ansiBrightRed"
    | "terminal.ansiBrightWhite"
    | "terminal.ansiBrightYellow"
    | "terminal.ansiCyan"
    | "terminal.ansiGreen"
    | "terminal.ansiMagenta"
    | "terminal.ansiRed"
    | "terminal.ansiWhite"
    | "terminal.ansiYellow";


// MARK: Theme

export type ThemeType = "light" | "dark" | "hc";

export type ThemeConf = {
    "name": string,
    "type": ThemeType,
    "colors"?: EditorColorConf,
    "semanticHighlighting"?: boolean,
    "semanticTokenColors"?: SemanticTokenConf,
    "tokenColors"?: Array<TokenColorConf>
};


// MARK: Os Hook

type OnThemeConf<T> = () => T;

type OnPackageConf<T> = () => T;

function onThemeConf<T>(conf: Conf, root: Dir, onThemeConf: OnThemeConf<T>): Result<T> {
    try {
        const [,, themePath] = parseConfTheme(conf, root);
        const themeJsonStr: string = JSON.stringify(conf.theme, null, 4);
        fs.writeFileSync(themePath, themeJsonStr);
        const o: T = onThemeConf();
        fs.unlinkSync(themePath);
        return Ok<T>(o);
    } catch (e) {
        return Err<Error>(Unknown(e));
    }
}

function onPackageConf<T>(conf: Conf, root: Dir, onPackageConf: OnPackageConf<T>): Result<T> {
    try {
        const [
            themeName,
            _, 
            themePath
        ] = parseConfTheme(conf, root);
        const json: string = JSON.stringify(packageConf(conf, themeName), null, 4);
        fs.writeFileSync(packageConfPath(root), json);
        const o: T = onPackageConf();
        fs.unlinkSync(packageConfPath(root));
        return Ok<T>(o);
    } catch (e) {
        return Err<Error>(Unknown(e));
    }
}

function packageConf(conf: Conf, name: string): PackageConf {
    return {
        "name": name,
        "description": conf.description,
        "displayName": conf.displayName,
        "publisher": conf.publisher,
        "license": "Unlicense",
        "version": conf.version,
        "contributes": {
            "themes": [{
                "label": name,
                "path": "./" + name + ".json" as JsonPath,
                "uiTheme": ({
                    "hc": "hc-black",
                    "light": "vs",
                    "dark": "vs-dark"
                } as Record<ThemeType, PackageConfUiTheme>)[conf.theme.type]
            }]
        },
        "engines": {
            "vscode": conf.engine ?? "^1.0.0"
        }
    };
}

function packageConfPath(root: Dir): string {
    return pt.join(root, "package.json");
}


// MARK: Parse

function parseConfTheme(conf: Conf, root: Dir): [string, string, string] {
    const themeNameAsKebabCase: string = conf.theme.name
        .trimStart()
        .trimEnd()
        .replaceAll(" ", "-")
        .toLowerCase();
    const themeFileName: string = `${themeNameAsKebabCase}.json`;
    const themePath: string = pt.join(root, themeFileName);
    return [
        themeNameAsKebabCase,
        themeFileName,
        themePath
    ];
}


// MARK: Guard

function onlyIfDependency(): Result<void> {
    try {
        cp.execSync("vsce --version", {
            stdio: "ignore"
        });
    } catch {
        return Err<Error>("ERR_MISSING_DEPENDENCY_VSCE");
    }
    try {
        cp.execSync("code --version", {
            stdio: "ignore"
        });
    } catch {
        return Err<Error>("ERR_MISSING_DEPENDENCY_CODE");
    }
    return Ok<void>(undefined);
}

function onlyIfRoot(root: Dir): Result<void> {
    const exists: boolean = fs.existsSync(root);
    if (!exists) {
        return Err<Error>("ERR_ROOT_DOES_NOT_EXIST");
    }
    return Ok<void>(undefined);
}

function onlyIfNotPackageConf(root: Dir): Result<void> {
    const exists: boolean = fs.existsSync(packageConfPath(root));
    if (exists) {
        return Err<Error>("ERR_PACKAGE_CONF_OVERRIDE");
    }
    return Ok<void>(undefined);   
}


// MARK: PUBLIC

export type Conf = {  
    "description"?: string,
    "displayName"?: string,
    "publisher": string,
    "license"?: License,
    "version"?: Version,
    "engine"?: SemverVersion | Version,
    "theme": ThemeConf
};

export type BrushMetadataConf = {
    "description"?: string,
    "displayName"?: string,
    "license"?: License,
    "version"?: Version,
    "engine"?: SemverVersion | Version
};

export type BrushRequiredConf = {
    "publisher": string,
    "name": string,
    "type": ThemeType,
    "root": Dir  
};

export type BrushPartialConf = 
    Omit<Partial<Conf>, "theme">
    & {
    "theme"?: Partial<ThemeConf>
};

export type Brush = {
    metadata(conf: BrushMetadataConf): Brush,
    editor(conf: EditorColorConf): Brush,
    tokenSemantic(conf: SemanticTokenConf): Brush,
    token(conf: TokenColorConf): Brush,
    build(): BrushPartialConf
};

export type PartialBrush = Omit<Brush, "build">;

export type Extension = {
    conf(): Readonly<Conf>
    install(): Result<Extension>,
    uninstall(): Result<Extension>
};

export type OnBuild = (brush: PartialBrush) => BrushRequiredConf;

export function build(onBuild: OnBuild): Result<Extension> {
    const brush: Brush = Brush();
    const reqConf: BrushRequiredConf = onBuild(brush);
    const parConf: BrushPartialConf = brush.build();
    const conf: Conf = {
        ...parConf,
        "publisher": reqConf.publisher,
        "theme": {
            ...(parConf.theme ?? {}),
            "name": reqConf.name,
            "type": reqConf.type
        }
    };
    const nowNum: number = Date.now();
    const now: bigint = BigInt(nowNum);
    const confn: Conf = {
        ...conf,
        "version": `0.1.${now}`
    };
    if (confn.theme.name === "") {
        return Err<Error>("ERR_MISSING_CONF_NAME");
    }
    return onlyIfDependency()
        .and<void>(() => onlyIfRoot(reqConf.root))
        .and<void>(() => onlyIfNotPackageConf(reqConf.root))
        .and<void>(() => {
            return onPackageConf<void>(confn, reqConf.root, () => {
                return onThemeConf<void>(confn, reqConf.root, () => {
                    return wrapUnsafeOperation<void>(() => {
                        return cp.execSync("vsce package", {
                            stdio: "ignore",
                            cwd: reqConf.root
                        });
                    })
                })
            })
        })
        .and<Extension>(() => Ok(Extension(confn, reqConf.root))) as Result<Extension>;
}

function Brush(): Brush {
    const conf_: BrushPartialConf = {};
    const self_: Brush = {
        metadata,
        editor,
        tokenSemantic,
        token,
        build
    }

    function metadata(conf: BrushMetadataConf): Brush {
        Object.assign(conf_, conf);
        return self_;
    }

    function editor(conf: EditorColorConf): Brush {
        if (conf_.theme === undefined) {
            conf_.theme = {};
        }
        Object.assign(conf_.theme, conf);
        return self_;
    }

    function tokenSemantic(conf: SemanticTokenConf): Brush {
        if (conf_.theme === undefined) {
            conf_.theme = {};
        }
        conf_.theme.semanticHighlighting = true;
        Object.assign(conf_.theme, conf);
        return self_;
    }

    function token(conf: TokenColorConf): Brush {
        if (conf_.theme === undefined) {
            conf_.theme = {};
        }
        if (conf_.theme.tokenColors === undefined) {
            conf_.theme.tokenColors = [];
        }
        conf_.theme.tokenColors.push(conf);
        return self_;
    }

    function build(): BrushPartialConf {
        return conf_;
    }

    return self_;
}

function Extension(conf_: Conf, root_: Dir): Extension {
    const self_ = {
        conf,
        install,
        uninstall
    };

    function conf(): Readonly<Conf> {
        return conf_;
    }

    function install(): Result<Extension> {
        const name: string = conf_.theme.name
            .trimStart()
            .trimEnd()
            .replaceAll(" ", "-");
        return onlyIfDependency()
            .and<void>(() => onlyIfRoot(root_))
            .and<Extension>(() => uninstall())
            .and<Extension>(() => wrapUnsafeOperation<Extension>(() => {
                cp.execSync(`code --install-extension ${name}-${conf_.version}.vsix`, {
                    stdio: "ignore",
                    cwd: root_
                });
                return self_;
            })) as Result<Extension>;
    }

    function uninstall(): Result<Extension> {
        return wrapUnsafeOperation<void>(() => {
            try {
                const name: string = conf_.theme.name
                    .trimStart()
                    .trimEnd()
                    .replaceAll(" ", "-");
                cp.execSync(`code --uninstall-extension ${conf_.publisher}.${name}`, {
                    stdio: "ignore",
                    cwd: root_
                });
            } catch {}
            return Ok(undefined);
        })
        .and<Extension>(() => Ok(self_)) as Result<Extension>;
    }
    
    return self_;
}
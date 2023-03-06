# gettextractor

CLI for extracting translation strings from application source files to a .PO (gettext) file for later translation. It uses babel under the hood to traverse AST tree and find all strings that appear in specific function calls.

## Usage
Consider the following application source fragment:
```ts
    // src/utils.ts
    import __ from './translate';

    export function injectHeader () {
        const element = document.createElement('h1');
        element.innerText = __('Hello world!');

        document.appendChild(element);
    }
```
regardless of what `__` function does, in an application development lifecycle, at some point you'll want to extract all translatable strings from source code and generate a file that'll want to send for translation. This tool is able to extract those strings from your whole application code to a single .po file.

To do that on the above file, do:
```bash
$ gettextractor --name __ --dir src --filter '.ts'
```
This will print the .PO file contents to standard output. See `--out` flag usage for info on how to save it to a file.

**--name**

Provide the name of a function that will be looked for during extraction.

**--dir**

Base directory name where all your source files are.

**--filter**

You can provide extensions list in the `--filter` flag to modify what files will get checked for presence of translation strings. For example, if you have a React application, you can do:
```bash
$ gettextractor --name __ --dir src --filter '.js,.jsx,.ts,.tsx'
```

**--out** (optional)

If you want to have the result saved to a file, provide its name as a value for this flag:
```bash
$ gettextractor --name __ --dir src --filter '.ts' --out en.po
```

**--annotation** (optional)

Sometimes, you may want to pass some information to future translators (reg. context, etc). In such case, you can do so by adding a comment direcly above the line with translation:
```ts
// TRANSLATORS: It's defining the greeting message.
const text = __('Hello world!');
```

This flag allows you to change the default `TRANSLATORS` prefix used for comments that will be passed to the resulting .po file, i.e.:
```ts
// CONTEXT: Custom info for translators.
/*
 * CONTEXT: I can also accept
 * multiline comment.
 */
const text = __('Hello world!');
```
```bash
$ gettextrator --name __ --dir src --filter '.ts' --annotation 'CONTEXT'
```
```
msgid ""
msgstr "Content-Type: text/plain\n"

# Custom info for translators.; I can also accept multiline comment.
#: src/HelloWorld.tsx:14:20
msgid "Hello world!"
msgstr "Hello world!"
```

# gettextractor

CLI for extracting translation strings from application source files to a .PO (gettext) file for later translation. It uses babel under the hood to traverse AST tree and find all strings that appear in a tagged template expression.

## Usage
Consider the following application source fragment:
```ts
    // src/utils.ts
    import __ from './translate';

    export function injectHeader () {
        const element = document.createElement('h1');
        element.innerText = __`Hello world!`;

        document.appendChild(element);
    }
```
regardless of what `__` function (tagged template expression) does, in an application development lifecycle, at some poiny you'll want to extract all translatable strings from source code and generate a file that'll want to send for translation. This tool is able to extract those strings from your whole application code to a single .po file.

To do that on the above file, do:
```bash
$ gettextractor --name __ --dir src --filter '.ts'
```
This will print the .PO file contents to standard output. See `--out` flag usage for info on how to save it to a file.

**--name**

Provide the name of a tagged template expression that will be looked for during extraction.

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

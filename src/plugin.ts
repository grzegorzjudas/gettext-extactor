import { PluginObj } from '@babel/core';
import type * as BabelCoreNamespace from '@babel/core';

import { Translation } from './types';

export type GettextractorOptions = {
    mapper: (result: Translation) => void;
    annotationPrefix: string;
}

function getAnnotations (path: BabelCoreNamespace.NodePath<any>, prefix: string) {
    const parentPath = path.findParent((path) => path.parent.leadingComments.length > 0);
    const annotations = parentPath.parent.leadingComments.map((comment) => {
        if (comment.type === 'CommentBlock') {
            const lines = comment.value
                .split('\n')
                .map((line) => line.trimStart().replace(/^\*/g, ''))
                .filter((v) => !!v);
            const valid = lines[0].trimStart().startsWith(`${prefix}: `);
            lines[0] = lines[0].trimStart().replace(`${prefix}: `, '');

            return valid ? lines.join(' ') : null;
        }

        const valid = comment.value.trimStart().startsWith(`${prefix}: `);

        return valid ? comment.value.trimStart().replace(`${prefix}: `, '') : null;
    });

    return annotations.filter((v) => !!v).map((c) => c.replace(/\s+/g, ' ').trim());
}

export default function Gettextractor (opts: GettextractorOptions) {
    return (): PluginObj => {
        return {
            name: 'gettexter',
            visitor: {
                CallExpression: function (path: BabelCoreNamespace.NodePath<any>, state) {
                    if (path.node.callee.name !== '__') return;
                    if (path.node.arguments[0].type !== 'StringLiteral') return;

                    const argument = path.node.arguments[0];
                    const cwd = `${state.cwd}/`;
                    const file = state.file.opts.filename.replace(cwd, '');
                    const comments = getAnnotations(path, opts.annotationPrefix);

                    opts.mapper({
                        id: argument.value,
                        value: argument.value,
                        file,
                        line: argument.loc.start.line,
                        column: argument.loc.start.column,
                        comments
                    });
                }
            }
        };
    };
}

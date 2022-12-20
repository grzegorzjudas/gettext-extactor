import { PluginObj } from '@babel/core';
import type * as BabelCoreNamespace from '@babel/core';

import { Translation } from './types';

type ResultMapper = (result: Translation) => void;

export default function Gettextractor (mapper: ResultMapper) {
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

                    mapper({
                        id: argument.value,
                        value: argument.value,
                        file,
                        line: argument.loc.start.line,
                        column: argument.loc.start.column
                    });
                }
            }
        };
    };
}

import { PluginObj } from '@babel/core';
import type * as BabelCoreNamespace from '@babel/core';

import { Translation } from './types';

type ResultMapper = (result: Translation) => void;

export default function Gettextractor (mapper: ResultMapper) {
    return (): PluginObj => {
        return {
            name: 'gettexter',
            visitor: {
                TaggedTemplateExpression: function (path: BabelCoreNamespace.NodePath<any>, state) {
                    if (path.node.tag.name !== '__') return;

                    const quasi = path.node.quasi.quasis[0];
                    const cwd = `${state.cwd}/`;
                    const file = state.file.opts.filename.replace(cwd, '');

                    mapper({
                        id: quasi.value.raw,
                        value: quasi.value.raw,
                        file,
                        line: quasi.loc.start.line,
                        column: quasi.loc.start.column
                    });
                }
            }
        };
    };
}

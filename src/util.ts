import { join } from 'path';
import { existsSync } from 'fs';
import { readdir, lstat } from 'fs/promises';
import { loadPartialConfig, transformFileAsync } from '@babel/core';
import { po, GetTextTranslations, GetTextComment } from 'gettext-parser';

import { Translation } from './types';

import Gettextrator from './plugin';

export async function traverseDir (dir: string, filters: string[]): Promise<string[]> {
    const exists = existsSync(dir);
    let files: string[] = [];

    if (!exists) {
        throw new Error(`Directory ${dir} does not exist.`);
    }

    const contents = await readdir(dir);

    for (let i = 0; i < contents.length; ++i) {
        const name = join(dir, contents[i]);
        const stat = await lstat(name);

        if (stat.isDirectory()) {
            files = files.concat(await traverseDir(name, filters));
        } else if (filters.some((f) => name.endsWith(f))) {
            files.push(name);
        }
    }

    return files;
}

export function generateGettext (translations: Translation[], headers: Record<string, string> = {}): GetTextTranslations {
    return {
        charset: 'utf-8',
        headers,
        translations: translations.map((translation) => ({
            [translation.value]: {
                msgid: {
                    msgid: translation.id,
                    msgstr: [ translation.value ],
                    msgid_plural: [ translation.context.plural ],
                    comments: {
                        reference: `${translation.file}:${translation.line}:${translation.column}`,
                        translator: translation.comments.join('; ')
                    } as GetTextComment
                }
            }
        })).reduce((all, current) => ({ ...all, ...current }), {})
    };
}

export function prepareBabelConfig (callback: (result: Translation) => void, annotationPrefix: string) {
    const config = loadPartialConfig();
    const plugin = Gettextrator({
        mapper: callback,
        annotationPrefix
    });

    config.options.plugins = [ plugin, ...(config.options.plugins || []) ];

    return config;
}

export async function extractTranslationsFromFiles (files: string[], annotationPrefix: string) {
    const data: Translation[] = [];
    const config = prepareBabelConfig((result) => {
        data.push(result);
    }, annotationPrefix);

    await Promise.all(files.map((f) => {
        return transformFileAsync(f, config.options);
    }));

    return data;
}

export function generatePoFromTranslations (translations: Translation[]) {
    return po.compile(generateGettext(translations));
}

import { compile, PathFunction } from 'path-to-regexp';
import { stringify } from 'query-string';

interface GeneratorCache {
    [pattern: string]: PathFunction;
}

const generatorCache: GeneratorCache = {};

const getGenerator = (pattern: string): PathFunction => {
    const generator = generatorCache[pattern];
    if (generator) {
        return generator;
    }

    const compiledGenerator = compile(pattern);
    generatorCache[pattern] = compiledGenerator;

    return compiledGenerator;
};

/**
 * Generates a URL from a pattern and parameters.
 * For example,
 *     generateUrl('/departments/:id', { id: 'electronics' })
 *     => '/departments/electronics'
 */
export const generateUrl = (pattern = '/', params = {}, queryParams = {}) => {
    // inject params
    const generator = getGenerator(pattern);
    let url = generator(params);

    // inject queryParams (remember to insert the question mark)
    if (Object.keys(queryParams).length > 0) {
        url = `${url}?${stringify(queryParams)}`;
    }

    return url;
};

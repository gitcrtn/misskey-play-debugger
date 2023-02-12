import { size } from 'lodash';

export const checkCaller = (callers, node) => {
    if (node.type == 'call') {
        callers.push({
            name: node.target.name,
            argsCount: size(node.args),
            loc: node.loc,
        })
        return true;
    }
    return false;
};

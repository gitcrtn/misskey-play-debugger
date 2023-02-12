import { each, size } from 'lodash';
import { checkCaller } from "./caller";

export const checkFunction = (callers, functions, node) => {
    if (node.type == 'def' && node.expr.type == 'fn') {
        functions[node.name] = {
            argsCount: size(node.expr.args),
        };
        each(node.expr.children, (child) => {
            checkCaller(callers, child);
        });
        return true;
    }
    return false;
};

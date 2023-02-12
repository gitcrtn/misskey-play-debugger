const regLf = /\r\n|\r|\n/;

export const getLocation = (code, loc) => {
    const allLineCount = code.split(regLf).length;
    const lines = code.slice(loc.start).split(regLf);
    const lineNumber = allLineCount - lines.length + 1;
    return `L${lineNumber}`;
};

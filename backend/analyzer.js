/**
 * Analyzes source code and calculates metrics.
 * Supports basic analysis for JS/TS and Python files based on extensions.
 */
function analyzeCode(code, fileName) {
    const lines = code.split(/\r?\n/);
    
    let totalLines = lines.length;
    let blankLines = 0;
    let comments = 0;
    let functions = 0;
    let complexityScore = 0;

    const isJS = fileName.endsWith('.js') || fileName.endsWith('.ts');
    const isPython = fileName.endsWith('.py');

    // Basic regex patterns
    const jsFuncRegex = /^\s*(function\s+\w+|const\s+\w+\s*=\s*(function|\([^)]*\)\s*=>)|let\s+\w+\s*=\s*(function|\([^)]*\)\s*=>)|class\s+\w+|\w+\s*\([^)]*\)\s*\{)/;
    const pyFuncRegex = /^\s*(def\s+\w+|class\s+\w+)/;
    
    // Comments
    const jsCommentRegex = /^\s*(\/\/|\/\*|\*)/;
    const pyCommentRegex = /^\s*#/;

    // Complexity indicators (basic keywords)
    const complexityKeywords = ['if', 'for', 'while', 'switch', 'catch', 'elif', 'except'];

    let inBlockComment = false;

    lines.forEach(line => {
        const trimmed = line.trim();

        // Count blank lines
        if (trimmed.length === 0) {
            blankLines++;
            return;
        }

        // Count JS Block comments /* ... */
        if (isJS) {
            if (trimmed.startsWith('/*')) inBlockComment = true;
            if (inBlockComment) {
                comments++;
                if (trimmed.endsWith('*/') || trimmed.includes('*/')) inBlockComment = false;
                return;
            }
        }

        // Count line comments
        if (isJS && jsCommentRegex.test(trimmed)) {
            comments++;
            return;
        } else if (isPython && pyCommentRegex.test(trimmed)) {
            comments++;
            return;
        }

        // Count functions/classes
        if (isJS && jsFuncRegex.test(trimmed)) {
            functions++;
            complexityScore++; // Functions add to complexity
        } else if (isPython && pyFuncRegex.test(trimmed)) {
            functions++;
            complexityScore++;
        }

        // Calculate simple complexity score based on control structures
        complexityKeywords.forEach(keyword => {
            // Check if keyword exists as a whole word
            const regex = new RegExp(`\\b${keyword}\\b`);
            if (regex.test(trimmed)) {
                complexityScore++;
            }
        });
    });

    // Normalize complexity score to a 1-100 scale (rough estimation for UI purposes)
    const normalizedComplexity = Math.min(100, Math.max(1, Math.round((complexityScore / Math.max(1, totalLines - blankLines - comments)) * 100 * 2)));

    // Prevent edge cases like all blank lines
    if (totalLines === blankLines) {
        return {
            lines: totalLines,
            functions: 0,
            comments: 0,
            blankLines: blankLines,
            complexityScore: 0
        };
    }

    return {
        lines: totalLines,
        functions: functions,
        comments: comments,
        blankLines: blankLines,
        complexityScore: normalizedComplexity
    };
}

module.exports = { analyzeCode };

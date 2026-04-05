/**
 * TypeScript to JavaScript converter using Babel AST.
 * Usage: node convert.mjs <input.ts|tsx> <output.js|jsx>
 */

import { readFileSync, writeFileSync } from 'fs';
import { parse } from '@babel/parser';
import _generate from '@babel/generator';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';

// CommonJS interop
const generate = _generate.default || _generate;
const traverse = _traverse.default || _traverse;

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const code = readFileSync(inputFile, 'utf8');
const isJSX = inputFile.endsWith('.tsx');

let ast;
try {
    ast = parse(code, {
        sourceType: 'module',
        plugins: [
            'typescript',
            ...(isJSX ? ['jsx'] : []),
        ],
        errorRecovery: true,
    });
} catch (err) {
    console.error(`Parse error in ${inputFile}:`, err.message);
    process.exit(1);
}

traverse(ast, {
    // Remove type-only imports (import type ...)
    ImportDeclaration(path) {
        if (path.node.importKind === 'type') {
            path.remove();
            return;
        }
        // Remove type specifiers from mixed imports
        path.node.specifiers = path.node.specifiers.filter(
            spec => spec.importKind !== 'type'
        );
        if (path.node.specifiers.length === 0) {
            path.remove();
        }
    },

    // Remove export type
    ExportNamedDeclaration(path) {
        if (path.node.exportKind === 'type') {
            path.remove();
        }
    },

    // Remove TypeScript Interface declarations
    TSInterfaceDeclaration(path) {
        path.remove();
    },

    // Remove TypeScript Type aliases
    TSTypeAliasDeclaration(path) {
        path.remove();
    },

    // Remove TypeScript enum declarations  
    TSEnumDeclaration(path) {
        path.remove();
    },

    // Remove TypeScript module declarations
    TSModuleDeclaration(path) {
        path.remove();
    },

    // Remove type assertions (as keyword) - TSAsExpression
    TSAsExpression(path) {
        path.replaceWith(path.node.expression);
    },

    // Remove type assertions (<Type>expr) - TSTypeAssertion
    TSTypeAssertion(path) {
        path.replaceWith(path.node.expression);
    },

    // Remove non-null assertions (expr!)
    TSNonNullExpression(path) {
        path.replaceWith(path.node.expression);
    },

    // Remove "satisfies" operator
    TSSatisfiesExpression(path) {
        path.replaceWith(path.node.expression);
    },

    // Remove type parameters from function/class declarations
    Function(path) {
        if (path.node.typeParameters) {
            path.node.typeParameters = null;
        }
        if (path.node.returnType) {
            path.node.returnType = null;
        }
        // Remove type annotations from parameters
        if (path.node.params) {
            path.node.params.forEach(param => {
                if (param.typeAnnotation) param.typeAnnotation = null;
                // Handle assignment patterns (default values)
                if (param.type === 'AssignmentPattern' && param.left && param.left.typeAnnotation) {
                    param.left.typeAnnotation = null;
                }
                // Handle rest elements
                if (param.type === 'RestElement' && param.typeAnnotation) {
                    param.typeAnnotation = null;
                }
                // Handle object patterns
                if (param.type === 'ObjectPattern' && param.typeAnnotation) {
                    param.typeAnnotation = null;
                }
                // Handle array patterns
                if (param.type === 'ArrayPattern' && param.typeAnnotation) {
                    param.typeAnnotation = null;
                }
            });
        }
    },

    // Remove type annotations from variable declarations
    VariableDeclarator(path) {
        if (path.node.id && path.node.id.typeAnnotation) {
            path.node.id.typeAnnotation = null;
        }
    },

    // Remove type annotations from class properties
    ClassProperty(path) {
        if (path.node.typeAnnotation) {
            path.node.typeAnnotation = null;
        }
    },

    // Remove type annotations from class methods
    ClassMethod(path) {
        if (path.node.returnType) {
            path.node.returnType = null;
        }
        if (path.node.typeParameters) {
            path.node.typeParameters = null;
        }
    },

    // Remove type parameters from class declarations
    ClassDeclaration(path) {
        if (path.node.typeParameters) {
            path.node.typeParameters = null;
        }
        if (path.node.superTypeParameters) {
            path.node.superTypeParameters = null;
        }
        if (path.node.implements) {
            path.node.implements = null;
        }
    },

    // Remove type parameters from call expressions (e.g. useState<boolean>())
    CallExpression(path) {
        if (path.node.typeParameters) {
            path.node.typeParameters = null;
        }
    },

    // Remove type parameters from new expressions
    NewExpression(path) {
        if (path.node.typeParameters) {
            path.node.typeParameters = null;
        }
    },

    // Handle object destructuring with type annotations
    ObjectPattern(path) {
        if (path.node.typeAnnotation) {
            path.node.typeAnnotation = null;
        }
        path.node.properties.forEach(prop => {
            if (prop.value && prop.value.typeAnnotation) {
                prop.value.typeAnnotation = null;
            }
        });
    },

    // Remove type annotations from array destructuring
    ArrayPattern(path) {
        if (path.node.typeAnnotation) {
            path.node.typeAnnotation = null;
        }
    },

    // Remove declare statements
    TSDeclareFunction(path) {
        path.remove();
    },
});

const output = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
}, code);

writeFileSync(outputFile, output.code, 'utf8');
console.log(`✓ ${inputFile} → ${outputFile}`);

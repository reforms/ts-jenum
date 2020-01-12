module.exports = {
    "roots": [
        "./src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "globals": {
        "ts-jest": {
            "tsConfig": "tsconfig.test.json",
            "diagnostics": {
                "ignoreCodes": [151001]
            }
        }
    },
    "moduleDirectories": ['node_modules', 'src']
}
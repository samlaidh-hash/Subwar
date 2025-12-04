export default [
    {
        files: ['js/three.min.js'],
        rules: {
            'no-unused-vars': 'off',
            'no-undef': 'off'
        }
    },
    {
        files: ['js/**/*.js'],
        ignores: ['js/three.min.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                THREE: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                localStorage: 'readonly',
                TORPEDO_TYPES: 'readonly',
                Torpedo: 'readonly',
                WeaponsSystem: 'readonly',
                module: 'readonly',
                fetch: 'readonly',
                Response: 'readonly',
                Request: 'readonly',
                Headers: 'readonly',
                performance: 'readonly',
                navigator: 'readonly',
                createImageBitmap: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            'no-multiple-empty-lines': ['error', { 'max': 2 }]
        }
    },
    {
        files: ['test_combined_reticle.js', 'test_scenarios.js', 'demo_oolite_integration.js', 'test_simple_browser.js', 'test_reticle_visual.js', 'debug_fullscreen_map.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                THREE: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                localStorage: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            'no-multiple-empty-lines': ['error', { 'max': 2 }]
        }
    },
    {
        files: ['test_*.js', 'convert_*.js', 'download_*.js', 'oolite_dat_parser.js', 'capture_*.js', 'debug_*.js', 'screenshot_*.js', 'quick_test.js'],
        ignores: ['test_combined_reticle.js', 'test_scenarios.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                window: 'readonly',
                document: 'readonly',
                THREE: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            'no-multiple-empty-lines': ['error', { 'max': 2 }]
        }
    }
];

// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    devServer: {
        proxy: {
            '/y-gateway': {
                target: 'http://localhost:5000',
                ws: true,
                changeOrigin: true
            }
        }
    }
}

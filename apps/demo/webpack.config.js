const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { NxReactWebpackPlugin } = require("@nx/react/webpack-plugin");
const { join } = require("path");

module.exports = (options) => ({
    output: {
        path: join(__dirname, "../../dist/apps/demo"),
    },
    devServer: {
        port: 4200,
    },
    plugins: [
        new NxAppWebpackPlugin({
            tsConfig: "./tsconfig.app.json",
            compiler: "babel",
            main: "./src/main.tsx",
            index: "./src/index.html",
            // serve locally, build for GitHub actions
            baseHref: options.WEBPACK_SERVE ? "/" : "/fix-webm-duration/",
            assets: ["./src/favicon.ico", "./src/assets"],
            styles: [],
            outputHashing: process.env["NODE_ENV"] === "production" ? "all" : "none",
            optimization: process.env["NODE_ENV"] === "production",
        }),
        new NxReactWebpackPlugin({
            // Uncomment this line if you don't want to use SVGR
            // See: https://react-svgr.com/
            // svgr: false
        }),
    ],
});

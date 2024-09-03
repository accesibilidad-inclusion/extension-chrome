// From: https://github.com/taturou/vue3-typescript-chrome-extension/blob/master/scripts/zip_dist.js
/*
    MIT License

    Copyright (c) 2021 taturou <taturou@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const packageJson = require("../package.json");

function create_zip_file() {
    const productName = packageJson.name;
    const srcDirName = path.join(__dirname, "../dist");
    const destDirName = path.join(__dirname, "../builds");
    const destFileName = `${packageJson.name}-${packageJson.version}.zip`;
    const destPath = path.join(destDirName, destFileName);

    // Check if `dist` folder exists
    if (fs.existsSync(srcDirName) === false) {
        console.error(`Error: '${srcDirName}' is not found.`);
        console.error("Please build the extension before zip it.");
        return;
    }

    // Check if `dist` folder is empty
    const files = fs.readdirSync(srcDirName);
    if (files.length === 0) {
        console.error(`Error: '${srcDirName}' is empty.`);
        console.error("Please build the extension before zip it.");
        return;
    }

    // Create destination directory `builds`
    if (fs.existsSync(destDirName) === false) {
        console.log(`Create directory: ${destDirName}\n`);
        fs.mkdirSync(destDirName);
    }

    // Zip
    console.log(`Zip ${srcDirName}`);
    console.log(` to ${destPath}\n`);
    console.log("Start...");

    const output = fs.createWriteStream(destPath);
    output.on("close", () => {
        console.log(archive.pointer() + " total bytes.");
        console.log("Done.\n");
    });

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.directory(srcDirName, productName);
    archive.pipe(output);
    archive.on("warning", (err) => {
        console.log(err);
    });
    archive.on("error", (err) => {
        console.log(err);
    });
    archive.finalize();
}

create_zip_file();


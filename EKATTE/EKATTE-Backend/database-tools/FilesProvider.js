const Logger = require('../debugging-tools/Logger');
const https = require('https');
const fs = require('fs');
const unzipper = require('unzipper');

class FilesProvider {
    static download(url, destinationPath, fileName) {
        return new Promise((resolve, reject) => {
            try {
                const file = fs.createWriteStream(destinationPath + fileName);

                https.get(url, (response) => {
                    response.pipe(file).on('finish', () => {
                        Logger.log("Success", "File downloaded successfully");

                        resolve({ res: "File downloaded successfully" });
                    });
                });
            } catch {
                Logger.log("Error", "Error occurred while trying to download file");

                reject({ err: "Error occurred while trying to download file" });
            }
        });
    }

    static decompress(_sorcePath, _fileName, _destinationPath) {
        return new Promise((resolve, reject) => {
            try {
                fs.createReadStream(_sorcePath + _fileName).pipe(unzipper.Extract({ path: _destinationPath })).on('finish', () => {
                    Logger.log("Success", "File decompressed successfully");

                    resolve({ res: "File decompressed successfully" });
                });
            } catch {
                Logger.log("Error", "Error occurred while trying to decompress file");

                reject({ err: "Error occurred while trying to decompress file" });
            }
        });
    }

    static prepareFiles() {
        const assetsPath = __dirname + "/../assets/";
        const zipNameOne = "Ekatte.zip";
        const zipNameTwo = "Ekatte_xlsx.zip";

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(assetsPath)) {
                    fs.mkdirSync(assetsPath);
                }

                if (fs.existsSync(assetsPath + 'Ek_obl.xlsx') && fs.existsSync(assetsPath + 'Ek_obst.xlsx') && fs.existsSync(assetsPath + 'Ek_atte.xlsx')) {
                    Logger.log("Success", "All required files are available");

                    resolve({ res: "All required files are available" });
                } else {
                    this.download("https://www.nsi.bg/sites/default/files/files/EKATTE/Ekatte.zip", assetsPath, zipNameOne).then(res => {
                        console.log(res);

                        this.decompress(assetsPath, zipNameOne, assetsPath).then((res) => {
                            console.log(res);

                            Logger.log("Success", "Files prepared successfully");

                            return this.decompress(assetsPath, zipNameTwo, assetsPath);
                        }).then(res => {
                            console.log(res);

                            Logger.log("Success", "Files prepared successfully");

                            resolve({ res: "Files prepared successfully" });
                        }).catch((err) => {
                            console.log(err);

                            Logger.log("Error", "Error occurred while trying to prepare files");

                            reject({ err: "Error occurred while trying to prepare files" });
                        });
                    });
                }
            } catch {
                Logger.log("Error", "Error occurred while trying to prepare files");

                reject({ err: "Error occurred while trying to prepare files" });
            }
        });
    }
}

module.exports = FilesProvider;
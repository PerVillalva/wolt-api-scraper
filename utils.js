import fs from 'fs';

export function writeDataToJSON(fileName, data) {
    fs.writeFile(`${fileName}.json`, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
}

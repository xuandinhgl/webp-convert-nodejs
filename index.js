const webp = require("webp-converter");
const fs = require("fs");

const extAllowed = ["jpg", "png", "jpeg"];

const source = "./sources/";
const desc = "./images/";
const getFileName = (file) => file.split(".").slice(0, -1).join(".");

const files = fs.readdirSync(source).reduce((acc, file) => {
  const [, ext] = file.split(".");
  if (extAllowed.includes(ext)) {
    acc.push({ src: source + file, dest: getFileName(desc + file) });
  }

  return acc;
}, []);

const filesWebp = fs.readdirSync(source).reduce((acc, file) => {
  const [, ext] = file.split(".");
  if (ext === "webp") {
    acc.push({ src: source + file, dest: getFileName(desc + file) });
  }

  return acc;
}, []);

console.log(filesWebp);

const convertImage = async () => {
  if (files.length) {
    const data = files.pop();
    await webp.cwebp(data.src, `${data.dest}.webp`, "-q 80", (logging = "-v"));
    console.log("Done: " + data.src);
    await convertImage();
  }
};
const convertImageWebp = async () => {
  if (filesWebp.length) {
    const data = filesWebp.pop();
    await webp.dwebp(data.src, `${data.dest}.jpg`, "-o", (logging = "-v"));
    console.log("Done: " + data.src);
    await convertImageWebp();
  }
};

(async () => {
  await convertImage();
  await convertImageWebp();
})();

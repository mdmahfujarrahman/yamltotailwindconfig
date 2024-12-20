"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const JSYamlConverter = {
    convertToJson: (yamlFile) => {
        return js_yaml_1.default.load(yamlFile);
    },
};
const tailwindYmalConfigFile = fs_1.default.readFileSync("tailwindConfig.yaml", "utf8");
const tailwindConfig = `module.exports = ${JSON.stringify(JSYamlConverter.convertToJson(tailwindYmalConfigFile), null, 2)};`;
fs_1.default.writeFileSync("tailwind.Config.js", tailwindConfig);

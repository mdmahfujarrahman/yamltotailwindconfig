import fs from "fs";
import yaml from "js-yaml";
import YAML from "yaml";

interface IYamlConverter {
    convertToJson: (yaml: string) => any;
}

const JSYamlConverter: IYamlConverter = {
    convertToJson: (yamlFile: string): any => {
        return yaml.load(yamlFile);
    },
};
const YAMLConverter: IYamlConverter = {
    convertToJson: (yamlFile: string): any => {
        return YAML.parse(yamlFile);
    },
};

const tailwindYmalConfigFile = fs.readFileSync("tailwindConfig.yaml", "utf8");

const tailwindConfig = `module.exports = ${JSON.stringify(
    YAMLConverter.convertToJson(tailwindYmalConfigFile),
    null,
    2
)};`;

fs.writeFileSync("tailwind.Config.js", tailwindConfig);

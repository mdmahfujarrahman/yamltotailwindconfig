import fs from "fs";
import yaml from "js-yaml";
import YAML from "yaml";
import { execSync } from "child_process";

//  Main Style interface

interface IStyleConfig {
    global: {
        darkMode: boolean;
    };
    layout: {
        container: {
            maxWidth: string;
            padding: string;
        };
        spacing: {
            small: string;
            medium: string;
            large: string;
            extraLarge: string;
            extraExtraLarge: string;
        };
    };
    typography: {
        links: {
            default: {
                color: string;
                textDecoration: string;
            };
            hover: {
                color: string;
            };
        };
    };
    colors: {
        border: string;
        input: string;
        ring: string;
        background: string;
        foreground: string;
        primary: IColorVariant;
        secondary: IColorVariant;
        destructive: IColorVariant;
        muted: IColorVariant;
        accent: IColorVariant;
        popover: IColorVariant;
        card: IColorVariant;
        blueShades: IColorShades;
        slateShades: IColorShades;
        greenShades: IColorShades;
    };
    borderRadius: {
        large: string;
        medium: string;
        small: string;
    };
    animations: {
        keyframes: {
            accordionOpen: IAnimationFrames;
            accordionClose: IAnimationFrames;
        };
        transitions: {
            accordionOpen: string;
            accordionClose: string;
        };
    };
    components: {
        button: IComponentStyles;
        card: IComponentStyles;
    };
}

interface IColorVariant {
    default: string;
    foreground: string;
}

interface IColorShades {
    lightest?: string;
    lighter?: string;
    light?: string;
    medium?: string;
    dark?: string;
    darker?: string;
    darkest?: string;
}

interface IAnimationFrames {
    from: {
        [property: string]: string;
    };
    to: {
        [property: string]: string;
    };
}

interface IComponentStyles {
    default: {
        [property: string]: string;
    };
    hover: {
        [property: string]: string;
    };
}



//  Adaptors for convert YAML to Object

interface IYamlConverter<T> {
    yamlToJSObject: (yaml: string) => T;
}

const JSYamlConverter: IYamlConverter<IStyleConfig> = {
    yamlToJSObject: (yamlFile: string): IStyleConfig => {
        return yaml.load(yamlFile) as IStyleConfig;
    },
};

const YAMLConverter: IYamlConverter<IStyleConfig> = {
    yamlToJSObject: (yamlFile: string): IStyleConfig => {
        return YAML.parse(yamlFile) as IStyleConfig;
    },
};


// Convert style interface global

interface IStyleConfigConverter<T, K> {
    configConverter: (response: T) => K
}



// Specific Framework or design style interface

interface ITailwindConfig {
    darkMode?: string[] | boolean;
    content?: string[];
    theme: {
        container?: {};
        extend?: {};
    };
    prefix?: string;
    plugins?: string[]
}

interface IMuiTheme {
    palette: {
        primary: object,
        secondary: object,
        background: object,
        error: object,
        text: object
    },
    typography: object,
    shape: object,
    components: object
}


// Helper for check is tailwind plugins already install or not

function checkAndInstallModule(moduleName: string) {
    try {
        require.resolve(moduleName);
    } catch (err) {
        console.log(`Module "${moduleName}" not found. Installing...`);
        execSync(`npm install ${moduleName}`, { stdio: "inherit" });
        console.log(`Module "${moduleName}" installed successfully.`);
    }
}


checkAndInstallModule("tailwindcss-animate");



//  Adaptors



// Tailwind
const TailwindConfigConverter: IStyleConfigConverter<IStyleConfig, ITailwindConfig> = {
    configConverter: (response: IStyleConfig): ITailwindConfig => {
        const formattedResponse: ITailwindConfig = {
            darkMode: response.global.darkMode ? ["class"] : false,
            content: ["./pages/**/*.{ts,tsx}",
                "./components/**/*.{ts,tsx}",
                "./app/**/*.{ts,tsx}",
                "./src/**/*.{ts,tsx}"],
            theme: {
                container: {
                    center: true,
                    padding: response.layout.container.padding,
                    screens: {
                        "2xl": response.layout.container.maxWidth,
                    },
                },
                extend: {
                    spacing: {
                        sm: response.layout.spacing.small,
                        md: response.layout.spacing.medium,
                        lg: response.layout.spacing.large,
                        xl: response.layout.spacing.extraLarge,
                        "2xl": response.layout.spacing.extraExtraLarge,
                    },
                    colors: {
                        ...response.colors,
                    },
                    borderRadius: {
                        lg: response.borderRadius.large,
                        md: response.borderRadius.medium,
                        sm: response.borderRadius.small,
                    },
                    keyframes: {
                        accordionOpen: {
                            from: { height: "0" },
                            to: { height: response.animations.keyframes.accordionOpen.to.height },
                        },
                        accordionClose: {
                            from: { height: response.animations.keyframes.accordionClose.from.height },
                            to: { height: "0" },
                        },
                    },
                    animation: {
                        accordionOpen: response.animations.transitions.accordionOpen,
                        accordionClose: response.animations.transitions.accordionClose,
                    },
                },
            },
            plugins: [require('tailwindcss-animate')],
        };
        return formattedResponse
    },
}


// Mui
const MuiThemeConverter: IStyleConfigConverter<IStyleConfig, IMuiTheme> = {
    configConverter: (response: IStyleConfig): IMuiTheme => {
        const formattedResponse: IMuiTheme = {
            palette: {
                primary: {
                    main: response.colors.primary.default,
                    contrastText: response.colors.primary.foreground,
                },
                secondary: {
                    main: response.colors.secondary.default,
                    contrastText: response.colors.secondary.foreground,
                },
                error: {
                    main: response.colors.destructive.default,
                    contrastText: response.colors.destructive.foreground,
                },
                background: {
                    default: response.colors.background,
                    paper: response.colors.card.default,
                },
                text: {
                    primary: response.colors.foreground,
                    secondary: response.colors.muted.default,
                },
            },
            typography: {
                link: {
                    color: response.typography.links.default.color,
                    textDecoration: response.typography.links.default.textDecoration,
                    "&:hover": {
                        color: response.typography.links.hover.color,
                    },
                },
            },
            shape: {
                borderRadius: parseInt(response.borderRadius.large.replace("px", "")),
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            backgroundColor: response.components.button.default.backgroundColor,
                            color: response.components.button.default.color,
                            padding: response.components.button.default.padding,
                            borderRadius: response.components.button.default.borderRadius,
                            fontSize: response.components.button.default.fontSize,
                            "&:hover": {
                                backgroundColor: response.components.button.hover.backgroundColor,
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: response.components.card.default.backgroundColor,
                            padding: response.components.card.default.padding,
                            borderRadius: response.components.card.default.borderRadius,
                            boxShadow: response.components.card.default.shadow,
                            "&:hover": {
                                boxShadow: response.components.card.hover.shadow,
                            },
                        },
                    },
                },
            },
        };
        return formattedResponse
    },
};


// Read Yaml file
const globalStyleYAML = fs.readFileSync("global.yaml", "utf8");



// Convert yaml to js object
const formattedYAMLFile = YAMLConverter.yamlToJSObject(globalStyleYAML)
const formattedJSYamlFile = JSYamlConverter.yamlToJSObject(globalStyleYAML)



// create  file  structure before write file


// javascript tailwind config
const javascriptTailwindConfig = `
module.exports = ${JSON.stringify(
    TailwindConfigConverter.configConverter(formattedJSYamlFile),
    null,
    2
)}  `;


// typescript tailwind config
const typescriptTailwindConfig = `
import type { Config } from 'tailwindcss';

const config = ${JSON.stringify(
    TailwindConfigConverter.configConverter(formattedYAMLFile),
    null,
    2
)} satisfies Config;

export default config;
`;

// mui config 
const muiConfig = `
import { createTheme } from "@mui/material/styles";

const theme = createTheme(${JSON.stringify(MuiThemeConverter.configConverter(formattedJSYamlFile), null, 2)})

export default theme;

`

// write tailwind config file
fs.writeFileSync("tailwind.Config.js", javascriptTailwindConfig);
fs.writeFileSync("tailwind.Config.ts", typescriptTailwindConfig);



// write mui config file
fs.writeFileSync("theme.js", muiConfig);
fs.writeFileSync("theme.ts", muiConfig);
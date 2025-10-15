export default {
    transform: { "^.+\\.(t|j)sx?$": ["ts-jest", { useESM: true }] },
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    moduleFileExtensions: ["ts", "js"],
};
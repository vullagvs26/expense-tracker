module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")], // ← add this
  theme: { extend: {} },
  plugins: [],
};

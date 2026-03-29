# linux
bun build --compile --bytecode --minify --outfile ./dist/ap-linux-x64 --target bun-linux-x64-modern ./src/cli.ts
bun build --compile --bytecode --minify --outfile ./dist/ap-linux-arm64 --target bun-linux-arm64 ./src/cli.ts

# macos
bun build --compile --bytecode --minify --outfile ./dist/ap-mac-mchip --target bun-darwin-arm64 ./src/cli.ts
bun build --compile --bytecode --minify --outfile ./dist/ap-mac-intel --target bun-darwin-x64 ./src/cli.ts
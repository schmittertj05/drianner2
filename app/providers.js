// app/providers.tsx
"use client";
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = Providers;
var jsx_runtime_1 = require("react/jsx-runtime");
var wagmi_1 = require("wagmi");
var chains_1 = require("wagmi/chains");
var react_query_1 = require("@tanstack/react-query");
var config = (0, wagmi_1.createConfig)({
    chains: [chains_1.mainnet, chains_1.sepolia],
    transports: (_a = {},
        _a[chains_1.mainnet.id] = (0, wagmi_1.http)(),
        _a[chains_1.sepolia.id] = (0, wagmi_1.http)(),
        _a),
});
var queryClient = new react_query_1.QueryClient();
function Providers(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(wagmi_1.WagmiProvider, { config: config, children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }) }));
}

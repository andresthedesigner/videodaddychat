import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["convex/_generated/**"],
  },
  {
    // Icon system enforcement: Use Phosphor or @/lib/icons instead of lucide-react
    // See docs/icon-system-migration-plan.md for details
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/icons/extras.ts", "docs/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              message:
                "Use @phosphor-icons/react or @/lib/icons instead. See docs/icon-system-migration-plan.md",
            },
          ],
          patterns: [
            {
              group: ["lucide-react/*"],
              message:
                "Use @phosphor-icons/react or @/lib/icons instead. See docs/icon-system-migration-plan.md",
            },
          ],
        },
      ],
    },
  },
]

export default eslintConfig

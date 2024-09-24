>  When the default new tab has already annoyed you

# Motivation

One day, I realized that the default new tab consumes resources even when it's not active. Ridiculous!

# Advantages

- Lightweight 🪶
- Supports light/dark mode 🌓
- Nice look 💅
- Suspends when is not active 🔋
- Blazing fast ⚡️
- No analytics and spyware 🕵️‍♂️

# Screenshots
## Light mode
![Light mode](https://github.com/user-attachments/assets/1686c070-5267-4c8d-8af7-628adca16eae)

## Dark mode
![Dark mode](https://github.com/user-attachments/assets/720058f1-2356-4c19-8f3a-33e5b76dba37)

# How to install the extension

You have two options:

1. Download and install the latest [nightly release](https://github.com/khmm12/minimal-chrome-tab/releases/download/nightly/minimal-chrome-tab.zip).
2. Build it yourself and install it. See [How to Build the Extension](#how-to-build-the-extension).

For more information on how to install an extension, refer to [Chrome's developer documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

# Development

To get started, follow these steps:

1. Install the dependencies:
```bash
pnpm i
```

2. Run the development server:
```bash
pnpm dev
```

# How to build the extension

To build the extension, use the following command:

```bash
pnpm build
```

After that, you can install the extension by loading the unpacked extension from the `dist` folder.

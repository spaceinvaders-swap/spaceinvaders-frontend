# 🥞 Offside UIkit

Offside UIkit is a set of React components and hooks used to build pages on Offside's apps. It also contains a theme file for dark and light mode.

## Install

`yarn add @offsideswap/uikit`

***Note**: In case you want to use the older version of the Offside UIkit, you should install @offsideswap-libs/uikit, instead, but we recommend using the latest version of the UIkit.*


## Setup

### Providers

Before using Offside UIkit, you need to provide the theme file to uikit provider.

```
import { UIKitProvider, light, dark } from '@offsideswap/uikit'
...
<UIKitProvider theme={isDark ? dark : light}>...</UIKitProvider>
```

### Reset

A reset CSS is available as a global styled component.

```
import '@offsideswap/ui/css/reset.css'
import { ResetCSS } from '@offsideswap/uikit'
...
<ResetCSS />
```

### Types

This project is built with Typescript and export all the relevant types.

## How to use the UIkit

If you want to use components from the UIkit, check the [Storybook documentation](https://uikit.offside.run)

# use-rhf-should-unregister

> shouldUnregister polyfill for React Hook Form v7

[![NPM](https://img.shields.io/npm/v/use-rhf-should-unregister.svg)](https://www.npmjs.com/package/use-rhf-should-unregister) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-rhf-should-unregister
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'use-rhf-should-unregister'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [iamacook](https://github.com/iamacook)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).

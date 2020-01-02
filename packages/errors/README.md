[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/logger`

[![npm version](https://img.shields.io/npm/v/@betterer/logger.svg)](https://www.npmjs.com/package/@betterer/logger)

Logger used within [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

### Code

```typescript
import { code } from '@betterer/logger';

code({
  filePath: './file.js',
  fileText: 'function add (a, b) {\n  return a + b;\n}',
  start: 24,
  end: 37
});
```

![Example output for code logger](/packages/logger/images/code.png?raw=true)

---

### Error

```typescript
import { error } from '@betterer/logger';

error('message');
```

![Example output for error logger](/packages/logger/images/error.png?raw=true)

---

### Info

```typescript
info('message');
```

![Example output for info logger](/packages/logger/images/info.png?raw=true)

---

### Success

```typescript
success('message');
```

![Example output for success logger](/packages/logger/images/success.png?raw=true)

---

### Warning

```typescript
warn('message');
```

![Example output for warn logger](/packages/logger/images/warn.png?raw=true)

---

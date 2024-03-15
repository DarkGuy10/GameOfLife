# Conway's Game of Life

Conway's Game of Life with modifications.

### 🚀 Installing the Deno runtime

You need to have the [Deno](https://deno.com/) runtime installed.

```
# Windows
irm https://deno.land/install.ps1 | iex

# Linux
curl -fsSL https://deno.land/install.sh | sh

# MacOS
curl -fsSL https://deno.land/install.sh | sh
```

### ⚙️ Execution

The default values for grid rows, columns and execution delay can be customized
through execution flags.

- `--rows` Number of rows in the cell grid (optional)
- `--cols` Number of columns in the cell grid (optional)
- `--delay` Time duration between two successive generations in milliseconds
  (optional)

```
# Examples
deno run main.ts --rows=20 --cols=25 --delay=100

deno run main.ts --delay=10
```

### 🔧 Building from source

You need to have the [Deno](https://deno.com/) runtime installed.

```
deno compile main.ts
```

### 📜 License

MIT.

Interestingly, this simulation always ends up with all alive cells.

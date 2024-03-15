# Conway's Game of Life

Conway's Game of Life with modifications.

### 📦 Precompiled binaries

I've already compiled the binaries for Windows, and you can simply run the
executable.

### 🚀 Using the Deno runtime

You need to have the [Deno](https://deno.com/) runtime installed.

```
# Windows
irm https://deno.land/install.ps1 | iex

# Linux
curl -fsSL https://deno.land/install.sh | sh

# MacOS
curl -fsSL https://deno.land/install.sh | sh
```

Now from the project directory run:

```
deno run main.ts
```

### 🔧 Building from source

You need to have the [Deno](https://deno.com/) runtime installed.

```
deno compile main.ts
```

### 📜 License

MIT.

Interestingly, this simulation always ends up with all alive cells.

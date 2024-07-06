# @fix-webm-duration/parser

Parse webm files into individual sections, edit the sections,
and compile the file from edited sections back together.

See the demo [here](https://yusitnikov.github.io/fix-webm-duration/).

**Warning: it's an internal implementation package, the interfaces here can change at any moment!**
**Please don't use it directly in production code, only for debugging contents of webm files while developing!**

## Installation

Install from a package manager:

```
npm install @fix-webm-duration/parser
```

## Usage

### Parse a blob:

```typescript
import { WebmFile } from "@fix-webm-duration/parser";

const file = await WebmFile.fromBlob(blob);
```

It will return an instance of `WebmFile`, which is a tree of sections with IDs.
`WebmFile` and `WebmContainer` are containers for other sections,
while all other classes of webm nodes (`WebmUint`, `WebmFloat`, `WebmString`) are the final leaves of the tree.
`WebmBase` is the base node class that is uses for nodes with unrecognized IDs
(the map of webm nodes in the library is not full, it's only a set of nodes required to fix webm duration).

### Traverse nodes:

The `data` field of a parsed `WebmContainer` (or `WebmFile`) object
contains a list of child nodes (which could be leaves or other sections).

Use the `getSectionById` method to get a direct child section by ID, e.g.

```typescript
const segmentSection: WebmContainer | null = file.getSectionById(0x8538067);
```

Section IDs could be found in the [sections.ts file](./src/lib/sections.ts).

### Modify nodes

Use the `setValue` method to modify the value of nodes, e.g.

```typescript
const durationSection = infoSection.getSectionById(0x489);
if (!durationSection) throw new Error("Duration section not found");
durationSection.setValue(60000);
```

Access regular array method for the `data` field to add or remove child nodes for a sections, e.g.

```typescript
const durationSection = new WebmFloat("Duration");
durationSection.setValue(duration);
infoSection.data!.push({
    id: 0x489,
    data: durationSection,
});
```

### Compile modified file back to blob

Call `updateByData` method of all modified `WebmContainer` and `WebmFile` objects in the reverse order,
i.e. starting from the most nested nodes, and ending with the `WebmFile` object.

Call the `toBlob` method of the file to convert the parsed file to blob.
Pass MIME type to it if it's not default, e.g. `file.toBlob("audio/webm")`.

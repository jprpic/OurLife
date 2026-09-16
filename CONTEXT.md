# OurLife Context

OurLife organizes everyday tasks and shopping into user-managed lists.

## To-Buy Shopping

**Shopping category**:
A user-selected context for grouping an item on the to-buy list. Categories describe where or how the user intends to shop; the app does not infer a category from an item's name or store.

**Global item entry**:
The canonical way to create a shopping item is the top input bar at the top of the to-buy screen. It accepts the item title and the chosen category at creation time. The app keeps that category assignment stable when the item is saved; a category drawer is a view of existing items, not a separate creation surface.

**Household**:
The shopping category for household goods, with examples including Jysk, Ikea, and Tedi. It is distinct from Hardware, which covers home improvement and DIY supplies.

## To-Do Tasks

**Todo item**:
A single actionable task that can be active or completed. Its identity is the item itself, not the row or the form that edits it.

**Favorite**:
A user-selected status that marks a todo as personally important. The UI may present it as a star, but the canonical domain term is favorite. It is set or cleared from the overview list or the detail view, never during creation.

**Active todo sorting**:
Active todos are ordered with favorites first, regardless of the creation timestamp. Among favorites, newer items appear before older items; among non-favorites, the same creation-time ordering applies.

**Done todo behavior**:
A completed todo remains editable in full, including its title and note, and it can be reopened. A favorite is preserved while a task is merely complete and still active in the recent-completion window; it is only cleared when the item is reopened from the done bucket, which means the item had already crossed into the done archive semantics. When done items are shown in the archive, the star is hidden and the item behaves as a completed history entry rather than an active favorite.

**Todo note**:
Optional freeform text attached to a todo item to capture context, reminders, or details that are not part of the item title.

**Todo detail view**:
A dedicated place to inspect and edit a todo item. Opening the detail view is separate from the completion action; the completion radio remains the direct way to mark a task done.

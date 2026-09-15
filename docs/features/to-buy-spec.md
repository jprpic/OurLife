OurLife PWA Specification (Phase 2: To-Buy)
1. Feature Overview
Phase 2 introduces the To-Buy shopping system to the OurLife PWA. The feature provides store/type-categorized accordion drawers, dual quick-add workflows, persistent in-cart item checking for friction-free in-store shopping, and a floating global bulk-clear action to clean up checked items upon checkout.

2. Predefined Categories (Drawers)
The app maintains six predefined shopping categories:

Groceries (Supermarket)

Hygiene (DM / Müller)

Hardware (Home improvement / DIY)

Household (Jysk / Ikea / Tedi)

Car (Auto supplies)

Online (E-commerce / Deliveries)

Category selection is always made by the user. The app does not automatically classify an item based on its title or the shop where it is purchased.

3. Data Requirements
Shopping Item Structure
id: Unique string identifier.

title: Name of the item to buy.

 categoryId: Identifier linking the item to one of the 6 predefined categories.

checked: Boolean representing whether the item is currently in the shopping cart.

createdAt: ISO timestamp recording when the item was added.

4. User Interface & Accordion Drawer Rules
Dynamic Drawer Visibility
A drawer is hidden completely if it contains zero items.

As soon as an item is assigned to a category, its drawer becomes visible.

Accordion Mechanics
Tapping a category header expands or collapses its nested items.

Each category header displays a count badge of remaining unchecked items (e.g., Groceries (3)).

5. Item Creation Workflows
1. Global Add Item Bar (Always Visible at Top of Tab)
A text input with a companion category dropdown picker (defaulting to Groceries).

Allows adding an item to any category from the top of the screen.

2. Contextual Quick-Add (In-Drawer Button)
An "+ Add" button positioned directly inside each expanded drawer header.

Tapping this button opens/focuses an inline input tailored to that specific list.

The category picker is hidden in this context because the category is automatically inherited from the drawer.

6. In-Store Shopping & Persistence Rules
In-Cart Checkbox Logic
Items inside drawers feature standard checkboxes.

Checking an item strikes it through and visually mutes it (line-through text-slate-500).

Session Persistence: Checked states are saved immediately to local storage (idb-keyval). The user can check an item, lock their phone, move to another store aisle, and reopen the app with all checked items intact.

Bulk Clear ("Save / Finish Shopping")
A floating action button (e.g., "Clear Checked Items") is fixed to the bottom-right or sticky bottom bar of the screen.

The button remains accessible while scrolling through long lists.

Tapping this button permanently deletes all currently checked (checked: true) items across all lists. Unchecked items remain untouched.

If a category drawer becomes empty after clearing, the drawer automatically hides itself.

7. Storage & Offline Requirements
All list updates, item additions, check toggles, and bulk deletions sync immediately to IndexedDB via idb-keyval.

Zero network dependency; full offline functionality while inside stores.
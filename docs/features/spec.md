SPEC_OURLIFE.md — OurLife PWA Specification (Phase 1)
1. Overview & Core Vision
OurLife is a local-first, mobile-optimized Progressive Web Application (PWA) designed for shared household productivity. Phase 1 focuses entirely on delivering a lightweight, ad-free To-Do management system inspired by Microsoft To-Do's staged task completion workflow. The app features a clean tabbed layout that acts as a shell for both the To-Do features and the upcoming To-Buy shopping drawers.

2. Technical Stack & Architecture Constraints
Framework: Angular 18+ using Standalone Components and Signals for state management.

Styling: Tailwind CSS (all utility styling written inline in HTML templates; component CSS files must remain under 1 kB).

Storage: idb-keyval for offline-first, local-only IndexedDB persistence.

PWA Capabilities: Configured with Angular Service Worker and Web App Manifest for mobile installation.

Deployment: Hosted as a static web app (Vercel, Netlify, or GitHub Pages).

3. Data Requirements
To-Do Item Structure
id: Unique string identifier.

title: Text content of the task.

createdAt: ISO timestamp recording when the task was added.

completedAt: ISO timestamp recording when the task was marked completed (or null if active).

4. User Interface & Layout Requirements
Top Bar & Tab Shell
Fixed top header featuring the app title "OurLife" and a tab switcher.

Tab 1 — To-Do: Active view for managing current and completed tasks.

Tab 2 — To-Buy (Placeholder): Renders a styled placeholder screen announcing the store-drawer shopping feature coming in Phase 2.

5. To-Do Feature Requirements
1. Quick-Add Input
Single text input bar placed at the top of the To-Do view.

Submitting via the Enter key or button creates a new task with a createdAt timestamp and a null completion date.

2. Radio Button Task Toggle
Tasks must use a circular radio button / custom rounded toggle rather than standard square checkboxes.

Tapping the radio button toggles completion:

If uncompleted: assigns the current ISO timestamp to completedAt.

If completed: resets completedAt to null.

3. Staged Completion Workflow (Microsoft To-Do Pattern)
Active List Display: Shows all uncompleted tasks AND tasks completed within the last 24 hours.

Visual Staging: Completed items remaining in the active list are styled with a strikethrough (line-through) and muted grey text (text-slate-500).

Auto-Transfer Rule: Any task with a completedAt timestamp older than 24 hours automatically moves out of the active list and into the Done Archive.

4. Done Archive (Paginated)
Located at the bottom of the screen under a "Done" section header.

Displays tasks completed over 24 hours ago, sorted descending by completedAt (newest completed first).

Pagination: Renders the first 10 items initially with a [ Load More ] button at the bottom that increases the list size by 10 items per click. No filters required.

6. Persistence & Offline Requirements
All task creations, completion toggles, and state changes must automatically sync to local IndexedDB storage.

App must load instantly and operate without internet connectivity.
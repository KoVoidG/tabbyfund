# Requirements Document

## Introduction

Frontend polish fixes for the TabbyFund Next.js application addressing two areas: replacing the mobile bottom navigation with a full-featured drawer menu, and replacing emoji icons on the Foster page with lucide-react icons for visual consistency.

## Glossary

- **Mobile_Drawer**: A Sheet/Drawer component that slides in from the side of the screen to display navigation links on mobile viewports (below the `md` Tailwind breakpoint)
- **Topbar**: The sticky header bar displayed at the top of the authenticated app layout
- **Sidebar**: The fixed left-side navigation panel visible only on desktop viewports (md+ breakpoint)
- **Foster_Page**: The `/foster` route page displaying fostered cat assignments, behavioural profiles, and adoption readiness
- **Active_Route**: The currently matched URL path, visually highlighted in navigation components
- **Bottom_Nav**: The existing fixed bottom navigation bar for mobile (to be removed)

## Requirements

### Requirement 1

**User Story:** As a mobile user, I want a hamburger menu that opens a navigation drawer, so that I can access all app routes without a crowded bottom bar.

#### Acceptance Criteria

1. WHEN a user taps the hamburger menu button in the Topbar on a mobile viewport, THE Mobile_Drawer SHALL open and display all navigation links
2. WHEN the Mobile_Drawer is open, THE Mobile_Drawer SHALL display the same community routes as the Sidebar: Dashboard, Report, Rescue Feed, Donate, Adopt, and Foster
3. WHILE a user has the role "vet" and is verified, THE Mobile_Drawer SHALL display the Vet Dashboard link
4. WHILE a user has the role "admin", THE Mobile_Drawer SHALL display the Admin link
5. WHEN a user taps a navigation link in the Mobile_Drawer, THE Mobile_Drawer SHALL navigate to the selected route and close the drawer
6. WHEN the Mobile_Drawer is open, THE Mobile_Drawer SHALL highlight the Active_Route with distinct visual styling matching the Sidebar active state
7. THE hamburger menu button SHALL be visible only on mobile viewports (below md breakpoint)
8. THE Sidebar SHALL remain unchanged and visible only on desktop viewports (md+ breakpoint)
9. WHEN the Mobile_Drawer replaces the Bottom_Nav, THE Bottom_Nav component SHALL be removed from the layout

### Requirement 2

**User Story:** As a user viewing the Foster page, I want consistent lucide-react icons instead of emoji characters, so that the page feels cohesive with the rest of the app.

#### Acceptance Criteria

1. WHEN the Foster_Page tab buttons are rendered, THE Foster_Page SHALL display lucide-react icons instead of emoji characters for each tab label
2. THE Foster_Page SHALL use the PawPrint icon for the "Assigned to Me" tab
3. THE Foster_Page SHALL use the ClipboardList icon for the "Behaviour Profiles" tab
4. THE Foster_Page SHALL use the Heart icon for the "Ready for Adoption" tab
5. WHEN the Foster_Page is rendered, THE Foster_Page SHALL contain zero emoji characters in its navigation elements

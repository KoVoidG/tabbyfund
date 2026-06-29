\# TABBYFUND MASTER PROMPT

\## Part 3 — Database Architecture, Data Model \& Business Rules



\# Philosophy



The database is the single source of truth.



Business logic should be enforced by database relationships, role-based authorization, and application validation.



Avoid duplicate data whenever possible.



Prefer normalized tables unless denormalization significantly improves performance or simplifies the MVP.



\---



\# Database



Supabase PostgreSQL



Requirements:



\- Row Level Security enabled

\- UUID primary keys

\- Foreign key constraints

\- Created and updated timestamps

\- Soft delete only when necessary

\- Typed Supabase client



\---



\# Core Entities



The application revolves around these core entities.



Profiles



Cases



Transport Requests



Vet Quotes



Donations



Treatment Records



Foster Records



Adoption Listings



Notifications (future)



Activity Logs (future)



\---



\# Relationship Overview



One User



↓



Can Report



Many Cases



\---



One Case



↓



Has One Reporter



↓



Can Have One Transport Request



↓



Can Have One Vet Quote



↓



Can Receive Many Donations



↓



Can Have One Treatment Record



↓



Can Have One Foster Record



↓



Can Have One Adoption Listing



\---



\# Profiles Table



Purpose:



Stores application-specific user information.



Supabase Auth handles authentication.



This table extends auth.users.



Fields:



id



display\_name



email



avatar\_url



role



is\_verified



created\_at



updated\_at



Rules:



Every authenticated user automatically has a profile.



Only admins may change roles.



Vet accounts require verification.



\---



\# Roles



Allowed values:



community



vet



admin



Never introduce additional roles.



Community members become transporters or foster caregivers through actions, not through separate roles.



\---



\# Cases Table



Purpose:



Represents one rescue case.



Every rescue has exactly one case.



Fields:



id



reporter\_id



status



photo\_url



description



precise\_lat



precise\_lng



fuzzed\_lat



fuzzed\_lng



ai\_condition



ai\_severity



ai\_reasoning



created\_at



updated\_at



Rules:



Every case belongs to one reporter.



Every case progresses through a predefined lifecycle.



Cases cannot skip required stages.



\---



\# Case Status Lifecycle



Allowed statuses:



REPORTED



TRIAGED



AWAITING\_TRANSPORT



IN\_TRANSIT



AT\_VET



QUOTED



FUNDING\_OPEN



FUNDED



IN\_TREATMENT



TREATED



FUNDS\_RELEASED



IN\_FOSTER



ADOPTED



SHELTERED



REUNITED



Terminal States:



ADOPTED



SHELTERED



REUNITED



Cancelled States:



CANCELLED



LOST\_CONTACT



DECEASED



Status transitions should be validated by application logic.



\---



\# Transport Requests



Purpose:



Allows community volunteers to transport rescued cats.



Fields:



id



case\_id



claimed\_by



status



claimed\_at



delivered\_at



Rules:



One transport request per case.



Only one volunteer may claim a request.



Claimed requests become unavailable.



\---



\# Transport Status



OPEN



CLAIMED



DELIVERED



\---



\# Vet Quotes



Purpose:



Stores the official treatment quotation.



Fields:



id



case\_id



vet\_id



quoted\_amount



notes



quoted\_at



Rules:



Only verified vets may create quotes.



Only one active quote per case.



Funding cannot begin before a quote exists.



\---



\# Donations



Purpose:



Records all community donations.



Fields:



id



case\_id



donor\_id



amount



status



created\_at



released\_at



Rules:



Multiple donations per case.



Money is simulated.



No payment gateway.



Donations remain locked until treatment is confirmed.



\---



\# Donation Status



PENDING



HELD\_IN\_ESCROW



RELEASED



REFUNDED (future)



\---



\# Treatment Records



Purpose:



Stores veterinary treatment information.



Fields:



id



case\_id



vet\_id



treatment\_summary



outcome



confirmed\_at



Rules:



Only verified vets.



One treatment record per case.



Treatment confirmation releases escrow.



\---



\# Treatment Outcomes



ONGOING



RECOVERED



DECEASED



REFERRED



\---



\# Foster Records



Purpose:



Tracks temporary caretakers.



Fields:



id



case\_id



caretaker\_id



started\_at



ended\_at



status



Rules:



Only one active foster.



Usually assigned to the transporter.



\---



\# Foster Status



ACTIVE



REASSIGNED



ADOPTED



SHELTERED



\---



\# Adoption Listings



Purpose:



Represents cats available for adoption.



Fields:



id



case\_id



description



personality



medical\_notes



matched\_with



status



listed\_at



Rules:



Created after treatment.



One listing per case.



\---



\# Adoption Status



OPEN



MATCHED



COMPLETED



CLOSED



\---



\# AI Data



The AI should never overwrite veterinary information.



AI fields are advisory only.



Store:



Condition



Severity



Reasoning



Confidence



Timestamp



AI output should always remain visible for transparency.



\---



\# Coordinates



Store:



Precise coordinates



Fuzzed coordinates



Public users should only receive fuzzed coordinates.



Precise coordinates are restricted to:



Assigned transporter



Assigned veterinarian



Administrator



\---



\# Auditability



Every important action should be traceable.



Examples:



Case reported



Transport claimed



Quote submitted



Donation received



Treatment confirmed



Funds released



Adoption completed



Future versions should implement an Activity Log.



\---



\# Row Level Security



Profiles



Users may read their own profile.



Admins may manage all profiles.



\---



Cases



Authenticated users may create cases.



Anyone may view public rescue cases.



Only reporters may edit their own reports before transport begins.



Admins have full access.



\---



Transport Requests



Any authenticated user may claim an OPEN request.



Only the assigned transporter may update their transport.



\---



Vet Quotes



Only verified vets may create or modify quotes.



Community users have read-only access.



\---



Donations



Authenticated users may donate.



Donors may view their own donations.



Admins may view all donations.



\---



Treatment Records



Only verified vets.



Readable by everyone.



\---



Adoption Listings



Publicly readable.



Only admins or verified vets may modify listings.



\---



\# Database Constraints



Funding cannot begin without:



Verified Vet Quote



Funds cannot release without:



Treatment Record



Adoption cannot begin until:



Treatment Completed



A case cannot have:



Multiple active transporters



Multiple active foster caregivers



Multiple active vet quotes



\---



\# Seed Data



Create demo data automatically.



Minimum:



5 Community Users



2 Verified Vets



1 Admin



10 Rescue Cases



3 Active Fundraisers



2 Cats Awaiting Transport



2 Cats In Treatment



2 Cats Ready For Adoption



Use realistic Thai names and locations around Bangkok for demo purposes.



\---



\# Future Tables (Do Not Build for MVP)



Notifications



Messages



Shelters



NGOs



Volunteer Reputation



Achievements



Pet Medical History



Push Notifications



Lost \& Found Pets



Payment Providers



Analytics



These are intentionally excluded from the hackathon MVP but the architecture should allow them to be added later.


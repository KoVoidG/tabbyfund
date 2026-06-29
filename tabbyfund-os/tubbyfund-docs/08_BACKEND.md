\# TABBYFUND MASTER PROMPT

\## Part 8 — API Specification, Server Actions \& Backend Contracts



\# Philosophy



The backend exists to enforce business rules, protect data, and provide a single source of truth.



The frontend should never contain business logic.



All sensitive operations must execute on the server.



Prefer Server Actions whenever possible.



Use Route Handlers only when Server Actions are not appropriate.



\---



\# Backend Architecture



Client



↓



Server Component



↓



Server Action



↓



Service Layer



↓



Supabase



↓



Return Typed Result



Business logic should never be duplicated.



\---



\# Layers



UI



↓



Server Action



↓



Service



↓



Repository (Supabase)



↓



Database



Each layer has one responsibility.



\---



\# Standard Response Format



Every Server Action should return the same structure.



Success



{

&#x20;   success: true,

&#x20;   data: ...

}



Failure



{

&#x20;   success: false,

&#x20;   error: {

&#x20;       code: "...",

&#x20;       message: "..."

&#x20;   }

}



Never throw raw errors to the UI.



\---



\# Error Codes



UNAUTHORIZED



FORBIDDEN



NOT\_FOUND



VALIDATION\_ERROR



AI\_UNAVAILABLE



UPLOAD\_FAILED



DATABASE\_ERROR



UNKNOWN\_ERROR



Keep errors predictable.



\---



\# Authentication



Every protected action must:



Verify authentication.



↓



Verify role.



↓



Validate input.



↓



Execute business logic.



↓



Return typed response.



Never trust client data.



\---



\# Validation



Every mutation must validate using Zod.



Validation order



Request



↓



Authentication



↓



Authorization



↓



Zod Validation



↓



Business Rules



↓



Database



↓



Return Result



Never skip validation.



\---



\# Server Actions



Use Server Actions for:



Login



Register



Report Rescue



Claim Transport



Create Vet Quote



Donate



Update Treatment



Create Adoption Listing



Update Profile



Vet Verification



Admin Actions



These should never require REST endpoints.



\---



\# Route Handlers



Use Route Handlers only when necessary.



Examples



AI Analysis



File Upload



Webhook



Future Payment Gateway



Future Push Notifications



Future Mobile API



Avoid unnecessary REST APIs.



\---



\# Service Layer



Every feature should own a service.



Example



ReportService



Responsibilities



Create rescue



Update rescue



Retrieve rescue



Close rescue



Never put business logic inside UI components.



\---



DonationService



Create donation



Calculate progress



Release escrow



Refund (future)



\---



VetService



Submit quote



Update treatment



Complete treatment



Retrieve assigned cases



\---



AIService



Prepare prompt



Call Gemini



Validate JSON



Return typed object



\---



NotificationService



Create notification



Read notifications



Mark read



Future push support



\---



\# Report Flow



Server Action



createRescueCase()



Flow



Validate



↓



Upload Image



↓



Save Image URL



↓



Create Case



↓



Trigger AI



↓



Save AI Result



↓



Return Case



Failure



If AI fails



↓



Still create case



↓



Return success



↓



Mark AI unavailable



\---



\# Transport Flow



claimTransport()



Validate



↓



Check role



↓



Check transport availability



↓



Assign transporter



↓



Update status



↓



Notify reporter



↓



Return success



\---



\# Vet Quote Flow



submitVetQuote()



Validate



↓



Vet verification



↓



Case status



↓



Create quote



↓



Update funding goal



↓



Open funding



↓



Notify reporter



↓



Return result



\---



\# Donation Flow



createDonation()



Validate



↓



Case exists



↓



Funding open



↓



Create donation



↓



Update progress



↓



Return result



Funds remain escrowed.



\---



\# Treatment Completion



completeTreatment()



Validate



↓



Vet ownership



↓



Treatment record



↓



Update case



↓



Release escrow



↓



Open adoption



↓



Notify community



↓



Return success



\---



\# Adoption Flow



createAdoptionListing()



Validate



↓



Treatment complete



↓



Create listing



↓



Update case



↓



Return result



\---



\# Admin Flow



verifyVet()



Validate admin



↓



Approve account



↓



Update role



↓



Notify user



↓



Return success



\---



\# Authorization Matrix



Community



Can



Report



Donate



Transport



Foster



Adopt



Own Dashboard



Cannot



Verify Vets



Modify Quotes



Release Funds



\---



Veterinarian



Can



View Assigned Cases



Submit Quotes



Update Treatment



Complete Treatment



Cannot



Verify Users



Manage Platform



\---



Administrator



Full access.



\---



\# Pagination



Default page size



10



Maximum



50



Never return unlimited data.



\---



\# Searching



Support



Status



Severity



Location



Adoption



Newest



Distance



Avoid premature advanced search.



\---



\# Sorting



Feed



Severity



↓



Newest



↓



Distance



Dashboard



Newest first.



\---



\# Image Upload



Images



↓



Compression



↓



Supabase Storage



↓



Public URL



↓



Database



Requirements



JPEG



PNG



WEBP



Maximum 10MB



Compress before upload.



\---



\# Logging



Log



Authentication failures



AI failures



Upload failures



Unexpected errors



Never log secrets.



\---



\# Security



Rate limit



AI requests



Report creation



Login



Future payment routes



Sanitize all user input.



Escape rendered content.



Protect against XSS.



Never expose internal IDs.



\---



\# API Documentation



Every Server Action should contain



Purpose



Input



Validation



Output



Possible Errors



Permissions



Keep documentation close to implementation.



\---



\# Demo Mode



Provide mock service implementations when:



Supabase unavailable



Gemini unavailable



Network unavailable



The demo should always remain functional.



\---



\# Future Integrations (Not MVP)



Stripe



PromptPay



LINE Login



LINE Notify



Email



SMS



Push Notifications



NGO APIs



Shelter APIs



Analytics



Keep architecture open for future integrations.


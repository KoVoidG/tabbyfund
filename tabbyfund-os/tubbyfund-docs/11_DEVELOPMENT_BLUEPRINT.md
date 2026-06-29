\# TABBYFUND MASTER PROMPT

\## Part 11 — Development Blueprint \& 14-Day Sprint Plan



\# Development Philosophy



The objective is not to build every possible feature.



The objective is to build the highest quality MVP that clearly demonstrates the complete rescue lifecycle.



Every day should produce visible progress.



Prioritize working software over perfect software.



Build the foundation correctly first.



Every completed feature should remain stable throughout the hackathon.



Never sacrifice architecture for temporary speed.



\---



\# MVP Definition



The MVP is considered complete when judges can successfully experience the entire rescue lifecycle.



Report Cat



↓



AI Triage



↓



Transport



↓



Vet Quote



↓



Funding



↓



Treatment



↓



Escrow Release



↓



Temporary Foster



↓



Adoption



↓



Community Impact



Everything else is optional.



\---



\# Development Priorities



Priority 1 (Critical)



Application Setup



Authentication



Database



Reporting



AI Triage



Transport



Vet Portal



Funding



Treatment



Adoption



Dashboard



Judge Sandbox



Without these features,



the project is incomplete.



\---



Priority 2 (Important)



Achievements



Animations



Advanced Dashboard



Search



Filtering



Improved Empty States



These improve user experience but are not required.



\---



Priority 3 (Future)



Push Notifications



Real Payments



LINE Login



NGO Integration



Messaging



Chat



Volunteer Reputation



These are intentionally excluded from the MVP.



\---



\# Sprint Overview



Day 1



Foundation



Goals



Create repository



Setup Next.js



Configure Tailwind



Install shadcn/ui



Configure Supabase



Setup Authentication



Create folder structure



Setup TypeScript



Setup ESLint



Setup Prettier



Outcome



Application boots successfully.



Authentication works.



Repository structure finalized.



\---



Day 2



Database



Goals



Create database schema



Configure RLS



Seed demo data



Setup Storage



Generate Types



Test database



Outcome



Backend foundation complete.



\---



Day 3



Design System



Goals



Implement Theme



Typography



Colors



Buttons



Cards



Forms



Navigation



Mascot placeholders



Responsive layout



Outcome



Reusable UI foundation.



\---



Day 4



Authentication \& Community Dashboard



Goals



Login



Registration



Profile



Dashboard



Navigation



Role detection



Outcome



Users can sign in.



\---



Day 5



Rescue Reporting



Goals



Report page



Image upload



Map picker



Validation



Case creation



Outcome



Users can report rescued cats.



\---



Day 6



AI Integration



Goals



Gemini



Prompt



JSON validation



Severity



Reasoning



Rescue guidance



Outcome



AI triage operational.



Fallback ready.



\---



Day 7



Transport System



Goals



Transport queue



Volunteer assignment



Transport details



Mission completion



Outcome



Community rescue workflow complete.



\---



Day 8



Veterinarian Portal



Goals



Vet dashboard



Case review



Treatment quote



Funding goal



Treatment updates



Outcome



Medical workflow complete.



\---



Day 9



Donation System



Goals



Escrow simulation



Funding progress



Donation history



Release logic



Outcome



Funding workflow complete.



\---



Day 10



Treatment \& Foster



Goals



Treatment completion



Escrow release



Temporary foster



Recovery timeline



Outcome



Recovery workflow complete.



\---



Day 11



Adoption



Goals



Adoption listings



Recovery stories



Filters



Adoption process



Outcome



Rescue lifecycle completed.



\---



Day 12



Admin Dashboard



Goals



Vet verification



Statistics



Platform overview



Moderation



Outcome



Administration complete.



\---



Day 13



Judge Experience



Goals



Sandbox



Demo mode



Role switch



Mock AI



Seed data



Presentation flow



Outcome



Perfect hackathon demo.



\---



Day 14



Polish



Goals



Bug fixing



Accessibility



Responsive testing



Animations



Performance



Code cleanup



Documentation



Presentation rehearsal



Outcome



Production-quality MVP.



\---



\# Feature Dependencies



Authentication



↓



Profiles



↓



Reporting



↓



AI



↓



Transport



↓



Veterinarian



↓



Funding



↓



Treatment



↓



Foster



↓



Adoption



↓



Community Dashboard



Never build dependent features before prerequisites.



\---



\# Daily Checklist



Every day should end with:



✓ Working application



✓ Git commit



✓ Tested feature



✓ Responsive UI



✓ No TypeScript errors



✓ No ESLint errors



✓ Updated documentation



Never finish the day with broken code.



\---



\# Git Workflow



Main Branch



Production-ready code only.



Feature Branches



feature/reporting



feature/ai



feature/transport



feature/vet



feature/donation



feature/adoption



Merge only after testing.



\---



\# Commit Convention



feat:



fix:



refactor:



style:



docs:



test:



chore:



Examples



feat(report): create rescue reporting flow



fix(ai): handle invalid Gemini response



refactor(dashboard): simplify statistics cards



\---



\# Demo Readiness Checklist



The application must always be demoable.



Even if unfinished.



If AI fails



↓



Use mock response.



If Supabase fails



↓



Use seeded data.



If internet fails



↓



Sandbox still works.



The demo should never depend on external reliability.



\---



\# Risk Management



Highest Risks



AI API issues



Supabase configuration



Authentication bugs



Time management



Scope creep



Mitigation



Prepare mock AI.



Keep simulated payments.



Avoid unnecessary features.



Finish MVP before polishing.



\---



\# Time Allocation



Core Features



70%



Polish



20%



Presentation



10%



Never spend multiple days perfecting one screen.



\---



\# Definition of MVP Complete



The MVP is complete when:



A user can report an injured cat.



AI prioritizes the case.



A volunteer transports the cat.



A veterinarian submits a treatment quote.



The community funds the treatment.



The veterinarian confirms recovery.



Escrow releases.



The cat enters foster care.



The cat is adopted.



Community impact updates.



If all of these work,



the project successfully demonstrates TabbyFund's mission.



\---



\# Success Criteria



By the end of Day 14:



The application should feel like a real startup product.



Judges should understand the concept within one minute.



The rescue workflow should be intuitive.



The UI should feel polished.



The architecture should support future expansion.



The project should clearly demonstrate technical skill, thoughtful design, and meaningful social impact.


\# TABBYFUND MASTER PROMPT

\## Part 4 — Product Features, User Flows \& Business Logic



\# Philosophy



Every feature exists to make rescuing stray cats easier, faster, safer, and more transparent.



Users should never feel overwhelmed.



Every screen should answer one question:



"What is the next best action for this user?"



The application should always guide users through the rescue process instead of expecting them to understand it.



\---



\# Primary User Roles



The platform has only three roles.



Community



Veterinarian



Administrator



Permissions should always be determined by role and ownership.



\---



\# Overall Rescue Lifecycle



Every rescue follows this exact sequence.



Discover Cat



↓



Report



↓



AI Triage



↓



Temporary Rescue Guidance



↓



Transport



↓



Veterinary Examination



↓



Treatment Quote



↓



Community Funding



↓



Treatment



↓



Fund Release



↓



Temporary Foster



↓



Adoption



↓



Case Closed



No rescue should skip required stages.



\---



\# Feature 1 — Report Rescue Case



Purpose



Allow anyone in the community to report an injured stray cat in less than two minutes.



Required Information



• Photo



• Short description



• GPS location



• Optional contact note



Workflow



User opens Report page



↓



Uploads photo



↓



Writes description



↓



Pins location



↓



Submits report



↓



Case created



↓



AI triage automatically starts



Success Criteria



The report should be completed quickly with minimal typing.



\---



Business Rules



Photo is required.



Location is required.



Description is required.



Only authenticated users may report.



Duplicate reports at the same location should warn the user but still allow submission.



\---



Edge Cases



Poor internet connection



Large image upload



GPS unavailable



AI unavailable



If AI fails



↓



Still create the case



↓



Mark AI status as unavailable



↓



Allow manual review



Never block report submission because AI failed.



\---



\# Feature 2 — AI Triage



Purpose



Help prioritize rescue cases.



AI should NEVER diagnose.



AI only assists.



AI receives



Photo



Description



Returns



Condition Category



Severity



Confidence



Reasoning



First Aid Suggestions



Example



Severity



Critical



Reason



Visible heavy bleeding.



Unable to stand.



Large open wound.



First Aid



Do not force movement.



Keep warm.



Contact transporter immediately.



Business Rules



AI recommendations are advisory.



Veterinary decisions always override AI.



\---



\# Feature 3 — Rescue Guidance



Immediately after reporting



The application should educate the reporter.



Examples



Provide water if safe.



Avoid chasing frightened cats.



Keep nearby if possible.



Do not attempt to treat serious injuries.



Use a towel if transportation becomes necessary.



Purpose



Reduce panic.



Improve rescue quality.



\---



\# Feature 4 — Rescue Feed



Purpose



Display active rescue cases.



Sort Order



Critical



↓



High



↓



Medium



↓



Low



Each card displays



Photo



Severity



Location



Time



Status



Distance



Funding Progress (when applicable)



Actions



View Details



Volunteer



Donate



Share



\---



\# Feature 5 — Transportation



Purpose



Move the rescued cat to a veterinary clinic.



Workflow



Reporter asked



Can you transport?



YES



↓



Become transporter



NO



↓



Open volunteer request



↓



Nearby volunteers may accept



↓



Transport completed



Rules



Only one transporter.



Transport requests disappear once claimed.



Admins may reassign.



\---



\# Feature 6 — Veterinary Portal



Purpose



Allow verified veterinarians to manage treatment.



Dashboard



Cases Awaiting Examination



Cases Awaiting Quote



Cases In Treatment



Completed Cases



Actions



View case



Enter quote



Update treatment



Upload photos



Confirm completion



Only verified veterinarians may access.



\---



\# Feature 7 — Treatment Quote



Purpose



Create a trustworthy fundraising goal.



Vet enters



Treatment Cost



Treatment Summary



Estimated Recovery



After submission



Case status



↓



FUNDING\_OPEN



Rules



Only one active quote.



Quote cannot change after donations begin without admin approval.



\---



\# Feature 8 — Community Funding



Purpose



Allow transparent treatment funding.



Case page displays



Progress bar



Amount raised



Target amount



Remaining amount



Donation history



Mock PromptPay QR



Donate button



Rules



Payments are simulated.



Money remains inside escrow.



No real payment gateway.



\---



Escrow Flow



Donation



↓



Escrow



↓



Treatment Completed



↓



Funds Released



↓



Vet



Never



Reporter



Volunteer



Administrator



\---



\# Feature 9 — Treatment Progress



Vet updates



Waiting



Examining



In Treatment



Recovering



Recovered



Upload



Photos



Medical notes



Completion date



Community should be able to follow progress.



\---



\# Feature 10 — Temporary Foster



If adoption is not immediate



Assign temporary caretaker.



Priority



Transport volunteer



↓



Original reporter



↓



Another volunteer



Rules



Only one active foster.



Admin may reassign.



\---



\# Feature 11 — Adoption



Recovered cats become adoptable.



Adoption Card



Before Photo



After Photo



Recovery Story



Personality



Medical History



Vaccination



Adoption Status



Adopt Button



Purpose



Help people emotionally connect with rescued cats.



\---



\# Feature 12 — Community Dashboard



Purpose



Show impact.



Statistics



Cats Reported



Transport Missions



Cats Fostered



Donations



Successful Adoptions



Current Missions



Achievements



Recent Activity



Users should feel proud.



\---



\# Feature 13 — Veterinarian Dashboard



Statistics



Pending Cases



Treatments



Revenue Released



Average Recovery Time



Current Patients



Today's Tasks



\---



\# Feature 14 — Administrator Dashboard



Purpose



Platform oversight.



Statistics



Users



Verified Vets



Reports



Funding



Completed Rescues



Adoptions



Pending Verification



Suspicious Activity



Quick Actions



Approve Vet



Disable User



Resolve Reports



View Analytics



\---



\# Notifications



Notify users when



Transport claimed



Vet submitted quote



Funding opened



Funding completed



Treatment updated



Treatment completed



Adoption request received



Use simple in-app notifications for MVP.



Push notifications are future work.



\---



\# Search



Allow searching by



Case ID



Status



Location



Severity



Adoption availability



Do not implement advanced search for MVP.



\---



\# Maps



Users can



View rescue locations



Drop report pins



Navigate to assigned rescue



Public users only see fuzzed locations.



Transporters and vets see exact locations.



\---



\# Judge Sandbox Mode



A dedicated demo page.



Purpose



Allow judges to experience the complete application in under one minute.



Requirements



No login.



Pre-seeded data.



Role switcher.



One-click navigation.



Every feature demonstrated.



Reporter



↓



Volunteer



↓



Vet



↓



Donor



↓



Foster



↓



Adopter



The sandbox should showcase the platform's full rescue lifecycle without requiring setup.



\---



\# Success Criteria



A user with no prior knowledge should understand the platform within sixty seconds.



The rescue lifecycle should be visually obvious.



Every action should feel purposeful.



Every page should encourage the next logical step.



Users should finish the demo feeling that they genuinely helped rescue a stray cat.


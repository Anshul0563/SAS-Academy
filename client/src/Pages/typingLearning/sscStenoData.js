const countWords = (text = "") => text.trim().split(/\s+/).filter(Boolean).length;

const buildText = (sections) => sections.join(" ");

const rawStenoParagraphs = [
  {
    id: "ssc-steno-admin-001",
    title: "Administrative Review and Office Procedure",
    difficulty: "intermediate",
    duration: 600,
    targetWPM: 80,
    accuracyGoal: 95,
    language: "english",
    category: "Administration",
    practiceType: "SSC Steno Dictation",
    paragraphText: buildText([
      "The administrative review meeting was convened to examine the progress of pending references received from regional offices, district authorities, and public representatives. The chairperson observed that timely disposal of correspondence is an essential part of responsible governance, because every file represents a request, a grievance, or an official decision that may affect citizens directly.",
      "All section officers were instructed to maintain a clear record of receipts, movement of files, action taken, and final disposal. It was further directed that no communication should remain unattended merely because the matter requires consultation with another department. In such cases, the dealing assistant shall prepare a concise note indicating the issue, the rule position, the documents available, and the specific clarification required.",
      "The committee also reviewed the practice of issuing office memoranda without proper reference numbers. It was decided that every circular, order, reminder, and clarification must contain the subject, date, file number, issuing authority, and distribution list. This will ensure that future audit teams and inspection officers can verify the decision-making process without difficulty.",
      "During the discussion, attention was invited to delays caused by incomplete enclosures. The chairperson emphasized that a document checklist must be attached to every proposal before it is submitted for approval. If any certificate, undertaking, financial statement, or legal opinion is missing, the file should not be pushed forward mechanically. Instead, the concerned branch must obtain the missing material and record the action in writing.",
      "The meeting concluded with directions for weekly monitoring. Each branch will submit a brief statement showing opening balance, receipts during the week, cases disposed of, cases pending beyond fifteen days, and reasons for delay. The objective of this exercise is not merely to prepare statistics, but to improve the discipline of public administration. Officers were advised to treat accuracy, clarity, and punctuality as the foundation of efficient office work.",
    ]),
  },
  {
    id: "ssc-steno-parliament-002",
    title: "Parliamentary Committee Proceedings",
    difficulty: "advanced",
    duration: 600,
    targetWPM: 90,
    accuracyGoal: 94,
    language: "english",
    category: "Parliament",
    practiceType: "SSC Steno Speech",
    paragraphText: buildText([
      "Honourable members, the committee has assembled today to consider the progress made in implementing recommendations relating to administrative transparency, digital record management, and citizen service delivery. The secretariat has circulated a background note containing replies from the ministries concerned, along with a comparative statement showing the action taken on each recommendation.",
      "At the outset, the chairperson observed that parliamentary oversight is meaningful only when departments furnish complete, precise, and timely information. A general assurance that the matter is under consideration cannot be treated as sufficient compliance. The committee expects measurable steps, clear timelines, and details of responsibility fixed at each level.",
      "Several members expressed concern that important public schemes suffer when field offices do not receive operational instructions in simple language. It was suggested that guidelines should be issued in both English and Hindi, and where necessary in regional languages, so that implementing agencies can act without ambiguity. The ministry representative stated that a revised communication protocol is being prepared and will be placed before the competent authority shortly.",
      "The committee then examined the status of recruitment-related reforms. Members noted that applicants from rural areas often face difficulty in obtaining updates regarding examination schedules, document verification, and final results. The department was advised to strengthen online dashboards, helpdesk responses, and SMS alerts. It was also recommended that grievance disposal should be monitored independently, because delayed replies create avoidable uncertainty among candidates.",
      "In conclusion, the chairperson directed the ministry to submit a detailed action taken statement within six weeks. The statement shall indicate decisions already implemented, matters pending approval, financial implications, and the names of divisions responsible for follow-up. The committee reiterated that public administration must be accountable, accessible, and responsive. The proceedings were then adjourned with thanks to the witnesses and officials present.",
    ]),
  },
  {
    id: "ssc-steno-policy-003",
    title: "Public Policy and Citizen Services",
    difficulty: "intermediate",
    duration: 540,
    targetWPM: 75,
    accuracyGoal: 95,
    language: "english",
    category: "Public Policy",
    practiceType: "Policy Note",
    paragraphText: buildText([
      "Public policy is effective when it converts official intention into practical relief for citizens. A scheme may be well designed at the national level, but its success depends upon the clarity of guidelines, capacity of field officers, availability of funds, and regular feedback from beneficiaries. For this reason, every department must establish a reliable system for planning, implementation, monitoring, and correction.",
      "The policy division has proposed that citizen service centres should display complete information regarding eligibility, documents required, fees payable, expected time for disposal, and appeal mechanism. This information must be written in simple language and updated whenever rules are amended. Officials should avoid technical expressions when dealing with applicants who may not be familiar with administrative terminology.",
      "The note also emphasizes the importance of digital inclusion. Online services reduce delay only when citizens are able to use them easily. Therefore, departments should provide assisted digital facilities, helpline support, and grievance tracking numbers. The objective is to ensure that technology does not become a barrier for elderly persons, persons with disabilities, or residents of remote areas.",
      "A review of existing procedures indicates that many delays occur because applications are returned repeatedly for minor defects. The proposed approach requires the receiving office to examine the application carefully at the first stage and communicate all deficiencies at once. This will reduce unnecessary visits and improve public confidence in government services.",
      "The department has recommended quarterly social audit meetings at the district level. Representatives of local bodies, civil society organizations, and beneficiary groups may be invited to provide suggestions. Such consultation does not reduce official authority; rather, it strengthens policy by bringing practical experience into administrative decision-making. The final report will be submitted after interdepartmental consultation.",
    ]),
  },
  {
    id: "ssc-steno-railway-004",
    title: "Railway Department Safety Report",
    difficulty: "advanced",
    duration: 600,
    targetWPM: 90,
    accuracyGoal: 94,
    language: "english",
    category: "Railway Department",
    practiceType: "Departmental Report",
    paragraphText: buildText([
      "The railway safety review was undertaken to assess station management, passenger amenities, maintenance schedules, and emergency preparedness across selected divisions. The inspection team visited platforms, control rooms, booking counters, parcel offices, waiting halls, and crew lobbies. The team interacted with supervisors, technical staff, passengers, and representatives of service providers.",
      "It was observed that punctual maintenance of signalling equipment, track components, electrical installations, and public announcement systems is essential for safe and efficient operations. Divisional officers were instructed to ensure that inspection registers are updated regularly and that defects noticed during routine checks are attended to without delay. Where immediate rectification is not possible, temporary safety measures must be recorded and monitored.",
      "The report places special emphasis on crowd management during festival seasons, recruitment examinations, and local events. Stations receiving heavy footfall should prepare route plans for entry and exit, deploy additional staff, keep medical assistance ready, and coordinate with local police authorities. Public announcements must be clear, timely, and repeated in languages understood by passengers.",
      "The committee also examined passenger grievance records. Complaints relating to cleanliness, drinking water, lighting, waiting rooms, and ticketing counters were reviewed. It was recommended that station managers should analyze complaint patterns rather than dispose of each complaint as an isolated matter. Repeated complaints from the same location indicate a systemic issue requiring managerial attention.",
      "In the concluding remarks, the reviewing authority stated that railway administration combines technical precision with public service. Every employee, whether posted in operations, commercial, engineering, electrical, mechanical, or security branch, contributes to passenger confidence. The divisions have been asked to submit an action plan with timelines, budget requirements, and responsible officers for each improvement proposed in the report.",
    ]),
  },
  {
    id: "ssc-steno-digital-005",
    title: "Digital India Implementation Note",
    difficulty: "advanced",
    duration: 600,
    targetWPM: 85,
    accuracyGoal: 95,
    language: "english",
    category: "Digital India",
    practiceType: "Official Note",
    paragraphText: buildText([
      "The Digital India programme has created a framework for transforming public services through technology, connectivity, and data-driven administration. However, the use of digital platforms must be accompanied by institutional discipline, cyber security awareness, and citizen-friendly design. Departments are expected to review their online services not only from the perspective of technical availability, but also from the perspective of actual public convenience.",
      "The implementation note recommends that every online service should provide a clear application form, document checklist, fee details, acknowledgement number, expected timeline, and appeal provision. Applicants should be able to track the status of their application without visiting the office. Where applications are rejected, reasons must be communicated clearly, and the applicant should be informed about the method of correction or appeal.",
      "Data protection has been identified as a critical responsibility. Officials handling digital records must ensure that passwords are not shared, personal information is not printed unnecessarily, and access rights are reviewed periodically. Training programmes should cover phishing awareness, safe handling of removable media, secure email practices, and reporting of suspected incidents.",
      "The note also addresses the need for interoperability among departmental systems. Citizens should not be asked to submit the same certificate repeatedly if the information is already available in a trusted government database and can be verified lawfully. At the same time, consent, privacy, and legal safeguards must be respected.",
      "The department proposes a monthly dashboard showing number of applications received, disposed of, pending beyond timeline, rejected, and returned for correction. Senior officers will review the dashboard to identify bottlenecks. Digital governance is not merely the conversion of paper forms into online forms; it is the redesign of service delivery with accountability, transparency, and measurable outcomes.",
    ]),
  },
  {
    id: "ssc-steno-court-006",
    title: "Court Proceedings and Record Preparation",
    difficulty: "expert",
    duration: 720,
    targetWPM: 100,
    accuracyGoal: 96,
    language: "english",
    category: "Court Proceedings",
    practiceType: "Legal Transcription",
    paragraphText: buildText([
      "The matter was taken up for hearing after completion of the regular board. Learned counsel for the petitioner submitted that the representation filed by the petitioner had remained pending before the competent authority for several months, although all relevant documents had been supplied. It was argued that delay in consideration of the representation had caused avoidable hardship and uncertainty.",
      "On behalf of the respondent department, it was stated that the matter involved verification of service records, financial implications, and consultation with the accounts branch. The court observed that administrative consultation may be necessary in appropriate cases, but such consultation cannot justify indefinite inaction. When a citizen or employee submits a representation, the authority concerned is expected to consider it in accordance with law and pass a reasoned order within a reasonable period.",
      "The court further noted that a speaking order is an important part of fair procedure. The order need not be lengthy, but it must indicate that the authority has examined the facts, considered the rules, and applied its mind to the claim. A mechanical rejection or an unexplained delay weakens confidence in administrative justice.",
      "After hearing the parties, the court directed the competent authority to decide the pending representation within eight weeks from the date of receipt of the order. The petitioner shall be at liberty to submit a supplementary representation along with supporting documents within ten days. The authority shall provide an opportunity of hearing if considered necessary and shall communicate the final decision to the petitioner promptly.",
      "It was clarified that the court had not expressed any opinion on the merits of the claim. All questions of fact and law were left open for consideration by the authority. The petition was disposed of with the above directions, and no order as to costs was passed. The registry was directed to provide a certified copy of the order as per rules.",
    ]),
  },
];

export const sscStenoParagraphs = rawStenoParagraphs.map((item) => ({
  ...item,
  wordCount: countWords(item.paragraphText),
}));

export const sscStenoCategories = [
  "All",
  ...Array.from(new Set(sscStenoParagraphs.map((item) => item.category))),
];

import "dotenv/config";
import { db, contentTable, quizzesTable, quizQuestionsTable, newsTable, forumPostsTable, usersTable } from "./index.js";
import crypto from "crypto";

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw + "cybersecure_salt_2025").digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(usersTable).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  await db.insert(usersTable).values([
    { name: "Admin User", email: "admin@cyberaware.com", password: hash("admin1234"), role: "admin" },
    { name: "Jitendra Singh Chouhan", email: "jitendrasinghchouhan2704@gmail.com", password: hash("password123"), role: "user" },
  ]);

  await db.insert(contentTable).values([
    {
      title: "Understanding Phishing Attacks",
      description: "Learn how phishing attacks work, how to identify suspicious emails, and how to protect yourself from falling victim to email scams.",
      category: "phishing",
      difficulty: "beginner",
      readTime: 8,
    },
    {
      title: "Malware: Types, Detection & Prevention",
      description: "A comprehensive guide to different types of malware including viruses, trojans, spyware, and ransomware, with prevention tips.",
      category: "malware",
      difficulty: "intermediate",
      readTime: 12,
    },
    {
      title: "Creating Strong Passwords",
      description: "Best practices for creating and managing strong, unique passwords. Learn about password managers and multi-factor authentication.",
      category: "password",
      difficulty: "beginner",
      readTime: 6,
    },
    {
      title: "Data Privacy in the Digital Age",
      description: "Understanding how your personal data is collected, stored, and used online. Learn your rights and how to minimize your digital footprint.",
      category: "privacy",
      difficulty: "intermediate",
      readTime: 10,
    },
    {
      title: "Safe Social Media Practices",
      description: "How to use social media platforms safely. Learn about privacy settings, oversharing risks, and protecting your identity online.",
      category: "social_media",
      difficulty: "beginner",
      readTime: 7,
    },
    {
      title: "Ransomware: How It Works & How to Stay Safe",
      description: "Deep dive into ransomware attacks, famous incidents, backup strategies, and how organizations can defend against encryption-based attacks.",
      category: "ransomware",
      difficulty: "advanced",
      readTime: 15,
    },
    {
      title: "Introduction to Cybersecurity Fundamentals",
      description: "A beginner-friendly overview of the cybersecurity landscape, CIA triad, common threats, and why cybersecurity awareness matters for everyone.",
      category: "general",
      difficulty: "beginner",
      readTime: 10,
    },
    {
      title: "Two-Factor Authentication Guide",
      description: "Everything you need to know about enabling and using 2FA. Understand different 2FA methods and why they're essential for account security.",
      category: "password",
      difficulty: "beginner",
      readTime: 5,
    },
    {
      title: "Advanced Phishing: Spear Phishing & Whaling",
      description: "Beyond standard phishing — how attackers craft highly targeted attacks against individuals and executives using social engineering.",
      category: "phishing",
      difficulty: "advanced",
      readTime: 14,
    },
    {
      title: "Protecting Children Online",
      description: "Guide for parents and educators on keeping children safe online. Topics include cyberbullying, predators, age-appropriate content, and digital literacy.",
      category: "general",
      difficulty: "beginner",
      readTime: 9,
    },
  ]);

  const [quiz1] = await db.insert(quizzesTable).values([
    { title: "Phishing Awareness Quiz", description: "Test your ability to identify phishing attacks and suspicious emails.", category: "phishing", difficulty: "beginner" },
  ]).returning();

  const [quiz2] = await db.insert(quizzesTable).values([
    { title: "Password Security Challenge", description: "How strong is your password knowledge? Test your understanding of password best practices.", category: "password", difficulty: "intermediate" },
  ]).returning();

  const [quiz3] = await db.insert(quizzesTable).values([
    { title: "General Cybersecurity Knowledge Test", description: "A comprehensive test covering all major cybersecurity topics.", category: "general", difficulty: "intermediate" },
  ]).returning();

  await db.insert(quizQuestionsTable).values([
    { quizId: quiz1.id, question: "Which of the following is a common sign of a phishing email?", optionA: "The email comes from a known contact", optionB: "Urgent language asking you to act immediately", optionC: "The email has no attachments", optionD: "The email was sent during business hours", correctAnswer: "B", explanation: "Phishing emails often use urgency tactics to pressure victims into acting without thinking." },
    { quizId: quiz1.id, question: "What should you do if you receive a suspicious email asking for your bank credentials?", optionA: "Reply and ask them to verify their identity", optionB: "Click the link to see if it's legitimate", optionC: "Delete it and report it as phishing", optionD: "Forward it to your friends to warn them", correctAnswer: "C", explanation: "Never click links in suspicious emails. Delete and report them to prevent others from falling victim." },
    { quizId: quiz1.id, question: "What is 'spear phishing'?", optionA: "A phishing attack that targets a specific individual or organization", optionB: "A phishing attack using fake social media profiles", optionC: "A phishing attack using SMS messages", optionD: "A phishing attack targeting gaming accounts", correctAnswer: "A", explanation: "Spear phishing is a highly targeted attack tailored to a specific person using personal information." },
    { quizId: quiz1.id, question: "Which URL is most likely a phishing attempt?", optionA: "https://www.amazon.com/login", optionB: "https://amaz0n-secure.com/login", optionC: "https://amazon.secure.login.com", optionD: "Both B and C", correctAnswer: "D", explanation: "Attackers use lookalike domains and subdomains to deceive users. Always verify the exact domain." },
    { quizId: quiz1.id, question: "What does HTTPS in a URL guarantee?", optionA: "The website is 100% safe and legitimate", optionB: "The connection is encrypted, but the site may still be malicious", optionC: "The website is owned by a verified company", optionD: "The website cannot steal your data", correctAnswer: "B", explanation: "HTTPS only ensures encryption in transit. Phishing sites can and do use HTTPS certificates." },
  ]);

  await db.insert(quizQuestionsTable).values([
    { quizId: quiz2.id, question: "What makes a password strong?", optionA: "Using your birthday as the password", optionB: "Using a combination of letters, numbers, and symbols with 12+ characters", optionC: "Using the same password everywhere for consistency", optionD: "Using the word 'password' with numbers", correctAnswer: "B", explanation: "Strong passwords are long (12+ chars) and use a mix of character types." },
    { quizId: quiz2.id, question: "What is a password manager?", optionA: "A person who manages your passwords", optionB: "Software that generates and securely stores unique passwords", optionC: "A browser feature that auto-fills forms", optionD: "A government program for identity management", correctAnswer: "B", explanation: "Password managers generate and encrypt unique passwords for all your accounts." },
    { quizId: quiz2.id, question: "How often should you change your passwords?", optionA: "Every day", optionB: "Every week", optionC: "Only when there's evidence of a breach", optionD: "Never", correctAnswer: "C", explanation: "Modern guidance recommends changing passwords only after a breach, focusing instead on using unique strong passwords." },
    { quizId: quiz2.id, question: "What is two-factor authentication (2FA)?", optionA: "Using two different passwords", optionB: "A security method requiring two separate forms of verification", optionC: "Logging in from two devices simultaneously", optionD: "Having two email addresses", correctAnswer: "B", explanation: "2FA requires something you know (password) plus something you have (phone/token) or are (biometric)." },
  ]);

  await db.insert(quizQuestionsTable).values([
    { quizId: quiz3.id, question: "What does 'CIA Triad' stand for in cybersecurity?", optionA: "Central Intelligence Agency", optionB: "Confidentiality, Integrity, Availability", optionC: "Cyber Incident Analysis", optionD: "Computing Infrastructure Architecture", correctAnswer: "B", explanation: "The CIA Triad — Confidentiality, Integrity, Availability — forms the foundation of cybersecurity." },
    { quizId: quiz3.id, question: "What is malware?", optionA: "Malicious software designed to harm systems", optionB: "A type of hardware failure", optionC: "Poor quality software", optionD: "Software for email marketing", correctAnswer: "A", explanation: "Malware (malicious software) is designed to damage, disrupt, or gain unauthorized access to systems." },
    { quizId: quiz3.id, question: "What is a firewall?", optionA: "A physical wall in a server room to prevent fires", optionB: "Software or hardware that monitors and controls network traffic", optionC: "A type of antivirus program", optionD: "A password encryption tool", correctAnswer: "B", explanation: "A firewall monitors and controls incoming/outgoing network traffic based on security rules." },
    { quizId: quiz3.id, question: "What is ransomware?", optionA: "Software that demands ransom from software companies", optionB: "Malware that encrypts files and demands payment for decryption", optionC: "A type of computer game", optionD: "Anti-virus software that is expensive", correctAnswer: "B", explanation: "Ransomware encrypts a victim's files and demands payment (ransom) to restore access." },
    { quizId: quiz3.id, question: "What is social engineering?", optionA: "Building social networks", optionB: "Manipulating people into revealing confidential information", optionC: "Engineering software for social media", optionD: "A type of malware attack", correctAnswer: "B", explanation: "Social engineering exploits human psychology rather than technical vulnerabilities to gain access." },
  ]);

  await db.insert(newsTable).values([
    { title: "Critical Zero-Day Vulnerability Found in Major Browser", summary: "Security researchers have discovered a critical zero-day vulnerability affecting millions of users. Update your browser immediately.", source: "CyberSecurity Times", severity: "critical", publishedAt: new Date("2026-03-25") },
    { title: "New Phishing Campaign Targets Banking Customers", summary: "A sophisticated phishing campaign mimicking major banks has been targeting customers across 15 countries. Learn how to spot these emails.", source: "ThreatPost", severity: "high", publishedAt: new Date("2026-03-22") },
    { title: "Ransomware Attack Disrupts Hospital Operations", summary: "A major hospital network was hit with ransomware, disrupting patient care systems. Backup strategies and rapid response were key to recovery.", source: "InfoSecurity Magazine", severity: "critical", publishedAt: new Date("2026-03-20") },
    { title: "Password Manager Database Breach Reported", summary: "A popular password manager reported unauthorized access to encrypted vaults. Experts urge users to change master passwords and enable 2FA.", source: "Krebs on Security", severity: "high", publishedAt: new Date("2026-03-18") },
    { title: "AI-Powered Deepfakes Used in Fraud Scams", summary: "Cybercriminals are using AI-generated deepfake audio and video to impersonate executives and conduct financial fraud.", source: "Dark Reading", severity: "high", publishedAt: new Date("2026-03-15") },
    { title: "Government Warns of State-Sponsored Cyber Espionage", summary: "Intelligence agencies have issued warnings about increased state-sponsored cyber espionage targeting critical infrastructure.", source: "CISA", severity: "critical", publishedAt: new Date("2026-03-12") },
    { title: "Social Media Privacy Updates: What You Need to Know", summary: "Several major social media platforms have updated their privacy policies. Here's what changed and how it affects your data.", source: "The Verge", severity: "medium", publishedAt: new Date("2026-03-10") },
    { title: "New Malware Campaign Targets Android Devices", summary: "A new strain of mobile malware is being distributed through unofficial app stores, targeting banking credentials on Android.", source: "ESET Research", severity: "high", publishedAt: new Date("2026-03-08") },
    { title: "Data Breach Exposes 50 Million User Records", summary: "A major e-commerce platform disclosed a data breach affecting 50 million customers. Learn what data was compromised and what steps to take.", source: "BleepingComputer", severity: "critical", publishedAt: new Date("2026-03-05") },
    { title: "Tips for Secure Online Shopping in 2026", summary: "With online shopping at an all-time high, here are essential security tips to protect your financial data while shopping online.", source: "CyberSafe Blog", severity: "low", publishedAt: new Date("2026-03-01") },
  ]);

  await db.insert(forumPostsTable).values([
    { title: "How do I know if my email was compromised?", content: "I received an email saying my account was accessed from an unknown location. What steps should I take to secure my email account and check if I've been hacked?", category: "general", authorName: "CuriousUser123", replyCount: 3 },
    { title: "Best free antivirus recommendations 2026", content: "Looking for recommendations for reliable free antivirus software. What are you all using? Is Windows Defender enough these days?", category: "malware", authorName: "TechNewbie", replyCount: 5 },
    { title: "VPN: Is it really necessary for home users?", content: "I keep hearing about VPNs but I'm not sure if I need one at home. What are the actual benefits vs just using my ISP? Any recommendations?", category: "privacy", authorName: "HomeUser", replyCount: 7 },
    { title: "My company got phished - lessons learned", content: "Our company recently fell victim to a phishing attack that compromised several email accounts. I wanted to share what we learned and the changes we made.", category: "phishing", authorName: "SecAdmin2026", replyCount: 4 },
    { title: "Password manager comparison: which one to choose?", content: "I'm finally ready to use a password manager but there are so many options. Bitwarden, 1Password, LastPass... What do you recommend and why?", category: "password", authorName: "PasswordNewbie", replyCount: 8 },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit());

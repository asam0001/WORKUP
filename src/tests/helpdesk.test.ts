import { describe, it, expect } from "vitest";
import { HelpdeskAssistant, HelpdeskContext } from "@/lib/helpdesk/assistant";

describe("AI Helpdesk Virtual Team Assistant (Quila)", () => {
  const sampleTask = {
    id: "task-ff-001",
    ticketKey: "FF-001",
    title: "Fix a login validation issue",
    difficulty: "Beginner",
    department: "Backend Engineering",
    businessContext: "Customers report empty emails are accepted.",
    objective: "Reject empty emails and require '@' format.",
    whyImportant: "Stops ghost user sessions in auth DB.",
    stepByStepInstructions: JSON.stringify([
      "Read the issue description",
      "Open src/auth/validator.py",
      "Update validation logic",
      "Run tests",
      "Submit PR"
    ]),
    toolsAndFiles: JSON.stringify(["src/auth/validator.py", "tests/test_validator.py"]),
    expectedOutput: "Empty emails rejected, valid emails accepted, tests pass.",
    hints: JSON.stringify([
      "Inspect validate_login_input return value.",
      "In Python, check if not email or len(email.strip()) == 0.",
      "Check for '@' symbol in email string."
    ]),
  };

  it("should explain the mission in simple, beginner-friendly language", async () => {
    const context: HelpdeskContext = {
      task: sampleTask,
      userMessage: "I don't understand what this mission is asking me to do.",
    };

    const response = await HelpdeskAssistant.generateReply(context);

    expect(response.reply).toContain("Your goal:");
    expect(response.reply).toContain("FF-001");
    expect(response.reply).toContain("src/auth/validator.py");
    expect(response.suggestedPrompts.length).toBeGreaterThan(0);
  });

  it("should guide the learner to the next step based on test state", async () => {
    // When tests haven't passed yet
    const context1: HelpdeskContext = {
      task: sampleTask,
      userMessage: "Where should I start?",
      testResult: null,
    };
    const response1 = await HelpdeskAssistant.generateReply(context1);
    expect(response1.reply).toContain("src/auth/validator.py");

    // When tests already passed
    const context2: HelpdeskContext = {
      task: sampleTask,
      userMessage: "What to do next?",
      testResult: { passed: true, exitCode: 0 },
    };
    const response2 = await HelpdeskAssistant.generateReply(context2);
    expect(response2.reply).toContain("Submit Work");
  });

  it("should provide progressive hints without immediately giving away solutions", async () => {
    // Hint Level 0 -> Requesting Hint 1
    const res1 = await HelpdeskAssistant.generateReply({
      task: sampleTask,
      userMessage: "Can you give me a hint on the code?",
      hintLevel: 0,
    });
    expect(res1.reply).toContain("Hint 1 of 3");
    expect(res1.reply).toContain("Inspect validate_login_input");
    expect(res1.hintLevel).toBe(1);

    // Hint Level 1 -> Requesting Hint 2
    const res2 = await HelpdeskAssistant.generateReply({
      task: sampleTask,
      userMessage: "I need another hint",
      hintLevel: 1,
    });
    expect(res2.reply).toContain("Hint 2 of 3");
    expect(res2.reply).toContain("not email or len(email.strip()) == 0");
    expect(res2.hintLevel).toBe(2);
  });

  it("should explain test errors in plain English", async () => {
    const context: HelpdeskContext = {
      task: sampleTask,
      userMessage: "Why did my test fail?",
      testResult: {
        passed: false,
        exitCode: 1,
        stderr: "AssertionError: Empty email should be rejected",
      },
    };

    const response = await HelpdeskAssistant.generateReply(context);
    expect(response.reply).toContain("AssertionError");
    expect(response.reply).toContain("When a test fails");
  });

  it("should explain submission process clearly", async () => {
    const context: HelpdeskContext = {
      task: sampleTask,
      userMessage: "How do I submit my work?",
    };

    const response = await HelpdeskAssistant.generateReply(context);
    expect(response.reply).toContain("Submit Work");
    expect(response.reply).toContain("Evidence of Skill");
  });
});

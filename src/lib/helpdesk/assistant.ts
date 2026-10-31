/**
 * [workup] Virtual Team Assistant — AI Helpdesk ("Quila" Mentor Engine)
 *
 * Implements empathetic, beginner-friendly colleague and technical mentor guidance:
 * - Simple language explanations without intimidating jargon
 * - Step-by-step progress guidance
 * - Progressive hints (Hint 1 -> 2 -> 3) before revealing code
 * - Plain English test error triage
 * - Submission & workflow coaching
 */

export interface HelpdeskMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface HelpdeskContext {
  task: {
    id: string;
    ticketKey: string;
    title: string;
    difficulty: string;
    department?: string | null;
    businessContext: string;
    objective: string;
    whyImportant?: string | null;
    stepByStepInstructions?: string | null;
    toolsAndFiles?: string | null;
    expectedOutput?: string | null;
    hints?: string | null;
    teamLeadName?: string;
  };
  userMessage: string;
  hintLevel?: number;
  activeFilePath?: string;
  testResult?: {
    passed: boolean;
    stdout?: string;
    stderr?: string;
    exitCode?: number;
  } | null;
}

export interface HelpdeskResponse {
  reply: string;
  hintLevel: number;
  hasMoreHints: boolean;
  suggestedPrompts: string[];
}

export class HelpdeskAssistant {
  public static async generateReply(context: HelpdeskContext): Promise<HelpdeskResponse> {
    const { task, userMessage, hintLevel = 0, activeFilePath, testResult } = context;
    const lowerMsg = userMessage.toLowerCase().trim();

    // Parse hints array from task
    let parsedHints: string[] = [];
    if (task.hints) {
      try {
        parsedHints = JSON.parse(task.hints);
      } catch {
        parsedHints = [task.hints];
      }
    }

    // Parse target files
    let targetFiles: string[] = [];
    if (task.toolsAndFiles) {
      try {
        targetFiles = JSON.parse(task.toolsAndFiles);
      } catch {
        targetFiles = [];
      }
    }
    const primaryFile = targetFiles.find((f) => !f.startsWith("tests/") && f !== "README.md") || targetFiles[0] || "source code";

    // Parse steps
    let steps: string[] = [];
    if (task.stepByStepInstructions) {
      try {
        steps = JSON.parse(task.stepByStepInstructions);
      } catch {
        steps = [];
      }
    }

    // 1. INTENT: Mission Explanation ("I don't understand", "What is this mission", "Explain")
    if (
      lowerMsg.includes("don't understand") ||
      lowerMsg.includes("dont understand") ||
      lowerMsg.includes("what is this") ||
      lowerMsg.includes("explain this mission") ||
      lowerMsg.includes("explain the task") ||
      lowerMsg.includes("what am i supposed to do")
    ) {
      const whyImp = task.whyImportant ? `\n\n💡 **Why it matters:** ${task.whyImportant}` : "";
      return {
        reply: `Hi there! Don't worry at all — let's break this down together in simple terms. 😊\n\n🎯 **Your goal:** ${task.objective}\n\nIn plain English: You are working on ticket **${task.ticketKey}** for **${task.department || "Engineering"}**. Right now, the code has a small bug that causes incorrect behavior for users.${whyImp}\n\nTo get started, we'll open **\`${primaryFile}\`** and look at the function mentioned in the instructions. Would you like me to guide you to where to start?`,
        hintLevel,
        hasMoreHints: parsedHints.length > hintLevel,
        suggestedPrompts: [
          "Where should I start?",
          "Can you give me a hint?",
          "How do I run the tests?",
        ],
      };
    }

    // 2. INTENT: What to do next / Step guidance ("What should I do next", "Where to start", "Next step")
    if (
      lowerMsg.includes("what to do") ||
      lowerMsg.includes("what should i do") ||
      (lowerMsg.includes("where") && lowerMsg.includes("start")) ||
      lowerMsg.includes("where to start") ||
      lowerMsg.includes("how to start") ||
      lowerMsg.includes("next step")
    ) {
      let stepGuide = "";
      if (testResult && testResult.passed) {
        stepGuide = `🎉 **Awesome job!** All your automated tests are currently **passing**.\n\nYour next step is to click the green **Submit Work** button in the top-right corner. This will package your code, store your deliverables in the artifact vault, and send your pull request to your Team Lead for a formal code review!`;
      } else if (testResult && !testResult.passed) {
        stepGuide = `You've run the tests, but some tests are still failing. Let's look at the failure message:\n\n1. Check the **Automated Tests** tab below.\n2. Look at the assertion error — it tells you what input caused the failure.\n3. Update your logic in **\`${primaryFile}\`**.\n4. Click **Run Tests** again to verify your fix!`;
      } else {
        stepGuide = `Here is your recommended path forward:\n\n1. Open **\`${primaryFile}\`** in the editor.\n2. Read through the function comments to see what input it expects.\n3. Make your code update.\n4. Click **Run Tests** in the top bar to verify.\n\nTake your time — there's no rush!`;
      }

      return {
        reply: stepGuide,
        hintLevel,
        hasMoreHints: parsedHints.length > hintLevel,
        suggestedPrompts: [
          "Can you give me a hint on the code?",
          "How do I run the tests?",
          "What is the expected outcome?",
        ],
      };
    }

    // 3. INTENT: Progressive Hints ("hint", "stuck", "clue", "help me code")
    if (
      lowerMsg.includes("hint") ||
      lowerMsg.includes("stuck") ||
      lowerMsg.includes("clue") ||
      lowerMsg.includes("help with code") ||
      lowerMsg.includes("how do i write")
    ) {
      const nextLevel = Math.min(hintLevel + 1, parsedHints.length);
      const hintText = parsedHints[nextLevel - 1] || "Check the function return value and make sure edge cases like empty strings or unexpected types are handled.";

      let hintIntro = "";
      if (nextLevel === 1) {
        hintIntro = `Here is **Hint 1 of ${parsedHints.length}** (a gentle nudge to point you in the right direction):`;
      } else if (nextLevel === 2) {
        hintIntro = `Here is **Hint 2 of ${parsedHints.length}** (diving a bit deeper into the logic):`;
      } else {
        hintIntro = `Here is **Hint ${nextLevel} of ${parsedHints.length}** (the specific technical implementation clue):`;
      }

      return {
        reply: `${hintIntro}\n\n🔍 **${hintText}**\n\nGive that a try in **\`${primaryFile}\`** and press **Ctrl+S** (or the Save button), then run the tests! If you're still stuck, ask me for another hint.`,
        hintLevel: nextLevel,
        hasMoreHints: nextLevel < parsedHints.length,
        suggestedPrompts: [
          nextLevel < parsedHints.length ? "Give me another hint" : "What should I do after editing?",
          "How do I run the tests?",
          "Explain the test error",
        ],
      };
    }

    // 4. INTENT: Test error explanation & troubleshooting ("test failed", "error", "failing", "why did test fail")
    if (
      (lowerMsg.includes("test") && (lowerMsg.includes("fail") || lowerMsg.includes("error"))) ||
      lowerMsg.includes("assertionerror") ||
      lowerMsg.includes("why did") ||
      lowerMsg.includes("failing") ||
      lowerMsg.includes("traceback")
    ) {
      if (testResult && testResult.stderr) {
        return {
          reply: `Let's look at why the tests didn't pass:\n\n⚠️ **Error details:**\n\`\`\`\n${testResult.stderr.substring(0, 300)}\n\`\`\`\n\nWhen a test fails, it means the test ran your function with specific test inputs (like an empty input \`""\` or invalid data), but your code returned something unexpected.\n\n👉 **Tip:** Check the file **\`${primaryFile}\`** and make sure you handle both the normal case and the empty/invalid edge cases. Would you like a hint on how to write the check?`,
          hintLevel,
          hasMoreHints: parsedHints.length > hintLevel,
          suggestedPrompts: [
            "Can you give me a hint on the code?",
            "What is the expected outcome?",
            "How do I submit my work?",
          ],
        };
      } else {
        return {
          reply: `If a test failed, it usually means:\n1. An edge case (like an empty value or missing field) wasn't rejected properly.\n2. Or the function returned \`True\` when it should have returned \`False\` (or vice versa).\n\nCheck the **Automated Tests** tab below the editor to see which specific test function failed. Each test name tells you exactly what condition it tested!`,
          hintLevel,
          hasMoreHints: parsedHints.length > hintLevel,
          suggestedPrompts: [
            "Give me a hint on the code",
            "What does the test expect?",
            "Where do I make the change?",
          ],
        };
      }
    }

    // 5. INTENT: Submission Help ("How do I submit", "ready to submit", "finish")
    if (
      lowerMsg.includes("submit") ||
      lowerMsg.includes("turn in") ||
      lowerMsg.includes("finish") ||
      lowerMsg.includes("done")
    ) {
      return {
        reply: `Submitting your work is super simple! Here's how:\n\n1. **Save your file:** Make sure you've clicked **Save** (or pressed Ctrl+S).\n2. **Run the tests:** Click **Run Tests** to make sure all tests are green (PASSED).\n3. **Click Submit Work:** Click the green **Submit Work** button in the top-right header.\n4. **Add pull request notes:** You can optionally write a sentence explaining your solution.\n5. **Confirm:** Your work will be evaluated against the rubric by your AI Tech Lead, and upon passing, you'll receive your verified **Evidence of Skill** credential! 🎓`,
        hintLevel,
        hasMoreHints: parsedHints.length > hintLevel,
        suggestedPrompts: [
          "How are submissions evaluated?",
          "What is Evidence of Skill?",
          "Can I review my code first?",
        ],
      };
    }

    // 6. DEFAULT / GENERAL TECHNICAL SUPPORT
    return {
      reply: `I'm here as your team technical mentor for **${task.title}**! 🤝\n\nWe are currently addressing: *${task.objective}*.\n\nWhenever you feel stuck, need code syntax advice, or want to know what to do next, just ask me. I won't spoil the answers immediately — I'll give you progressive hints so you genuinely learn how software teams solve real tickets!`,
      hintLevel,
      hasMoreHints: parsedHints.length > hintLevel,
      suggestedPrompts: [
        "Explain this mission in simple terms",
        "Where should I start?",
        "Give me a hint on the code",
        "How do I run tests?",
      ],
    };
  }
}

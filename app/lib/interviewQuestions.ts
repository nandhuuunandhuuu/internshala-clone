export type Question = {
  id: string;
  skill: string;
  question: string;
  answer: string;
};

export const INTERVIEW_QUESTIONS: Question[] = [
  // React
  { id: "q1", skill: "React", question: "What is the Virtual DOM?", answer: "A lightweight in-memory representation of the real DOM that React uses to efficiently calculate the minimal set of changes needed before updating the actual DOM." },
  { id: "q2", skill: "React", question: "What is the difference between state and props?", answer: "Props are read-only data passed from a parent component; state is data managed internally by a component that can change over time." },
  { id: "q3", skill: "React", question: "What are React Hooks?", answer: "Functions like useState and useEffect that let you use state and other React features in function components without writing a class." },
  { id: "q3b", skill: "React", question: "What is the purpose of the useEffect dependency array?", answer: "It tells React when to re-run the effect - an empty array runs it once on mount, omitting it runs on every render, and including values re-runs it whenever those values change." },
  { id: "q3c", skill: "React", question: "What is prop drilling and how can you avoid it?", answer: "Passing data through many nested components that don't need it just to reach a deeply nested child. It can be avoided using Context API or state management libraries." },
  { id: "q3d", skill: "React", question: "What is a key prop and why is it important in lists?", answer: "A unique identifier for list items that helps React efficiently track which items changed, were added, or removed, improving rendering performance and correctness." },

  // JavaScript
  { id: "q4", skill: "JavaScript", question: "What is a closure?", answer: "A function that remembers and can access variables from its outer scope even after that outer function has finished executing." },
  { id: "q5", skill: "JavaScript", question: "What is the difference between == and ===?", answer: "== compares values after type coercion; === compares both value and type without coercion." },
  { id: "q6", skill: "JavaScript", question: "What is event bubbling?", answer: "When an event triggered on a nested element propagates upward through its parent elements in the DOM tree." },
  { id: "q6b", skill: "JavaScript", question: "What is the difference between var, let, and const?", answer: "var is function-scoped and can be redeclared; let is block-scoped and can be reassigned; const is block-scoped and cannot be reassigned after initialization." },
  { id: "q6c", skill: "JavaScript", question: "What is a Promise?", answer: "An object representing the eventual completion or failure of an asynchronous operation, allowing you to chain .then()/.catch() or use async/await." },
  { id: "q6d", skill: "JavaScript", question: "What is the difference between synchronous and asynchronous code?", answer: "Synchronous code runs line by line, blocking further execution until each step finishes; asynchronous code allows other operations to continue while waiting for a task (like a network request) to complete." },

  // Node.js
  { id: "q7", skill: "Node.js", question: "What is the event loop in Node.js?", answer: "A mechanism that allows Node.js to perform non-blocking I/O operations by offloading tasks and processing callbacks once the call stack is empty." },
  { id: "q7b", skill: "Node.js", question: "What is middleware in Express.js?", answer: "Functions that have access to the request and response objects and can modify them, end the request cycle, or call the next middleware in the stack." },
  { id: "q7c", skill: "Node.js", question: "What is the difference between require and import?", answer: "require is Node's CommonJS module syntax, loaded synchronously; import is the ES Module syntax, which supports static analysis and works asynchronously in browsers." },

  // MongoDB
  { id: "q8", skill: "MongoDB", question: "What is the difference between SQL and NoSQL databases?", answer: "SQL databases use structured tables with fixed schemas; NoSQL databases like MongoDB store flexible, schema-less documents, often in JSON-like format." },
  { id: "q9", skill: "MongoDB", question: "What is an index in MongoDB?", answer: "A data structure that improves the speed of query operations by allowing the database to find documents without scanning the whole collection." },
  { id: "q9b", skill: "MongoDB", question: "What is the difference between embedding and referencing in MongoDB?", answer: "Embedding stores related data within the same document for fast reads; referencing stores an ID pointing to a document in another collection, useful for data that's large, shared, or changes independently." },

  // SQL
  { id: "q10", skill: "SQL", question: "What is a JOIN in SQL?", answer: "An operation that combines rows from two or more tables based on a related column between them." },
  { id: "q10b", skill: "SQL", question: "What is the difference between INNER JOIN and LEFT JOIN?", answer: "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matched rows from the right table, with NULLs where there's no match." },
  { id: "q10c", skill: "SQL", question: "What is normalization?", answer: "The process of organizing database tables to reduce data redundancy and improve data integrity, typically by splitting data into related tables." },

  // Python
  { id: "q11", skill: "Python", question: "What is a list comprehension?", answer: "A concise way to create lists in Python using a single line of code, e.g. [x*2 for x in range(5)]." },
  { id: "q11b", skill: "Python", question: "What is the difference between a list and a tuple?", answer: "Lists are mutable (can be changed after creation); tuples are immutable and generally used for fixed collections of items." },
  { id: "q11c", skill: "Python", question: "What are *args and **kwargs used for?", answer: "*args lets a function accept any number of positional arguments; **kwargs lets it accept any number of keyword arguments, both packed into a tuple/dict respectively." },

  // Java
  { id: "q16", skill: "Java", question: "What is the difference between JDK, JRE, and JVM?", answer: "JVM runs Java bytecode; JRE includes the JVM plus libraries needed to run Java applications; JDK includes the JRE plus development tools like the compiler." },
  { id: "q17", skill: "Java", question: "What is method overloading vs overriding?", answer: "Overloading is defining multiple methods with the same name but different parameters in the same class; overriding is redefining a parent class's method in a subclass with the same signature." },

  // Communication / soft skills
  { id: "q12", skill: "Communication", question: "How do you handle disagreements with a teammate?", answer: "Listen to understand their perspective first, explain your reasoning calmly, and focus on finding a solution that serves the project's goals rather than winning the argument." },
  { id: "q12b", skill: "Communication", question: "How would you explain a technical concept to a non-technical person?", answer: "Use analogies and everyday language, avoid jargon, focus on the outcome and why it matters rather than implementation details." },

  { id: "q13", skill: "Problem Solving", question: "Describe a time you solved a difficult problem.", answer: "Structure your answer using the STAR method: Situation, Task, Action, Result - be specific about what you personally did." },
  { id: "q13b", skill: "Problem Solving", question: "How do you approach debugging an issue you've never seen before?", answer: "Reproduce the issue reliably, isolate the smallest case that triggers it, check recent changes, use logs/breakpoints to narrow down the cause, then verify the fix doesn't break anything else." },

  { id: "q14", skill: "Leadership", question: "How do you motivate a team member who is underperforming?", answer: "Understand the root cause first (skills gap, unclear expectations, personal issues), then provide specific feedback and support rather than just criticism." },

  { id: "q15", skill: "Git", question: "What is the difference between merge and rebase?", answer: "Merge combines two branches and creates a new commit preserving history; rebase moves commits onto a new base, creating a linear history." },
  { id: "q15b", skill: "Git", question: "What is a merge conflict and how do you resolve it?", answer: "It happens when Git can't automatically reconcile changes to the same lines in a file from different branches; you resolve it by manually editing the conflicting sections and committing the result." },
];

// Generates additional practice questions for any skill using proven interview question templates
export function generateSkillQuestions(skill: string): Question[] {
  const templates = [
    { suffix: "concept", question: `Explain a core concept in ${skill} as if teaching a beginner.`, answer: `Break ${skill} down into its fundamental purpose, give a simple real-world analogy, then a small concrete example.` },
    { suffix: "project", question: `Describe a project where you used ${skill}. What was your specific contribution?`, answer: `Use the STAR method: describe the Situation, your Task, the Action you took with ${skill}, and the Result.` },
    { suffix: "challenge", question: `What's a common challenge people face when learning ${skill}, and how would you help someone overcome it?`, answer: `Name a genuine common pitfall in ${skill}, then explain a clear, practical way to address it.` },
    { suffix: "compare", question: `How does ${skill} compare to alternative tools or approaches you know?`, answer: `Compare strengths and trade-offs honestly - no tool is best for everything, so mention when you'd choose ${skill} and when you wouldn't.` },
    { suffix: "improve", question: `If you had to improve your ${skill} skills in the next 3 months, what would you focus on?`, answer: `Show self-awareness: name a specific gap, a concrete resource or practice plan, and how you'd measure progress.` },
  ];

  return templates.map((t, i) => ({
    id: `gen-${skill.toLowerCase().replace(/\s+/g, "-")}-${i}`,
    skill,
    question: t.question,
    answer: t.answer,
  }));
}
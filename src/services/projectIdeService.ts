import type { LanguageId, PracticeProject } from '../models/learning';

export type IdeLanguageId = 'python' | 'csharp' | 'java' | 'html' | 'css' | 'javascript' | 'typescript' | 'tsx' | 'bash' | 'sql' | 'json';

export interface ProjectIdeCompletion {
  label: string;
  type: 'keyword' | 'function' | 'class' | 'variable' | 'snippet' | 'property';
  detail: string;
  apply?: string;
}

export interface ProjectIdeConfig {
  language: IdeLanguageId;
  displayLanguage: string;
  fileName: string;
  starterCode: string;
  completions: ProjectIdeCompletion[];
}

const completionByCourse: Record<LanguageId, ProjectIdeCompletion[]> = {
  python: [
    completion('def', 'keyword', 'Function definition', 'def function_name():\n    pass'),
    completion('return', 'keyword', 'Return a value'),
    completion('Path', 'class', 'pathlib file helper', 'Path("tasks.json")'),
    completion('json.loads', 'function', 'Parse JSON text'),
    completion('json.dumps', 'function', 'Serialize JSON'),
    completion('argparse.ArgumentParser', 'class', 'CLI parser')
  ],
  csharp: [
    completion('class', 'keyword', 'Class declaration', 'public class LessonProgress\n{\n}'),
    completion('record', 'keyword', 'Immutable data model'),
    completion('List<T>', 'class', 'Generic list'),
    completion('Console.WriteLine', 'function', 'Write to console'),
    completion('async Task', 'snippet', 'Async method'),
    completion('return', 'keyword', 'Return a value')
  ],
  java: [
    completion('class', 'keyword', 'Class declaration', 'public class LessonProgress {\n}'),
    completion('record', 'keyword', 'Compact data carrier'),
    completion('List.of', 'function', 'Create immutable list'),
    completion('private final', 'snippet', 'Immutable field'),
    completion('return', 'keyword', 'Return a value'),
    completion('System.out.println', 'function', 'Print output')
  ],
  html: [
    completion('main', 'snippet', 'Main landmark', '<main>\n  \n</main>'),
    completion('section', 'snippet', 'Page section', '<section>\n  \n</section>'),
    completion('article', 'snippet', 'Standalone content', '<article>\n  \n</article>'),
    completion('label', 'snippet', 'Form label', '<label for="field">Label</label>'),
    completion('input', 'snippet', 'Input field', '<input id="field" name="field" />'),
    completion('button', 'snippet', 'Action button', '<button type="button">Continue</button>')
  ],
  css: [
    completion('display: grid', 'property', 'Grid layout'),
    completion('display: flex', 'property', 'Flex layout'),
    completion('gap', 'property', 'Spacing between children'),
    completion('minmax', 'function', 'Responsive grid size'),
    completion('@media', 'snippet', 'Responsive breakpoint', '@media (min-width: 720px) {\n  \n}'),
    completion('transition', 'property', 'Motion transition')
  ],
  javascript: [
    completion('const', 'keyword', 'Block-scoped constant'),
    completion('function', 'keyword', 'Function declaration', 'function name() {\n  return null;\n}'),
    completion('fetch', 'function', 'HTTP request'),
    completion('async', 'keyword', 'Async function marker'),
    completion('await', 'keyword', 'Wait for promise'),
    completion('addEventListener', 'function', 'DOM event listener')
  ],
  typescript: [
    completion('type', 'keyword', 'Type alias', 'type Model = {\n  id: string;\n};'),
    completion('interface', 'keyword', 'Object contract', 'interface Model {\n  id: string;\n}'),
    completion('readonly', 'keyword', 'Immutable property'),
    completion('unknown', 'keyword', 'Validated external value'),
    completion('Promise', 'class', 'Async result type'),
    completion('Result<T>', 'snippet', 'Success or failure union', 'type Result<T> = { ok: true; data: T } | { ok: false; error: string };')
  ],
  react: [
    completion('useState', 'function', 'React state hook', 'const [value, setValue] = useState("");'),
    completion('useEffect', 'function', 'React effect hook', 'useEffect(() => {\n  \n}, []);'),
    completion('useMemo', 'function', 'Memoized derived value'),
    completion('props', 'variable', 'Component inputs'),
    completion('className', 'property', 'React CSS class prop'),
    completion('onClick', 'property', 'Click handler prop')
  ],
  git: [
    completion('git status', 'function', 'Inspect working tree'),
    completion('git add', 'function', 'Stage files'),
    completion('git commit', 'function', 'Create commit', 'git commit -m "feat: describe change"'),
    completion('git switch', 'function', 'Switch branch'),
    completion('git merge', 'function', 'Merge branch'),
    completion('git push', 'function', 'Push commits')
  ],
  sql: [
    completion('select', 'keyword', 'Read rows', 'select column_name\nfrom table_name;'),
    completion('from', 'keyword', 'Choose table'),
    completion('where', 'keyword', 'Filter rows'),
    completion('order by', 'keyword', 'Sort rows'),
    completion('create table', 'snippet', 'Create table', 'create table table_name (\n  id uuid primary key\n);'),
    completion('insert into', 'keyword', 'Insert rows')
  ],
  backend: [
    completion('app.get', 'function', 'GET route', 'app.get("/health", (_request, response) => {\n  response.json({ status: "ok" });\n});'),
    completion('app.post', 'function', 'POST route'),
    completion('z.object', 'function', 'Zod schema'),
    completion('request.body', 'property', 'Request payload'),
    completion('response.status', 'function', 'HTTP status'),
    completion('logger.info', 'function', 'Structured log')
  ],
  automation: [
    completion('trigger', 'property', 'Automation trigger'),
    completion('action', 'property', 'Automation action'),
    completion('parameters', 'property', 'Tool parameters'),
    completion('requiresApproval', 'property', 'Human approval gate'),
    completion('onError', 'property', 'Error handling path'),
    completion('redact', 'property', 'Sensitive field masking')
  ]
};

const ideBaseByCourse: Record<LanguageId, Omit<ProjectIdeConfig, 'completions'>> = {
  python: {
    language: 'python',
    displayLanguage: 'Python',
    fileName: 'main.py',
    starterCode: 'from pathlib import Path\n\n\ndef main():\n    print("Start project")\n\n\nif __name__ == "__main__":\n    main()\n'
  },
  csharp: {
    language: 'csharp',
    displayLanguage: 'C#',
    fileName: 'Program.cs',
    starterCode: 'public class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Start project");\n    }\n}\n'
  },
  java: {
    language: 'java',
    displayLanguage: 'Java',
    fileName: 'Main.java',
    starterCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Start project");\n    }\n}\n'
  },
  html: {
    language: 'html',
    displayLanguage: 'HTML',
    fileName: 'index.html',
    starterCode: '<main>\n  <section>\n    <h1>Project</h1>\n  </section>\n</main>\n'
  },
  css: {
    language: 'css',
    displayLanguage: 'CSS',
    fileName: 'styles.css',
    starterCode: '.project {\n  display: grid;\n  gap: 1rem;\n}\n'
  },
  javascript: {
    language: 'javascript',
    displayLanguage: 'JavaScript',
    fileName: 'main.js',
    starterCode: 'async function main() {\n  console.log("Start project");\n}\n\nmain();\n'
  },
  typescript: {
    language: 'typescript',
    displayLanguage: 'TypeScript',
    fileName: 'main.ts',
    starterCode: 'type ProjectState = {\n  id: string;\n  done: boolean;\n};\n\nconst state: ProjectState = { id: "project", done: false };\n'
  },
  react: {
    language: 'tsx',
    displayLanguage: 'React TSX',
    fileName: 'ProjectApp.tsx',
    starterCode: 'type ProjectAppProps = {\n  title: string;\n};\n\nexport function ProjectApp({ title }: ProjectAppProps) {\n  return <section><h1>{title}</h1></section>;\n}\n'
  },
  git: {
    language: 'bash',
    displayLanguage: 'Git Shell',
    fileName: 'workflow.sh',
    starterCode: 'git status\n# Add your workflow commands here\n'
  },
  sql: {
    language: 'sql',
    displayLanguage: 'SQL',
    fileName: 'schema.sql',
    starterCode: 'select lesson_id, completed_at\nfrom lesson_progress\nwhere user_id = \'user_123\';\n'
  },
  backend: {
    language: 'typescript',
    displayLanguage: 'Backend TypeScript',
    fileName: 'api.ts',
    starterCode: 'app.get("/health", (_request, response) => {\n  response.json({ status: "ok" });\n});\n'
  },
  automation: {
    language: 'json',
    displayLanguage: 'Automation JSON',
    fileName: 'workflow.json',
    starterCode: '{\n  "trigger": "new_event",\n  "action": "create_task",\n  "requiresApproval": true\n}\n'
  }
};

export function getProjectIdeConfig(project: PracticeProject): ProjectIdeConfig {
  return {
    ...ideBaseByCourse[project.courseId],
    completions: getProjectLanguageCompletionSource(project)
  };
}

export function getProjectLanguageCompletionSource(project: PracticeProject): ProjectIdeCompletion[] {
  return completionByCourse[project.courseId];
}

function completion(label: string, type: ProjectIdeCompletion['type'], detail: string, apply?: string): ProjectIdeCompletion {
  return { label, type, detail, apply };
}

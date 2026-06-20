import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(dir, 'skills');

export default async () => {
  return {
    config: (cfg) => {
      try {
        cfg.skills = cfg.skills || {};
        cfg.skills.paths = cfg.skills.paths || [];
        if (!cfg.skills.paths.includes(skillsDir)) {
          cfg.skills.paths.push(skillsDir);
        }

        cfg.command = cfg.command || {};
        cfg.command.jenie = {
          template: 'The developer ran /jenie with argument: "$ARGUMENTS". Route to the appropriate skill:\n- "prepare-for-wishes" → Load the prepare-for-wishes skill and follow its workflow step by step.\n- "list-tasks" → Load the list-tasks skill and follow its workflow step by step.\n- "analyze-task" → Load the analyze-task skill and follow its workflow step by step.\n- "implement-task" → Load the implement-task skill and follow its workflow step by step.\nIf the argument is unrecognized or empty, load the prepare-for-wishes skill as the default entry point.',
          description: 'Jenie skill runner — /jenie <prepare-for-wishes|list-tasks|analyze-task|implement-task>'
        };

        const globalsDir = resolve(skillsDir, 'globals');
        cfg.permission = cfg.permission || {};
        cfg.permission.external_directory = cfg.permission.external_directory || {};
        cfg.permission.external_directory[`${globalsDir}/**`] = 'allow';
        cfg.permission.external_directory['.jenie/**'] = 'allow';
      } catch (err) {
        console.error('[jenie/ai-tools] Plugin config error:', err.message);
      }
    }
  };
};

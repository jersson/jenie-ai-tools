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
        cfg.command['jenie:analyze-task'] = {
          template: 'Load the analyze-task skill and follow its workflow step by step.',
          description: 'Analyze consistency of the selected task (user story or bug) using INVEST + 3C'
        };
        cfg.command['jenie:list-tasks'] = {
          template: 'Load the list-tasks skill and follow its workflow step by step.',
          description: 'Browse available tasks (user story or bug) from the project docs/ folder'
        };
        cfg.command['jenie:prepare-for-wishes'] = {
          template: 'Load the prepare-for-wishes skill and follow its workflow step by step.',
          description: 'Entry point — loads global config, analyzes project technical context, and asks what to do'
        };
        cfg.command['jenie:implement-task'] = {
          template: 'Load the implement-task skill and follow its workflow step by step.',
          description: 'Implement a validated task end-to-end — branch, TDD, implement, lint, commit'
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

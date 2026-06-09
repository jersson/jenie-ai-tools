import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const skillsDir = resolve(dir, 'skills');

export default async () => {
  return {
    config: (cfg) => {
      cfg.skills = cfg.skills || {};
      cfg.skills.paths = cfg.skills.paths || [];
      if (!cfg.skills.paths.includes(skillsDir)) {
        cfg.skills.paths.push(skillsDir);
      }

      cfg.command = cfg.command || {};
      cfg.command['jenie:task-validator'] = {
        template: 'Load the task-validator skill and follow its workflow step by step.',
        description: 'Validate a user story or bug using INVEST + 3C'
      };
    }
  };
};

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../data/site';

// true quando o PDF do currículo está em public/: os botões de download só aparecem nesse caso
export const temCurriculo = existsSync(join(process.cwd(), 'public', site.curriculo));

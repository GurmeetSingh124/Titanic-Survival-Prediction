import path from 'node:path';
import { pathToFileURL } from 'node:url';
const workspaceDir = 'C:/Users/acer/Desktop/Titanic Survival Prediction';
const skillDir = 'C:/Users/acer/.codex/plugins/cache/openai-primary-runtime/presentations/26.1029.11837/skills/presentations';
const candidatePath = path.join(workspaceDir, '.codex-finalizer/candidate.pptx');
const finalPath = path.join(workspaceDir, '.codex-published/Titanic_Survival_Prediction_8_Slides.pptx');
const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, 'container_tools/artifact_tool_utils.mjs')).href);
const result = await finalizePresentation({
  explicitTotalSlideCount: 8,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: { basis: 'design', families: ['Georgia', 'Aptos'] },
  expectedSlideSizeEmu: '12192000,6858000',
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: 'C:/Users/acer/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
  integrityValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-bullet-geometry', '--validate-heading-fit'],
  verifyArtifactToolImport: true,
  receiptPath: path.join(workspaceDir, '.codex-finalizer/validation.json'),
});
console.log(JSON.stringify(result, null, 2));

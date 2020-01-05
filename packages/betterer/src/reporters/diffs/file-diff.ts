import { code, error } from '@betterer/logger';

import { FileBetterer, BettererFiles, BettererFileMarksMap } from '../../betterer';

export function fileDiff(
  betterer: FileBetterer,
  current: BettererFiles,
  serialisedCurrent: BettererFileMarksMap,
  serialisedPrevious: BettererFileMarksMap | null
): void {
  const fileInfoMap = betterer.getDiff(current, serialisedCurrent, serialisedPrevious);
  Object.keys(fileInfoMap).forEach(file => {
    const fileInfo = fileInfoMap[file];
    const { length } = fileInfo;
    error(`${length} new ${getIssues(length)} in "${file}":`);
    fileInfo.forEach(info => code(info));
  });
}

function getIssues(count: number): string {
  return count === 1 ? 'issue' : 'issues';
}

import LinesAndColumns from 'lines-and-columns';
import { createHash } from '../../hasher';
import { BettererFile } from './file';
import { BettererFiles } from './files';
import { BettererFilesResult, BettererFilesDeserialised, BettererFileIssuesMapSerialised, BettererFileIssue, BettererFileIssueDeserialised, BettererFileIssueSerialised } from './types';

const UNKNOWN_LOCATION = {
    line: 0,
    column: 0,
} as const;

export function deserialise(serialised: BettererFileIssuesMapSerialised): BettererFilesDeserialised {
    return new BettererFiles(
        Object.keys(serialised).map((key) => {
            const [filePath, fileHash] = key.split(':');
            const issues = serialised[key].map(issue => {
                const [line, column, length, message, hash] = issue;
                return { line, column, length, message, hash };
            });
            return new BettererFile<BettererFileIssueDeserialised>(filePath, fileHash, issues);
        })
    );
}

export function serialise(result: BettererFilesResult | BettererFilesDeserialised): BettererFileIssuesMapSerialised {
    return (result.files as ReadonlyArray<BettererFile<BettererFileIssue | BettererFileIssueDeserialised>>).reduce((serialised: BettererFileIssuesMapSerialised, file: BettererFile<BettererFileIssue | BettererFileIssueDeserialised>) => {
        const { filePath, fileHash, fileIssues } = file;
        serialised = {
            ...serialised, [`${filePath}:${fileHash}`]: fileIssues.map(issue => {
                if (isResult(issue)) {
                    issue = resultToDeserialiseIssue(issue);
                }
                return serialiseDeserialised(issue);
            }).sort(([aLine], [bLine]) => aLine - bLine)
        };
        return serialised;
    }, {} as BettererFileIssuesMapSerialised);
}

export function resultToDeserialiseIssue(issue: BettererFileIssue): BettererFileIssueDeserialised {
    const { fileText, start, end, message, hash } = issue;
    const lc = new LinesAndColumns(fileText);
    const { line, column } = lc.locationForIndex(start) || UNKNOWN_LOCATION;
    const length = end - start;
    return {
        line, column, length, message, hash: hash || createHash(fileText.substr(start, length))
    };
}

function serialiseDeserialised(issue: BettererFileIssueDeserialised): BettererFileIssueSerialised {
    const { line, column, length, message, hash } = issue;
    return [line, column, length, message, hash];
}

function isResult(result: unknown): result is BettererFileIssue {
    return !!(result as BettererFileIssue).fileText;
}

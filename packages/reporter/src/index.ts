import { defaultReporter } from './reporter';

export {
  testBetterΔ,
  testCheckedΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testObsoleteΔ,
  testRunningΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ,
  updateInstructionsΔ
} from './messages';
export { quoteΔ } from './utils';

export const reporter = defaultReporter;

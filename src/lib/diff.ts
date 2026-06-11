export interface DiffBlock {
  type: 'unchanged' | 'removed' | 'added';
  text: string;
}

export function diffSentences(original: string, improved: string): { originalDiff: DiffBlock[]; improvedDiff: DiffBlock[] } {
  // Simple heuristic sentence tokenizer
  const tokenize = (text: string) => {
    return text.split(/([.!?]+(?:\s+|$))/).reduce<string[]>((acc, cur, idx) => {
      if (idx % 2 === 0) {
        if (cur.trim()) acc.push(cur);
      } else {
        if (acc.length > 0) acc[acc.length - 1] += cur;
      }
      return acc;
    }, []);
  };

  const originalSentences = tokenize(original);
  const improvedSentences = tokenize(improved);

  const originalDiff: DiffBlock[] = [];
  const improvedDiff: DiffBlock[] = [];

  // If they are completely different or one is empty, mark full change
  if (originalSentences.length === 0 || improvedSentences.length === 0) {
    return {
      originalDiff: [{ type: 'removed', text: original }],
      improvedDiff: [{ type: 'added', text: improved }]
    };
  }

  // A very basic LCS-like alignment for sentence highlight
  let i = 0, j = 0;
  while (i < originalSentences.length || j < improvedSentences.length) {
    if (i < originalSentences.length && j < improvedSentences.length) {
      if (originalSentences[i].trim().toLowerCase() === improvedSentences[j].trim().toLowerCase()) {
        originalDiff.push({ type: 'unchanged', text: originalSentences[i] });
        improvedDiff.push({ type: 'unchanged', text: improvedSentences[j] });
        i++;
        j++;
      } else {
        // Look ahead to see if one matches later
        let foundMatch = false;
        for (let lookAhead = 1; lookAhead <= 3; lookAhead++) {
          if (i + lookAhead < originalSentences.length && originalSentences[i + lookAhead].trim().toLowerCase() === improvedSentences[j].trim().toLowerCase()) {
            // original sentences were removed
            for (let k = 0; k < lookAhead; k++) {
              originalDiff.push({ type: 'removed', text: originalSentences[i + k] });
            }
            i += lookAhead;
            foundMatch = true;
            break;
          }
          if (j + lookAhead < improvedSentences.length && originalSentences[i].trim().toLowerCase() === improvedSentences[j + lookAhead].trim().toLowerCase()) {
            // improved sentences were added
            for (let k = 0; k < lookAhead; k++) {
              improvedDiff.push({ type: 'added', text: improvedSentences[j + k] });
            }
            j += lookAhead;
            foundMatch = true;
            break;
          }
        }
        if (!foundMatch) {
          originalDiff.push({ type: 'removed', text: originalSentences[i] });
          improvedDiff.push({ type: 'added', text: improvedSentences[j] });
          i++;
          j++;
        }
      }
    } else if (i < originalSentences.length) {
      originalDiff.push({ type: 'removed', text: originalSentences[i] });
      i++;
    } else {
      improvedDiff.push({ type: 'added', text: improvedSentences[j] });
      j++;
    }
  }

  return { originalDiff, improvedDiff };
}

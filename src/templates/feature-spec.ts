export function buildFeatureSpec(data: {
  title: string;
  id: string;
  createdAt: string;
  description: string;
}): string {
  return `# ${data.title}

> Created: ${data.createdAt}
> ID: ${data.id}
> Status: In Progress

---

## Overview

${data.description}

## Technical Context

- **Tech Stack**: _To be filled by AI after codebase analysis_
- **Project Structure**: _To be filled by AI after codebase analysis_
- **Existing Patterns**: _To be filled by AI after codebase analysis_
- **Related Features**: _To be filled by AI after codebase analysis_

## Files to Create

| File Path | Purpose |
|---|---|
| _To be filled by AI after codebase analysis_ | |

## Files to Modify

| File Path | Changes |
|---|---|
| _To be filled by AI after codebase analysis_ | |

## Data Schema

_To be filled by AI after codebase analysis_

## API / Interface

_To be filled by AI after codebase analysis_

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| _To be filled by AI after codebase analysis_ | | |

## Implementation Tasks

### Setup & Foundation

- [ ] _To be filled by AI after codebase analysis_

### Core Logic

- [ ] _To be filled by AI after codebase analysis_

### Integration

- [ ] _To be filled by AI after codebase analysis_

### Testing

- [ ] _To be filled by AI after codebase analysis_

## Definition of Done

- [ ] All implementation tasks are completed
- [ ] Code passes lint and type checks
- [ ] No regressions in existing features

## Notes

_To be filled by AI after codebase analysis_
`;
}
